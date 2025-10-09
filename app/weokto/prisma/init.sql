-- Schema bootstrap for the dual-site auth setup (Weokto & Stam).
-- Execute this script once on an empty SQLite database before running the app.

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "WeoktoUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pseudo" TEXT,
  "lastName" TEXT,
  "firstName" TEXT,
  "birthDate" DATETIME,
  "email" TEXT UNIQUE,
  "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WeoktoUser_email_idx" ON "WeoktoUser" ("email");

CREATE TABLE IF NOT EXISTS "WeoktoSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  CONSTRAINT "WeoktoSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WeoktoUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "WeoktoAccount" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
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
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WeoktoAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WeoktoUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "WeoktoAccount_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "WeoktoVerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("identifier", "token"),
  UNIQUE ("token")
);

CREATE TABLE IF NOT EXISTS "WeoktoOtpCode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "consumedAt" DATETIME,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastAttempt" DATETIME
);

CREATE TABLE IF NOT EXISTS "StamUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pseudo" TEXT,
  "lastName" TEXT,
  "firstName" TEXT,
  "birthDate" DATETIME,
  "email" TEXT UNIQUE,
  "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "StamUser_email_idx" ON "StamUser" ("email");

CREATE TABLE IF NOT EXISTS "StamSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  CONSTRAINT "StamSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "StamUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "StamAccount" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
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
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StamAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "StamUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "StamAccount_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "StamVerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("identifier", "token"),
  UNIQUE ("token")
);

CREATE TABLE IF NOT EXISTS "StamOtpCode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "consumedAt" DATETIME,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastAttempt" DATETIME
);

COMMIT;
