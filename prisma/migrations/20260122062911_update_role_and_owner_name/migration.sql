/*
  Warnings:

  - Added the required column `nama_pemilik` to the `usaha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `role` ENUM('SUPERADMIN', 'PEGAWAI') NOT NULL DEFAULT 'PEGAWAI';

-- AlterTable
ALTER TABLE `usaha` ADD COLUMN `nama_pemilik` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `wilayah` MODIFY `estimasi_biaya` LONGTEXT NULL,
    MODIFY `estimasi_waktu` LONGTEXT NULL;
