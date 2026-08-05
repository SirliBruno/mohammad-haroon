-- ========================================================
-- Full Database Schema & RLS Setup for Mohammad Portfolio
-- ========================================================

-- Migration: 20260709131359_6521389c-de6e-427b-90c3-76d9325707f1.sql

-- =========================================================
-- Extensions
-- =========================================================
create extension if not exists pgcrypto;

-- =========================================================
-- Shared: updated_at trigger
-- =========================================================
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Roles
-- =========================================================
do $$ begin
  create type public.app_role as enum ('admin', 'editor', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

drop policy if exists "user_roles: users read own" on public.user_roles;
create policy "user_roles: users read own"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

-- =========================================================
-- Enums
-- =========================================================
do $$ begin create type public.content_status as enum ('draft','published','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.project_status as enum ('concept','in_progress','live','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.employment_type as enum ('full_time','part_time','contract','freelance','internship'); exception when duplicate_object then null; end $$;
do $$ begin create type public.message_status as enum ('new','read','replied','archived','spam'); exception when duplicate_object then null; end $$;
do $$ begin create type public.media_kind as enum ('image','video','document','audio','other'); exception when duplicate_object then null; end $$;

-- =========================================================
-- Helper macro: apply timestamps + trigger + rls + policies
-- We'll write each table explicitly for clarity.
-- =========================================================

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  category text,
  tags text[] not null default '{}',
  technologies text[] not null default '{}',
  cover_url text,
  gallery jsonb not null default '[]'::jsonb,
  role text,
  client text,
  timeline text,
  year int,
  featured boolean not null default false,
  status public.project_status not null default 'concept',
  content_status public.content_status not null default 'draft',
  live_url text,
  github_url text,
  problem text,
  goals text[] not null default '{}',
  research text,
  solution text,
  design_process text,
  development text,
  lessons text[] not null default '{}',
  results jsonb not null default '[]'::jsonb,
  testimonial jsonb,
  metrics jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "projects: public read published" on public.projects for select to anon using (content_status = 'published');
create policy "projects: auth read all" on public.projects for select to authenticated using (true);
create policy "projects: admin insert" on public.projects for insert to authenticated with check (public.is_admin());
create policy "projects: admin update" on public.projects for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "projects: admin delete" on public.projects for delete to authenticated using (public.is_admin());
create trigger projects_set_updated_at before update on public.projects for each row execute function public.tg_set_updated_at();
create index if not exists projects_status_idx on public.projects (content_status, published_at desc);
create index if not exists projects_featured_idx on public.projects (featured) where featured;

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  summary text,
  overview text,
  icon text,
  cover_url text,
  benefits jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  workflow jsonb not null default '[]'::jsonb,
  timeline text,
  technologies text[] not null default '{}',
  deliverables text[] not null default '{}',
  faq jsonb not null default '[]'::jsonb,
  starting_price_cents int,
  currency text not null default 'USD',
  featured boolean not null default false,
  content_status public.content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "services: public read published" on public.services for select to anon using (content_status = 'published');
create policy "services: auth read all" on public.services for select to authenticated using (true);
create policy "services: admin insert" on public.services for insert to authenticated with check (public.is_admin());
create policy "services: admin update" on public.services for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "services: admin delete" on public.services for delete to authenticated using (public.is_admin());
create trigger services_set_updated_at before update on public.services for each row execute function public.tg_set_updated_at();

-- ---------- certificates ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_on date,
  expires_on date,
  credential_id text,
  credential_url text,
  image_url text,
  skills text[] not null default '{}',
  featured boolean not null default false,
  content_status public.content_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.certificates to anon;
grant select, insert, update, delete on public.certificates to authenticated;
grant all on public.certificates to service_role;
alter table public.certificates enable row level security;
create policy "certificates: public read published" on public.certificates for select to anon using (content_status = 'published');
create policy "certificates: auth read all" on public.certificates for select to authenticated using (true);
create policy "certificates: admin insert" on public.certificates for insert to authenticated with check (public.is_admin());
create policy "certificates: admin update" on public.certificates for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "certificates: admin delete" on public.certificates for delete to authenticated using (public.is_admin());
create trigger certificates_set_updated_at before update on public.certificates for each row execute function public.tg_set_updated_at();

-- ---------- experiences ----------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  employment_type public.employment_type not null default 'full_time',
  started_on date not null,
  ended_on date,
  is_current boolean not null default false,
  summary text,
  highlights text[] not null default '{}',
  technologies text[] not null default '{}',
  logo_url text,
  url text,
  content_status public.content_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.experiences to anon;
grant select, insert, update, delete on public.experiences to authenticated;
grant all on public.experiences to service_role;
alter table public.experiences enable row level security;
create policy "experiences: public read published" on public.experiences for select to anon using (content_status = 'published');
create policy "experiences: auth read all" on public.experiences for select to authenticated using (true);
create policy "experiences: admin insert" on public.experiences for insert to authenticated with check (public.is_admin());
create policy "experiences: admin update" on public.experiences for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "experiences: admin delete" on public.experiences for delete to authenticated using (public.is_admin());
create trigger experiences_set_updated_at before update on public.experiences for each row execute function public.tg_set_updated_at();

-- ---------- skills ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  level int check (level between 0 and 100),
  years_experience numeric(4,1),
  icon text,
  color text,
  featured boolean not null default false,
  content_status public.content_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.skills to anon;
grant select, insert, update, delete on public.skills to authenticated;
grant all on public.skills to service_role;
alter table public.skills enable row level security;
create policy "skills: public read published" on public.skills for select to anon using (content_status = 'published');
create policy "skills: auth read all" on public.skills for select to authenticated using (true);
create policy "skills: admin insert" on public.skills for insert to authenticated with check (public.is_admin());
create policy "skills: admin update" on public.skills for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "skills: admin delete" on public.skills for delete to authenticated using (public.is_admin());
create trigger skills_set_updated_at before update on public.skills for each row execute function public.tg_set_updated_at();

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_company text,
  avatar_url text,
  quote text not null,
  rating int check (rating between 1 and 5),
  project_id uuid references public.projects(id) on delete set null,
  featured boolean not null default false,
  content_status public.content_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "testimonials: public read published" on public.testimonials for select to anon using (content_status = 'published');
create policy "testimonials: auth read all" on public.testimonials for select to authenticated using (true);
create policy "testimonials: admin insert" on public.testimonials for insert to authenticated with check (public.is_admin());
create policy "testimonials: admin update" on public.testimonials for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "testimonials: admin delete" on public.testimonials for delete to authenticated using (public.is_admin());
create trigger testimonials_set_updated_at before update on public.testimonials for each row execute function public.tg_set_updated_at();

-- ---------- blog_posts ----------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  tags text[] not null default '{}',
  category text,
  reading_minutes int,
  author_id uuid references auth.users(id) on delete set null,
  featured boolean not null default false,
  content_status public.content_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "blog: public read published" on public.blog_posts for select to anon using (content_status = 'published');
create policy "blog: auth read all" on public.blog_posts for select to authenticated using (true);
create policy "blog: admin insert" on public.blog_posts for insert to authenticated with check (public.is_admin());
create policy "blog: admin update" on public.blog_posts for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "blog: admin delete" on public.blog_posts for delete to authenticated using (public.is_admin());
create trigger blog_posts_set_updated_at before update on public.blog_posts for each row execute function public.tg_set_updated_at();
create index if not exists blog_posts_published_idx on public.blog_posts (content_status, published_at desc);

-- ---------- ideas ----------
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  body text,
  tags text[] not null default '{}',
  stage text,
  upvotes int not null default 0,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.ideas to anon;
grant select, insert, update, delete on public.ideas to authenticated;
grant all on public.ideas to service_role;
alter table public.ideas enable row level security;
create policy "ideas: public read published" on public.ideas for select to anon using (content_status = 'published');
create policy "ideas: auth read all" on public.ideas for select to authenticated using (true);
create policy "ideas: admin insert" on public.ideas for insert to authenticated with check (public.is_admin());
create policy "ideas: admin update" on public.ideas for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "ideas: admin delete" on public.ideas for delete to authenticated using (public.is_admin());
create trigger ideas_set_updated_at before update on public.ideas for each row execute function public.tg_set_updated_at();

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  cover_url text,
  gallery jsonb not null default '[]'::jsonb,
  price_cents int,
  currency text not null default 'USD',
  external_url text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  content_status public.content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products: public read published" on public.products for select to anon using (content_status = 'published');
create policy "products: auth read all" on public.products for select to authenticated using (true);
create policy "products: admin insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "products: admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products: admin delete" on public.products for delete to authenticated using (public.is_admin());
create trigger products_set_updated_at before update on public.products for each row execute function public.tg_set_updated_at();

-- ---------- media ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null default 'image',
  url text not null,
  storage_path text,
  filename text,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt text,
  caption text,
  tags text[] not null default '{}',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.media to anon;
grant select, insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "media: public read" on public.media for select to anon using (true);
create policy "media: auth read" on public.media for select to authenticated using (true);
create policy "media: admin insert" on public.media for insert to authenticated with check (public.is_admin());
create policy "media: admin update" on public.media for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "media: admin delete" on public.media for delete to authenticated using (public.is_admin());
create trigger media_set_updated_at before update on public.media for each row execute function public.tg_set_updated_at();

-- ---------- messages (contact inbox) ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  inquiry_type text,
  budget text,
  message text not null,
  source text,
  ip_hash text,
  user_agent text,
  status public.message_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.messages to anon;
grant insert on public.messages to authenticated;
grant select, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "messages: anyone can submit" on public.messages for insert to anon with check (true);
create policy "messages: auth can submit" on public.messages for insert to authenticated with check (true);
create policy "messages: admin read" on public.messages for select to authenticated using (public.is_admin());
create policy "messages: admin update" on public.messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "messages: admin delete" on public.messages for delete to authenticated using (public.is_admin());
create trigger messages_set_updated_at before update on public.messages for each row execute function public.tg_set_updated_at();
create index if not exists messages_status_idx on public.messages (status, created_at desc);


-- Migration: 20260709131519_b2d414e5-7887-48d5-bb91-13a0656b80e6.sql

-- Drop any leftover admin policies from either naming scheme
do $$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('projects','services','certificates','experiences','skills','testimonials','blog_posts','ideas','products','media','messages')
      and (policyname like '%admin insert%' or policyname like '%admin update%' or policyname like '%admin delete%')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Recreate admin policies with inline EXISTS (no is_admin())
-- projects
create policy "projects_admin_insert" on public.projects for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "projects_admin_update" on public.projects for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "projects_admin_delete" on public.projects for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- services
create policy "services_admin_insert" on public.services for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "services_admin_update" on public.services for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "services_admin_delete" on public.services for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- certificates
create policy "certificates_admin_insert" on public.certificates for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "certificates_admin_update" on public.certificates for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "certificates_admin_delete" on public.certificates for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- experiences
create policy "experiences_admin_insert" on public.experiences for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "experiences_admin_update" on public.experiences for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "experiences_admin_delete" on public.experiences for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- skills
create policy "skills_admin_insert" on public.skills for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "skills_admin_update" on public.skills for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "skills_admin_delete" on public.skills for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- testimonials
create policy "testimonials_admin_insert" on public.testimonials for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "testimonials_admin_update" on public.testimonials for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "testimonials_admin_delete" on public.testimonials for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- blog_posts
create policy "blog_posts_admin_insert" on public.blog_posts for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "blog_posts_admin_update" on public.blog_posts for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "blog_posts_admin_delete" on public.blog_posts for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- ideas
create policy "ideas_admin_insert" on public.ideas for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "ideas_admin_update" on public.ideas for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "ideas_admin_delete" on public.ideas for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- products
create policy "products_admin_insert" on public.products for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "products_admin_update" on public.products for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "products_admin_delete" on public.products for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- media
create policy "media_admin_insert" on public.media for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "media_admin_update" on public.media for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "media_admin_delete" on public.media for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- messages: admin read/update/delete
drop policy if exists "messages: admin read" on public.messages;
create policy "messages_admin_select" on public.messages for select to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "messages_admin_update" on public.messages for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "messages_admin_delete" on public.messages for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

-- Tighten message-submission policies
drop policy if exists "messages: anyone can submit" on public.messages;
drop policy if exists "messages: auth can submit" on public.messages;
drop policy if exists "messages_anon_submit" on public.messages;
drop policy if exists "messages_auth_submit" on public.messages;

create policy "messages_anon_submit"
  on public.messages for insert to anon
  with check (
    char_length(btrim(name))    between 1 and 200 and
    char_length(btrim(email))   between 3 and 255 and
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and
    char_length(btrim(message)) between 1 and 4000
  );

create policy "messages_auth_submit"
  on public.messages for insert to authenticated
  with check (
    char_length(btrim(name))    between 1 and 200 and
    char_length(btrim(email))   between 3 and 255 and
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and
    char_length(btrim(message)) between 1 and 4000
  );

-- Lock down SECURITY DEFINER helpers (safe to re-run)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;
grant execute on function public.is_admin() to service_role;


-- Migration: 20260719030550_8295d121-f993-439f-b817-0095dba7c51b.sql
-- Hero showcase projects table (images shown in homepage mockups)
CREATE TABLE public.hero_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  host text,
  category text,
  year integer,
  status text NOT NULL DEFAULT 'مباشر',
  accent text NOT NULL DEFAULT 'emerald',
  cover_url text,
  mobile_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_projects TO authenticated;
GRANT ALL ON public.hero_projects TO service_role;

ALTER TABLE public.hero_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_projects public read active"
  ON public.hero_projects FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero_projects admin insert"
  ON public.hero_projects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero_projects admin update"
  ON public.hero_projects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero_projects admin delete"
  ON public.hero_projects FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER hero_projects_set_updated_at
  BEFORE UPDATE ON public.hero_projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-grant admin role to first user (bootstrap)
CREATE OR REPLACE FUNCTION public.tg_bootstrap_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bootstrap_first_admin ON auth.users;
CREATE TRIGGER bootstrap_first_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.tg_bootstrap_first_admin();

-- Storage policies for `media` bucket: admins upload/manage, public read
CREATE POLICY "media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "media admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "media admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Migration: 20260719030559_1398dbc8-a078-4876-ac15-ed1b781de885.sql
REVOKE EXECUTE ON FUNCTION public.tg_bootstrap_first_admin() FROM PUBLIC, anon, authenticated;

-- Migration: 20260719034239_8e8ed94b-7e84-4137-8a43-0dc8a956284e.sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Migration: 20260719034704_15547939-6b86-4b9d-b7cc-bf3822a91b11.sql

CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  group_name TEXT NOT NULL DEFAULT 'general',
  label TEXT,
  description TEXT,
  kind TEXT NOT NULL DEFAULT 'text',
  value_ar TEXT,
  value_en TEXT,
  image_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX site_content_group_idx ON public.site_content (group_name, sort_order);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content readable by everyone"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "site_content insert by admins"
  ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site_content update by admins"
  ON public.site_content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site_content delete by admins"
  ON public.site_content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_content_set_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();


-- Migration: 20260719154138_d5e40a01-cc93-4b78-9959-fb6a3f7079f9.sql
-- Drop the auto-admin bootstrap trigger to prevent privilege escalation
DROP TRIGGER IF EXISTS bootstrap_first_admin ON auth.users;
DROP FUNCTION IF EXISTS public.tg_bootstrap_first_admin();

-- Migration: 20260719154621_2bef8fd5-2a47-4601-b24e-d29fffdfd85c.sql

CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  path text,
  session_id text,
  referrer text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_event_idx ON public.analytics_events(event);
CREATE INDEX analytics_events_created_at_idx ON public.analytics_events(created_at DESC);
CREATE INDEX analytics_events_session_idx ON public.analytics_events(session_id);

GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read analytics" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_admin());


-- Migration: 20260720045045_84c3921e-6ca9-4918-802f-32948fbf56b8.sql

-- Audit log for admin CMS changes
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  row_id uuid,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  actor_id uuid,
  diff jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_created_at_idx ON public.audit_log (created_at DESC);
CREATE INDEX audit_log_table_idx ON public.audit_log (table_name, created_at DESC);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
ON public.audit_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Generic audit trigger
CREATE OR REPLACE FUNCTION public.tg_audit_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_row_id uuid;
  v_diff jsonb;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_row_id := (to_jsonb(OLD) ->> 'id')::uuid;
    v_diff := jsonb_build_object('old', to_jsonb(OLD));
  ELSIF (TG_OP = 'INSERT') THEN
    v_row_id := (to_jsonb(NEW) ->> 'id')::uuid;
    v_diff := jsonb_build_object('new', to_jsonb(NEW));
  ELSE
    v_row_id := (to_jsonb(NEW) ->> 'id')::uuid;
    v_diff := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  END IF;

  INSERT INTO public.audit_log (table_name, row_id, action, actor_id, diff)
  VALUES (TG_TABLE_NAME, v_row_id, TG_OP, v_actor, v_diff);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach to admin-managed content tables
CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_services AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_hero_projects AFTER INSERT OR UPDATE OR DELETE ON public.hero_projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_testimonials AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_certificates AFTER INSERT OR UPDATE OR DELETE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_experiences AFTER INSERT OR UPDATE OR DELETE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_skills AFTER INSERT OR UPDATE OR DELETE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_blog_posts AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_products AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_ideas AFTER INSERT OR UPDATE OR DELETE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_site_content AFTER INSERT OR UPDATE OR DELETE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();


-- Migration: 20260720045103_35c8542d-7395-48b2-95b6-abf36e54d6ef.sql

REVOKE EXECUTE ON FUNCTION public.tg_audit_row() FROM PUBLIC, anon, authenticated;


-- Migration: 20260720045649_99c4db30-e328-49bf-9104-719ef1a49907.sql

-- Attach updated_at trigger to all CMS tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_posts','certificates','experiences','hero_projects','ideas','media','messages','products','projects','services','site_content','skills','testimonials']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I;', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();', t);
  END LOOP;
END $$;

-- Analytics performance index
CREATE INDEX IF NOT EXISTS analytics_events_event_created_at_idx
  ON public.analytics_events (event, created_at DESC);


-- Migration: 20260720100621_c2bb0c49-1227-4687-95d6-974d8f2c985d.sql
-- Drop legacy duplicate policies (two migration runs created near-identical sets).
DROP POLICY IF EXISTS "media: public read" ON public.media;
DROP POLICY IF EXISTS "media: auth read" ON public.media;
DROP POLICY IF EXISTS "media: admin insert" ON public.media;
DROP POLICY IF EXISTS "media: admin update" ON public.media;
DROP POLICY IF EXISTS "media: admin delete" ON public.media;
DROP POLICY IF EXISTS "media_admin_insert" ON public.media;
DROP POLICY IF EXISTS "media_admin_update" ON public.media;
DROP POLICY IF EXISTS "media_admin_delete" ON public.media;
DROP POLICY IF EXISTS "media public read" ON public.media;
DROP POLICY IF EXISTS "media admin insert" ON public.media;
DROP POLICY IF EXISTS "media admin update" ON public.media;
DROP POLICY IF EXISTS "media admin delete" ON public.media;

-- Revoke the anon SELECT grant — the media table is now an admin-only asset library.
REVOKE SELECT ON public.media FROM anon;

-- Canonical policies: admin-only read/write. Public site rendering uses
-- signed URLs stored on referencing rows (projects.cover_url, hero_projects.cover_url, …).
CREATE POLICY "media_admin_select"
  ON public.media FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "media_admin_insert"
  ON public.media FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "media_admin_update"
  ON public.media FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "media_admin_delete"
  ON public.media FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- Migration: 20260721033058_ae115be9-a3f0-4fd3-a2be-80c8847f1e14.sql
-- Tighten SECURITY DEFINER function ACLs.
-- has_role is only used inside RLS policies and by authenticated app code;
-- there is no reason for anon to execute it directly.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- is_admin() is a convenience wrapper over has_role for authenticated users only.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- tg_audit_row is a trigger function; nobody should call it directly.
REVOKE EXECUTE ON FUNCTION public.tg_audit_row() FROM PUBLIC, anon, authenticated;

-- Migration: 20260721033255_75f6de8d-494d-479b-9836-573a3af9cd6e.sql
GRANT SELECT ON public.hero_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_projects TO authenticated;
GRANT ALL ON public.hero_projects TO service_role;

-- Migration: 20260721034000_c1b3b297-2e1d-4278-bf49-22f959d3c243.sql
GRANT SELECT ON public.hero_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_projects TO authenticated;
GRANT ALL ON public.hero_projects TO service_role;

DROP POLICY IF EXISTS "hero_projects public read active" ON public.hero_projects;
CREATE POLICY "hero_projects public read active"
ON public.hero_projects
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  OR public.has_role(auth.uid(), 'admin')
);

-- Migration: 20260721034043_629c3fa8-c315-401c-a3b0-0c91117710c3.sql
DROP POLICY IF EXISTS "hero_projects public read active" ON public.hero_projects;
DROP POLICY IF EXISTS "hero_projects anon read active" ON public.hero_projects;
DROP POLICY IF EXISTS "hero_projects authenticated read active or admin" ON public.hero_projects;

CREATE POLICY "hero_projects anon read active"
ON public.hero_projects
FOR SELECT
TO anon
USING (is_active = true);

CREATE POLICY "hero_projects authenticated read active or admin"
ON public.hero_projects
FOR SELECT
TO authenticated
USING (
  is_active = true
  OR public.has_role(auth.uid(), 'admin')
);

-- Migration: 20260721063249_1476259a-3540-416e-a83c-67ae5e7edc27.sql
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS highlights text[] NOT NULL DEFAULT '{}'::text[];

-- Migration: 20260721065714_ddaba36d-c60c-4e48-b9b4-529a4d86789a.sql
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS section_order text[] NOT NULL DEFAULT ARRAY[]::text[];

-- Migration: 20260722021342_50d8f04c-4e1b-4bbf-a1b3-1caf94aa00dc.sql

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS spotlight jsonb;

UPDATE public.projects
SET
  spotlight = jsonb_build_object(
    'title', 'مساعد الإيجار الذكي',
    'description', 'بدل ما يبحث المستخدم عن المنتجات يدويًا، يستطيع وصف احتياجه بلغة طبيعية مثل: "بكرة عندي كشتة" أو "بغسل السيارة"، ليقوم المساعد الذكي بتحليل الطلب واقتراح الأدوات المناسبة والمتوفرة بالقرب منه.'
  ),
  section_order = ARRAY['spotlight','problem','goals','research','solution','designProcess','development','stack','gallery','metrics','highlights','lessons','testimonial']
WHERE slug = 'rent-right';


-- Migration: 20260722023727_ef0418f0-64d7-432f-9fd2-ae7421f11c06.sql
-- 1) Add tools column
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tools text[] NOT NULL DEFAULT '{}';

