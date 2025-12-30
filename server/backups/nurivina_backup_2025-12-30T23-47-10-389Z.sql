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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounting_settings`
--

LOCK TABLES `accounting_settings` WRITE;
/*!40000 ALTER TABLE `accounting_settings` DISABLE KEYS */;
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
  `normal_balance` enum('debit','credit') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'debit',
  PRIMARY KEY (`id`),
  KEY `parent_account_id` (`parent_account_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`parent_account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'اصول','asset',NULL,0.00,'','debit'),(2,'خصوم','liability',NULL,0.00,'','credit'),(3,'مصروفات مباشره','expense',NULL,0.00,'','debit'),(4,'مصروفات غير مباشره','expense',NULL,0.00,'','debit'),(5,'ايرادات','revenue',NULL,0.00,'','credit'),(6,'مردودات المبيعات','revenue',NULL,0.00,'','credit'),(7,'صافي الدخل','equity',NULL,0.00,'','credit'),(8,'اصول ثابته','asset',1,0.00,'','debit'),(9,'اصول متداوله','asset',1,0.00,'','debit'),(10,'رأس المال','liability',2,0.00,'','credit'),(11,'قروض','liability',2,0.00,'','credit'),(12,'خصوم متادوله','liability',2,0.00,'','credit'),(13,'صافي الربح','liability',2,0.00,'','credit'),(14,'ارباح مرحلة','liability',2,0.00,'','credit'),(15,'تكلفة البضاعة المباعة','expense',3,0.00,'','debit'),(16,'مصروفات نقل بضاعة','expense',3,0.00,'','debit'),(17,'مرتبات المبيعات','expense',3,0.00,'','debit'),(18,'عمولات المبيعات','expense',3,0.00,'','debit'),(19,'خصم خاص','expense',3,0.00,'','debit'),(20,'دمغه','expense',3,0.00,'','debit'),(21,'مصروفات خطابات ضمان','expense',3,0.00,'','debit'),(22,'مصروفات تسويقيه','expense',3,0.00,'','debit'),(23,'جرد تالف تصنيع','expense',3,0.00,'','debit'),(24,'تكاليف تشغيل مباشره','expense',3,0.00,'','debit'),(25,'مصروفات عموميه','expense',4,0.00,'','debit'),(26,'اهلاكات','expense',4,0.00,'','debit'),(27,'مرتبات','expense',4,0.00,'','debit'),(28,'مبيعات','revenue',5,0.00,'','credit'),(29,'خدمات','revenue',5,0.00,'','credit'),(30,'خصم مكتسب','revenue',5,0.00,'','credit'),(31,'آلات','asset',8,0.00,'','debit'),(32,'آراضي','asset',8,0.00,'','debit'),(33,'مباني','asset',8,0.00,'','debit'),(34,'أدوات مكتبية','asset',8,0.00,'','debit'),(35,'سيارات','asset',8,0.00,'','debit'),(36,'أثاث','asset',8,0.00,'','debit'),(37,'ملفات','asset',8,0.00,'','debit'),(38,'برامج محاسبيه','asset',8,0.00,'','debit'),(39,'جهاز كمبيوتر','asset',8,0.00,'','debit'),(40,'صندوق وبنوك','asset',9,0.00,'','debit'),(41,'خزينه','asset',40,0.00,'','debit'),(42,'خزينة شركة الشحن','asset',40,0.00,'','debit'),(43,'البنك الأهلي الخاص','asset',40,0.00,'','debit'),(44,'البنك شركه','asset',40,0.00,'','debit'),(45,'فودافون كاش','asset',40,0.00,'','debit'),(46,'كارد فيزا','asset',40,0.00,'','debit'),(47,'العملاء','asset',9,0.00,'','debit'),(48,'اوراق قبض','asset',9,0.00,'','debit'),(49,'المخزون','asset',9,0.00,'','debit'),(50,'جاري الشركاء','asset',9,0.00,'','debit'),(51,'جاري هاني صلاح','asset',50,0.00,'','debit'),(52,'صافي الخسارة','asset',9,0.00,'','debit'),(53,'خسارة مرحلة','asset',9,0.00,'','debit'),(54,'تأمينات لدى الغير','asset',9,0.00,'','debit'),(55,'سلف العاملين','asset',9,0.00,'','debit'),(56,'خصم ضرائب','asset',9,0.00,'','debit'),(57,'خصم ضرائب مبيعات','asset',9,0.00,'','debit'),(58,'غطاء خطابات ضمان','asset',9,0.00,'','debit'),(59,'اعتمادات مستندية','asset',9,0.00,'','debit'),(60,'مدينون متنوعون','asset',9,0.00,'','debit'),(61,'عائلة ','asset',60,0.00,'','debit'),(62,'الموردين','liability',12,0.00,'','credit'),(63,'مخصصات','liability',12,0.00,'','credit'),(64,'اوراق دفع','liability',12,0.00,'','credit'),(65,'ضريبة القيمه المضافه','liability',12,0.00,'','credit'),(66,'مصلحة الضرائب','liability',12,0.00,'','credit'),(67,'مقاولين من الباطل','liability',12,0.00,'','credit'),(68,'خصم و اضافه ضرائب مشتريات','liability',12,0.00,'','credit'),(69,'دائنون متنوعون ','liability',12,0.00,'','credit'),(70,'دائن فيزا كارد','liability',69,0.00,'','credit'),(71,'ديون شخصيه','liability',12,0.00,'','credit'),(72,'الأولاد','liability',71,0.00,'','credit'),(73,'نيفين','liability',71,0.00,'','credit'),(74,'إيهاب','liability',71,0.00,'','credit'),(75,'مرتبات مستحقه','liability',12,0.00,'','credit'),(76,'نسبة تحصيل','expense',22,0.00,'','debit'),(77,'هدايا تسويقية','expense',22,0.00,'','debit'),(78,'تعويضات عروض تسويقيه','expense',22,0.00,'','debit'),(79,'مصاريف تصميمات','expense',22,0.00,'','debit'),(80,'عينات مجانية للدكاترة','expense',22,0.00,'','debit'),(81,'عينات للتصوير والتصميمات','expense',22,0.00,'','debit'),(82,'عينات للbloggers','expense',22,0.00,'','debit'),(83,'مشاركات مؤتمرات','expense',22,0.00,'','debit'),(84,'مشاركه فى معرض الجامعات','expense',22,0.00,'','debit'),(85,'مطبوعات تسويقيه','expense',22,0.00,'','debit'),(86,'sponsor health day','expense',22,0.00,'','debit'),(87,'social media ','expense',22,0.00,'','debit'),(88,'اجتماع للدكاتره','expense',22,0.00,'','debit'),(89,'مصروفات بلوجر blogger','expense',22,0.00,'','debit'),(90,'ايجارات','expense',25,0.00,'','debit'),(91,'ايجار مكتب','expense',90,0.00,'','debit'),(92,'ايجار سياره','expense',90,0.00,'','debit'),(93,'ايجار مخزن','expense',90,0.00,'','debit'),(94,'كهرباء','expense',25,0.00,'','debit'),(95,'بوفيه','expense',25,0.00,'','debit'),(96,'ضيافه','expense',25,0.00,'','debit'),(97,'مصاريف سيارة المدير','expense',25,0.00,'','debit'),(98,'زكاة','expense',25,0.00,'','debit'),(99,'مصاريف مكتب الإداره','expense',25,0.00,'','debit'),(100,'هدايا','expense',25,0.00,'','debit'),(101,'عمولات بنكيه','expense',25,0.00,'','debit'),(102,'مصاريف اجتماعات','expense',25,0.00,'','debit'),(103,'بدل سفر','expense',25,0.00,'','debit'),(104,'كروت بيزنيس b.c','expense',25,0.00,'','debit'),(105,'مصاريف وزارة الصحة','expense',25,0.00,'','debit'),(106,'اتعاب مكتب المحاسب القانونى','expense',25,0.00,'','debit'),(107,'فندق ','expense',25,0.00,'','debit'),(108,'خصم مسموح به','revenue',28,0.00,'','debit'),(109,'تحت التشغيل','asset',49,0.00,'','debit'),(110,'مخزون تام الصنع','asset',49,0.00,'','debit'),(111,'مخزون أولي','asset',49,0.00,NULL,'debit');
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
-- Table structure for table `batch_inventory`
--

DROP TABLE IF EXISTS `batch_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_inventory` (
  `batch_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`batch_id`,`warehouse_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `batch_inventory_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`),
  CONSTRAINT `batch_inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `batch_inventory_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_inventory`
