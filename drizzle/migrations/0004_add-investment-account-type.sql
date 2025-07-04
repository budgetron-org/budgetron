ALTER TABLE "bank_accounts" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."bank_account_type_enum";--> statement-breakpoint
CREATE TYPE "public"."bank_account_type_enum" AS ENUM('CHECKING', 'CREDIT', 'INVESTMENT', 'SAVINGS');--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "type" SET DATA TYPE "public"."bank_account_type_enum" USING "type"::"public"."bank_account_type_enum";