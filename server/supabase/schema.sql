-- Enable extension for UUID generation
create extension if not exists "pgcrypto";

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  care_qr_id integer unique,
  care_youtube_url text,
  description text,
  full_description text,
  image_url text,
  image_urls text[] not null default '{}',
  price_kobo integer not null check (price_kobo >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.products
  add column if not exists full_description text;

alter table if exists public.products
  add column if not exists image_urls text[] not null default '{}';

alter table if exists public.products
  add column if not exists care_qr_id integer;

alter table if exists public.products
  add column if not exists care_youtube_url text;

alter table if exists public.products
  drop constraint if exists products_care_qr_id_check;

alter table if exists public.products
  add constraint products_care_qr_id_check
  check (care_qr_id is null or care_qr_id > 0);

create unique index if not exists idx_products_care_qr_id_unique
  on public.products(care_qr_id)
  where care_qr_id is not null;

update public.products
set care_qr_id = case slug
  when 'diabetes' then 1
  when 'stomach-ulcer' then 2
  when 'hepatitis-b' then 3
  when 'cardiac-health' then 4
  when 'typhoid' then 5
  when 'hiv' then 6
  when 'urinary-tract-infection' then 7
  when 'pregnancy' then 8
  when 'ovulation' then 9
  when 'malaria' then 10
  when 'syphilis' then 11
  when 'male-fertility' then 12
  when 'hpv-antigen' then 13
  when 'menopause' then 14
  when 'chlamydia' then 15
  when 'vaginal-ph-infection' then 16
  when 'gonorrhea' then 17
  when 'kidney' then 18
  when 'prostate' then 19
  else care_qr_id
end
where care_qr_id is null;

alter table if exists public.products
  drop constraint if exists products_image_urls_max_3;

alter table if exists public.products
  add constraint products_image_urls_max_3
  check (coalesce(array_length(image_urls, 1), 0) <= 3);

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);

-- User profiles (linked to Supabase auth.users)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  delivery_address text,
  delivery_location text,
  is_legacy_user boolean not null default false,
  is_activated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.user_profiles
  add column if not exists delivery_address text;

alter table if exists public.user_profiles
  add column if not exists delivery_location text;

-- Orders
create type public.order_status as enum (
  'pending_payment',
  'paid',
  'completed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

alter type public.order_status add value if not exists 'completed';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_location text,
  delivery_fee_kobo integer not null default 0 check (delivery_fee_kobo >= 0),
  total_kobo integer not null check (total_kobo >= 0),
  status public.order_status not null default 'pending_payment',
  payment_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.orders
  add column if not exists delivery_location text;

alter table if exists public.orders
  add column if not exists delivery_fee_kobo integer not null default 0;

alter table if exists public.orders
  drop constraint if exists orders_delivery_fee_kobo_check;

alter table if exists public.orders
  add constraint orders_delivery_fee_kobo_check
  check (delivery_fee_kobo >= 0);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Delivery fees
create table if not exists public.delivery_fees (
  id uuid primary key default gen_random_uuid(),
  location text not null unique,
  fee_kobo integer not null check (fee_kobo >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.delivery_fees
  drop constraint if exists delivery_fees_location_check;

alter table if exists public.delivery_fees
  add constraint delivery_fees_location_check
  check (location in ('Mainland', 'Island'));

insert into public.delivery_fees (location, fee_kobo, is_active)
values
  ('Mainland', 300000, true),
  ('Island', 200000, true)
on conflict (location) do nothing;

create index if not exists idx_delivery_fees_location on public.delivery_fees(location);
create index if not exists idx_delivery_fees_active on public.delivery_fees(is_active);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_kobo integer not null check (unit_price_kobo >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Quiz questions
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  options jsonb not null,
  sort_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quiz responses
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  session_id text,
  responses jsonb not null,
  recommended_product_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_responses_user_id on public.quiz_responses(user_id);

-- ClustaCare submitted test results
create type public.clustacare_result_status as enum ('new', 'reviewed', 'follow_up');

create table if not exists public.clustacare_results (
  id uuid primary key default gen_random_uuid(),
  test_result text not null check (test_result in ('positive', 'negative', 'invalid')),
  whatsapp_number text,
  status public.clustacare_result_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clustacare_results_created_at on public.clustacare_results(created_at desc);
create index if not exists idx_clustacare_results_status on public.clustacare_results(status);

-- Contact inquiries from public contact form
create type public.contact_inquiry_status as enum ('new', 'in_progress', 'resolved', 'spam');

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status public.contact_inquiry_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_inquiries_created_at on public.contact_inquiries(created_at desc);
create index if not exists idx_contact_inquiries_status on public.contact_inquiries(status);

-- Health records
create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  metric_name text not null,
  metric_value text not null,
  recorded_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_health_records_user_id on public.health_records(user_id);
create index if not exists idx_health_records_recorded_at on public.health_records(recorded_at desc);

-- Row level security baseline
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.user_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.health_records enable row level security;
alter table public.clustacare_results enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.delivery_fees enable row level security;

-- Public read access for active catalog data
create policy "public_read_categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "public_read_active_products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "public_read_active_quiz_questions"
  on public.quiz_questions for select
  to anon, authenticated
  using (is_active = true);

create policy "public_read_active_delivery_fees"
  on public.delivery_fees for select
  to anon, authenticated
  using (is_active = true);

-- Authenticated users can read/write own profile
create policy "users_manage_own_profile"
  on public.user_profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Authenticated users can read own orders
create policy "users_read_own_orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users_read_own_order_items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "users_manage_own_quiz_responses"
  on public.quiz_responses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_manage_own_health_records"
  on public.health_records for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "public_insert_clustacare_results"
  on public.clustacare_results for insert
  to anon, authenticated
  with check (true);

create policy "public_insert_contact_inquiries"
  on public.contact_inquiries for insert
  to anon, authenticated
  with check (true);
