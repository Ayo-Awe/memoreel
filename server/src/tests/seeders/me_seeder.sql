-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: memoreel_test
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` VALUES (1,'faeb09c966b9f2f33e97a1dcd7348412ec4f32cfff8e3d82924d6bf3b0d06c9a',1684671606002),(2,'1918714bde315a597842a846803595f9ee0a6568a64098265d1c0e865c85ac6b',1684682342202),(3,'9f430bc889b930525d145a984341616406186aeac76bec0f54a1cc1ee02572d8',1684766855562),(4,'ccbcda9a22169f85cb078d47924f21110cbd91497626b8fdfa83123728c4bc8c',1684768272105),(5,'193ec39a371356579659fd1c4b77219bda3bb7b3c95fd1d94469219621acbc9e',1684882684495);
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reels`
--

DROP TABLE IF EXISTS `reels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `bucket_key` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `confirmation_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `delivery_date` timestamp NOT NULL,
  `status` enum('delivered','shipped','failed','unconfirmed') NOT NULL,
  `delivery_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reels`
--

LOCK TABLES `reels` WRITE;
/*!40000 ALTER TABLE `reels` DISABLE KEYS */;
INSERT INTO `reels` VALUES (1,'pupoawe@gmail.com','7dbbf106b747df2b1be7167bfd8c8103','A sunny afternoon','My favourite reel',NULL,'2023-05-24 17:45:15','2023-05-26 16:46:34','shipped',NULL),(2,'pupoawe@gmail.com','d6538884d9f69b4e6286b562732586a2','My Reel',NULL,'a90f17e50d2f7e62466228ae5a3cf2143c69c89d43440b185278be9c6cd7b83c','2023-05-24 17:46:34','2023-05-26 18:48:34','unconfirmed',NULL),(3,'pupoawe@gmail.com','c4e8b53c6e04aaa9ac83e02826fb6c3b','A sunny afternoon','My favourite reel',NULL,'2023-05-24 17:51:48','2023-05-26 16:46:34','delivered','6ebc92a604c1f3dfad85a7fe1465b3086ad41e4b1d15edb7cfd1fbe1a2b29d85'),(4,'pupoawe@gmail.com','75d1a3e1a7f139db972f2fb35a6496cc','A sunny afternoon','My favourite reel',NULL,'2023-05-24 17:51:53','2023-05-26 16:46:34','shipped',NULL);
/*!40000 ALTER TABLE `reels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_social_accounts`
--

DROP TABLE IF EXISTS `user_social_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_social_accounts` (
  `provider` enum('google') NOT NULL,
  `user_id` int NOT NULL,
  `social_login_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`provider`,`user_id`),
  KEY `user_social_accounts_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `user_social_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_social_accounts`
--

LOCK TABLES `user_social_accounts` WRITE;
/*!40000 ALTER TABLE `user_social_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_social_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `confirmation_token` varchar(255) DEFAULT NULL,
  `confirmation_token_expires_at` timestamp NULL DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `password_token` varchar(100) DEFAULT NULL,
  `password_token_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'pupoawe@gmail.com','$2b$10$.vaTMKhumY3jNP5o//yyJOjD1osHDJWFCq5xkGnGtuYn67Acm4nFi',NULL,NULL,1,NULL,NULL,'2023-05-24 17:42:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-24 18:56:43