--

LOCK TABLES `batch_inventory` WRITE;
/*!40000 ALTER TABLE `batch_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_inventory` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_of_materials`
--

LOCK TABLES `bill_of_materials` WRITE;
/*!40000 ALTER TABLE `bill_of_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `bill_of_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cheques`
--

DROP TABLE IF EXISTS `cheques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cheques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cheque_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cheque_type` enum('incoming','outgoing') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` int NOT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `status` enum('issued','deposited','cleared','bounced','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'issued',
  `related_payment_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `sales_payment_id` int DEFAULT NULL,
  `purchase_payment_id` int DEFAULT NULL,
  `service_payment_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cheque_payment` (`related_payment_id`),
  KEY `cheques_sales_payment_id_foreign_idx` (`sales_payment_id`),
  KEY `cheques_purchase_payment_id_foreign_idx` (`purchase_payment_id`),
  KEY `account_id` (`account_id`),
  KEY `fk_cheques_service_payment` (`service_payment_id`),
  CONSTRAINT `cheques_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `cheques_purchase_payment_id_foreign_idx` FOREIGN KEY (`purchase_payment_id`) REFERENCES `purchase_invoice_payments` (`id`),
  CONSTRAINT `cheques_sales_payment_id_foreign_idx` FOREIGN KEY (`sales_payment_id`) REFERENCES `sales_invoice_payments` (`id`),
  CONSTRAINT `fk_cheque_payment` FOREIGN KEY (`related_payment_id`) REFERENCES `purchase_invoice_payments` (`id`),
  CONSTRAINT `fk_cheques_service_payment` FOREIGN KEY (`service_payment_id`) REFERENCES `service_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheques`
--

LOCK TABLES `cheques` WRITE;
/*!40000 ALTER TABLE `cheques` DISABLE KEYS */;
/*!40000 ALTER TABLE `cheques` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'برج العرب',3),(2,'مطوبس',11),(3,'كفر الشيخ',11),(4,'المنصوره',7),(5,'ميت غمر',7),(6,'السنبلاوين',7),(7,'طلخا',7),(8,'منيه النصر',7),(9,'المنزله',7),(10,'شربين',7),(11,'دكرنس',7),(12,'بلقاس',7),(13,'طنطا',9),(14,'كفر الزيات',9),(15,'المحله الكبرى',9),(16,'بسيون',9),(17,'قطور',9),(18,'زفتى',9),(19,'سمنود',9),(20,'القاهره',1),(21,'مدينه نصر',1),(22,'مصر الجديده',1),(23,'المعادى',1),(24,'حلوان',1),(25,'شبرا',1),(26,'الزيتون',1),(27,'المطريه',1),(28,'المرج',1),(29,'عين شمس',1),(30,'السلام',1),(31,'الجيزه',2),(32,'6 اكتوبر',2),(33,'الشيخ زايد',2),(34,'الهرم',2),(35,'العمرانيه',2),(36,'الدقى',2),(37,'الاسكندريه',3),(38,'بنها',4),(39,'شبرا الخيمه',4),(40,'دمنهور',5),(41,'كفر الدوار',5),(42,'رشيد',5),(43,'ادكو',5),(44,'مرسى مطروح',6),(45,'العلمين',6),(46,'الضبعه',6),(47,'سيوه',6),(48,'الزقازيق',8),(49,'العاشر من رمضان',8),(50,'منيا القمح',8),(51,'بلبيس',8),(52,'اجا',7),(53,'جمصه',7),(54,'دسوق',11),(55,'دمياط',12),(56,'دمياط الجديده',12),(57,'راس البر',12),(58,'كفر سعد',12),(59,'الزرقا',12),(60,'فارسكور',12),(61,'كفر البطيخ',12);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `company_name_en` varchar(255) DEFAULT NULL,
  `commercial_register` varchar(50) DEFAULT NULL,
  `tax_number` varchar(50) DEFAULT NULL,
  `vat_number` varchar(50) DEFAULT NULL,
  `company_type` enum('تجارية','صناعية','خدمية','حكومية') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `address` text,
  `city_id` int NOT NULL,
  `established_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_companies_city` (`city_id`),
  CONSTRAINT `fk_companies_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'مصر');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_inventory`
--

LOCK TABLES `current_inventory` WRITE;
/*!40000 ALTER TABLE `current_inventory` DISABLE KEYS */;
INSERT INTO `current_inventory` VALUES (4,10,4,12000,'2025-12-30 00:14:25'),(5,11,4,12000,'2025-12-30 00:14:25'),(6,12,4,12000,'2025-12-30 00:14:25'),(7,2,1,3000,'2025-12-30 18:23:29'),(8,1,1,2000,'2025-12-30 20:00:35');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `city_id` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_doctors_city` (`city_id`),
  CONSTRAINT `fk_doctors_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entry_types`
--

LOCK TABLES `entry_types` WRITE;
/*!40000 ALTER TABLE `entry_types` DISABLE KEYS */;
INSERT INTO `entry_types` VALUES (1,'قيد افتتاحي'),(2,'قيد فاتورة مبيعات'),(3,'قيد تحصيل مبيعات'),(4,'قيد مرتجع مبيعات'),(5,'قيد فاتورة مشتريات'),(6,'قيد سداد مشتريات'),(7,'قيد مرتجع مشتريات'),(8,'قيد مصروف'),(9,'قيد إيراد'),(10,'قيد تسوية'),(11,'قيد إهلاك'),(12,'قيد تحويل مخزني'),(13,'قيد إنتاج / تصنيع'),(14,'قيد تعديل يدوي');
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
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_job_order_items`
--

