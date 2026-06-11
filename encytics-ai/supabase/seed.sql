-- ============================================================================
-- seed.sql — LOCAL-ONLY workflow fixtures.
--
-- Runs automatically after migrations on `supabase start` / `supabase db reset`.
-- It is NEVER applied to production: `supabase db push` and the dashboard SQL
-- Editor activation path only run migrations.
--
-- The four public placeholder studies are seeded by the 0001 migration (they
-- are launch content). This file adds what local developers need on top:
-- one DRAFT and one PENDING study, so the Content Studio review workflow
-- (draft → submit → publish / demote) can be exercised without typing test
-- data by hand on every reset.
--
-- Inserts are idempotent: the partial unique index on slug (live rows only)
-- makes `on conflict ... do nothing` safe across repeated resets.
-- ============================================================================

insert into public.case_studies
  (slug, client, industry, title, summary, body, metrics, tags, status, featured, created_by)
values
  (
    'local-fixture-draft-study',
    'Local Fixture Co', 'Testing',
    '[DRAFT FIXTURE] Streaming ingestion overhaul',
    'A local-only draft used to test the Content Studio editing flow.',
    'Edit me, save me as draft, submit me for review. I exist so you do not have to create test data by hand after every `supabase db reset`.',
    '[{"label":"Purpose","value":"dev fixture"}]'::jsonb,
    array['fixture','local'],
    'draft', false, 'local-dev'
  ),
  (
    'local-fixture-pending-study',
    'Local Fixture Co', 'Testing',
    '[PENDING FIXTURE] Forecast model awaiting review',
    'A local-only pending study used to test the admin publish/reject flow.',
    'I am waiting in the review queue. Publish me from the admin panel to test the pending → published transition, or edit me to test demotion rules.',
    '[{"label":"Purpose","value":"dev fixture"}]'::jsonb,
    array['fixture','local'],
    'pending', false, 'local-dev'
  )
on conflict (slug) where deleted_at is null do nothing;