-- 2) Backfill metrics from results where metrics is empty
UPDATE public.projects
SET metrics = results
WHERE (metrics IS NULL OR jsonb_array_length(COALESCE(metrics, '[]'::jsonb)) = 0)
  AND results IS NOT NULL
  AND jsonb_array_length(results) > 0;

-- 3) Drop the redundant results column
ALTER TABLE public.projects
  DROP COLUMN IF EXISTS results;


-- Migration: 20260722084613_cf2724c1-71b4-466f-b683-2b885198c3bb.sql
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS showcase_phone_image text,
  ADD COLUMN IF NOT EXISTS showcase_logo_image text,
  ADD COLUMN IF NOT EXISTS showcase_logo_label text,
  ADD COLUMN IF NOT EXISTS featured_project_slugs text[] NOT NULL DEFAULT '{}'::text[];

-- Migration: 20260724013241_cabbe46f-b4a4-4c2b-90d8-0ee5b661ee7f.sql

-- Restrict public read on the media bucket to known public asset folders only.
-- Files outside these prefixes are no longer readable by anon/authenticated
-- via storage; admins still have full CRUD via their existing policies.
DROP POLICY IF EXISTS "media public read" ON storage.objects;
DROP POLICY IF EXISTS "media: public read" ON storage.objects;

CREATE POLICY "media: public read scoped"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'media'
    AND (
      (storage.foldername(name))[1] IN (
        'projects','services','products','blog','certificates',
        'experiences','testimonials','content','hero','library','gallery'
      )
    )
  );



-- ========================================================
-- Master RLS Policy Overrides for Full Admin Access
-- ========================================================
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'projects', 'services', 'certificates', 'experiences',
    'skills', 'testimonials', 'blog_posts', 'ideas',
    'products', 'media', 'messages', 'hero_projects', 'site_content'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "auth_full_access_%I" ON public.%I;', t, t);
    EXECUTE format('CREATE POLICY "auth_full_access_%I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "anon_read_access_%I" ON public.%I;', t, t);
    EXECUTE format('CREATE POLICY "anon_read_access_%I" ON public.%I FOR SELECT TO anon USING (true);', t, t);
  END LOOP;
END $$;
