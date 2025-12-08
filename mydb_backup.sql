-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: nurivina
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
-- Table structure for table `accounting_settings`
--

DROP TABLE IF EXISTS `accounting_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounting_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operation_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_account_id` int DEFAULT NULL,
  `default_account_id` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_accounting_settings_op_scope` (`operation_type`,`scope`),
  KEY `idx_accounting_settings_parent` (`parent_account_id`),
  KEY `idx_accounting_settings_default` (`default_account_id`),
  CONSTRAINT `fk_accounting_settings_default` FOREIGN KEY (`default_account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_accounting_settings_parent` FOREIGN KEY (`parent_account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounting_settings`
--

LOCK TABLES `accounting_settings` WRITE;
/*!40000 ALTER TABLE `accounting_settings` DISABLE KEYS */;
INSERT INTO `accounting_settings` VALUES (1,'cash','',7,8,'','2025-09-20 11:38:13','2025-09-20 11:38:13');
/*!40000 ALTER TABLE `accounting_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` enum('asset','liability','equity','revenue','expense') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_account_id` int DEFAULT NULL,
  `opening_balance` decimal(15,2) DEFAULT '0.00',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `parent_account_id` (`parent_account_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`parent_account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'اصول','asset',NULL,0.00,''),(2,'اصول ثابته','asset',1,0.00,''),(3,'اصول متداوله','asset',1,0.00,''),(4,'آلات','asset',2,0.00,''),(5,'مباني','asset',2,0.00,''),(6,'أراضى','asset',2,0.00,''),(7,'صندوق وبنوك','asset',3,0.00,''),(8,'خزينه','asset',7,0.00,''),(9,'خزينه شركه الشحن','asset',7,0.00,''),(10,'البنك الاهلى الخاص','asset',7,0.00,''),(11,'العملاء','asset',3,0.00,''),(12,'اوراق قبض','asset',3,0.00,''),(13,'المخزون','asset',3,0.00,''),(14,'جاري الشركاء','asset',3,0.00,''),(15,'جارى هانى صلاح','asset',14,0.00,''),(16,'خصم ضرائب','asset',3,0.00,''),(17,'خصوم','liability',NULL,0.00,''),(18,'رأس مال','liability',17,0.00,''),(19,'قروض','liability',17,0.00,''),(20,'خصوم متداولة','liability',17,0.00,''),(21,'الموردين','liability',20,0.00,''),(24,'المخزون','asset',3,0.00,'');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_prevent_cycles_insert` BEFORE INSERT ON `accounts` FOR EACH ROW BEGIN
    IF has_cycle(NEW.id, NEW.parent_account_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '❌ Invalid: Circular reference in accounts hierarchy (insert)';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_prevent_cycles_update` BEFORE UPDATE ON `accounts` FOR EACH ROW BEGIN
    IF has_cycle(NEW.id, NEW.parent_account_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '❌ Invalid: Circular reference in accounts hierarchy (update)';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `batch_number` varchar(100) NOT NULL,
  `expiry_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `batches_ibfk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batches`
--

LOCK TABLES `batches` WRITE;
/*!40000 ALTER TABLE `batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_of_materials`
--

DROP TABLE IF EXISTS `bill_of_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_of_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `material_id` int NOT NULL,
  `quantity_per_unit` decimal(12,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `bill_of_materials_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `bill_of_materials_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_of_materials`
--

LOCK TABLES `bill_of_materials` WRITE;
/*!40000 ALTER TABLE `bill_of_materials` DISABLE KEYS */;
INSERT INTO `bill_of_materials` VALUES (10,6,10,1.000),(11,6,11,1.000),(12,6,12,1.000);
/*!40000 ALTER TABLE `bill_of_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `governate_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `governate_id` (`governate_id`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`governate_id`) REFERENCES `governates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'المنصوره',3),(3,'القاهره',3),(4,'الاسكندريه',4),(5,'الدقي',3),(6,'المنزله',2),(7,'دمياط',7),(8,'المنصوره',2),(9,'طلخا',2),(10,'منية النصر',2);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'مصر'),(5,'USA');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_inventory`
--

DROP TABLE IF EXISTS `current_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`warehouse_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `current_inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `current_inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_inventory`
--

