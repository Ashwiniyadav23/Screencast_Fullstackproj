# Supabase Setup Guide

This guide walks you through setting up Supabase for the ScreenShare Studio application.

## Prerequisites

- Supabase account (create one at https://supabase.com)
- Your project already created in Supabase
- Environment variables set (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`)

## 1. Create Storage Bucket for Recordings

### Steps:

1. **Open your Supabase Dashboard** - Go to https://app.supabase.com
2. **Select your project** from the list
3. **Navigate to Storage** - Click "Storage" in the left sidebar
4. **Create a new bucket**:
   - Click "New Bucket" button
   - Enter bucket name: `recordings` (exactly as shown)
   - **IMPORTANT**: Uncheck "Private bucket" to make it public
   - Click "Create bucket"

### Make Bucket Public:

If you created it as private:
1. Click on the `recordings` bucket
2. Click the three-dot menu (⋯)
3. Select "Make public"
4. Confirm the action

✅ Your bucket is now ready for uploads!

## 2. Create Database Table for Recording Metadata

### SQL Setup:

1. **Navigate to SQL Editor** in Supabase dashboard
2. **Create a new query** and paste this SQL:

```sql
-- Create recordings table
create table public.recordings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Recording',
  storage_path text not null,
  file_size bigint not null,
  duration integer default 0,
  public_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.recordings enable row level security;

-- Users can see their own recordings
create policy "Users can view their own recordings" on public.recordings
  for select using (auth.uid() = user_id);

-- Users can insert their own recordings
create policy "Users can create their own recordings" on public.recordings
  for insert with check (auth.uid() = user_id);

-- Users can delete their own recordings
create policy "Users can delete their own recordings" on public.recordings
  for delete using (auth.uid() = user_id);

-- Create index for faster queries
create index recordings_user_id_idx on public.recordings(user_id);
create index recordings_created_at_idx on public.recordings(created_at);
```

3. **Click "Run"** to execute the query

✅ Your database is now set up!

## 3. Storage Bucket Policies (Optional but Recommended)

For more control over who can upload recordings:

1. **Go to Storage** → **recordings bucket** → **Policies** tab
2. **Create upload policy** (if not auto-created):
   - Click "New policy"
   - For "Authenticated role" → "Allow" → "insert"
   - Click "Create"

## 4. Test the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Sign in** to the application
3. **Record a video** and try uploading
4. **Check Supabase Storage** to see your uploaded video file
5. **Check the recordings table** in Supabase to see metadata

## Troubleshooting

### "Bucket not found" Error
- ✅ Check that the bucket name is exactly `recordings` (lowercase)
- ✅ Ensure the bucket is set to **Public**
- ✅ Refresh the page and try again

### "Not authenticated" Error
- ✅ Make sure you're signed in to the app
- ✅ Check that your Supabase authentication is working

### "Permission denied" Error
- ✅ Verify RLS policies are created correctly
- ✅ Check that your user_id matches in the recordings table
- ✅ Ensure the bucket policies allow authenticated users to upload

### Upload hangs / doesn't complete
- ✅ Check your network connection
- ✅ Try with a smaller video file first
- ✅ Check browser console for specific errors
- ✅ Verify Supabase credentials in `.env.local`

## Environment Variables

Make sure these are set in your `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

You can find these values in **Supabase Settings** → **API** tab

## Support

For more help:
- Supabase Docs: https://supabase.com/docs
- React Router Docs: https://reactrouter.com
- Report issues: Create a GitHub issue in this repository
