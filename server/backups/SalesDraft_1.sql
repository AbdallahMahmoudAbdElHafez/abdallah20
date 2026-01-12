-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: nurivina_crm
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `area_id` int NOT NULL AUTO_INCREMENT,
  `area_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (2,'دمياط','2025-10-17 14:11:44','2025-10-17 14:11:44');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinics`
--

DROP TABLE IF EXISTS `clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinic_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clinic_phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_clinics_city` (`city_id`),
  CONSTRAINT `fk_clinics_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinics`
--

LOCK TABLES `clinics` WRITE;
/*!40000 ALTER TABLE `clinics` DISABLE KEYS */;
INSERT INTO `clinics` VALUES (4,'هبببب','نتتتغا','',2),(5,'مركز نور',NULL,NULL,NULL),(6,'مركز ميت بطيخ','خلف مصنع الكراسي','',2);
/*!40000 ALTER TABLE `clinics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm`
--

DROP TABLE IF EXISTS `crm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crm` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `visit_frequency` int unsigned DEFAULT NULL,
  `marketClass` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `firstWeek` tinyint(1) DEFAULT '0',
  `secondWeek` tinyint(1) DEFAULT '0',
  `thirdWeek` tinyint(1) DEFAULT '0',
  `fourthWeek` tinyint(1) DEFAULT '0',
  `fifthWeek` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_doctor` (`doctor_id`),
  KEY `fk_visit_user` (`user_id`),
  CONSTRAINT `fk_visit_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm`
--

LOCK TABLES `crm` WRITE;
/*!40000 ALTER TABLE `crm` DISABLE KEYS */;
INSERT INTO `crm` VALUES (8,8,7,2,'A',0,0,2,0,0,'2025-10-19 22:12:24','2025-10-19 22:13:03'),(9,8,9,2,'A',1,0,0,0,0,'2025-10-19 22:30:58','2025-10-19 22:50:41'),(10,8,11,2,'A',0,0,0,0,1,'2025-10-19 22:45:11','2025-10-19 22:51:12');
/*!40000 ALTER TABLE `crm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_clinic`
--

DROP TABLE IF EXISTS `doctor_clinic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_clinic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `clinic_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `clinic_id` (`clinic_id`),
  CONSTRAINT `doctor_clinic_ibfk_15` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `doctor_clinic_ibfk_16` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_clinic`
--

LOCK TABLES `doctor_clinic` WRITE;
/*!40000 ALTER TABLE `doctor_clinic` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctor_clinic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (5,'محمد نادر'),(6,'عم ابراهيم'),(7,'توتال'),(8,'عباس العقاد'),(9,'عادل محمد'),(10,'عباس نادر'),(11,'عباس الدوقي');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors_users`
--

DROP TABLE IF EXISTS `doctors_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_doctor` (`user_id`,`doctor_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `doctors_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctors_users_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors_users`
--

LOCK TABLES `doctors_users` WRITE;
/*!40000 ALTER TABLE `doctors_users` DISABLE KEYS */;
INSERT INTO `doctors_users` VALUES (6,8,9),(7,8,10),(8,8,11),(2,9,5),(3,9,7),(4,10,8),(5,11,7);
/*!40000 ALTER TABLE `doctors_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('rep','manager','admin') COLLATE utf8mb4_general_ci DEFAULT 'rep',
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'Abdallah','$2b$10$J58n6Xt0.O3Nn4RZArztqOXXoiKPAhemtlFliiDf1/et0NrBi6n6q','admin',NULL),(9,'ساره محمود','$2b$10$Tpib86MOmTdKM.M1QnAjwOLYeJNzJAP4sLuwP2EMjA03LXXs/UxdC','manager',NULL),(10,'بيتر','$2b$10$nr2hxvY9e7c2ji1NV2gu3.TtDIi7QluYNfi5sGLE/ZZrJWV3X9Nqm','manager',NULL),(11,'منه خالد المصرى','$2b$10$sqeGdMaMqQB6s74Gg6AyReA1uRpi3wZDnRRw0nla11.ZhGGI.Z3.u','rep',9),(12,'يمنى ايمن','$2b$10$VwZ3VZ/7JfmX3jTECrQEkO6bEuv.G.4yUTKFzc6iVPVnL.yd5sYsG','rep',9);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_plan_schedules`
--

DROP TABLE IF EXISTS `visit_plan_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_plan_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `crm_id` int unsigned NOT NULL,
  `visit_day` enum('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday') COLLATE utf8mb4_general_ci NOT NULL,
  `time_from` time NOT NULL,
  `time_to` time NOT NULL,
  `clinic_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visit_plan_schedules_ibfk_1` (`crm_id`),
  KEY `visit_plan_schedules_ibfk_2` (`clinic_id`),
  CONSTRAINT `visit_plan_schedules_ibfk_1` FOREIGN KEY (`crm_id`) REFERENCES `crm` (`id`) ON DELETE CASCADE,
  CONSTRAINT `visit_plan_schedules_ibfk_2` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_plan_schedules`
--

LOCK TABLES `visit_plan_schedules` WRITE;
/*!40000 ALTER TABLE `visit_plan_schedules` DISABLE KEYS */;
INSERT INTO `visit_plan_schedules` VALUES (2,8,'Saturday','02:12:00','01:14:00',4),(3,9,'Sunday','16:30:00','15:30:00',5),(4,10,'Saturday','02:44:00','01:45:00',6);
/*!40000 ALTER TABLE `visit_plan_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `visit_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `crm_id` int unsigned NOT NULL,
  `visit_date` date NOT NULL,
  `week_number` enum('1st week','2nd week','3rd week','4th week','5th week') COLLATE utf8mb4_general_ci NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`visit_id`),
  KEY `user_id` (`user_id`),
  KEY `visits_ibfk_25` (`crm_id`),
  CONSTRAINT `visits_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `visits_ibfk_25` FOREIGN KEY (`crm_id`) REFERENCES `crm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
INSERT INTO `visits` VALUES (5,8,8,'2025-10-19','3rd week','fgfgdfg'),(6,8,8,'2025-10-19','3rd week','sdfdsf'),(7,8,9,'2025-10-19','1st week','مروحتش'),(8,8,10,'2025-10-19','5th week','عندها');
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-11 22:01:17
