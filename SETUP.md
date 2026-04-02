# Portfolio Setup Guide

## 1. Supabase Setup (5 minutes)

### Create Project
1. Go to https://supabase.com → Sign up (free)
2. Create a new project → choose a region close to you

### Get API Keys
1. Settings → API
2. Copy "Project URL" → paste into `.env` as `VITE_SUPABASE_URL`
3. Copy "anon public" key → paste into `.env` as `VITE_SUPABASE_ANON_KEY`

### Create Database Table
Go to SQL Editor and run:

```sql
CREATE TABLE projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  title       TEXT NOT NULL,
  tagline     TEXT,
  description TEXT,
  category    TEXT,
  year        TEXT,
  stack       TEXT[],
  highlights  TEXT[],
  link        TEXT,
  image_url   TEXT,
  video_url   TEXT,
  accent      TEXT DEFAULT 'var(--sky-400)',
  featured    BOOLEAN DEFAULT false,
  published   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage all"
  ON projects FOR ALL TO authenticated USING (true);
```

### Create Storage Bucket
1. Storage → New bucket → name: `project-media` → toggle Public ✓ → Create

### Create Admin Account
1. Authentication → Users → Invite user
2. Enter your email → Send invitation
3. Check email → set your password
4. Use this email + password to log into `/admin`

## 2. Local Development

```bash
cp .env.example .env
# Fill in your Supabase URL and anon key

npm install
npm run dev
```

Open http://localhost:5173 for the portfolio
Open http://localhost:5173/admin to manage projects

## 3. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Add `vercel.json` for SPA routing:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

## 4. Using the Admin

- Go to `yoursite.com/admin`
- Sign in with your Supabase account
- Add projects with images/videos/links
- Projects appear on the homepage **immediately**
- Toggle Published/Draft to control visibility
- Set Sort Order (0 = first) to control display order