DROP TABLE IF EXISTS `external_job_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_job_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `quantity_sent` decimal(12,3) NOT NULL,
  `unit_cost` decimal(12,2) NOT NULL,
  `total_cost` decimal(14,2) NOT NULL,
  `batch_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  KEY `fk_batch_id` (`batch_id`),
  CONSTRAINT `external_job_order_items_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_job_order_items`
--

LOCK TABLES `external_job_order_items` WRITE;
/*!40000 ALTER TABLE `external_job_order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_job_order_items` ENABLE KEYS */;
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
  `cost_estimate` decimal(12,2) DEFAULT '0.00',
  `cost_actual` decimal(12,2) DEFAULT '0.00',
  `reference_no` varchar(100) DEFAULT NULL,
  `waste_quantity` decimal(12,3) DEFAULT '0.000',
  `transport_cost` decimal(12,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  KEY `product_id` (`product_id`),
  KEY `process_id` (`process_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `external_job_orders_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `external_job_orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `external_job_orders_ibfk_4` FOREIGN KEY (`process_id`) REFERENCES `processes` (`id`),
  CONSTRAINT `external_job_orders_ibfk_5` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `governates`
--

LOCK TABLES `governates` WRITE;
/*!40000 ALTER TABLE `governates` DISABLE KEYS */;
INSERT INTO `governates` VALUES (1,'القاهره',1),(2,'الجيزه',1),(3,'الاسكندريه',1),(4,'القليوبيه',1),(5,'البحيره',1),(6,'مطروح',1),(7,'الدقهليه',1),(8,'الشرقيه',1),(9,'الغربيه',1),(10,'المنوفيه',1),(11,'كفر الشيخ',1),(12,'دمياط',1),(13,'بورسعيد',1),(14,'الاسماعيليه',1),(15,'السويس',1),(16,'شمال سيناء',1),(17,'جنوب سيناء',1),(18,'بنى سويف',1),(19,'الفيوم',1),(20,'المنيا',1),(21,'اسيوط',1),(22,'سوهاج',1),(23,'قنا',1),(24,'الاقصر',1),(25,'اسوان',1),(26,'البحر الاحمر',1),(27,'الوادى الجديد',1);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction_batches`
--

LOCK TABLES `inventory_transaction_batches` WRITE;
/*!40000 ALTER TABLE `inventory_transaction_batches` DISABLE KEYS */;
INSERT INTO `inventory_transaction_batches` VALUES (4,4,NULL,3000,3.00),(5,5,NULL,3000,6.00),(6,6,NULL,3000,2.00),(7,7,NULL,3000,3.00),(8,8,NULL,3000,6.00),(9,9,NULL,3000,2.00),(10,10,NULL,3000,3.00),(11,11,NULL,3000,6.00),(12,12,NULL,3000,2.00),(13,13,NULL,3000,3.00),(14,14,NULL,3000,6.00),(15,15,NULL,3000,2.00),(16,16,NULL,3000,98.00),(17,17,NULL,2000,55.00);
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
  `source_type` enum('purchase','manufacturing','transfer','adjustment','sales_invoice','sales_return','purchase_return','external_job_order') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'adjustment',
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (4,10,4,'in','2025-12-29 00:00:00','Purchase Invoice #PI-2025-000001','purchase',NULL),(5,11,4,'in','2025-12-29 00:00:00','Purchase Invoice #PI-2025-000001','purchase',NULL),(6,12,4,'in','2025-12-29 00:00:00','Purchase Invoice #PI-2025-000001','purchase',NULL),(7,10,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000002','purchase',NULL),(8,11,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000002','purchase',NULL),(9,12,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000002','purchase',NULL),(10,10,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000003','purchase',NULL),(11,11,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000003','purchase',NULL),(12,12,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000003','purchase',NULL),(13,10,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000004','purchase',NULL),(14,11,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000004','purchase',NULL),(15,12,4,'in','2025-12-30 00:00:00','Purchase Invoice #PI-2025-000004','purchase',NULL),(16,2,1,'in','2025-12-30 00:00:00','','adjustment',NULL),(17,1,1,'in','2025-12-30 00:00:00','','adjustment',NULL);
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
  `batch_number` varchar(100) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ivi_voucher` (`voucher_id`),
  KEY `fk_ivi_product` (`product_id`),
  CONSTRAINT `fk_ivi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_ivi_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `issue_vouchers` (`id`) ON DELETE CASCADE
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_type_accounts`
--

LOCK TABLES `issue_voucher_type_accounts` WRITE;
/*!40000 ALTER TABLE `issue_voucher_type_accounts` DISABLE KEYS */;
INSERT INTO `issue_voucher_type_accounts` VALUES (1,1,80);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_types`
--

LOCK TABLES `issue_voucher_types` WRITE;
/*!40000 ALTER TABLE `issue_voucher_types` DISABLE KEYS */;
INSERT INTO `issue_voucher_types` VALUES (1,'','عينات','','2025-12-30 23:44:19');
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
  `account_id` int NOT NULL,
  `doctor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_no` (`voucher_no`),
  KEY `fk_iv_type` (`type_id`),
  KEY `fk_iv_party` (`party_id`),
  KEY `fk_iv_warehouse` (`warehouse_id`),
  KEY `fk_iv_employee` (`employee_id`),
  KEY `fk_issueVoucher_doctor` (`doctor_id`),
  CONSTRAINT `fk_issueVoucher_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
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
  `cost_type` enum('material','labor','transport','other') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  CONSTRAINT `job_order_costs_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `entry_type_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_journal_reference` (`reference_type_id`,`reference_id`),
  KEY `idx_journal_reference` (`reference_type_id`,`reference_id`),
  KEY `fk_journal_entries_entry_type` (`entry_type_id`),
  CONSTRAINT `fk_journal_entries_entry_type` FOREIGN KEY (`entry_type_id`) REFERENCES `entry_types` (`id`),
  CONSTRAINT `fk_journal_reference_type` FOREIGN KEY (`reference_type_id`) REFERENCES `reference_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
INSERT INTO `journal_entries` VALUES (2,'2025-12-29','Purchase Invoice #PI-2025-000001',1,2,'2025-12-29 23:54:28','2025-12-29 23:54:28',5),(3,'2025-12-30','Purchase Invoice #PI-2025-000002',1,3,'2025-12-30 00:03:37','2025-12-30 00:03:37',5),(4,'2025-12-30','Purchase Invoice #PI-2025-000003',1,4,'2025-12-30 00:08:02','2025-12-30 00:08:02',5),(5,'2025-12-30','Purchase Invoice #PI-2025-000004',1,5,'2025-12-30 00:14:25','2025-12-30 00:14:25',5),(6,'2025-12-30','قيد تسوية مخزنية #17 - ',2,17,'2025-12-30 20:00:35','2025-12-30 20:00:35',10);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_lines`
--

LOCK TABLES `journal_entry_lines` WRITE;
/*!40000 ALTER TABLE `journal_entry_lines` DISABLE KEYS */;
INSERT INTO `journal_entry_lines` VALUES (3,2,49,33000.00,0.00,'Inventory - PI #PI-2025-000001','2025-12-29 23:54:28','2025-12-29 23:54:28'),(4,2,62,0.00,33000.00,'Supplier - PI #PI-2025-000001','2025-12-29 23:54:28','2025-12-29 23:54:28'),(5,3,62,0.00,33000.00,'Supplier - PI #PI-2025-000002','2025-12-30 00:03:37','2025-12-30 00:03:37'),(6,4,62,0.00,33000.00,'Supplier - PI #PI-2025-000003','2025-12-30 00:08:02','2025-12-30 00:08:02'),(7,5,111,33000.00,0.00,'مخزون أولي - PI #PI-2025-000004','2025-12-30 00:14:25','2025-12-30 00:14:25'),(8,5,62,0.00,33000.00,'Supplier - PI #PI-2025-000004','2025-12-30 00:14:25','2025-12-30 00:14:25'),(9,6,110,110000.00,0.00,'إضافة مخزون (تسوية) - ','2025-12-30 20:00:36','2025-12-30 20:00:36'),(10,6,14,0.00,110000.00,'مواجهة تسوية إضافة مخزون - ','2025-12-30 20:00:36','2025-12-30 20:00:36');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
INSERT INTO `parties` VALUES (1,'ال عبد اللطيف الطرشوبى','customer','','','','',4,47,0.00,'2025-12-15 14:43:54',2),(2,'سالي','customer','','','','',4,47,0.00,'2025-12-15 14:50:27',2),(3,'نبيل الطرشوبى','customer','','','','',4,47,0.00,'2025-12-15 14:53:13',2),(4,'هيلثى','customer','','','','',4,47,0.00,'2025-12-15 14:53:33',3),(5,'نيوكيان','customer','','','','',4,47,0.00,'2025-12-15 14:53:52',3),(6,'الطيبى','customer','','','','',37,47,0.00,'2025-12-15 14:56:57',2),(7,'رمضان','customer','','','','',37,47,0.00,'2025-12-15 14:57:24',1),(8,'خالد محمد','customer','','','','',37,47,0.00,'2025-12-15 14:57:52',1),(9,'القبطان','customer','','','','',37,47,0.00,'2025-12-15 15:24:03',1),(10,'الشمس','customer','','','','',48,47,0.00,'2025-12-15 15:27:50',3),(11,'بيت المقدس','customer','','','','',55,47,0.00,'2025-12-15 15:28:13',3),(12,'بيت الادويه','customer','','','','',55,47,0.00,'2025-12-15 15:28:33',3),(13,'عامر','customer','','','','',55,47,0.00,'2025-12-15 15:29:27',1),(14,'وجيه','customer','','','','',5,47,0.00,'2025-12-15 15:35:10',1),(15,'هاجر وشروق','customer','','','','',13,47,0.00,'2025-12-15 15:35:32',3),(16,'رضا عطيه','customer','','','','',3,47,0.00,'2025-12-15 15:36:05',3),(17,'الاندلس','customer','','','','',13,47,0.00,'2025-12-15 15:36:24',3),(18,'هشام وفؤاد','customer','','','','',13,47,0.00,'2025-12-15 15:36:52',2),(19,'تهانى','customer','','','','',2,47,0.00,'2025-12-15 15:37:59',1),(23,'ECC','supplier','','','','',53,62,0.00,'2025-12-29 23:21:39',4),(24,'Attractive Pack','supplier','','','','',49,62,0.00,'2025-12-29 23:22:14',4);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party_categories`
--

LOCK TABLES `party_categories` WRITE;
/*!40000 ALTER TABLE `party_categories` DISABLE KEYS */;
INSERT INTO `party_categories` VALUES (1,'صيدليه'),(2,'سلسله'),(3,'مخزن'),(4,'مورد'),(5,'مصنع'),(6,'عميل');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `processes`
--

LOCK TABLES `processes` WRITE;
/*!40000 ALTER TABLE `processes` DISABLE KEYS */;
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
-- Table structure for table `product_types`
--

DROP TABLE IF EXISTS `product_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
INSERT INTO `product_types` VALUES (1,'منتج تام'),(2,'مستلزم انتاج');
/*!40000 ALTER TABLE `product_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_id` int DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cost_price` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `unit_id` (`unit_id`),
  KEY `products_ibfk_2` (`type_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `product_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nurivina Argan Oil 100ml',1,330.00,1,'2025-12-13 15:00:23',0.00),(2,'Nurivina Argan Oil Hair Serum 100ml',1,430.00,1,'2025-12-13 15:01:00',0.00),(3,'Nurivina Omega Anti-Hair Loss Shampoo 220ml',1,250.00,1,'2025-12-13 15:01:39',0.00),(4,'Nurivina Argan oil Leave in Conditioner 220ml',1,270.00,1,'2025-12-13 15:02:34',0.00),(5,'Nurivina whitening Cream 50gm',1,240.00,1,'2025-12-13 15:03:07',0.00),(6,'Nurivina Anti-Hair Loss Spray 100ml',1,520.00,1,'2025-12-13 15:04:41',0.00),(10,'Nurivina Omega Anti-Hair Loss Shampoo Cap',2,0.00,1,'2025-12-29 23:19:10',0.00),(11,'Nurivina Omega Anti-Hair Loss Shampoo Bottle 220ml',2,0.00,2,'2025-12-29 23:19:59',0.00),(12,'Nurivina Omega Anti-Hair Loss Shampoo Sticker',2,0.00,1,'2025-12-29 23:20:32',0.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoice_items`
--

LOCK TABLES `purchase_invoice_items` WRITE;
/*!40000 ALTER TABLE `purchase_invoice_items` DISABLE KEYS */;
INSERT INTO `purchase_invoice_items` (`id`, `purchase_invoice_id`, `product_id`, `warehouse_id`, `batch_number`, `expiry_date`, `quantity`, `bonus_quantity`, `unit_price`, `discount`, `created_at`, `updated_at`) VALUES (4,2,10,4,'',NULL,3000.00,0.00,3.00,0.00,'2025-12-29 23:54:28','2025-12-29 23:54:28'),(5,2,11,4,'',NULL,3000.00,0.00,6.00,0.00,'2025-12-29 23:54:28','2025-12-29 23:54:28'),(6,2,12,4,'',NULL,3000.00,0.00,2.00,0.00,'2025-12-29 23:54:28','2025-12-29 23:54:28'),(7,3,10,4,'',NULL,3000.00,0.00,3.00,0.00,'2025-12-30 00:03:37','2025-12-30 00:03:37'),(8,3,11,4,'',NULL,3000.00,0.00,6.00,0.00,'2025-12-30 00:03:37','2025-12-30 00:03:37'),(9,3,12,4,'',NULL,3000.00,0.00,2.00,0.00,'2025-12-30 00:03:37','2025-12-30 00:03:37'),(10,4,10,4,'',NULL,3000.00,0.00,3.00,0.00,'2025-12-30 00:08:02','2025-12-30 00:08:02'),(11,4,11,4,'',NULL,3000.00,0.00,6.00,0.00,'2025-12-30 00:08:02','2025-12-30 00:08:02'),(12,4,12,4,'',NULL,3000.00,0.00,2.00,0.00,'2025-12-30 00:08:02','2025-12-30 00:08:02'),(13,5,10,4,'',NULL,3000.00,0.00,3.00,0.00,'2025-12-30 00:14:25','2025-12-30 00:14:25'),(14,5,11,4,'',NULL,3000.00,0.00,6.00,0.00,'2025-12-30 00:14:25','2025-12-30 00:14:25'),(15,5,12,4,'',NULL,3000.00,0.00,2.00,0.00,'2025-12-30 00:14:25','2025-12-30 00:14:25');
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
  `employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_invoice` (`purchase_invoice_id`),
  KEY `fk_payment_account` (`account_id`),
  KEY `fk_pip_employee` (`employee_id`),
  CONSTRAINT `fk_payment_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`purchase_invoice_id`) REFERENCES `purchase_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pip_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `purchase_invoice_payments_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoices`
--

LOCK TABLES `purchase_invoices` WRITE;
/*!40000 ALTER TABLE `purchase_invoices` DISABLE KEYS */;
INSERT INTO `purchase_invoices` VALUES (2,24,NULL,'PI-2025-000001','2025-12-29',NULL,'','normal','unpaid',33000.00,0.00,0.00,0.00,0.00,0.00,33000.00,'2025-12-29 23:54:28','2025-12-29 23:54:28'),(3,24,NULL,'PI-2025-000002','2025-12-30',NULL,'','normal','unpaid',33000.00,0.00,0.00,0.00,0.00,0.00,33000.00,'2025-12-30 00:03:37','2025-12-30 00:03:37'),(4,23,NULL,'PI-2025-000003','2025-12-30',NULL,'','normal','unpaid',33000.00,0.00,0.00,0.00,0.00,0.00,33000.00,'2025-12-30 00:08:02','2025-12-30 00:08:02'),(5,24,NULL,'PI-2025-000004','2025-12-30',NULL,'','normal','unpaid',33000.00,0.00,0.00,0.00,0.00,0.00,33000.00,'2025-12-30 00:14:25','2025-12-30 00:14:25');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_items`
--

LOCK TABLES `purchase_order_items` WRITE;
/*!40000 ALTER TABLE `purchase_order_items` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
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

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, NEW.account_id, 0, NEW.amount, 'دفع للمورد');

    
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

  
  SELECT warehouse_id INTO wh_id
  FROM purchase_invoices
  WHERE id = (
    SELECT purchase_invoice_id FROM purchase_returns WHERE id = NEW.purchase_return_id
  );

  
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
  `return_type` enum('cash','credit') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
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

    
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع شراء #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, purchase_account, 0, NEW.total_amount, 'إلغاء جزئي للمشتريات');

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, payable_account, NEW.total_amount, 0, 'تخفيض مديونية المورد');

    
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

    
    DELETE FROM journal_entries 
    WHERE description = CONCAT('مرتجع شراء #', OLD.id);

    
    SELECT 
        IFNULL(SUM(quantity * price), 0),
        IFNULL(SUM(quantity * price * (tax_rate / 100)), 0)
    INTO
        total_amount,
        tax_amount
    FROM purchase_return_items
    WHERE return_id = NEW.id;

    
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

    
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع شراء #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, purchase_account, 0, total_amount, 'إلغاء جزئي للمشتريات');

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, payable_account, total_amount + tax_amount, 0, 'تخفيض مديونية المورد');

    
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_types`
--

LOCK TABLES `reference_types` WRITE;
/*!40000 ALTER TABLE `reference_types` DISABLE KEYS */;
INSERT INTO `reference_types` VALUES (1,'purchase_invoice','فاتورة شراء','Journal Entry for Purchase Invoice','2025-12-29 23:24:13','2025-12-29 23:24:13'),(2,'inventory_adjustment','تسوية مخزنية','Inventory Adjustment Transaction','2025-12-30 20:00:35','2025-12-30 20:00:35');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
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
  `payment_method` enum('cash','bank_transfer','cheque') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` int NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `reference_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sales_invoice_id` (`sales_invoice_id`),
  KEY `idx_account_id` (`account_id`),
  KEY `fk_sip_employee` (`employee_id`),
  CONSTRAINT `fk_sip_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `chk_amount_positive` CHECK ((`amount` >= 0.01))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_payments`
--

LOCK TABLES `sales_invoice_payments` WRITE;
/*!40000 ALTER TABLE `sales_invoice_payments` DISABLE KEYS */;
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
  `status` enum('unpaid','paid','partial','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `sales_order_id` int DEFAULT NULL,
  `party_id` int NOT NULL,
  `invoice_date` date NOT NULL DEFAULT (curdate()),
  `due_date` date DEFAULT NULL,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `account_id` int DEFAULT NULL,
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
  `invoice_type` enum('normal','opening') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `sales_order_id` (`sales_order_id`),
  KEY `party_id` (`party_id`),
  KEY `account_id` (`account_id`),
  KEY `fk_employee_id` (`employee_id`),
  KEY `fk_sales_invoices_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_sales_invoices_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_invoices_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`),
  CONSTRAINT `sales_invoices_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `sales_invoices_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_order_items`
--

LOCK TABLES `sales_order_items` WRITE;
/*!40000 ALTER TABLE `sales_order_items` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_orders`
--

LOCK TABLES `sales_orders` WRITE;
/*!40000 ALTER TABLE `sales_orders` DISABLE KEYS */;
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

--
-- Table structure for table `sales_returns`
--

DROP TABLE IF EXISTS `sales_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_returns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `return_date` date NOT NULL DEFAULT (curdate()),
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `return_type` enum('cash','credit') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  PRIMARY KEY (`id`),
  KEY `sales_invoice_id` (`sales_invoice_id`),
  KEY `fk_sales_returns_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_sales_returns_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
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

    
    SELECT 
        IFNULL(SUM(quantity * price), 0),
        IFNULL(SUM(quantity * price * (tax_rate / 100)), 0)
    INTO
        total_amount,
        tax_amount
    FROM sales_return_items
    WHERE return_id = NEW.id;

    
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

    
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع بيع #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, receivable_account, 0, total_amount + tax_amount, 'إلغاء مديونية العميل');

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, sales_account, total_amount, 0, 'إلغاء إيرادات المبيعات');

    
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
    
    DELETE FROM journal_entries 
    WHERE description = CONCAT('مرتجع بيع #', OLD.id);

    
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
-- Table structure for table `service_payments`
--

DROP TABLE IF EXISTS `service_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `party_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_method` enum('cash','bank','cheque','other') DEFAULT 'cash',
  `reference_number` varchar(255) DEFAULT NULL,
  `account_id` int NOT NULL,
  `external_job_order_id` int DEFAULT NULL,
  `note` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  KEY `account_id` (`account_id`),
  KEY `external_job_order_id` (`external_job_order_id`),
  KEY `fk_sp_employee` (`employee_id`),
  CONSTRAINT `fk_sp_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `service_payments_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `service_payments_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `service_payments_ibfk_3` FOREIGN KEY (`external_job_order_id`) REFERENCES `external_job_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_payments`
--

LOCK TABLES `service_payments` WRITE;
/*!40000 ALTER TABLE `service_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!50001 DROP VIEW IF EXISTS `suppliers`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `suppliers` AS SELECT 
 1 AS `id`,
 1 AS `name`*/;
SET character_set_client = @saved_cs_client;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'قطعة'),(2,'عبوه');
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
-- Temporary view structure for view `v_monthly_orders_report`
--

