-- AlterTable: add tokenExpiresAt to Attendee (nullable — existing rows have no expiry until next login)
ALTER TABLE "Attendee" ADD COLUMN "tokenExpiresAt" TIMESTAMP(3);
