import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────────
// SETUP — run this SQL in Supabase → SQL Editor
// ─────────────────────────────────────────────────────────────────────────────
//
// -- 1. PROJECTS TABLE
// CREATE TABLE projects (
//   id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at  TIMESTAMPTZ DEFAULT now(),
//   title       TEXT NOT NULL,
//   tagline     TEXT,
//   description TEXT,
//   category    TEXT,
//   year        TEXT,
//   stack       TEXT[],
//   highlights  TEXT[],
//   link        TEXT,
//   image_url   TEXT,
//   video_url   TEXT,
//   accent      TEXT DEFAULT 'var(--sky-400)',
//   featured    BOOLEAN DEFAULT false,
//   published   BOOLEAN DEFAULT true,
//   sort_order  INTEGER DEFAULT 0
// );
// ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (published = true);
// CREATE POLICY "Auth full access projects"      ON projects FOR ALL TO authenticated USING (true);
//
// -- 2. CV TABLE (stores latest uploaded CV/resume)
// CREATE TABLE cv (
//   id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at TIMESTAMPTZ DEFAULT now(),
//   file_url   TEXT NOT NULL,
//   file_name  TEXT,
//   label      TEXT DEFAULT 'Download CV'
// );
// ALTER TABLE cv ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read cv"  ON cv FOR SELECT USING (true);
// CREATE POLICY "Auth manage cv"  ON cv FOR ALL TO authenticated USING (true);
//
// -- 3. CERTIFICATIONS TABLE
// CREATE TABLE certifications (
//   id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at  TIMESTAMPTZ DEFAULT now(),
//   title       TEXT NOT NULL,
//   issuer      TEXT NOT NULL,
//   issued_date TEXT,
//   expiry_date TEXT,
//   credential_id   TEXT,
//   credential_url  TEXT,
//   image_url   TEXT,
//   published   BOOLEAN DEFAULT true,
//   sort_order  INTEGER DEFAULT 0
// );
// ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read published certs" ON certifications FOR SELECT USING (published = true);
// CREATE POLICY "Auth manage certs"           ON certifications FOR ALL TO authenticated USING (true);
//
// -- 4. Storage bucket
// Storage → New bucket → name: "portfolio-media" → toggle Public ✓ → Create
//
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL  || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getPublishedProjects() {
  const { data, error } = await supabase
    .from('projects').select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects').select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from('projects').insert([project]).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from('projects').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ── CV / Resume ───────────────────────────────────────────────────────────────

export async function getCV() {
  const { data, error } = await supabase
    .from('cv').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (error) throw error
  return data
}

export async function upsertCV(payload) {
  // Always keep only one CV row — delete old, insert new
  await supabase.from('cv').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { data, error } = await supabase.from('cv').insert([payload]).select().single()
  if (error) throw error
  return data
}

// ── Certifications ────────────────────────────────────────────────────────────

export async function getPublishedCerts() {
  const { data, error } = await supabase
    .from('certifications').select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAllCerts() {
  const { data, error } = await supabase
    .from('certifications').select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createCert(cert) {
  const { data, error } = await supabase
    .from('certifications').insert([cert]).select().single()
  if (error) throw error
  return data
}

export async function updateCert(id, updates) {
  const { data, error } = await supabase
    .from('certifications').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCert(id) {
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) throw error
}

// ── File upload ───────────────────────────────────────────────────────────────

export async function uploadFile(file, folder = 'images') {
  const ext  = file.name.split('.').pop()
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage
    .from('portfolio-media')
    .upload(name, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage.from('portfolio-media').getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function deleteFile(url) {
  const path = url.split('/portfolio-media/')[1]
  if (!path) return
  await supabase.storage.from('portfolio-media').remove([path])
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session))
}
