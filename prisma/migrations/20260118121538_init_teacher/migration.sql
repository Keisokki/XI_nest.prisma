-- CreateTable
CREATE TABLE `Teacher` (
    `id_guru` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_guru` VARCHAR(191) NOT NULL,
    `no_tlp` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_guru`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
