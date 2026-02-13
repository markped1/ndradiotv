-- Nigeria Diaspora Radio - Supabase Schema Update
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FIX PLAYBACK SYNC

-- 1. Add missing columns to station_state
ALTER TABLE station_state ADD COLUMN IF NOT EXISTS is_tv_active BOOLEAN DEFAULT FALSE;
ALTER TABLE station_state ADD COLUMN IF NOT EXISTS current_video_id TEXT;

-- 2. Ensure media_files has the URL column (it should, but just in case)
ALTER TABLE media_files ADD COLUMN IF NOT EXISTS url TEXT;

-- 3. Optimization: Add timestamp for faster sync checks
ALTER TABLE station_state ADD COLUMN IF NOT EXISTS last_updated BIGINT;

-- 4. Set Initial State
INSERT INTO station_state (id, is_playing, is_tv_active, current_track_name)
VALUES (1, false, false, 'Station Standby')
ON CONFLICT (id) DO UPDATE 
SET is_playing = EXCLUDED.is_playing, is_tv_active = EXCLUDED.is_tv_active;

-- IMPORTANT: 
-- Go to your Supabase Dashboard -> Storage
-- Select the 'media' bucket
-- Click 'Edit Bucket' (or similar settings)
-- Ensure 'Public' is checked!
