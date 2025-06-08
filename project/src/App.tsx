import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthForms } from './components/AuthForms';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './components/Dashboard';
import { DiscoverPage } from './components/DiscoverPage';
import { MatchesPage } from './components/MatchesPage';
import { RequestsPage } from './components/RequestsPage';
import { CalendarPage } from './components/CalendarPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useDarkMode } from './hooks/useDarkMode';
import { AppState } from './types';

function App() {
  const { user, loading: authLoading, signUp, signIn, signOut, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id || null);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [currentView, setCurrentView] = useState<AppState['currentView']>('landing');

  // Handle navigation based on auth state and profile completion
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      if (currentView !== 'landing' && currentView !== 'login' && currentView !== 'signup' && currentView !== 'discover') {
        setCurrentView('landing');
      }
      return;
    }

    // User is authenticated
    if (profileLoading) return;

    // Check if profile setup is needed
    const hasProfile = profile && (profile.teach_skills.length > 0 || profile.learn_skills.length > 0);
    
    if (!hasProfile && currentView !== 'profile-setup') {
      setCurrentView('profile-setup');
    } else if (hasProfile && (currentView === 'profile-setup' || currentView === 'landing' || currentView === 'login' || currentView === 'signup')) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, authLoading, profile, profileLoading, currentView]);

  const handleNavigate = (view: AppState['currentView']) => {
    // Prevent navigation to protected routes if not authenticated
    if (!isAuthenticated && ['dashboard', 'matches', 'requests', 'calendar', 'analytics', 'profile-setup'].includes(view)) {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
  };

  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    await signUp(email, password, name);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentView('landing');
  };

  const handleProfileSetupComplete = () => {
    setCurrentView('dashboard');
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header
        currentUser={user}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {currentView === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {(currentView === 'login' || currentView === 'signup') && (
        <AuthForms
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}

      {isAuthenticated && user && currentView === 'profile-setup' && (
        <ProfileSetup
          userId={user.id}
          onComplete={handleProfileSetupComplete}
          isFirstTime={!profile}
        />
      )}

      {isAuthenticated && user && currentView === 'dashboard' && (
        <Dashboard
          currentUser={user}
          userProfile={profile}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'discover' && (
        <DiscoverPage
          currentUser={user}
          onNavigate={handleNavigate}
        />
      )}

      {isAuthenticated && user && userProfile && currentView === 'matches' && (
        <MatchesPage
          currentUser={user}
          userProfile={userProfile}
        />
      )}

      {isAuthenticated && user && currentView === 'requests' && (
        <RequestsPage currentUser={user} />
      )}

      {isAuthenticated && user && currentView === 'calendar' && (
        <CalendarPage currentUser={user} />
      )}

      {isAuthenticated && user && currentView === 'analytics' && (
        <AnalyticsPage currentUser={user} />
      )}
    </div>
  );
}

export default App;