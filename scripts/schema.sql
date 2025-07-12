-- Create the 'collections' table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Draft', 'Saved')) DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create the 'sources' table
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'collections'
CREATE POLICY "Users can view their own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'sources'
CREATE POLICY "Users can view sources in their own collections" ON sources FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM collections WHERE id = collection_id)
);
CREATE POLICY "Users can insert sources into their own collections" ON sources FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM collections WHERE id = collection_id)
);
CREATE POLICY "Users can delete sources from their own collections" ON sources FOR DELETE USING (
  auth.uid() = (SELECT user_id FROM collections WHERE id = collection_id)
);
