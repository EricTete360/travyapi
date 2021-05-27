/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `adminuser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `adminuser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `superadminuser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `superadminuser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user.mobile_unique` ON `user`(`mobile`);

-- CreateIndex
CREATE UNIQUE INDEX `adminuser.email_unique` ON `adminuser`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `adminuser.mobile_unique` ON `adminuser`(`mobile`);

-- CreateIndex
CREATE UNIQUE INDEX `superadminuser.email_unique` ON `superadminuser`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `superadminuser.mobile_unique` ON `superadminuser`(`mobile`);
