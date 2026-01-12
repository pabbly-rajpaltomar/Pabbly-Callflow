-- Add recording_url column to calls table
ALTER TABLE calls ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_calls_recording_url ON calls(recording_url);

SELECT 'Recording URL column added successfully!' as message;
