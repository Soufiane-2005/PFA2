-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: learning_adaptatif
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `contenu` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cours`
--

DROP TABLE IF EXISTS `cours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `fichier_pdf` varchar(255) NOT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `module_id` int NOT NULL,
  `enseignant_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cours_ibfk_2` (`enseignant_id`),
  KEY `cours_ibfk_1` (`module_id`),
  CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cours_ibfk_2` FOREIGN KEY (`enseignant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `enseignements`
--

DROP TABLE IF EXISTS `enseignements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enseignements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `module_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enseignement` (`user_id`,`module_id`),
  KEY `enseignements_ibfk_2` (`module_id`),
  CONSTRAINT `enseignements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enseignements_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `etudiant_modules_profiling`
--

DROP TABLE IF EXISTS `etudiant_modules_profiling`;
/*!50001 DROP VIEW IF EXISTS `etudiant_modules_profiling`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `etudiant_modules_profiling` AS SELECT 
 1 AS `user_id`,
 1 AS `email`,
 1 AS `module_id`,
 1 AS `module_nom`,
 1 AS `profiling`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `notifications_ibfk_1` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_module_profiling`
--

DROP TABLE IF EXISTS `user_module_profiling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_module_profiling` (
  `user_id` int NOT NULL,
  `module_id` int NOT NULL,
  `is_profiled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`,`module_id`),
  KEY `user_module_profiling_ibfk_2` (`module_id`),
  CONSTRAINT `user_module_profiling_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_module_profiling_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','enseignant','etudiant') NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `numero_telephone` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `etudiant_modules_profiling`
--

/*!50001 DROP VIEW IF EXISTS `etudiant_modules_profiling`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `etudiant_modules_profiling` AS select `u`.`id` AS `user_id`,`u`.`email` AS `email`,`m`.`id` AS `module_id`,`m`.`nom` AS `module_nom`,coalesce(`ump`.`is_profiled`,false) AS `profiling` from ((`users` `u` join `modules` `m`) left join `user_module_profiling` `ump` on(((`ump`.`user_id` = `u`.`id`) and (`ump`.`module_id` = `m`.`id`)))) where (`u`.`role` = 'etudiant') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 21:04:53