LOCK TABLES `current_inventory` WRITE;
/*!40000 ALTER TABLE `current_inventory` DISABLE KEYS */;
INSERT INTO `current_inventory` VALUES (30,11,8,0,'2025-12-07 09:30:08'),(31,10,8,0,'2025-12-07 09:30:08'),(32,12,8,0,'2025-12-07 09:30:08'),(33,10,16,3000,'2025-12-07 09:30:08'),(34,11,16,2960,'2025-12-07 20:33:05'),(35,12,16,3000,'2025-12-07 09:30:08');
/*!40000 ALTER TABLE `current_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'الحسابات','2025-11-15 20:56:52'),(2,'المبيعات','2025-11-15 20:57:01'),(3,'المشتريات','2025-11-15 20:57:11'),(4,'Owner','2025-11-15 20:57:29'),(5,'قسم المبيعات 1','2025-11-25 13:29:01');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_job_title` (`job_title_id`),
  KEY `fk_parent_employee` (`parent_id`),
  KEY `fk_department_id` (`department_id`),
  CONSTRAINT `fk_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_job_title` FOREIGN KEY (`job_title_id`) REFERENCES `job_titles` (`id`),
  CONSTRAINT `fk_parent_employee` FOREIGN KEY (`parent_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entry_types`
--

DROP TABLE IF EXISTS `entry_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entry_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entry_types`
--

LOCK TABLES `entry_types` WRITE;
/*!40000 ALTER TABLE `entry_types` DISABLE KEYS */;
INSERT INTO `entry_types` VALUES (1,'daily'),(2,'adjustment'),(3,'closing'),(4,'opening'),(5,'transfer'),(6,'depreciation'),(7,'currency_revaluation');
/*!40000 ALTER TABLE `entry_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_date` date NOT NULL DEFAULT (curdate()),
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `debit_account_id` int NOT NULL,
  `credit_account_id` int NOT NULL,
  `city_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `party_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_exp_debit` (`debit_account_id`),
  KEY `idx_exp_credit` (`credit_account_id`),
  KEY `fk_exp_city` (`city_id`),
  KEY `fk_exp_employee` (`employee_id`),
  KEY `fk_exp_party` (`party_id`),
  CONSTRAINT `fk_exp_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_credit` FOREIGN KEY (`credit_account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_debit` FOREIGN KEY (`debit_account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_party` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `expenses_chk_amount` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,'2025-11-24','',1000.00,8,21,4,NULL,3,'2025-11-24 14:27:13');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_job_orders`
--

DROP TABLE IF EXISTS `external_job_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_job_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `party_id` int NOT NULL,
  `product_id` int NOT NULL,
  `process_id` int DEFAULT NULL,
  `warehouse_id` int NOT NULL,
  `status` enum('planned','in_progress','completed','cancelled') DEFAULT 'planned',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `order_quantity` decimal(12,3) DEFAULT NULL,
  `produced_quantity` decimal(12,3) DEFAULT NULL,
  `estimated_processing_cost_per_unit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `actual_processing_cost_per_unit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `estimated_raw_material_cost_per_unit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `actual_raw_material_cost_per_unit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_estimated_cost` decimal(14,2) NOT NULL DEFAULT '0.00',
  `total_actual_cost` decimal(14,2) NOT NULL DEFAULT '0.00',
  `reference_no` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  KEY `product_id` (`product_id`),
  KEY `process_id` (`process_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `external_job_orders_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `external_job_orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `external_job_orders_ibfk_4` FOREIGN KEY (`process_id`) REFERENCES `processes` (`id`),
  CONSTRAINT `external_job_orders_ibfk_5` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_job_orders`
--

LOCK TABLES `external_job_orders` WRITE;
/*!40000 ALTER TABLE `external_job_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_job_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `governates`
--

DROP TABLE IF EXISTS `governates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `governates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `governates_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `governates`
--

LOCK TABLES `governates` WRITE;
/*!40000 ALTER TABLE `governates` DISABLE KEYS */;
INSERT INTO `governates` VALUES (2,'الدقهلية',1),(3,'القاهره',1),(4,'الاسكندريه',1),(5,'الشرقيه',1),(7,'دمياط',1),(8,'البحر الأحمر',1),(9,'الغربيه',1),(10,'البحيره',1),(11,'كفر الشيخ',1);
/*!40000 ALTER TABLE `governates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `action_type` enum('insert','update','delete') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_change` int NOT NULL,
  `reference_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `log_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_logs`
--

LOCK TABLES `inventory_logs` WRITE;
/*!40000 ALTER TABLE `inventory_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transaction_batches`
--

DROP TABLE IF EXISTS `inventory_transaction_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transaction_batches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventory_transaction_id` int NOT NULL,
  `batch_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_transaction_id` (`inventory_transaction_id`),
  KEY `batch_id` (`batch_id`),
  CONSTRAINT `itb_ibfk_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`),
  CONSTRAINT `itb_ibfk_transaction` FOREIGN KEY (`inventory_transaction_id`) REFERENCES `inventory_transactions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction_batches`
--

LOCK TABLES `inventory_transaction_batches` WRITE;
/*!40000 ALTER TABLE `inventory_transaction_batches` DISABLE KEYS */;
INSERT INTO `inventory_transaction_batches` VALUES (52,95,NULL,3000,2.00),(53,96,NULL,3000,6.00),(54,97,NULL,3000,3.00),(55,98,NULL,3000,6.00),(56,99,NULL,3000,6.00),(57,100,NULL,3000,2.00),(58,101,NULL,3000,2.00),(59,102,NULL,3000,3.00),(60,103,NULL,3000,3.00),(61,104,NULL,10,2.00),(62,105,NULL,30,2.00);
/*!40000 ALTER TABLE `inventory_transaction_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `transaction_type` enum('in','out') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source_type` enum('purchase','manufacturing','transfer','adjustment','sales_invoice','sales_return','purchase_return') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'adjustment',
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (95,11,8,'in','2025-12-07 09:28:28','Added from Purchase Invoice PI-2025-000131','purchase',71),(96,10,8,'in','2025-12-07 09:28:28','Added from Purchase Invoice PI-2025-000131','purchase',72),(97,12,8,'in','2025-12-07 09:28:28','Added from Purchase Invoice PI-2025-000131','purchase',73),(98,10,8,'out','2025-12-07 09:29:00','تحويل إلى مخزن تحت التشغيل لدى الغير','transfer',8),(99,10,16,'in','2025-12-07 09:29:00','تحويل من مخزن مخزن مستزمات انتاج','transfer',8),(100,11,8,'out','2025-12-07 09:29:00','تحويل إلى مخزن تحت التشغيل لدى الغير','transfer',8),(101,11,16,'in','2025-12-07 09:29:00','تحويل من مخزن مخزن مستزمات انتاج','transfer',8),(102,12,8,'out','2025-12-07 09:29:00','تحويل إلى مخزن تحت التشغيل لدى الغير','transfer',8),(103,12,16,'in','2025-12-07 09:29:00','تحويل من مخزن مخزن مستزمات انتاج','transfer',8),(104,11,16,'out','2025-12-07 00:00:00','Sales Invoice #INV-2025-000017','sales_invoice',17),(105,11,16,'out','2025-12-07 00:00:00','Sales Invoice #INV-2025-000018','sales_invoice',18);
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_voucher_items`
--

DROP TABLE IF EXISTS `issue_voucher_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_voucher_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `voucher_id` int NOT NULL,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `batch_number` varchar(100) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `unit_price` decimal(12,2) DEFAULT '0.00',
  `cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ivi_voucher` (`voucher_id`),
  KEY `fk_ivi_product` (`product_id`),
  KEY `fk_ivi_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_ivi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_ivi_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `issue_vouchers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ivi_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_items`
--

LOCK TABLES `issue_voucher_items` WRITE;
/*!40000 ALTER TABLE `issue_voucher_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `issue_voucher_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_voucher_type_accounts`
--

DROP TABLE IF EXISTS `issue_voucher_type_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_voucher_type_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `issue_voucher_type_id` int NOT NULL,
  `account_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ivta_type` (`issue_voucher_type_id`),
  KEY `fk_ivta_account` (`account_id`),
  CONSTRAINT `fk_ivta_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ivta_type` FOREIGN KEY (`issue_voucher_type_id`) REFERENCES `issue_voucher_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_type_accounts`
--

LOCK TABLES `issue_voucher_type_accounts` WRITE;
/*!40000 ALTER TABLE `issue_voucher_type_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `issue_voucher_type_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_voucher_types`
--

DROP TABLE IF EXISTS `issue_voucher_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_voucher_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_types`
--

LOCK TABLES `issue_voucher_types` WRITE;
/*!40000 ALTER TABLE `issue_voucher_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `issue_voucher_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_vouchers`
--

DROP TABLE IF EXISTS `issue_vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `voucher_no` varchar(100) NOT NULL,
  `type_id` int DEFAULT NULL,
  `party_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `warehouse_id` int NOT NULL,
  `issued_by` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `status` enum('draft','approved','posted','cancelled') NOT NULL DEFAULT 'draft',
  `issue_date` date NOT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_no` (`voucher_no`),
  KEY `fk_iv_type` (`type_id`),
  KEY `fk_iv_party` (`party_id`),
  KEY `fk_iv_warehouse` (`warehouse_id`),
  KEY `fk_iv_employee` (`employee_id`),
  CONSTRAINT `fk_iv_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_iv_party` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `fk_iv_type` FOREIGN KEY (`type_id`) REFERENCES `issue_voucher_types` (`id`),
  CONSTRAINT `fk_iv_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_vouchers`
--

LOCK TABLES `issue_vouchers` WRITE;
/*!40000 ALTER TABLE `issue_vouchers` DISABLE KEYS */;
/*!40000 ALTER TABLE `issue_vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_order_costs`
--

DROP TABLE IF EXISTS `job_order_costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_order_costs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_order_id` int NOT NULL,
  `cost_type` enum('raw_material','processing','transport','other') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `cost_per_unit` decimal(12,2) DEFAULT NULL,
  `cost_date` date DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  CONSTRAINT `job_order_costs_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_order_costs`
--

LOCK TABLES `job_order_costs` WRITE;
/*!40000 ALTER TABLE `job_order_costs` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_order_costs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_order_status_log`
--

DROP TABLE IF EXISTS `job_order_status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_order_status_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_order_id` int NOT NULL,
  `status` enum('planned','in_progress','completed','cancelled') NOT NULL,
  `changed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `changed_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  CONSTRAINT `job_order_status_log_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_order_status_log`
--

LOCK TABLES `job_order_status_log` WRITE;
/*!40000 ALTER TABLE `job_order_status_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_order_status_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_titles`
--

DROP TABLE IF EXISTS `job_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_titles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_titles`
--

LOCK TABLES `job_titles` WRITE;
/*!40000 ALTER TABLE `job_titles` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_titles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_entries`
--

DROP TABLE IF EXISTS `journal_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entry_date` date NOT NULL DEFAULT (curdate()),
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_type_id` int NOT NULL,
  `reference_id` int DEFAULT NULL,
  `entry_type_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_journal_reference` (`reference_type_id`,`reference_id`),
  KEY `idx_journal_reference` (`reference_type_id`,`reference_id`),
  KEY `fk_entry_type` (`entry_type_id`),
  CONSTRAINT `fk_entry_type` FOREIGN KEY (`entry_type_id`) REFERENCES `entry_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_journal_reference_type` FOREIGN KEY (`reference_type_id`) REFERENCES `reference_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
INSERT INTO `journal_entries` VALUES (24,'2025-12-07','اعتماد أمر شراء #PO-2025-000130',4,130,1,'2025-12-07 09:23:56','2025-12-07 09:23:56'),(25,'2025-12-07','اعتماد أمر شراء #PO-2025-000131',4,131,1,'2025-12-07 09:28:28','2025-12-07 09:28:28'),(26,'2025-12-31','تحصيل فاتورة مبيعات #INV-2025-000017',2,4,1,'2025-12-07 20:30:22','2025-12-07 20:30:22');
/*!40000 ALTER TABLE `journal_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_entry_lines`
--

DROP TABLE IF EXISTS `journal_entry_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entry_lines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `journal_entry_id` int NOT NULL,
  `account_id` int NOT NULL,
  `debit` decimal(15,2) DEFAULT '0.00',
  `credit` decimal(15,2) DEFAULT '0.00',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_line_entry` (`journal_entry_id`),
  KEY `fk_line_account` (`account_id`),
  CONSTRAINT `fk_line_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_line_entry` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_credit_nonneg` CHECK ((`credit` >= 0)),
  CONSTRAINT `chk_debit_nonneg` CHECK ((`debit` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_lines`
--

LOCK TABLES `journal_entry_lines` WRITE;
/*!40000 ALTER TABLE `journal_entry_lines` DISABLE KEYS */;
INSERT INTO `journal_entry_lines` VALUES (41,24,13,33000.00,0.00,'إضافة للمخزون','2025-12-07 09:23:56','2025-12-07 09:23:56'),(42,24,21,0.00,33000.00,'حساب المورد (أجل)','2025-12-07 09:23:56','2025-12-07 09:23:56'),(43,25,13,33000.00,0.00,'إضافة للمخزون','2025-12-07 09:28:28','2025-12-07 09:28:28'),(44,25,21,0.00,33000.00,'حساب المورد (أجل)','2025-12-07 09:28:28','2025-12-07 09:28:28'),(45,26,8,10.00,0.00,'دخول إلى الصندوق/البنك','2025-12-07 20:30:22','2025-12-07 20:30:22'),(46,26,21,0.00,10.00,'تخفيض مديونية العميل','2025-12-07 20:30:22','2025-12-07 20:30:22');
/*!40000 ALTER TABLE `journal_entry_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parties`
--

DROP TABLE IF EXISTS `parties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `party_type` enum('customer','supplier','both') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tax_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `opening_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `city_id` (`city_id`),
  KEY `account_id` (`account_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `parties_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `parties_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `parties_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `party_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
INSERT INTO `parties` VALUES (1,'هاجر وشروقه','supplier','','','','',4,21,0.00,'2025-08-20 12:44:24',2),(3,'ECC','supplier','','','','',3,21,0.00,'2025-08-26 09:39:55',6),(4,'عباس الضو','customer','0500','','','',1,21,0.00,'2025-09-02 14:26:46',2),(5,'Attractive pack','supplier','','','','',8,21,0.00,'2025-11-29 12:32:50',6);
/*!40000 ALTER TABLE `parties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `party_categories`
--

DROP TABLE IF EXISTS `party_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `party_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party_categories`
--

LOCK TABLES `party_categories` WRITE;
/*!40000 ALTER TABLE `party_categories` DISABLE KEYS */;
INSERT INTO `party_categories` VALUES (1,'صيدلي'),(2,'سلسله'),(4,'مخزن'),(5,'عياده'),(6,'مصنع'),(7,'زبال');
/*!40000 ALTER TABLE `party_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `processes`
--

DROP TABLE IF EXISTS `processes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `processes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `processes`
--

LOCK TABLES `processes` WRITE;
/*!40000 ALTER TABLE `processes` DISABLE KEYS */;
INSERT INTO `processes` VALUES (1,'تصنيع',''),(2,'طباعه','');
/*!40000 ALTER TABLE `processes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_costs`
--

DROP TABLE IF EXISTS `product_costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_costs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_costs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_costs`
--

LOCK TABLES `product_costs` WRITE;
/*!40000 ALTER TABLE `product_costs` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_costs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_prices`
--

DROP TABLE IF EXISTS `product_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_prices_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_prices`
--

LOCK TABLES `product_prices` WRITE;
/*!40000 ALTER TABLE `product_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_prices` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `prevent_price_overlap` BEFORE INSERT ON `product_prices` FOR EACH ROW BEGIN
  IF EXISTS (
    SELECT 1 FROM product_prices
    WHERE product_id = NEW.product_id
      AND (
        (NEW.start_date BETWEEN start_date AND IFNULL(end_date, '9999-12-31')) OR
        (NEW.end_date IS NOT NULL AND end_date IS NOT NULL AND NEW.end_date BETWEEN start_date AND end_date) OR
        (start_date BETWEEN NEW.start_date AND IFNULL(NEW.end_date, '9999-12-31'))
      )
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Overlapping price period for this product is not allowed.';
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cost_price` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `unit_id` (`unit_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (4,'Nurivina Argan Oil 100ml',330.00,2,'2025-08-12 14:25:50',0.00),(5,'Nurivina Argan Oil Hair Serum 100ml',430.00,2,'2025-08-12 14:26:24',0.00),(6,'Nurivina Omega Anti-Hair Loss Shampoo 220ml',250.00,2,'2025-08-12 14:27:01',0.00),(7,'Nurivina Argan oil Leave in Conditioner 220ml',270.00,2,'2025-08-12 14:27:35',0.00),(8,'Nurivina whitening Cream 50gm',240.00,2,'2025-08-12 14:29:09',0.00),(10,'Nurivana Anti-Hair loss Shampoo Bottle 220Ml',6.00,5,'2025-10-15 12:51:02',6.00),(11,'Nurivina Anti-Hair Loss Shampoo Sticker',2.00,6,'2025-10-15 12:52:12',2.00),(12,'Nurivina Anti-Hair Loss Shampoo Cap',3.00,2,'2025-10-15 12:52:57',3.00),(13,'Nurivina Anti-Hair Loss Spray 100ml',520.00,2,'2025-11-25 13:42:37',0.00);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_invoice_items`
--

DROP TABLE IF EXISTS `purchase_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_invoice_id` int NOT NULL,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` decimal(18,2) NOT NULL DEFAULT '0.00',
  `bonus_quantity` decimal(18,2) NOT NULL DEFAULT '0.00',
  `unit_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  `discount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total_price` decimal(18,2) GENERATED ALWAYS AS (((`quantity` * `unit_price`) - `discount`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pii_pi` (`purchase_invoice_id`),
  KEY `idx_pii_product` (`product_id`),
  KEY `idx_pii_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_pii_pi` FOREIGN KEY (`purchase_invoice_id`) REFERENCES `purchase_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pii_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pii_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_invoice_items_chk_1` CHECK ((`quantity` >= 0)),
  CONSTRAINT `purchase_invoice_items_chk_2` CHECK ((`unit_price` >= 0)),
  CONSTRAINT `purchase_invoice_items_chk_3` CHECK ((`discount` >= 0)),
  CONSTRAINT `purchase_invoice_items_chk_4` CHECK ((`total_price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoice_items`
--

LOCK TABLES `purchase_invoice_items` WRITE;
/*!40000 ALTER TABLE `purchase_invoice_items` DISABLE KEYS */;
INSERT INTO `purchase_invoice_items` (`id`, `purchase_invoice_id`, `product_id`, `warehouse_id`, `batch_number`, `expiry_date`, `quantity`, `bonus_quantity`, `unit_price`, `discount`, `created_at`, `updated_at`) VALUES (71,106,11,8,'',NULL,3000.00,0.00,2.00,0.00,'2025-12-07 09:28:28','2025-12-07 09:28:28'),(72,106,10,8,'',NULL,3000.00,0.00,6.00,0.00,'2025-12-07 09:28:28','2025-12-07 09:28:28'),(73,106,12,8,'',NULL,3000.00,0.00,3.00,0.00,'2025-12-07 09:28:28','2025-12-07 09:28:28');
/*!40000 ALTER TABLE `purchase_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_invoice_payments`
--

DROP TABLE IF EXISTS `purchase_invoice_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_invoice_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_invoice_id` int NOT NULL,
  `payment_date` date NOT NULL DEFAULT (curdate()),
  `payment_method` enum('cash','bank_transfer','cheque') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` int NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `reference_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payment_invoice` (`purchase_invoice_id`),
  KEY `fk_payment_account` (`account_id`),
  CONSTRAINT `fk_payment_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`purchase_invoice_id`) REFERENCES `purchase_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchase_invoice_payments_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoice_payments`
--

LOCK TABLES `purchase_invoice_payments` WRITE;
/*!40000 ALTER TABLE `purchase_invoice_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_invoice_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_invoices`
--

DROP TABLE IF EXISTS `purchase_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `purchase_order_id` int DEFAULT NULL,
  `invoice_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `payment_terms` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_type` enum('normal','opening') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `status` enum('unpaid','paid','partially_paid','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `subtotal` decimal(18,2) NOT NULL DEFAULT '0.00',
  `additional_discount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `vat_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_invoice_supplier_number` (`supplier_id`,`invoice_number`),
  KEY `fk_pi_po` (`purchase_order_id`),
  KEY `idx_pi_supplier` (`supplier_id`),
  KEY `idx_pi_invoice_date` (`invoice_date`),
  CONSTRAINT `fk_pi_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pi_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `parties` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_invoices_chk_1` CHECK ((`additional_discount` >= 0)),
  CONSTRAINT `purchase_invoices_chk_2` CHECK ((`vat_rate` >= 0)),
  CONSTRAINT `purchase_invoices_chk_3` CHECK ((`tax_rate` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoices`
--

LOCK TABLES `purchase_invoices` WRITE;
/*!40000 ALTER TABLE `purchase_invoices` DISABLE KEYS */;
INSERT INTO `purchase_invoices` VALUES (106,5,131,'PI-2025-000131','2025-12-07',NULL,NULL,'normal','unpaid',33000.00,0.00,0.00,0.00,0.00,0.00,33000.00,'2025-12-07 09:28:28','2025-12-07 09:28:28');
/*!40000 ALTER TABLE `purchase_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_items`
--

DROP TABLE IF EXISTS `purchase_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `warehouse_id` int DEFAULT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` decimal(18,2) NOT NULL DEFAULT '0.00',
  `bonus_quantity` decimal(18,2) NOT NULL DEFAULT '0.00',
  `unit_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  `discount` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة الخصم % من 0 إلى 100',
  `expected_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_poi_po` (`purchase_order_id`),
  KEY `idx_poi_product` (`product_id`),
  KEY `idx_poi_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_poi_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_poi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_poi_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_order_items_chk_1` CHECK ((`quantity` >= 0)),
  CONSTRAINT `purchase_order_items_chk_2` CHECK ((`unit_price` >= 0)),
  CONSTRAINT `purchase_order_items_chk_3` CHECK (((`discount` >= 0) and (`discount` <= 100))),
  CONSTRAINT `purchase_order_items_chk_4` CHECK ((`total_price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_items`
--

LOCK TABLES `purchase_order_items` WRITE;
/*!40000 ALTER TABLE `purchase_order_items` DISABLE KEYS */;
INSERT INTO `purchase_order_items` VALUES (52,131,11,8,'',NULL,3000.00,0.00,2.00,0.00,NULL,'2025-12-07 09:28:21','2025-12-07 09:28:28',0.00),(53,131,10,8,'',NULL,3000.00,0.00,6.00,0.00,NULL,'2025-12-07 09:28:21','2025-12-07 09:28:28',0.00),(54,131,12,8,'',NULL,3000.00,0.00,3.00,0.00,NULL,'2025-12-07 09:28:21','2025-12-07 09:28:28',0.00);
/*!40000 ALTER TABLE `purchase_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `order_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_date` date NOT NULL,
  `status` enum('draft','approved','closed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `total_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subtotal` decimal(18,2) NOT NULL DEFAULT '0.00',
  `additional_discount` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT 'خصم إضافي على مستوى الطلب',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة ضريبة القيمة المضافة المتوقعة',
  `vat_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'أي ضريبة أخرى',
  `tax_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_po_supplier_number` (`supplier_id`,`order_number`),
  UNIQUE KEY `uq_po_number` (`order_number`),
  KEY `idx_po_supplier` (`supplier_id`),
  KEY `idx_po_order_date` (`order_date`),
  CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `parties` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (131,5,'PO-2025-000131','2025-12-07','approved',33000.00,'2025-12-07 09:28:21','2025-12-07 09:28:28',33000.00,0.00,0.00,0.00,0.00,0.00);
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_payments`
--

DROP TABLE IF EXISTS `purchase_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `party_id` int DEFAULT NULL,
  `supplier_id` int NOT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `account_id` int NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `purchase_payments_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `purchase_payments_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_payments`
--

LOCK TABLES `purchase_payments` WRITE;
/*!40000 ALTER TABLE `purchase_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_purchase_payment` AFTER INSERT ON `purchase_payments` FOR EACH ROW BEGIN
    DECLARE entry_id INT;
    DECLARE payables_account INT;

    SELECT payables_account_id INTO payables_account
    FROM accounting_settings
    WHERE id = 1;

    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.payment_date, CONCAT('دفع مورد #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    -- دائن من حساب النقدية/البنك
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, NEW.account_id, 0, NEW.amount, 'دفع للمورد');

    -- مدين إلى حساب المورد (الدائنون)
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, payables_account, NEW.amount, 0, 'تخفيض مديونية المورد');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `purchase_return_items`
--

DROP TABLE IF EXISTS `purchase_return_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_return_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_return_id` int NOT NULL,
  `purchase_invoice_item_id` int DEFAULT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `purchase_return_id` (`purchase_return_id`),
  KEY `purchase_invoice_item_id` (`purchase_invoice_item_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `purchase_return_items_ibfk_1` FOREIGN KEY (`purchase_return_id`) REFERENCES `purchase_returns` (`id`),
  CONSTRAINT `purchase_return_items_ibfk_2` FOREIGN KEY (`purchase_invoice_item_id`) REFERENCES `purchase_invoice_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `purchase_return_items_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_return_items`
--

LOCK TABLES `purchase_return_items` WRITE;
/*!40000 ALTER TABLE `purchase_return_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_return_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_inventory_after_purchase_return` AFTER INSERT ON `purchase_return_items` FOR EACH ROW BEGIN
  DECLARE wh_id INT;

  -- جلب المخزن المرتبط بالفاتورة الأصلية
  SELECT warehouse_id INTO wh_id
  FROM purchase_invoices
  WHERE id = (
    SELECT purchase_invoice_id FROM purchase_returns WHERE id = NEW.purchase_return_id
  );

  -- خصم الكمية المرتجعة من المخزون
  UPDATE current_inventory
  SET quantity = quantity - NEW.quantity
  WHERE product_id = NEW.product_id AND warehouse_id = wh_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_log_after_purchase_return` AFTER INSERT ON `purchase_return_items` FOR EACH ROW BEGIN
  DECLARE wh_id INT;

  SELECT warehouse_id INTO wh_id
  FROM purchase_invoices
  WHERE id = (
    SELECT purchase_invoice_id FROM purchase_returns WHERE id = NEW.purchase_return_id
  );

  INSERT INTO inventory_logs (
    product_id,
    warehouse_id,
    action_type,
    quantity_change,
    reference_type,
    reference_id
  )
  VALUES (
    NEW.product_id,
    wh_id,
    'delete',
    -NEW.quantity,
    'purchase_return',
    NEW.purchase_return_id
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `purchase_returns`
--

DROP TABLE IF EXISTS `purchase_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_returns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `purchase_invoice_id` int DEFAULT NULL,
  `return_date` date NOT NULL DEFAULT (curdate()),
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `purchase_invoice_id` (`purchase_invoice_id`),
  KEY `fk_pr_supplier` (`supplier_id`),
  KEY `fk_pr_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_pr_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `parties` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pr_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_returns_ibfk_1` FOREIGN KEY (`purchase_invoice_id`) REFERENCES `purchase_invoices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_returns`
--

LOCK TABLES `purchase_returns` WRITE;
/*!40000 ALTER TABLE `purchase_returns` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_returns` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_purchase_return` AFTER INSERT ON `purchase_returns` FOR EACH ROW BEGIN
    DECLARE entry_id INT;
    DECLARE purchase_account INT;
    DECLARE payable_account INT;
    DECLARE tax_account INT;

    -- جلب إعدادات الحسابات
    SELECT
        purchases_expense_account_id,
        payables_account_id,
        tax_account_id
    INTO
        purchase_account,
        payable_account,
        tax_account
    FROM accounting_settings
    WHERE id = 1;

    -- رأس القيد
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع شراء #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    -- عكس قيد المشتريات: دائن للمشتريات
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, purchase_account, 0, NEW.total_amount, 'إلغاء جزئي للمشتريات');

    -- مدين للمورد: تخفيض المديونية
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, payable_account, NEW.total_amount, 0, 'تخفيض مديونية المورد');

    -- ضريبة مشتريات مستردة (لو فيه)
    IF NEW.tax_amount > 0 THEN
        INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
        VALUES (entry_id, tax_account, 0, NEW.tax_amount, 'عكس ضريبة المشتريات');
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_update_purchase_return` AFTER UPDATE ON `purchase_returns` FOR EACH ROW BEGIN
    DECLARE entry_id INT;
    DECLARE purchase_account INT;
    DECLARE payable_account INT;
    DECLARE tax_account INT;
    DECLARE total_amount DECIMAL(10,2) DEFAULT 0.00;
    DECLARE tax_amount DECIMAL(10,2) DEFAULT 0.00;

    -- حذف القيد القديم
    DELETE FROM journal_entries 
    WHERE description = CONCAT('مرتجع شراء #', OLD.id);

    -- حساب الإجمالي من عناصر المرتجع
    SELECT 
        IFNULL(SUM(quantity * price), 0),
        IFNULL(SUM(quantity * price * (tax_rate / 100)), 0)
    INTO
        total_amount,
        tax_amount
    FROM purchase_return_items
    WHERE return_id = NEW.id;

    -- جلب إعدادات الحسابات
    SELECT 
        purchases_expense_account_id,
        payables_account_id,
        tax_account_id
    INTO 
        purchase_account,
        payable_account,
        tax_account
    FROM accounting_settings
    WHERE id = 1;

    -- رأس القيد الجديد
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع شراء #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    -- عكس المشتريات
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, purchase_account, 0, total_amount, 'إلغاء جزئي للمشتريات');

    -- تخفيض مديونية المورد
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, payable_account, total_amount + tax_amount, 0, 'تخفيض مديونية المورد');

    -- عكس الضريبة
    IF tax_amount > 0 THEN
        INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
        VALUES (entry_id, tax_account, 0, tax_amount, 'عكس ضريبة المشتريات');
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_delete_purchase_return` AFTER DELETE ON `purchase_returns` FOR EACH ROW BEGIN
    -- حذف القيد المرتبط
    DELETE FROM journal_entries 
    WHERE description = CONCAT('مرتجع شراء #', OLD.id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `reference_types`
--

DROP TABLE IF EXISTS `reference_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reference_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_types`
--

LOCK TABLES `reference_types` WRITE;
/*!40000 ALTER TABLE `reference_types` DISABLE KEYS */;
INSERT INTO `reference_types` VALUES (1,'purchase_invoice','فاتورة مشتريات',NULL,'2025-09-16 09:59:53','2025-09-16 09:59:53'),(2,'sales_invoice','فاتورة مبيعات',NULL,'2025-12-04 03:57:22','2025-12-04 03:57:22'),(3,'manual_entry','قيد يدوي','قيد يومية يدوي','2025-12-04 20:30:33','2025-12-04 20:30:33'),(4,'purchase_order','أمر شراء','قيود أوامر الشراء','2025-12-05 12:42:04','2025-12-05 12:42:04');
/*!40000 ALTER TABLE `reference_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoice_items`
--

DROP TABLE IF EXISTS `sales_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_percent` decimal(5,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `warehouse_id` int DEFAULT NULL,
  `bonus` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sales_invoice_id` (`sales_invoice_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_si_items_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_si_items_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_invoice_items_ibfk_1` FOREIGN KEY (`sales_invoice_id`) REFERENCES `sales_invoices` (`id`),
  CONSTRAINT `sales_invoice_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
INSERT INTO `sales_invoice_items` VALUES (8,17,11,10,2.00,0.00,0.00,0.00,16,0),(9,18,11,30,2.00,0.00,0.00,0.00,16,0);
/*!40000 ALTER TABLE `sales_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoice_payments`
--

DROP TABLE IF EXISTS `sales_invoice_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_invoice_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_id` int NOT NULL,
  `payment_date` date NOT NULL DEFAULT (curdate()),
  `payment_method` enum('cash','bank_transfer','cheque') COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` int NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sales_payment_invoice` (`sales_invoice_id`),
  KEY `fk_sales_payment_account` (`account_id`),
  CONSTRAINT `fk_sales_payment_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_sales_payment_invoice` FOREIGN KEY (`sales_invoice_id`) REFERENCES `sales_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sales_invoice_payments_chk_amount` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_payments`
--

LOCK TABLES `sales_invoice_payments` WRITE;
/*!40000 ALTER TABLE `sales_invoice_payments` DISABLE KEYS */;
INSERT INTO `sales_invoice_payments` VALUES (4,17,'2025-12-31','cash',8,10.00,NULL,'','2025-12-07 20:30:22','2025-12-07 20:30:22');
/*!40000 ALTER TABLE `sales_invoice_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoices`
--

DROP TABLE IF EXISTS `sales_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_type` enum('normal','opening') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `status` enum('unpaid','paid','partial','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `sales_order_id` int DEFAULT NULL,
  `party_id` int NOT NULL,
  `invoice_date` date NOT NULL DEFAULT (curdate()),
  `due_date` date DEFAULT NULL,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `employee_id` int DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `subtotal` decimal(18,2) NOT NULL DEFAULT '0.00',
  `additional_discount` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT 'خصم إضافي على مستوى الفاتورة',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة ضريبة القيمة المضافة',
  `vat_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'أي ضريبة أخرى',
  `tax_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `sales_order_id` (`sales_order_id`),
  KEY `party_id` (`party_id`),
  KEY `fk_employee_id` (`employee_id`),
  KEY `fk_sales_invoices_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_sales_invoices_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_invoices_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`),
  CONSTRAINT `sales_invoices_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
INSERT INTO `sales_invoices` VALUES (16,'SI-2025-000001','opening','unpaid',NULL,4,'2025-12-07',NULL,0.00,'2025-12-07 18:53:44',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1000.00),(17,'INV-2025-000017','normal','partial',17,4,'2025-12-07',NULL,0.00,'2025-12-07 19:02:26',NULL,16,20.00,0.00,0.00,0.00,0.00,0.00,20.00),(18,'INV-2025-000018','normal','unpaid',18,4,'2025-12-07',NULL,0.00,'2025-12-07 20:33:05',NULL,16,60.00,0.00,0.00,0.00,0.00,0.00,60.00);
/*!40000 ALTER TABLE `sales_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_order_items`
--

DROP TABLE IF EXISTS `sales_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_percent` decimal(5,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `bonus` int NOT NULL DEFAULT '0',
  `warehouse_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_order_id` (`sales_order_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_so_items_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_so_items_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_order_items_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`),
  CONSTRAINT `sales_order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_order_items`
--

LOCK TABLES `sales_order_items` WRITE;
/*!40000 ALTER TABLE `sales_order_items` DISABLE KEYS */;
INSERT INTO `sales_order_items` VALUES (16,17,11,10,2.00,0.00,0.00,0.00,0,16),(17,18,11,30,2.00,0.00,0.00,0.00,0,16);
/*!40000 ALTER TABLE `sales_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_orders`
--

DROP TABLE IF EXISTS `sales_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `party_id` int NOT NULL,
  `status` enum('pending','approved','partial','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `warehouse_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `order_date` date NOT NULL DEFAULT (curdate()),
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `subtotal` decimal(18,2) NOT NULL DEFAULT '0.00',
  `additional_discount` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT 'خصم إضافي على مستوى الطلب',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة ضريبة القيمة المضافة المتوقعة',
  `vat_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'أي ضريبة أخرى',
  `tax_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  KEY `fk_sales_orders_warehouse` (`warehouse_id`),
  KEY `fk_sales_orders_employee` (`employee_id`),
  CONSTRAINT `fk_sales_orders_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_sales_orders_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_orders_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_orders`
--

LOCK TABLES `sales_orders` WRITE;
/*!40000 ALTER TABLE `sales_orders` DISABLE KEYS */;
INSERT INTO `sales_orders` VALUES (17,4,'approved',16,NULL,'2025-12-07','','2025-12-07 19:01:43',20.00,0.00,0.00,0.00,0.00,0.00,20.00),(18,4,'approved',16,NULL,'2025-12-07','','2025-12-07 20:32:31',60.00,0.00,0.00,0.00,0.00,0.00,60.00);
/*!40000 ALTER TABLE `sales_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_payments`
--

DROP TABLE IF EXISTS `sales_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_id` int DEFAULT NULL,
  `party_id` int NOT NULL,
  `account_id` int NOT NULL,
  `payment_date` date NOT NULL DEFAULT (curdate()),
  `amount` decimal(10,2) NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sales_invoice_id` (`sales_invoice_id`),
  KEY `party_id` (`party_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `sales_payments_ibfk_1` FOREIGN KEY (`sales_invoice_id`) REFERENCES `sales_invoices` (`id`),
  CONSTRAINT `sales_payments_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `sales_payments_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_payments`
--

LOCK TABLES `sales_payments` WRITE;
/*!40000 ALTER TABLE `sales_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_return_items`
--

DROP TABLE IF EXISTS `sales_return_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_return_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_return_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_return_id` (`sales_return_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_return_items_ibfk_1` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`),
  CONSTRAINT `sales_return_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_return_items`
--

LOCK TABLES `sales_return_items` WRITE;
/*!40000 ALTER TABLE `sales_return_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_return_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_update_inventory_on_sales_return` AFTER INSERT ON `sales_return_items` FOR EACH ROW BEGIN
  DECLARE wh_id INT DEFAULT 1;

  INSERT INTO current_inventory (product_id, warehouse_id, quantity)
  VALUES (NEW.product_id, wh_id, NEW.quantity)
  ON DUPLICATE KEY UPDATE quantity = quantity + NEW.quantity;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_log_on_sales_return` AFTER INSERT ON `sales_return_items` FOR EACH ROW BEGIN
  DECLARE wh_id INT DEFAULT 1;

  INSERT INTO inventory_logs (
    product_id,
    warehouse_id,
    action_type,
    quantity_change,
    reference_type,
    reference_id
  )
  VALUES (
    NEW.product_id,
    wh_id,
    'return',
    NEW.quantity,
    'sales_return',
    NEW.sales_return_id
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sales_returns`
--

DROP TABLE IF EXISTS `sales_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_returns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_id` int NOT NULL,
  `return_date` date NOT NULL DEFAULT (curdate()),
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sales_invoice_id` (`sales_invoice_id`),
  CONSTRAINT `sales_returns_ibfk_1` FOREIGN KEY (`sales_invoice_id`) REFERENCES `sales_invoices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_returns`
--

LOCK TABLES `sales_returns` WRITE;
/*!40000 ALTER TABLE `sales_returns` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_returns` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_insert_sales_return` AFTER INSERT ON `sales_returns` FOR EACH ROW BEGIN
    DECLARE entry_id INT;
    DECLARE sales_account INT;
    DECLARE receivable_account INT;
    DECLARE tax_account INT;
    DECLARE total_amount DECIMAL(10,2) DEFAULT 0.00;
    DECLARE tax_amount DECIMAL(10,2) DEFAULT 0.00;

    -- حساب الإجمالي من عناصر المرتجع
    SELECT 
        IFNULL(SUM(quantity * price), 0),
        IFNULL(SUM(quantity * price * (tax_rate / 100)), 0)
    INTO
        total_amount,
        tax_amount
    FROM sales_return_items
    WHERE return_id = NEW.id;

    -- جلب إعدادات الحسابات
    SELECT 
        sales_revenue_account_id,
        receivables_account_id,
        tax_account_id
    INTO 
        sales_account,
        receivable_account,
        tax_account
    FROM accounting_settings
    WHERE id = 1;

    -- رأس القيد
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع بيع #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    -- دائن للعميل
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, receivable_account, 0, total_amount + tax_amount, 'إلغاء مديونية العميل');

    -- مدين: إلغاء الإيراد
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, sales_account, total_amount, 0, 'إلغاء إيرادات المبيعات');

    -- مدين: عكس ضريبة مبيعات
    IF tax_amount > 0 THEN
        INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
        VALUES (entry_id, tax_account, tax_amount, 0, 'عكس ضريبة المبيعات');
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_update_sales_return` AFTER UPDATE ON `sales_returns` FOR EACH ROW BEGIN
    -- حذف القيد القديم
    DELETE FROM journal_entries 
    WHERE description = CONCAT('مرتجع بيع #', OLD.id);

    -- تنفيذ نفس خطوات INSERT
    CALL trg_after_insert_sales_return(NEW);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_delete_sales_return` AFTER DELETE ON `sales_returns` FOR EACH ROW BEGIN
    DELETE FROM journal_entries 
    WHERE description = CONCAT('مرتجع بيع #', OLD.id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `supplier_cheques`
--

DROP TABLE IF EXISTS `supplier_cheques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_cheques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_payment_id` int NOT NULL,
  `cheque_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `status` enum('issued','cleared','bounced','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'issued',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cheque_payment` (`purchase_payment_id`),
  CONSTRAINT `fk_cheque_payment` FOREIGN KEY (`purchase_payment_id`) REFERENCES `purchase_invoice_payments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_cheques`
--

LOCK TABLES `supplier_cheques` WRITE;
/*!40000 ALTER TABLE `supplier_cheques` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_cheques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (2,'قطعه'),(5,'عبوه'),(6,'قط');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse_transfer_items`
--

DROP TABLE IF EXISTS `warehouse_transfer_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_transfer_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transfer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `batch_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transfer_item_transfer` (`transfer_id`),
  KEY `fk_transfer_item_product` (`product_id`),
  CONSTRAINT `fk_transfer_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_transfer_item_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `warehouse_transfers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfer_items`
--

LOCK TABLES `warehouse_transfer_items` WRITE;
/*!40000 ALTER TABLE `warehouse_transfer_items` DISABLE KEYS */;
INSERT INTO `warehouse_transfer_items` VALUES (7,8,10,3000,6.00,NULL,NULL),(8,8,11,3000,2.00,NULL,NULL),(9,8,12,3000,3.00,NULL,NULL);
/*!40000 ALTER TABLE `warehouse_transfer_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse_transfers`
--

DROP TABLE IF EXISTS `warehouse_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_transfers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_warehouse_id` int NOT NULL,
  `to_warehouse_id` int NOT NULL,
  `transfer_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_transfer_from` (`from_warehouse_id`),
  KEY `fk_transfer_to` (`to_warehouse_id`),
  CONSTRAINT `fk_transfer_from` FOREIGN KEY (`from_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_transfer_to` FOREIGN KEY (`to_warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfers`
--

LOCK TABLES `warehouse_transfers` WRITE;
/*!40000 ALTER TABLE `warehouse_transfers` DISABLE KEYS */;
INSERT INTO `warehouse_transfers` VALUES (8,8,16,'2025-12-07 09:29:00','');
/*!40000 ALTER TABLE `warehouse_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `city_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `warehouses_ibfk_1` (`city_id`),
  CONSTRAINT `warehouses_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` VALUES (1,'مخزن دمياط','دمياط',7,'2025-08-20 09:17:31'),(2,'المخزن الرئيسي','المنصوره',3,'2025-08-20 09:24:44'),(3,'مخزن الاسكندريه','الاسكندرية',4,'2025-08-20 09:27:00'),(8,'مخزن مستزمات انتاج','المنصوره',1,'2025-11-29 12:34:39'),(16,'مخزن تحت التشغيل لدى الغير','',4,'2025-12-04 22:13:46');
/*!40000 ALTER TABLE `warehouses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'nurivina'
--

--
-- Dumping routines for database 'nurivina'
--
/*!50003 DROP FUNCTION IF EXISTS `has_cycle` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `has_cycle`(new_id INT, new_parent_id INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
    DECLARE cycle_found BOOLEAN DEFAULT FALSE;

    -- لو parent_id = NULL مفيش مشكلة
    IF new_parent_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- ممنوع يكون الحساب parent لنفسه
    IF new_id = new_parent_id THEN
        RETURN TRUE;
    END IF;

    -- CTE recursive يتبع الشجرة لفوق
    WITH RECURSIVE ancestors AS (
        SELECT id, parent_account_id
        FROM accounts
        WHERE id = new_parent_id

        UNION ALL

        SELECT a.id, a.parent_account_id
        FROM accounts a
        INNER JOIN ancestors an ON a.id = an.parent_account_id
    )
    SELECT TRUE INTO cycle_found
    FROM ancestors
    WHERE id = new_id
    LIMIT 1;

    RETURN cycle_found;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-09  1:26:02
