export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  teach_skills: string[];
  learn_skills: string[];
  bio?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PairRequest {
  id: string;
  requester_id: string;
  requested_id: string;
  skill: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface SkillSession {
  id: string;
  pair_request_id: string;
  teacher_id: string;
  learner_id: string;
  skill: string;
  scheduled_date?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AppState {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  currentView: 'landing' | 'login' | 'signup' | 'profile-setup' | 'dashboard' | 'discover' | 'requests' | 'calendar' | 'analytics';
  darkMode: boolean;
}

// Predefined skills list
export const AVAILABLE_SKILLS = [
  // Programming & Development
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Java', 'C++', 'PHP', 'Ruby',
  'Vue.js', 'Angular', 'Flutter', 'React Native', 'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'MongoDB',
  
  // Design & Creative
  'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'InDesign',
  'Video Editing', 'Animation', 'Photography', 'Digital Art', 'Logo Design', 'Web Design', 'Branding',
  
  // Business & Marketing
  'Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Writing', 'Copywriting', 'Email Marketing',
  'Google Ads', 'Facebook Ads', 'Analytics', 'Project Management', 'Business Strategy', 'Sales',
  
  // Data & Analytics
  'Data Science', 'Machine Learning', 'Data Analysis', 'Excel', 'Power BI', 'Tableau', 'R Programming',
  'Statistics', 'Big Data', 'AI/ML', 'Data Visualization',
  
  // Languages
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Arabic',
  
  // Music & Arts
  'Guitar', 'Piano', 'Singing', 'Music Production', 'Drawing', 'Painting', 'Dancing', 'Writing', 'Poetry',
  
  // Life Skills
  'Cooking', 'Fitness Training', 'Yoga', 'Meditation', 'Public Speaking', 'Leadership', 'Time Management',
  'Financial Planning', 'Gardening', 'DIY/Crafts'
];