DROP TABLE IF EXISTS `v_monthly_orders_report`;
/*!50001 DROP VIEW IF EXISTS `v_monthly_orders_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_monthly_orders_report` AS SELECT 
 1 AS `order_month`,
 1 AS `total_orders`,
 1 AS `total_order_value`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_supplier_orders_report`
--

DROP TABLE IF EXISTS `v_supplier_orders_report`;
/*!50001 DROP VIEW IF EXISTS `v_supplier_orders_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_supplier_orders_report` AS SELECT 
 1 AS `supplier_id`,
 1 AS `supplier_name`,
 1 AS `total_orders`,
 1 AS `total_order_value`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_account_balances`
--

DROP TABLE IF EXISTS `view_account_balances`;
/*!50001 DROP VIEW IF EXISTS `view_account_balances`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_account_balances` AS SELECT 
 1 AS `account_id`,
 1 AS `account_name`,
 1 AS `total_debit`,
 1 AS `total_credit`,
 1 AS `balance`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_avg_purchase_cost`
--

DROP TABLE IF EXISTS `view_avg_purchase_cost`;
/*!50001 DROP VIEW IF EXISTS `view_avg_purchase_cost`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_avg_purchase_cost` AS SELECT 
 1 AS `product_id`,
 1 AS `avg_cost_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_current_inventory`
--

DROP TABLE IF EXISTS `view_current_inventory`;
/*!50001 DROP VIEW IF EXISTS `view_current_inventory`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_current_inventory` AS SELECT 
 1 AS `product_id`,
 1 AS `product_name`,
 1 AS `warehouse_id`,
 1 AS `warehouse_name`,
 1 AS `quantity`,
 1 AS `last_updated`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_customer_statement`
--

DROP TABLE IF EXISTS `view_customer_statement`;
/*!50001 DROP VIEW IF EXISTS `view_customer_statement`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_customer_statement` AS SELECT 
 1 AS `party_id`,
 1 AS `trans_date`,
 1 AS `description`,
 1 AS `debit`,
 1 AS `credit`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_customer_statement_base`
--

DROP TABLE IF EXISTS `view_customer_statement_base`;
/*!50001 DROP VIEW IF EXISTS `view_customer_statement_base`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_customer_statement_base` AS SELECT 
 1 AS `party_id`,
 1 AS `trans_date`,
 1 AS `description`,
 1 AS `debit`,
 1 AS `credit`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_customer_statement_dated`
--

DROP TABLE IF EXISTS `view_customer_statement_dated`;
/*!50001 DROP VIEW IF EXISTS `view_customer_statement_dated`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_customer_statement_dated` AS SELECT 
 1 AS `party_id`,
 1 AS `party_name`,
 1 AS `invoice_id`,
 1 AS `invoice_date`,
 1 AS `total_amount`,
 1 AS `total_paid`,
 1 AS `balance`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_inventory_logs`
--

DROP TABLE IF EXISTS `view_inventory_logs`;
/*!50001 DROP VIEW IF EXISTS `view_inventory_logs`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_inventory_logs` AS SELECT 
 1 AS `id`,
 1 AS `log_time`,
 1 AS `action_type`,
 1 AS `quantity_change`,
 1 AS `reference_type`,
 1 AS `reference_id`,
 1 AS `product_name`,
 1 AS `warehouse_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_monthly_profit_summary`
--

DROP TABLE IF EXISTS `view_monthly_profit_summary`;
/*!50001 DROP VIEW IF EXISTS `view_monthly_profit_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_monthly_profit_summary` AS SELECT 
 1 AS `month`,
 1 AS `total_sales`,
 1 AS `total_cost`,
 1 AS `total_profit`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_monthly_sales_summary`
--

DROP TABLE IF EXISTS `view_monthly_sales_summary`;
/*!50001 DROP VIEW IF EXISTS `view_monthly_sales_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_monthly_sales_summary` AS SELECT 
 1 AS `month`,
 1 AS `total_invoices`,
 1 AS `total_sales`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_purchase_returns`
--

DROP TABLE IF EXISTS `view_purchase_returns`;
/*!50001 DROP VIEW IF EXISTS `view_purchase_returns`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_purchase_returns` AS SELECT 
 1 AS `return_id`,
 1 AS `return_date`,
 1 AS `invoice_id`,
 1 AS `product_name`,
 1 AS `quantity`,
 1 AS `reason`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_sales_payments`
--

DROP TABLE IF EXISTS `view_sales_payments`;
/*!50001 DROP VIEW IF EXISTS `view_sales_payments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_sales_payments` AS SELECT 
 1 AS `payment_id`,
 1 AS `payment_date`,
 1 AS `party_name`,
 1 AS `account_name`,
 1 AS `amount`,
 1 AS `invoice_id`,
 1 AS `invoice_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_sales_payments_by_account`
--

DROP TABLE IF EXISTS `view_sales_payments_by_account`;
/*!50001 DROP VIEW IF EXISTS `view_sales_payments_by_account`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_sales_payments_by_account` AS SELECT 
 1 AS `account_id`,
 1 AS `account_name`,
 1 AS `payment_date`,
 1 AS `total_paid`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_sales_returns`
--

DROP TABLE IF EXISTS `view_sales_returns`;
/*!50001 DROP VIEW IF EXISTS `view_sales_returns`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_sales_returns` AS SELECT 
 1 AS `return_id`,
 1 AS `return_date`,
 1 AS `invoice_id`,
 1 AS `party_name`,
 1 AS `product_id`,
 1 AS `product_name`,
 1 AS `quantity`,
 1 AS `price`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_unpaid_sales_invoices`
--

DROP TABLE IF EXISTS `view_unpaid_sales_invoices`;
/*!50001 DROP VIEW IF EXISTS `view_unpaid_sales_invoices`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_unpaid_sales_invoices` AS SELECT 
 1 AS `invoice_id`,
 1 AS `party_name`,
 1 AS `invoice_date`,
 1 AS `total_amount`,
 1 AS `total_paid`,
 1 AS `balance`*/;
