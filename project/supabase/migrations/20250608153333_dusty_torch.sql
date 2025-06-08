/*
  # Complete Skillnestor Database Schema

  1. New Tables
    - `user_profiles` - User skill profiles with teach/learn skills
    - `pair_requests` - Skill exchange requests between users
    - `skill_sessions` - Scheduled learning sessions
    - `skill_analytics` - Track popular skills and user stats

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for discovery features

  3. Features
    - Profile management with skills
    - Peer-to-peer matching system
    - Request/accept workflow
    - Session scheduling
    - Analytics and trends
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  teach_skills text[] DEFAULT '{}',
  learn_skills text[] DEFAULT '{}',
  bio text DEFAULT '',
  is_public boolean DEFAULT true,
  location text DEFAULT '',
  timezone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Pair Requests Table
CREATE TABLE IF NOT EXISTS pair_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, requested_id, skill)
);

-- Skill Sessions Table
CREATE TABLE IF NOT EXISTS skill_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_request_id uuid REFERENCES pair_requests(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  scheduled_date timestamptz,
  duration_minutes integer DEFAULT 60,
  meeting_link text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skill Analytics Table
CREATE TABLE IF NOT EXISTS skill_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name text NOT NULL,
  teach_count integer DEFAULT 0,
  learn_count integer DEFAULT 0,
  total_requests integer DEFAULT 0,
  successful_matches integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(skill_name)
);

-- User Stats View
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id as user_id,
  u.email,
  up.teach_skills,
  up.learn_skills,
  COALESCE(sent.sent_requests, 0) as sent_requests,
  COALESCE(received.received_requests, 0) as received_requests,
  COALESCE(accepted.accepted_requests, 0) as accepted_requests,
  COALESCE(sessions.completed_sessions, 0) as completed_sessions
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN (
  SELECT requester_id, COUNT(*) as sent_requests
  FROM pair_requests
  GROUP BY requester_id
) sent ON u.id = sent.requester_id
LEFT JOIN (
  SELECT requested_id, COUNT(*) as received_requests
  FROM pair_requests
  GROUP BY requested_id
) received ON u.id = received.requested_id
LEFT JOIN (
  SELECT requested_id, COUNT(*) as accepted_requests
  FROM pair_requests
  WHERE status = 'accepted'
  GROUP BY requested_id
) accepted ON u.id = accepted.requested_id
LEFT JOIN (
  SELECT teacher_id, COUNT(*) as completed_sessions
  FROM skill_sessions
  WHERE status = 'completed'
  GROUP BY teacher_id
) sessions ON u.id = sessions.teacher_id;

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_analytics ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can read public profiles"
  ON user_profiles
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pair Requests Policies
CREATE POLICY "Users can view their requests"
  ON pair_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create requests"
  ON pair_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their requests"
  ON pair_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = requested_id)
  WITH CHECK (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Skill Sessions Policies
CREATE POLICY "Users can view their sessions"
  ON skill_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Users can manage their sessions"
  ON skill_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id)
  WITH CHECK (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- Skill Analytics Policies (Read-only for all authenticated users)
CREATE POLICY "Anyone can read skill analytics"
  ON skill_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- Functions to update analytics
CREATE OR REPLACE FUNCTION update_skill_analytics()
RETURNS trigger AS $$
BEGIN
  -- Update analytics when profiles change
  IF TG_TABLE_NAME = 'user_profiles' THEN
    -- Update teach skills count
    INSERT INTO skill_analytics (skill_name, teach_count)
    SELECT unnest(NEW.teach_skills), 1
    ON CONFLICT (skill_name) 
    DO UPDATE SET 
      teach_count = skill_analytics.teach_count + 1,
      updated_at = now();
    
    -- Update learn skills count
    INSERT INTO skill_analytics (skill_name, learn_count)
    SELECT unnest(NEW.learn_skills), 1
    ON CONFLICT (skill_name) 
    DO UPDATE SET 
      learn_count = skill_analytics.learn_count + 1,
      updated_at = now();
  END IF;
  
  -- Update request analytics
  IF TG_TABLE_NAME = 'pair_requests' THEN
    INSERT INTO skill_analytics (skill_name, total_requests)
    VALUES (NEW.skill, 1)
    ON CONFLICT (skill_name) 
    DO UPDATE SET 
      total_requests = skill_analytics.total_requests + 1,
      updated_at = now();
      
    -- Update successful matches when accepted
    IF NEW.status = 'accepted' THEN
      UPDATE skill_analytics 
      SET successful_matches = successful_matches + 1,
          updated_at = now()
      WHERE skill_name = NEW.skill;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_analytics_on_profile_change
  AFTER INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_skill_analytics();

CREATE TRIGGER update_analytics_on_request_change
  AFTER INSERT OR UPDATE ON pair_requests
  FOR EACH ROW EXECUTE FUNCTION update_skill_analytics();

-- Insert some initial popular skills data
INSERT INTO skill_analytics (skill_name, teach_count, learn_count, total_requests, successful_matches) VALUES
('JavaScript', 15, 25, 8, 6),
('Python', 12, 30, 12, 9),
('React', 10, 20, 6, 4),
('UI/UX Design', 8, 18, 10, 7),
('Digital Marketing', 6, 22, 5, 3),
('Guitar', 5, 15, 4, 3),
('Cooking', 7, 12, 3, 2),
('Spanish', 9, 16, 7, 5),
('Photography', 4, 14, 6, 4),
('Public Speaking', 3, 20, 8, 6)
ON CONFLICT (skill_name) DO NOTHING;