
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
