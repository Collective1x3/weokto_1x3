-- PostgreSQL bootstrap for the dual-site auth setup (Weokto & Stam).
-- Execute this once on an empty database (or schema) before running the app.

BEGIN;

CREATE TABLE IF NOT EXISTS "WeoktoUser" (
  "id" TEXT PRIMARY KEY,
  "pseudo" TEXT,
  "lastName" TEXT,
  "firstName" TEXT,
  "birthDate" DATE,
  "email" TEXT UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "WeoktoUser_email_idx" ON "WeoktoUser" ("email");

CREATE TABLE IF NOT EXISTS "WeoktoSession" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "WeoktoUser"("id") ON DELETE CASCADE,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "userAgent" TEXT,
  "ipAddress" TEXT
);

CREATE TABLE IF NOT EXISTS "WeoktoAccount" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "WeoktoUser"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "WeoktoAccount_provider_providerAccountId_key"
    UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "WeoktoVerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "StamUser" (
  "id" TEXT PRIMARY KEY,
  "pseudo" TEXT,
  "lastName" TEXT,
  "firstName" TEXT,
  "birthDate" DATE,
  "email" TEXT UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "StamUser_email_idx" ON "StamUser" ("email");

CREATE TABLE IF NOT EXISTS "StamSession" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "StamUser"("id") ON DELETE CASCADE,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "userAgent" TEXT,
  "ipAddress" TEXT
);

CREATE TABLE IF NOT EXISTS "StamAccount" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "StamUser"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "StamAccount_provider_providerAccountId_key"
    UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "StamVerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("identifier", "token")
);

COMMIT;
