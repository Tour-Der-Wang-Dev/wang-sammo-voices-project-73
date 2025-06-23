
-- Create complaint categories enum
CREATE TYPE complaint_category AS ENUM (
  'road', 'water', 'waste', 'electricity', 'public_safety', 'environment', 'other'
);

-- Create complaint status enum
CREATE TYPE complaint_status AS ENUM (
  'open', 'in_progress', 'resolved', 'closed'
);

-- Create user roles enum
CREATE TYPE user_role AS ENUM (
  'resident', 'admin', 'official'
);

-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  village TEXT,
  role user_role DEFAULT 'resident',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id TEXT UNIQUE, -- Human-readable ID like "WS-2024-001"
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  status complaint_status DEFAULT 'open',
  priority INTEGER DEFAULT 1,
  location_text TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  photo_url TEXT,
  voice_memo_url TEXT,
  user_id UUID REFERENCES user_profiles(id),
  is_anonymous BOOLEAN DEFAULT FALSE,
  phone TEXT, -- For anonymous complaints
  vote_count INTEGER DEFAULT 0,
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create complaint votes table (for community support)
CREATE TABLE complaint_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(complaint_id, user_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_complaint_id UUID REFERENCES complaints(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaint feedback table
CREATE TABLE complaint_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id),
  user_id UUID REFERENCES user_profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create functions
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
  complaint_id TEXT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(complaint_id FROM 'WS-' || year_suffix || '-(\d+)') AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM complaints
  WHERE complaint_id LIKE 'WS-' || year_suffix || '-%';
  
  complaint_id := 'WS-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 3, '0');
  
  RETURN complaint_id;
END;
$$ LANGUAGE plpgsql;

-- Function to award points to users
CREATE OR REPLACE FUNCTION award_points(user_uuid UUID, points_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET points = points + points_to_add,
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  user_uuid UUID,
  notification_title TEXT,
  notification_message TEXT,
  complaint_uuid UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, related_complaint_id)
  VALUES (user_uuid, notification_title, notification_message, complaint_uuid);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles: users can view all profiles but only update their own
CREATE POLICY "Allow public read access on user profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Complaints: public read, authenticated users can create
CREATE POLICY "Allow public read access on complaints" ON complaints
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create complaints" ON complaints
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR is_anonymous = true);

CREATE POLICY "Allow users to update own complaints" ON complaints
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM user_profiles WHERE role IN ('admin', 'official')
  ));

-- Complaint votes: authenticated users can vote
CREATE POLICY "Allow public read access on complaint votes" ON complaint_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to vote" ON complaint_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications: users can only see their own
CREATE POLICY "Allow users to view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Complaint feedback: public read, authenticated users can provide feedback
CREATE POLICY "Allow public read access on complaint feedback" ON complaint_feedback
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to provide feedback" ON complaint_feedback
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
