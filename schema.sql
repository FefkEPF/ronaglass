CREATE TABLE IF NOT EXISTS `settings` (
  `key` varchar(255) NOT NULL,
  `value` text,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `settings` (`key`, `value`) VALUES 
('hero_title', 'CAMDAKİ ŞEFFAF ÇÖZÜM<br><em>RONA AUTO GLASS</em>'),
('hero_subtitle', 'Kasko bozmadan cam değişimi. 15 dk\'da tamir.'),
('phone_number', '+90 534 694 37 89'),
('email_address', 'info@ronaglass.com.tr'),
('address', '2474 Cad 4/1 Şaşmaz / Ankara');

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
