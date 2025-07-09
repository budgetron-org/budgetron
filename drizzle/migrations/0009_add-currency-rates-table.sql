CREATE TABLE "currency_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_currency" text NOT NULL,
	"target_currency" text NOT NULL,
	"date" date NOT NULL,
	"rate" numeric NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "currency_rates_sourceCurrency_targetCurrency_date_source_unique" UNIQUE("source_currency","target_currency","date","source")
);
