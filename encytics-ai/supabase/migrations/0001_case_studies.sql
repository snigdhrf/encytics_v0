-- ============================================================================
-- 0001_case_studies.sql — core CMS table for the Encytics site
-- Fixes audit findings: 3.1 (no shared persistence), 3.3 (slug collisions /
-- random IDs), 2.6 (permanent delete), 2.5 (review-gate bypass, partial).
--
-- HOW TO APPLY
--   Option A: Supabase Dashboard → SQL Editor → paste this whole file → Run
--   Option B: supabase CLI → `supabase db push` (this file is already in the
--             conventional supabase/migrations/ location)
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.case_studies (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  client       text not null,
  industry     text not null,
  title        text not null,
  summary      text not null default '',
  body         text not null default '',
  metrics      jsonb not null default '[]'::jsonb,   -- [{ "label": "...", "value": "..." }]
  tags         text[] not null default '{}',
  status       text not null default 'pending'
               check (status in ('draft', 'pending', 'published')),
  featured     boolean not null default false,
  created_by   text not null,                        -- email; becomes FK -> profiles.id with real auth
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz,
  deleted_at   timestamptz                           -- soft delete: non-null = in trash
);

-- Slug must be unique among live rows; a soft-deleted row releases its slug.
create unique index if not exists case_studies_slug_live_unique
  on public.case_studies (slug)
  where deleted_at is null;

-- The hot path for the public site.
create index if not exists case_studies_published_idx
  on public.case_studies (status, featured)
  where status = 'published' and deleted_at is null;

-- ----------------------------------------------------------------------------
-- Seed: the four placeholder studies the site ships with today, so the public
-- pages look identical after the cutover.
-- ⚠ AUDIT M1: these are FABRICATED examples — replace with client-approved
-- content (or label as illustrative) before launch.
-- Inserted BEFORE the workflow triggers below so they can be born published.
-- ----------------------------------------------------------------------------
insert into public.case_studies
  (slug, client, industry, title, summary, body, metrics, tags, status, featured, created_by, created_at, published_at)
values
  (
    'real-time-recommendation-engine',
    'Global E-Commerce Platform', 'Retail',
    'Real-time recommendation engine reducing churn by 34%',
    'A streaming recommendation system serving sub-30ms personalized results at scale.',
    'We rebuilt the recommendation pipeline on Spark Structured Streaming with a Redis feature store, cutting churn by 34% and adding $12M in incremental revenue.',
    '[{"label":"Revenue lift","value":"+$12M"},{"label":"Churn reduction","value":"-34%"},{"label":"Latency","value":"<30ms"}]'::jsonb,
    array['ML','Spark','Redis','Kafka'],
    'published', true, 'seed', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'
  ),
  (
    'fraud-detection-model',
    'FinTech Unicorn', 'Finance',
    'Fraud detection model achieving 99.7% precision',
    'A gradient-boosted fraud model with a real-time feature platform.',
    'An XGBoost model fronted by a Feast feature store and Airflow retraining loop, preventing $8.2M in fraud while cutting false positives by 91%.',
    '[{"label":"Fraud prevented","value":"$8.2M"},{"label":"False positives","value":"-91%"}]'::jsonb,
    array['XGBoost','Feast','Airflow'],
    'published', false, 'seed', '2024-01-02T00:00:00Z', '2024-01-02T00:00:00Z'
  ),
  (
    'patient-readmission-prediction',
    'Healthcare Provider Network', 'Healthcare',
    'Patient readmission prediction and population analytics',
    'HIPAA-compliant analytics reducing readmissions and cost.',
    'A Snowflake-based population analytics layer with a readmission risk model, lowering readmissions by 28% and saving $3.4M annually.',
    '[{"label":"Readmissions","value":"-28%"},{"label":"Cost savings","value":"$3.4M"}]'::jsonb,
    array['Python','Snowflake','HIPAA'],
    'published', false, 'seed', '2024-01-03T00:00:00Z', '2024-01-03T00:00:00Z'
  ),
  (
    'data-lakehouse-migration',
    'Supply Chain Enterprise', 'Logistics',
    'End-to-end data lakehouse migration and demand forecasting',
    'A Databricks lakehouse migration with Prophet-based forecasting.',
    'We migrated a legacy warehouse to a Databricks Delta Lake lakehouse and shipped demand forecasting at 94% accuracy, cutting data cost by 60% and speeding queries 8×.',
    '[{"label":"Forecast accuracy","value":"94%"},{"label":"Data cost","value":"-60%"},{"label":"Query speed","value":"8× faster"}]'::jsonb,
    array['Databricks','dbt','Delta Lake','Prophet'],
    'published', true, 'seed', '2024-01-04T00:00:00Z', '2024-01-04T00:00:00Z'
  )
on conflict (slug) where deleted_at is null do nothing;

-- ----------------------------------------------------------------------------
-- Workflow triggers
-- ----------------------------------------------------------------------------

-- Content is never born published: publishing is a deliberate, separate admin
-- action after review. This holds even if someone crafts a raw API request.
create or replace function public.case_studies_before_insert()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' then
    new.status := 'pending';
  end if;
  return new;
end $$;

drop trigger if exists case_studies_before_insert on public.case_studies;
create trigger case_studies_before_insert
  before insert on public.case_studies
  for each row execute function public.case_studies_before_insert();

-- Keep updated_at honest and stamp published_at on the draft→published flip.
create or replace function public.case_studies_before_update()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'published' and old.status is distinct from 'published' then
    new.published_at := now();
  end if;
  return new;
end $$;

drop trigger if exists case_studies_before_update on public.case_studies;
create trigger case_studies_before_update
  before update on public.case_studies
  for each row execute function public.case_studies_before_update();

-- ----------------------------------------------------------------------------
-- Row-Level Security
--
-- ⚠ INTERIM POLICIES. Real per-role enforcement requires Supabase Auth, which
-- replaces the demo login in the next milestone (audit M2). Until then the
-- app enforces roles client-side and these policies are deliberately
-- permissive — with one hard guarantee: there is NO delete policy, so no
-- client can ever hard-DELETE a row. Content can only be soft-deleted
-- (deleted_at) and is always recoverable by an operator.
-- ----------------------------------------------------------------------------

alter table public.case_studies enable row level security;

drop policy if exists interim_select on public.case_studies;
create policy interim_select on public.case_studies
  for select to anon, authenticated using (true);

drop policy if exists interim_insert on public.case_studies;
create policy interim_insert on public.case_studies
  for insert to anon, authenticated with check (true);

drop policy if exists interim_update on public.case_studies;
create policy interim_update on public.case_studies
  for update to anon, authenticated using (true) with check (true);

-- TODO next milestone (Supabase Auth + profiles table):
--   * anon select        -> only status='published' and deleted_at is null
--   * insert/update      -> authenticated staff per profiles.role
--   * publish transition -> admins only, checked inside the update policy
--   * soft delete        -> admins only
