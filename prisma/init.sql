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

CREATE TABLE IF NOT EXISTS "StamVerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("identifier", "token")
);

COMMIT;
