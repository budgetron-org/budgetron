-- Seeds the DB with default feature flags --
-- By default, allow_signup flag is enabled for all domains --
INSERT INTO feature_flags (id, name, description, enabled, domains, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'allow_signup', 'Allow users to sign up', true, '{*}', now(), now());
