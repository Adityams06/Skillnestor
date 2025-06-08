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
  location?: string;
  timezone?: string;
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
  requester?: User;
  requested?: User;
}

export interface SkillSession {
  id: string;
  pair_request_id: string;
  teacher_id: string;
  learner_id: string;
  skill: string;
  scheduled_date?: string;
  duration_minutes: number;
  meeting_link?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  created_at: string;
  updated_at: string;
  teacher?: User;
  learner?: User;
}

export interface SkillMatch {
  user: User;
  profile: UserProfile;
  matchingSkills: {
    canTeach: string[];
    wantsToLearn: string[];
  };
  matchScore: number;
}

export interface SkillAnalytics {
  skill_name: string;
  teach_count: number;
  learn_count: number;
  total_requests: number;
  successful_matches: number;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  sent_requests: number;
  received_requests: number;
  accepted_requests: number;
  completed_sessions: number;
  teach_skills: string[];
  learn_skills: string[];
}

export interface AppState {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  currentView: 'landing' | 'login' | 'signup' | 'profile-setup' | 'dashboard' | 'discover' | 'requests' | 'calendar' | 'analytics';
  darkMode: boolean;
}

// Predefined skills list - expanded and categorized
export const AVAILABLE_SKILLS = [
  // Programming & Development
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Java', 'C++', 'PHP', 'Ruby',
  'Vue.js', 'Angular', 'Flutter', 'React Native', 'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'MongoDB',
  'Docker', 'AWS', 'Git', 'DevOps', 'Machine Learning', 'Data Science', 'Cybersecurity',
  
  // Design & Creative
  'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'InDesign',
  'Video Editing', 'Animation', 'Photography', 'Digital Art', 'Logo Design', 'Web Design', 'Branding',
  '3D Modeling', 'Game Design', 'Motion Graphics', 'Print Design',
  
  // Business & Marketing
  'Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Writing', 'Copywriting', 'Email Marketing',
  'Google Ads', 'Facebook Ads', 'Analytics', 'Project Management', 'Business Strategy', 'Sales',
  'Entrepreneurship', 'E-commerce', 'Affiliate Marketing', 'Influencer Marketing',
  
  // Data & Analytics
  'Data Analysis', 'Excel', 'Power BI', 'Tableau', 'R Programming', 'Statistics', 'Big Data', 
  'Data Visualization', 'Business Intelligence', 'Market Research',
  
  // Languages
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Arabic',
  'Russian', 'Hindi', 'Dutch', 'Swedish', 'Norwegian',
  
  // Music & Arts
  'Guitar', 'Piano', 'Singing', 'Music Production', 'Drawing', 'Painting', 'Dancing', 'Writing', 'Poetry',
  'Violin', 'Drums', 'Bass Guitar', 'DJ Skills', 'Sound Engineering', 'Songwriting',
  
  // Life Skills & Personal Development
  'Cooking', 'Fitness Training', 'Yoga', 'Meditation', 'Public Speaking', 'Leadership', 'Time Management',
  'Financial Planning', 'Gardening', 'DIY/Crafts', 'Home Organization', 'Parenting', 'Relationship Advice',
  'Career Coaching', 'Interview Skills', 'Networking', 'Stress Management', 'Mindfulness'
];

export const SKILL_CATEGORIES = {
  'Programming & Development': [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Java', 'C++', 'PHP', 'Ruby',
    'Vue.js', 'Angular', 'Flutter', 'React Native', 'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'MongoDB',
    'Docker', 'AWS', 'Git', 'DevOps', 'Machine Learning', 'Data Science', 'Cybersecurity'
  ],
  'Design & Creative': [
    'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'InDesign',
    'Video Editing', 'Animation', 'Photography', 'Digital Art', 'Logo Design', 'Web Design', 'Branding',
    '3D Modeling', 'Game Design', 'Motion Graphics', 'Print Design'
  ],
  'Business & Marketing': [
    'Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Writing', 'Copywriting', 'Email Marketing',
    'Google Ads', 'Facebook Ads', 'Analytics', 'Project Management', 'Business Strategy', 'Sales',
    'Entrepreneurship', 'E-commerce', 'Affiliate Marketing', 'Influencer Marketing'
  ],
  'Languages': [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Arabic',
    'Russian', 'Hindi', 'Dutch', 'Swedish', 'Norwegian'
  ],
  'Music & Arts': [
    'Guitar', 'Piano', 'Singing', 'Music Production', 'Drawing', 'Painting', 'Dancing', 'Writing', 'Poetry',
    'Violin', 'Drums', 'Bass Guitar', 'DJ Skills', 'Sound Engineering', 'Songwriting'
  ],
  'Life Skills': [
    'Cooking', 'Fitness Training', 'Yoga', 'Meditation', 'Public Speaking', 'Leadership', 'Time Management',
    'Financial Planning', 'Gardening', 'DIY/Crafts', 'Home Organization', 'Parenting', 'Relationship Advice',
    'Career Coaching', 'Interview Skills', 'Networking', 'Stress Management', 'Mindfulness'
  ]
};