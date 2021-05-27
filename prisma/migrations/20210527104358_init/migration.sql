/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `otpprofile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `otpprofile.otp_unique` ON `otpprofile`(`otp`);
