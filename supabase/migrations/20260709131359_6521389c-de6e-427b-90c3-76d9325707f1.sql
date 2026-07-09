
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
