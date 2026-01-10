-- Migration: Lead Activities Table
-- Description: Adds lead_activities table for tracking all lead interactions
-- Date: 2026-01-10

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS lead_activities (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('call', 'email', 'whatsapp', 'meeting', 'note', 'status_change', 'stage_change')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  old_value VARCHAR(100),
  new_value VARCHAR(100),
  duration_seconds INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_user_id ON lead_activities(user_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at DESC);

-- Comments
COMMENT ON TABLE lead_activities IS 'Tracks all activities performed on leads (calls, emails, WhatsApp, meetings, etc.)';
COMMENT ON COLUMN lead_activities.activity_type IS 'Type of activity: call, email, whatsapp, meeting, note, status_change, stage_change';
COMMENT ON COLUMN lead_activities.metadata IS 'Additional metadata stored as JSON (e.g., call recording URL, email subject, etc.)';
COMMENT ON COLUMN lead_activities.duration_seconds IS 'Duration of the activity in seconds (for calls and meetings)';
COMMENT ON COLUMN lead_activities.old_value IS 'Previous value for status/stage changes';
COMMENT ON COLUMN lead_activities.new_value IS 'New value for status/stage changes';
