-- AdSpark AI Database Schema
-- This file contains the SQL schema for setting up the Supabase database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_image TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Variations table
CREATE TABLE IF NOT EXISTS ad_variations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
  creative_type TEXT NOT NULL CHECK (creative_type IN ('textOnly', 'imageAndText')),
  visual_asset_url TEXT,
  text_copy TEXT NOT NULL,
  hook TEXT,
  cta TEXT,
  hashtags TEXT[],
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'approved', 'posted', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Posts table
CREATE TABLE IF NOT EXISTS test_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ad_variation_id UUID REFERENCES ad_variations(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
  account_id TEXT NOT NULL,
  post_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'failed', 'deleted')),
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Accounts table (for storing connected accounts)
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
  account_id TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  account_type TEXT DEFAULT 'test' CHECK (account_type IN ('test', 'production')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);

-- Subscription Usage table (for tracking API usage)
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  generations_used INTEGER DEFAULT 0,
  test_posts_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_variations_project_id ON ad_variations(project_id);
CREATE INDEX IF NOT EXISTS idx_ad_variations_platform ON ad_variations(platform);
CREATE INDEX IF NOT EXISTS idx_ad_variations_status ON ad_variations(status);
CREATE INDEX IF NOT EXISTS idx_test_posts_ad_variation_id ON test_posts(ad_variation_id);
CREATE INDEX IF NOT EXISTS idx_test_posts_platform ON test_posts(platform);
CREATE INDEX IF NOT EXISTS idx_test_posts_status ON test_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_media_accounts_user_id ON social_media_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON subscription_usage(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Ad Variations policies
CREATE POLICY "Users can view own ad variations" ON ad_variations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = ad_variations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create ad variations for own projects" ON ad_variations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = ad_variations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own ad variations" ON ad_variations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = ad_variations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own ad variations" ON ad_variations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = ad_variations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Test Posts policies
CREATE POLICY "Users can view own test posts" ON test_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ad_variations 
      JOIN projects ON projects.id = ad_variations.project_id
      WHERE ad_variations.id = test_posts.ad_variation_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create test posts for own variations" ON test_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM ad_variations 
      JOIN projects ON projects.id = ad_variations.project_id
      WHERE ad_variations.id = test_posts.ad_variation_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own test posts" ON test_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM ad_variations 
      JOIN projects ON projects.id = ad_variations.project_id
      WHERE ad_variations.id = test_posts.ad_variation_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Social Media Accounts policies
CREATE POLICY "Users can view own social media accounts" ON social_media_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own social media accounts" ON social_media_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social media accounts" ON social_media_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social media accounts" ON social_media_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Subscription Usage policies
CREATE POLICY "Users can view own subscription usage" ON subscription_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription usage" ON subscription_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription usage" ON subscription_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_variations_updated_at BEFORE UPDATE ON ad_variations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_posts_updated_at BEFORE UPDATE ON test_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_accounts_updated_at BEFORE UPDATE ON social_media_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_usage_updated_at BEFORE UPDATE ON subscription_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for product images and generated assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('generated-assets', 'generated-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Similar policies for generated assets
CREATE POLICY "Users can upload their own generated assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'generated-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own generated assets" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'generated-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own generated assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'generated-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own generated assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'generated-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
