-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usaha` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `sektor` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `kecamatan` VARCHAR(100) NOT NULL,
    `desa` VARCHAR(100) NOT NULL,
    `nomer_telp` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NULL,
    `gambar` VARCHAR(500) NULL,
    `investasi` BIGINT NULL,
    `tahun_berdiri` INTEGER NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diupdate_pada` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wilayah` (
    `id` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(100) NOT NULL,
    `desa` VARCHAR(100) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status_rdtr` VARCHAR(20) NOT NULL,
    `usaha_sesuai` LONGTEXT NOT NULL,
    `perlu_kajian` LONGTEXT NOT NULL,
    `catatan_risiko` LONGTEXT NULL,
    `estimasi_biaya` VARCHAR(500) NULL,
    `estimasi_waktu` VARCHAR(500) NULL,
    `gambar_rdtr` VARCHAR(500) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diupdate_pada` DATETIME(3) NOT NULL,

    UNIQUE INDEX `wilayah_kecamatan_desa_key`(`kecamatan`, `desa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
