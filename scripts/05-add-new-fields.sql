-- Add new fields to usaha table
ALTER TABLE usaha ADD COLUMN investasi BIGINT DEFAULT NULL AFTER email;
ALTER TABLE usaha ADD COLUMN tahun_berdiri INT DEFAULT NULL AFTER investasi;

-- Add new fields to wilayah table
ALTER TABLE wilayah ADD COLUMN latitude FLOAT NOT NULL DEFAULT 0 AFTER desa;
ALTER TABLE wilayah ADD COLUMN longitude FLOAT NOT NULL DEFAULT 0 AFTER latitude;
ALTER TABLE wilayah ADD COLUMN estimasi_biaya VARCHAR(500) DEFAULT NULL AFTER catatan_risiko;
ALTER TABLE wilayah ADD COLUMN estimasi_waktu VARCHAR(500) DEFAULT NULL AFTER estimasi_biaya;

-- Create indexes for better query performance
CREATE INDEX idx_usaha_investasi ON usaha(investasi);
CREATE INDEX idx_usaha_tahun ON usaha(tahun_berdiri);
CREATE INDEX idx_wilayah_lat_long ON wilayah(latitude, longitude);
