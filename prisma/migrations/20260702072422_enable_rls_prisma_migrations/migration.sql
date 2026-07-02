-- _prisma_migrations doesn't exist until Prisma's engine bootstraps it right
-- before applying the first migration, so it couldn't be included in the
-- RLS statements in 20260702071919_init. Closing that gap here.
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
