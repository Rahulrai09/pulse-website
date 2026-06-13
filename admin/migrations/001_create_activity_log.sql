-- SQL Migration to create the admin_activity_log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT,
  admin_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
