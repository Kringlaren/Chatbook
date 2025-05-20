-- --------------------------------------------------------
-- Värd:                         127.0.0.1
-- Serverversion:                11.5.2-MariaDB - mariadb.org binary distribution
-- Server-OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumpar databasstruktur för chatbook
CREATE DATABASE IF NOT EXISTS `chatbook` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `chatbook`;

-- Dumpar struktur för tabell chatbook.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.comments: ~0 rows (ungefär)

-- Dumpar struktur för tabell chatbook.followers
CREATE TABLE IF NOT EXISTS `followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user1_id` (`user1_id`),
  KEY `user2_id` (`user2_id`),
  CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.followers: ~16 rows (ungefär)
INSERT INTO `followers` (`id`, `user1_id`, `user2_id`, `created_at`) VALUES
	(21, 46, 31, '2025-04-30 11:44:58'),
	(28, 31, 49, '2025-05-03 13:06:44'),
	(30, 31, 47, '2025-05-03 13:06:58'),
	(31, 31, 52, '2025-05-06 09:18:02'),
	(32, 31, 54, '2025-05-06 09:19:14'),
	(34, 64, 31, '2025-05-08 10:11:13'),
	(39, 31, 51, '2025-05-08 10:22:38'),
	(40, 31, 50, '2025-05-08 18:18:16'),
	(41, 31, 48, '2025-05-08 18:23:23'),
	(42, 31, 65, '2025-05-14 11:37:30'),
	(43, 67, 65, '2025-05-15 06:44:59'),
	(44, 31, 67, '2025-05-15 06:45:19'),
	(45, 31, 46, '2025-05-19 10:48:22'),
	(46, 69, 31, '2025-05-19 14:45:03'),
	(47, 69, 65, '2025-05-19 14:45:13'),
	(48, 31, 69, '2025-05-19 14:46:15');