SET character_set_client = @saved_cs_client;

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
  PRIMARY KEY (`id`),
  KEY `fk_transfer_item_transfer` (`transfer_id`),
  KEY `fk_transfer_item_product` (`product_id`),
  CONSTRAINT `fk_transfer_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_transfer_item_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `warehouse_transfers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfer_items`
--

LOCK TABLES `warehouse_transfer_items` WRITE;
/*!40000 ALTER TABLE `warehouse_transfer_items` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfers`
--

LOCK TABLES `warehouse_transfers` WRITE;
/*!40000 ALTER TABLE `warehouse_transfers` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` VALUES (1,'المخزن الرئيسي','المنصوره - شارع الترعه',4,'2025-12-15 09:24:58'),(2,'مخزن التوريد الرئيسي','المنصوره - شارع اداب',4,'2025-12-15 09:25:42'),(3,'مخزن الاسكندريه','الاسكندريه',37,'2025-12-15 09:26:27'),(4,'مخزن مستلزمات الانتاج','المنصوره-شارع الترعه',4,'2025-12-15 09:27:03'),(5,'مخزن تحت التشغيل لدى الغير','المنصوره',4,'2025-12-15 09:29:30'),(6,'مخزن دمياط','دمياط',55,'2025-12-15 09:30:34');
/*!40000 ALTER TABLE `warehouses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `suppliers`
--

/*!50001 DROP VIEW IF EXISTS `suppliers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `suppliers` AS select `parties`.`id` AS `id`,`parties`.`name` AS `name` from `parties` where (`parties`.`party_type` = 'supplier') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_monthly_orders_report`
--

/*!50001 DROP VIEW IF EXISTS `v_monthly_orders_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_monthly_orders_report` AS select date_format(`po`.`order_date`,'%Y-%m') AS `order_month`,count(`po`.`id`) AS `total_orders`,sum(`po`.`total_amount`) AS `total_order_value` from `purchase_orders` `po` group by date_format(`po`.`order_date`,'%Y-%m') order by `order_month` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_supplier_orders_report`
--

/*!50001 DROP VIEW IF EXISTS `v_supplier_orders_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_supplier_orders_report` AS select `p`.`id` AS `supplier_id`,`p`.`name` AS `supplier_name`,count(`po`.`id`) AS `total_orders`,sum(`po`.`total_amount`) AS `total_order_value` from (`parties` `p` left join `purchase_orders` `po` on((`po`.`supplier_id` = `p`.`id`))) group by `p`.`id`,`p`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_account_balances`
--

/*!50001 DROP VIEW IF EXISTS `view_account_balances`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_account_balances` AS select `a`.`id` AS `account_id`,`a`.`name` AS `account_name`,sum(`jel`.`debit`) AS `total_debit`,sum(`jel`.`credit`) AS `total_credit`,sum((`jel`.`debit` - `jel`.`credit`)) AS `balance` from (`accounts` `a` left join `journal_entry_lines` `jel` on((`a`.`id` = `jel`.`account_id`))) group by `a`.`id`,`a`.`name` order by `a`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_avg_purchase_cost`
--

/*!50001 DROP VIEW IF EXISTS `view_avg_purchase_cost`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_avg_purchase_cost` AS select `purchase_invoice_items`.`product_id` AS `product_id`,avg(`purchase_invoice_items`.`unit_price`) AS `avg_cost_price` from `purchase_invoice_items` group by `purchase_invoice_items`.`product_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_current_inventory`
--

/*!50001 DROP VIEW IF EXISTS `view_current_inventory`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_current_inventory` AS select `ci`.`product_id` AS `product_id`,`p`.`name` AS `product_name`,`ci`.`warehouse_id` AS `warehouse_id`,`w`.`name` AS `warehouse_name`,`ci`.`quantity` AS `quantity`,`ci`.`last_updated` AS `last_updated` from ((`current_inventory` `ci` join `products` `p` on((`ci`.`product_id` = `p`.`id`))) join `warehouses` `w` on((`ci`.`warehouse_id` = `w`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_customer_statement`
--

/*!50001 DROP VIEW IF EXISTS `view_customer_statement`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_customer_statement` AS select `statement`.`party_id` AS `party_id`,`statement`.`trans_date` AS `trans_date`,`statement`.`description` AS `description`,`statement`.`debit` AS `debit`,`statement`.`credit` AS `credit` from (select `si`.`party_id` AS `party_id`,`si`.`invoice_date` AS `trans_date`,concat('فاتورة بيع #',`si`.`id`) AS `description`,`si`.`total_amount` AS `debit`,0 AS `credit` from `sales_invoices` `si` union all select `si`.`party_id` AS `party_id`,`sr`.`return_date` AS `return_date`,concat('مرتجع بيع #',`sr`.`id`) AS `CONCAT('مرتجع بيع #', sr.id)`,0 AS `0`,sum((`sri`.`quantity` * `sri`.`price`)) AS `SUM(sri.quantity * sri.price)` from ((`sales_returns` `sr` join `sales_invoices` `si` on((`sr`.`sales_invoice_id` = `si`.`id`))) join `sales_return_items` `sri` on((`sri`.`sales_return_id` = `sr`.`id`))) group by `sr`.`id`,`si`.`party_id`,`sr`.`return_date` union all select `sp`.`party_id` AS `party_id`,`sp`.`payment_date` AS `payment_date`,concat('دفعة عميل #',`sp`.`id`) AS `CONCAT('دفعة عميل #', sp.id)`,0 AS `0`,`sp`.`amount` AS `amount` from `sales_payments` `sp`) `statement` order by `statement`.`party_id`,`statement`.`trans_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_customer_statement_base`
--

/*!50001 DROP VIEW IF EXISTS `view_customer_statement_base`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_customer_statement_base` AS select `statement`.`party_id` AS `party_id`,`statement`.`trans_date` AS `trans_date`,`statement`.`description` AS `description`,`statement`.`debit` AS `debit`,`statement`.`credit` AS `credit` from (select `si`.`party_id` AS `party_id`,`si`.`invoice_date` AS `trans_date`,concat('فاتورة بيع #',`si`.`id`) AS `description`,`si`.`total_amount` AS `debit`,0 AS `credit` from `sales_invoices` `si` union all select `si`.`party_id` AS `party_id`,`sr`.`return_date` AS `return_date`,concat('مرتجع بيع #',`sr`.`id`) AS `CONCAT('مرتجع بيع #', sr.id)`,0 AS `0`,sum((`sri`.`quantity` * `sri`.`price`)) AS `SUM(sri.quantity * sri.price)` from ((`sales_returns` `sr` join `sales_invoices` `si` on((`sr`.`sales_invoice_id` = `si`.`id`))) join `sales_return_items` `sri` on((`sri`.`sales_return_id` = `sr`.`id`))) group by `sr`.`id`,`si`.`party_id`,`sr`.`return_date` union all select `sp`.`party_id` AS `party_id`,`sp`.`payment_date` AS `payment_date`,concat('دفعة عميل #',`sp`.`id`) AS `CONCAT('دفعة عميل #', sp.id)`,0 AS `0`,`sp`.`amount` AS `amount` from `sales_payments` `sp`) `statement` order by `statement`.`party_id`,`statement`.`trans_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_customer_statement_dated`
--

/*!50001 DROP VIEW IF EXISTS `view_customer_statement_dated`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_customer_statement_dated` AS select `p`.`id` AS `party_id`,`p`.`name` AS `party_name`,`si`.`id` AS `invoice_id`,`si`.`invoice_date` AS `invoice_date`,`si`.`total_amount` AS `total_amount`,ifnull(sum(`sp`.`amount`),0) AS `total_paid`,(`si`.`total_amount` - ifnull(sum(`sp`.`amount`),0)) AS `balance` from ((`sales_invoices` `si` join `parties` `p` on((`si`.`party_id` = `p`.`id`))) left join `sales_payments` `sp` on((`sp`.`sales_invoice_id` = `si`.`id`))) group by `si`.`id` order by `p`.`name`,`si`.`invoice_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_inventory_logs`
--

/*!50001 DROP VIEW IF EXISTS `view_inventory_logs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_inventory_logs` AS select `il`.`id` AS `id`,`il`.`log_time` AS `log_time`,`il`.`action_type` AS `action_type`,`il`.`quantity_change` AS `quantity_change`,`il`.`reference_type` AS `reference_type`,`il`.`reference_id` AS `reference_id`,`p`.`name` AS `product_name`,`w`.`name` AS `warehouse_name` from ((`inventory_logs` `il` join `products` `p` on((`il`.`product_id` = `p`.`id`))) join `warehouses` `w` on((`il`.`warehouse_id` = `w`.`id`))) order by `il`.`log_time` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_monthly_profit_summary`
--

/*!50001 DROP VIEW IF EXISTS `view_monthly_profit_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_monthly_profit_summary` AS select date_format(`si`.`invoice_date`,'%Y-%m') AS `month`,sum((`sii`.`quantity` * `sii`.`price`)) AS `total_sales`,sum((`sii`.`quantity` * coalesce(`apc`.`avg_cost_price`,0))) AS `total_cost`,(sum((`sii`.`quantity` * `sii`.`price`)) - sum((`sii`.`quantity` * coalesce(`apc`.`avg_cost_price`,0)))) AS `total_profit` from ((`sales_invoice_items` `sii` join `sales_invoices` `si` on((`sii`.`sales_invoice_id` = `si`.`id`))) left join `view_avg_purchase_cost` `apc` on((`sii`.`product_id` = `apc`.`product_id`))) group by date_format(`si`.`invoice_date`,'%Y-%m') order by `month` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_monthly_sales_summary`
--

/*!50001 DROP VIEW IF EXISTS `view_monthly_sales_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_monthly_sales_summary` AS select date_format(`sales_invoices`.`invoice_date`,'%Y-%m') AS `month`,count(0) AS `total_invoices`,sum(`sales_invoices`.`total_amount`) AS `total_sales` from `sales_invoices` group by date_format(`sales_invoices`.`invoice_date`,'%Y-%m') order by `month` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_purchase_returns`
--

/*!50001 DROP VIEW IF EXISTS `view_purchase_returns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_purchase_returns` AS select `pr`.`id` AS `return_id`,`pr`.`return_date` AS `return_date`,`pi`.`id` AS `invoice_id`,`p`.`name` AS `product_name`,`pri`.`quantity` AS `quantity`,`pri`.`reason` AS `reason` from ((((`purchase_return_items` `pri` join `purchase_returns` `pr` on((`pri`.`purchase_return_id` = `pr`.`id`))) join `purchase_invoice_items` `pii` on((`pri`.`purchase_invoice_item_id` = `pii`.`id`))) join `products` `p` on((`pri`.`product_id` = `p`.`id`))) join `purchase_invoices` `pi` on((`pr`.`purchase_invoice_id` = `pi`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_sales_payments`
--

/*!50001 DROP VIEW IF EXISTS `view_sales_payments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_sales_payments` AS select `sp`.`id` AS `payment_id`,`sp`.`payment_date` AS `payment_date`,`p`.`name` AS `party_name`,`a`.`name` AS `account_name`,`sp`.`amount` AS `amount`,`si`.`id` AS `invoice_id`,`si`.`invoice_date` AS `invoice_date` from (((`sales_payments` `sp` join `parties` `p` on((`sp`.`party_id` = `p`.`id`))) join `accounts` `a` on((`sp`.`account_id` = `a`.`id`))) left join `sales_invoices` `si` on((`sp`.`sales_invoice_id` = `si`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_sales_payments_by_account`
--

/*!50001 DROP VIEW IF EXISTS `view_sales_payments_by_account`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_sales_payments_by_account` AS select `a`.`id` AS `account_id`,`a`.`name` AS `account_name`,cast(`sp`.`payment_date` as date) AS `payment_date`,sum(`sp`.`amount`) AS `total_paid` from (`sales_payments` `sp` join `accounts` `a` on((`sp`.`account_id` = `a`.`id`))) group by `a`.`id`,cast(`sp`.`payment_date` as date) order by `payment_date` desc,`a`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_sales_returns`
--

/*!50001 DROP VIEW IF EXISTS `view_sales_returns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_sales_returns` AS select `sr`.`id` AS `return_id`,`sr`.`return_date` AS `return_date`,`si`.`id` AS `invoice_id`,`p`.`name` AS `party_name`,`sri`.`product_id` AS `product_id`,`pr`.`name` AS `product_name`,`sri`.`quantity` AS `quantity`,`sri`.`price` AS `price` from ((((`sales_returns` `sr` join `sales_invoices` `si` on((`sr`.`sales_invoice_id` = `si`.`id`))) join `parties` `p` on((`si`.`party_id` = `p`.`id`))) join `sales_return_items` `sri` on((`sri`.`sales_return_id` = `sr`.`id`))) join `products` `pr` on((`pr`.`id` = `sri`.`product_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_unpaid_sales_invoices`
--

/*!50001 DROP VIEW IF EXISTS `view_unpaid_sales_invoices`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_unpaid_sales_invoices` AS select `si`.`id` AS `invoice_id`,`p`.`name` AS `party_name`,`si`.`invoice_date` AS `invoice_date`,`si`.`total_amount` AS `total_amount`,ifnull(sum(`sp`.`amount`),0) AS `total_paid`,(`si`.`total_amount` - ifnull(sum(`sp`.`amount`),0)) AS `balance` from ((`sales_invoices` `si` join `parties` `p` on((`si`.`party_id` = `p`.`id`))) left join `sales_payments` `sp` on((`sp`.`sales_invoice_id` = `si`.`id`))) group by `si`.`id` having (`balance` > 0) order by `si`.`invoice_date` */;
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

-- Dump completed on 2025-12-31  1:47:12