-- Dumpar struktur för tabell chatbook.likes
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_id` (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.likes: ~1 rows (ungefär)
INSERT INTO `likes` (`id`, `user_id`, `post_id`, `created_at`) VALUES
	(100, 31, 45, '2025-05-19 15:20:59');

-- Dumpar struktur för tabell chatbook.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.posts: ~1 rows (ungefär)
INSERT INTO `posts` (`id`, `user_id`, `content`, `image`, `created_at`) VALUES
	(45, 31, 'Välkommen till Chatbook! Här kan du göra saker som att lägga upp inlägg och spela spel!', '/uploads/1747668045020.png', '2025-05-19 15:20:45');

-- Dumpar struktur för tabell chatbook.scoreboard
CREATE TABLE IF NOT EXISTS `scoreboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `scoreboard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.scoreboard: ~11 rows (ungefär)
INSERT INTO `scoreboard` (`id`, `user_id`, `score`, `created_at`) VALUES
	(1, 31, 11700, '2025-05-07 08:57:55'),
	(2, 46, 860, '2025-05-07 11:37:53'),
	(3, 55, 2340, '2025-05-07 12:28:57'),
	(4, 56, 900, '2025-05-07 13:16:37'),
	(5, 57, 360, '2025-05-07 13:28:40'),
	(6, 58, 500, '2025-05-07 13:31:03'),
	(7, 59, 200, '2025-05-07 13:32:46'),
	(8, 60, 400, '2025-05-07 13:41:06'),
	(10, 63, 3220, '2025-05-08 09:40:50'),
	(11, 64, 820, '2025-05-08 09:55:11'),
	(12, 69, 400, '2025-05-19 14:21:41');

-- Dumpar struktur för tabell chatbook.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.sessions: ~1 rows (ungefär)
INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('y-gJ3nJtL4Al8Tg5iZefhLX-m2Xma-qZ', 1750260752, '{"cookie":{"originalMaxAge":2592000000,"expires":"2025-06-18T15:15:02.870Z","httpOnly":true,"path":"/","sameSite":"lax"},"userId":31}');

-- Dumpar struktur för tabell chatbook.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT '/uploads/pp.png',
  `banner_img` varchar(255) DEFAULT '/uploads/banner.jpg',
  `bio` varchar(255) DEFAULT NULL,
  `bg_color` varchar(7) DEFAULT NULL,
  `text_color` varchar(7) DEFAULT NULL,
  `detail_color` varchar(7) DEFAULT NULL,
  `link_color` varchar(7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumpar data för tabell chatbook.users: ~23 rows (ungefär)
INSERT INTO `users` (`id`, `username`, `password`, `profile_pic`, `banner_img`, `bio`, `bg_color`, `text_color`, `detail_color`, `link_color`, `created_at`) VALUES
	(31, 'Adam.Kring', '$2b$10$i2MWESghDz3iHq1rQyj1dOp9tC66bL96umyJ1RMQtLq7SlJwTSmmK', '/uploads/1747667877622.jpg', '/uploads/1747667870757.png', 'Hejhejaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '#242424', '#f0f0f0', '#dddddd', '#ff69b4', '2025-04-10 09:51:01'),
	(45, 'Simon', '$2b$10$vqLHkbiSmbthED0fu/cmZO5lDwyFoYS9TAQojFpR/nVpYS7Zqo0r6', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-04-29 13:26:55'),
	(46, 'Josua', '$2b$10$4BSEX9LaGFSVqCcd0/eKsuC.mmb4.bnmpNc2gHcNGhiUXZa2V4hDq', '/uploads/pp.png', '/uploads/banner.jpg', NULL, '#1f243e', NULL, NULL, NULL, '2025-04-30 08:05:13'),
	(47, 'John.Doe', '$2b$10$zl/dKePlSrh7u8hyWzvAtunQed31R720jyfU1MZ/jQ9YBlBmQr85u', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-03 12:59:54'),
	(48, 'Batman', '$2b$10$8BW8UoSFPW9F3eQsJUUJU.r3nyUi2AMp2YT2j/SWr9Uym6TTR.yEi', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-03 13:00:11'),
	(49, 'Bamse', '$2b$10$NHVxCt.XHuyWh0YXHEbOEuWtS05pe9I0HEZRocaK3Rq3W5hnbi4be', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-03 13:00:55'),
	(50, 'Skalman', '$2b$10$uDw4Fd/EpyuUcwvJBg4TZu7Lt7ufZHAtD4e4CbrCz5bjtB0OXwFzi', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-03 13:01:15'),
	(51, 'Vilmer', '$2b$10$89JG7nM0g53QJ/GNHuuKfekkmzgkpNyYyLOZZ1lOHsZydSyiZGwhi', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-03 13:02:08'),
	(52, 'Han.Solo', '$2b$10$4nGDVjNdGtM.01SpBJ6neesjGlaaSC9gW7KLMZIe/IOBddvjX8LRK', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-03 13:02:57'),
	(53, 'Batman2', '$2b$10$Q3uXYs1L8vwX3S2.jaSMBumAk9fuo2r70IXhbK.2hP.PJeHIl3ZiW', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-05 10:58:59'),
	(54, 'simon.liebuse', '$2b$10$8UMJvzJwS3ZQkeo2BR1FQeP7zYQ8wr8TGf4Yuj98xQ7xqAjfEiyym', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-06 09:18:53'),
	(55, 'Sebastian.Koski', '$2b$10$m9HbHDJcqApqLKek4Kiutei4xMMJHyzk2ittoPC5JUBllrzFkUE16', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-07 12:09:23'),
	(56, 'Alexander.Kuhnert', '$2b$10$Wt6wb.LTVknu/KTLH8qsPu3SGFHB4PILby.3N1YoorETQGdJOcsdG', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-07 13:12:08'),
	(57, 'Big.Z', '$2b$10$Py6Oe8l/QJCXD6.s8bD/BujdU0UyM/P9HcBV63NqFSOc7kHVKepqu', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-07 13:28:03'),
	(58, 'Elias', '$2b$10$3oZTtgTy18tv/1tzjLMFj.41PvxJxBg9ENwZBpAD2W/T5cEfM4Sl.', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-07 13:30:20'),
	(59, 'Ludvig', '$2b$10$upx0mOXtPyfso1YtcFg6hOIoj.O5eMIeDNjdbxqkaUR.WmyolKZt2', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-07 13:32:04'),
	(60, 'Lindbäck', '$2b$10$E4fap6XmZtJzEHkNmu1t8eDxgPbkdVkV5eA5Ywz8EQSzaeMdI6CKO', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-07 13:40:18'),
	(63, 'simonedb', '$2b$10$E73c7.nqTloCDXHhF0NQSuk0nSF9vfCXjvs5u1thoXc7YsqeRYS8e', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-08 09:39:29'),
	(64, 'Morus', '$2b$10$SdF2LFQKNNA0XVL6cyARX.opNBmKYeTm87CmV.Xd531icQ.x8lEU.', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-08 09:54:37'),
	(65, 'Robin', '$2b$10$b2Q7/jMsUrhkqYJMFgP6HuKTk39TUf4UvLS.vpXYQjR2X71hHH/Qu', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-14 11:37:11'),
	(67, 'Aaaaaaaaaaaaaaaaaaaa', '$2b$10$xY.sMqBxB.j5XPMD7AMYTuWPQBVvFuQ3sVyEXZheG8fPoPZ8N7jum', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-15 06:42:31'),
	(69, 'Felix', '$2b$10$gQfYoNU1RofbNKom5bxUV.5ri/Eu6N5XWpRhsQchQvlZtjHsMe4/a', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-19 14:21:14'),
	(70, 'Theodor', '$2b$10$N59w3IYVPv5Wec5Ie/yD3eyHWu/4svK27ro3OglESw8EdpRMLfaL.', '/uploads/pp.png', '/uploads/banner.jpg', NULL, NULL, NULL, NULL, NULL, '2025-05-19 15:07:10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
