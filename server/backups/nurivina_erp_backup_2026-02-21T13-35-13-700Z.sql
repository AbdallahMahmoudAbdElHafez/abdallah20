-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: nurivina_erp
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
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'اصول','asset',NULL,0.00,'','debit'),(2,'خصوم','liability',NULL,0.00,'','credit'),(3,'مصروفات مباشره','expense',NULL,0.00,'','debit'),(4,'مصروفات غير مباشره','expense',NULL,0.00,'','debit'),(5,'ايرادات','revenue',NULL,0.00,'','credit'),(6,'مردودات المبيعات','revenue',NULL,0.00,'','credit'),(7,'حقوق الملكيه','equity',NULL,0.00,'','credit'),(8,'اصول ثابته','asset',1,0.00,'','debit'),(9,'اصول متداوله','asset',1,0.00,'','debit'),(10,'رأس المال','equity',7,0.00,'','credit'),(11,'قروض','liability',2,0.00,'','credit'),(12,'خصوم متادوله','liability',2,0.00,'','credit'),(13,'صافي الربح','liability',2,0.00,'','credit'),(14,'ارباح مرحلة','equity',7,0.00,'','credit'),(15,'تكلفة البضاعة المباعة','expense',3,0.00,'','debit'),(16,'مصروفات نقل بضاعة','expense',3,0.00,'','debit'),(17,'مرتبات المبيعات','expense',3,0.00,'','debit'),(18,'عمولات المبيعات','expense',3,0.00,'','debit'),(19,'خصم خاص','expense',3,0.00,'','debit'),(20,'دمغه','expense',3,0.00,'','debit'),(21,'مصروفات خطابات ضمان','expense',3,0.00,'','debit'),(22,'مصروفات تسويقيه','expense',3,0.00,'','debit'),(23,'جرد تالف تصنيع','expense',3,0.00,'','debit'),(24,'تكاليف تشغيل مباشره','expense',3,0.00,'','debit'),(25,'مصروفات عموميه','expense',4,0.00,'','debit'),(26,'اهلاكات','expense',4,0.00,'','debit'),(27,'مرتبات','expense',4,0.00,'','debit'),(28,'مبيعات','revenue',5,0.00,'','credit'),(29,'خدمات','revenue',5,0.00,'','credit'),(30,'خصم مكتسب','revenue',5,0.00,'','credit'),(31,'آلات','asset',8,0.00,'','debit'),(32,'آراضي','asset',8,0.00,'','debit'),(33,'مباني','asset',8,0.00,'','debit'),(34,'أدوات مكتبية','asset',8,0.00,'','debit'),(35,'سيارات','asset',8,0.00,'','debit'),(36,'أثاث','asset',8,0.00,'','debit'),(37,'ملفات','asset',8,0.00,'','debit'),(38,'برامج محاسبيه','asset',8,0.00,'','debit'),(39,'جهاز كمبيوتر','asset',8,0.00,'','debit'),(40,'صندوق وبنوك','asset',9,0.00,'','debit'),(41,'خزينه','asset',40,0.00,'','debit'),(42,'خزينة شركة الشحن','asset',40,0.00,'','debit'),(43,'QNB','asset',40,0.00,'','debit'),(44,'QNB Business','asset',40,0.00,'','debit'),(45,'فودافون كاش','asset',40,0.00,'','debit'),(46,'كارد فيزا','asset',40,0.00,'','debit'),(47,'العملاء','asset',9,0.00,'','debit'),(48,'اوراق قبض','asset',9,0.00,'','debit'),(49,'المخزون','asset',9,0.00,'','debit'),(50,'جاري الشركاء','asset',9,0.00,'','debit'),(51,'جاري هاني صلاح','asset',50,0.00,'','debit'),(52,'صافي الخسارة','asset',9,0.00,'','debit'),(53,'خسارة مرحلة','asset',9,0.00,'','debit'),(54,'تأمينات لدى الغير','asset',9,0.00,'','debit'),(55,'سلف العاملين','asset',9,0.00,'','debit'),(56,'خصم ضرائب','asset',9,0.00,'','debit'),(57,'خصم ضرائب مبيعات','asset',9,0.00,'','debit'),(58,'غطاء خطابات ضمان','asset',9,0.00,'','debit'),(59,'اعتمادات مستندية','asset',9,0.00,'','debit'),(60,'مدينون متنوعون','asset',9,0.00,'','debit'),(61,'عائلة ','asset',60,0.00,'','debit'),(62,'الموردين','liability',12,0.00,'','credit'),(63,'مخصصات','liability',12,0.00,'','credit'),(64,'اوراق دفع','liability',12,0.00,'','credit'),(65,'ضريبة القيمه المضافه','liability',12,0.00,'','credit'),(66,'مصلحة الضرائب','liability',12,0.00,'','credit'),(67,'مقاولين من الباطل','liability',12,0.00,'','credit'),(68,'خصم و اضافه ضرائب مشتريات','liability',12,0.00,'','credit'),(69,'دائنون متنوعون ','liability',12,0.00,'','credit'),(70,'دائن فيزا كارد','liability',69,0.00,'','credit'),(71,'ديون شخصيه','liability',12,0.00,'','credit'),(72,'الأولاد','liability',71,0.00,'','credit'),(73,'نيفين','liability',71,0.00,'','credit'),(74,'إيهاب','liability',71,0.00,'','credit'),(75,'مرتبات مستحقه','liability',12,0.00,'','credit'),(76,'نسبة تحصيل','expense',22,0.00,'','debit'),(77,'هدايا تسويقية','expense',22,0.00,'','debit'),(78,'تعويضات عروض تسويقيه','expense',22,0.00,'','debit'),(79,'مصاريف تصميمات','expense',22,0.00,'','debit'),(80,'عينات مجانية للدكاترة','expense',22,0.00,'','debit'),(81,'عينات للتصوير والتصميمات','expense',22,0.00,'','debit'),(82,'عينات للbloggers','expense',22,0.00,'','debit'),(83,'مشاركات مؤتمرات','expense',22,0.00,'','debit'),(84,'مشاركه فى معرض الجامعات','expense',22,0.00,'','debit'),(85,'مطبوعات تسويقيه','expense',22,0.00,'','debit'),(86,'sponsor health day','expense',22,0.00,'','debit'),(87,'social media ','expense',22,0.00,'','debit'),(88,'اجتماع للدكاتره','expense',22,0.00,'','debit'),(89,'مصروفات بلوجر blogger','expense',22,0.00,'','debit'),(90,'ايجارات','expense',25,0.00,'','debit'),(91,'ايجار مكتب','expense',90,0.00,'','debit'),(92,'ايجار سياره','expense',90,0.00,'','debit'),(93,'ايجار مخزن','expense',90,0.00,'','debit'),(94,'كهرباء','expense',25,0.00,'','debit'),(95,'بوفيه','expense',25,0.00,'','debit'),(96,'ضيافه','expense',25,0.00,'','debit'),(97,'مصاريف سيارة المدير','expense',25,0.00,'','debit'),(98,'زكاة','expense',25,0.00,'','debit'),(99,'مصاريف مكتب الإداره','expense',25,0.00,'','debit'),(100,'هدايا','expense',25,0.00,'','debit'),(101,'عمولات بنكيه','expense',25,0.00,'','debit'),(102,'مصاريف اجتماعات','expense',25,0.00,'','debit'),(103,'بدل سفر','expense',25,0.00,'','debit'),(104,'كروت بيزنيس b.c','expense',25,0.00,'','debit'),(105,'مصاريف وزارة الصحة','expense',25,0.00,'','debit'),(106,'اتعاب مكتب المحاسب القانونى','expense',25,0.00,'','debit'),(107,'فندق ','expense',25,0.00,'','debit'),(108,'خصم مسموح به','revenue',28,0.00,'','debit'),(109,'تحت التشغيل','asset',49,0.00,'','debit'),(110,'مخزون تام الصنع','asset',49,0.00,'','debit'),(111,'مخزون أولي','asset',49,0.00,NULL,'debit'),(112,'هالك مرتجعات مبيعات','expense',3,0.00,'مصروف هالك ناتج عن مرتجعات مبيعات تالفة','debit'),(113,'خسائر انتهاء صلاحية مرتجعات','expense',3,0.00,'مصروف خسائر ناتج عن مرتجعات منتهية الصلاحية','debit'),(114,'فروقات جرد مخزون','expense',3,0.00,NULL,'debit'),(115,'إيراد شحن','revenue',5,0.00,NULL,'debit'),(116,'وسيط تسوية استبدالات','asset',9,0.00,NULL,'debit'),(117,'الارصده الافتتاحيه','equity',7,0.00,'','credit'),(118,'مصروفات اشتراكات وخدمات رقمية','expense',25,0.00,'','debit'),(119,'مصروف ضريبة دخل سنوات سابقة','expense',4,0.00,'','debit'),(120,'Shopify','expense',118,0.00,'','debit'),(121,'Facebook','expense',118,0.00,'','debit'),(122,'Canva','expense',118,0.00,'','debit'),(123,'GoDaddy','expense',118,0.00,'','debit'),(124,'ChatGPT','expense',118,0.00,'','debit'),(125,'Bosta','expense',118,0.00,'','debit'),(126,'Fees','expense',118,0.00,'','debit'),(127,'تحت التشغيل - خامات','asset',109,0.00,'حساب فرعي لتتبع تكلفة الخامات تحت التشغيل','debit'),(128,'تحت التشغيل - خدمات خارجية','asset',109,0.00,'حساب فرعي لتتبع تكلفة الخدمات الخارجية تحت التشغيل','debit'),(129,'عينات مجانية للمخازن والشركات والصيدليات','expense',22,0.00,'','debit');
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
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `area_id` int NOT NULL AUTO_INCREMENT,
  `area_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
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
INSERT INTO `batch_inventory` VALUES (1,1,936),(1,2,68),(1,3,49),(1,6,2),(1,7,3),(1,10,6),(2,1,1793),(2,2,114),(2,3,52),(2,6,1),(2,7,7),(2,10,14),(3,1,1792),(3,2,149),(3,3,64),(3,6,9),(3,7,5),(3,10,8),(4,1,2129),(4,2,89),(4,3,50),(4,6,6),(4,10,6),(5,1,3135),(5,2,63),(5,3,4),(5,6,7),(5,7,2),(5,8,3),(5,10,6),(6,1,2296),(6,2,38),(6,3,29),(6,6,6),(6,7,5),(6,8,4),(6,10,6),(7,1,1618),(7,2,55),(7,3,42),(7,6,4),(7,7,5),(7,9,6),(7,10,6),(8,2,11),(8,3,28),(8,6,7),(8,7,4),(9,4,0),(10,4,0),(11,5,0),(12,5,51),(13,1,2521),(13,2,37),(13,3,50),(13,5,0),(13,10,5),(14,9,1),(15,3,1);
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
  `batch_number` varchar(100) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
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
INSERT INTO `batches` VALUES (1,10,'001','2028-12-01'),(2,6,'002','2028-11-01'),(3,1,'001','2028-08-01'),(4,2,'006','2028-12-01'),(5,3,'001','2028-10-01'),(6,4,'001','2028-01-01'),(7,5,'001','2027-07-01'),(8,2,'003','2028-06-01'),(9,12,NULL,NULL),(10,13,NULL,NULL),(11,12,NULL,NULL),(12,13,NULL,NULL),(13,15,'26001','2029-02-01'),(14,1,'002','2026-05-18'),(15,16,'002','2026-11-01');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_of_materials`
--

LOCK TABLES `bill_of_materials` WRITE;
/*!40000 ALTER TABLE `bill_of_materials` DISABLE KEYS */;
INSERT INTO `bill_of_materials` VALUES (1,13,11,1.000),(2,14,11,1.000),(3,10,14,1.000),(4,10,12,1.000),(5,15,13,1.000),(6,15,12,1.000);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheques`
--

LOCK TABLES `cheques` WRITE;
/*!40000 ALTER TABLE `cheques` DISABLE KEYS */;
INSERT INTO `cheques` VALUES (1,'100005271271','incoming',43,'2026-01-25','2026-02-08',30380.00,'issued',NULL,'2026-01-25 11:30:12','2026-01-25 11:30:12',38,NULL,NULL),(3,'20317000279032','incoming',43,'2026-02-25','2026-01-08',26217.00,'issued',NULL,'2026-02-01 14:14:29','2026-02-01 14:14:29',52,NULL,NULL),(4,'72274270','incoming',44,'2026-02-03','2026-01-29',18947.93,'issued',NULL,'2026-02-04 09:33:35','2026-02-04 09:33:35',58,NULL,NULL),(5,'20317000279115','incoming',43,'2026-02-15','2026-02-06',23314.00,'issued',NULL,'2026-02-19 15:25:22','2026-02-19 15:25:22',99,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'برج العرب',3),(2,'مطوبس',11),(3,'كفر الشيخ',11),(4,'المنصوره',7),(5,'ميت غمر',7),(6,'السنبلاوين',7),(7,'طلخا',7),(8,'منيه النصر',7),(9,'المنزله',7),(10,'شربين',7),(11,'دكرنس',7),(12,'بلقاس',7),(13,'طنطا',9),(14,'كفر الزيات',9),(15,'المحله الكبرى',9),(16,'بسيون',9),(17,'قطور',9),(18,'زفتى',9),(19,'سمنود',9),(20,'القاهره',1),(21,'مدينه نصر',1),(22,'مصر الجديده',1),(23,'المعادى',1),(24,'حلوان',1),(25,'شبرا',1),(26,'الزيتون',1),(27,'المطريه',1),(28,'المرج',1),(29,'عين شمس',1),(30,'السلام',1),(31,'الجيزه',2),(32,'6 اكتوبر',2),(33,'الشيخ زايد',2),(34,'الهرم',2),(35,'العمرانيه',2),(36,'الدقى',2),(37,'الاسكندريه',3),(38,'بنها',4),(39,'شبرا الخيمه',4),(40,'دمنهور',5),(41,'كفر الدوار',5),(42,'رشيد',5),(43,'ادكو',5),(44,'مرسى مطروح',6),(45,'العلمين',6),(46,'الضبعه',6),(47,'سيوه',6),(48,'الزقازيق',8),(49,'العاشر من رمضان',8),(50,'منيا القمح',8),(51,'بلبيس',8),(52,'اجا',7),(53,'جمصه',7),(54,'دسوق',11),(55,'دمياط',12),(56,'دمياط الجديده',12),(57,'راس البر',12),(58,'كفر سعد',12),(59,'الزرقا',12),(60,'فارسكور',12),(61,'كفر البطيخ',12),(62,'تلبانه',7),(63,'البحيره',5),(64,'بهتيم',4),(65,'القليوبيه',4),(66,'اسوان',25);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'نيوريفينا','Nurivina','126067','686642732','','تجارية','01554789988⁩','business.support@nurivina.com','https://nurivina.com/?srsltid=AfmBOopJeOYmRujkt49kV2ortcLMH_3l9TsVcfNK2VyJCcvVowmSAn3x','uploads/companies/logo-1769347168842-955666648.png',' المنصورة-المجزر الالى -التعاونيات عماره 12 \r\n',4,'2020-01-03',1,'2026-01-03 20:04:08','2026-01-25 13:19:28');
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_inventory`
--

LOCK TABLES `current_inventory` WRITE;
/*!40000 ALTER TABLE `current_inventory` DISABLE KEYS */;
INSERT INTO `current_inventory` VALUES (1,10,1,1080,'2026-02-17 12:08:30'),(2,6,1,1793,'2026-02-21 11:57:35'),(3,1,1,1792,'2026-02-17 12:08:30'),(4,2,1,2129,'2026-02-21 11:57:35'),(5,3,1,3135,'2026-02-18 10:50:11'),(6,4,1,2296,'2026-02-16 09:19:44'),(7,5,1,1618,'2026-02-18 10:49:28'),(8,6,7,7,'2026-02-03 11:51:32'),(9,1,7,5,'2026-02-03 11:51:32'),(10,2,7,4,'2026-01-11 19:06:50'),(11,4,7,5,'2026-01-11 19:08:17'),(12,3,7,2,'2026-02-03 11:51:32'),(13,10,3,49,'2026-02-21 13:02:03'),(14,6,3,52,'2026-02-21 12:56:25'),(15,1,3,64,'2026-02-19 17:50:47'),(16,2,3,78,'2026-02-21 12:56:25'),(17,4,3,29,'2026-02-21 08:38:11'),(18,3,3,4,'2026-02-21 08:25:57'),(19,10,2,68,'2026-02-21 13:02:03'),(20,6,2,114,'2026-02-21 12:56:25'),(21,1,2,149,'2026-02-20 13:00:06'),(22,2,2,100,'2026-02-21 12:56:25'),(23,4,2,38,'2026-02-20 13:09:06'),(24,3,2,63,'2026-02-20 13:00:06'),(25,5,2,55,'2026-02-21 12:56:25'),(26,1,6,9,'2026-02-11 23:26:12'),(27,2,6,13,'2026-01-29 23:22:26'),(28,4,6,6,'2026-02-11 23:28:56'),(29,3,6,7,'2026-02-04 15:35:54'),(30,5,6,4,'2026-02-04 15:35:54'),(31,5,3,42,'2026-02-21 12:56:25'),(32,10,7,3,'2026-02-03 11:51:32'),(33,3,8,3,'2026-02-18 11:40:01'),(34,4,8,4,'2026-01-18 09:39:33'),(35,12,4,0,'2026-01-20 21:01:08'),(36,13,4,0,'2026-01-20 21:01:08'),(37,12,5,51,'2026-02-01 12:31:46'),(38,13,5,0,'2026-02-01 12:31:46'),(39,5,7,5,'2026-01-25 19:40:41'),(40,6,6,1,'2026-02-04 15:30:32'),(41,10,6,2,'2026-02-19 18:32:06'),(42,5,9,6,'2026-02-07 08:57:31'),(43,1,10,8,'2026-02-17 11:24:12'),(44,2,10,6,'2026-02-17 11:24:12'),(45,3,10,6,'2026-02-17 11:24:12'),(46,4,10,6,'2026-02-17 11:24:12'),(47,5,10,6,'2026-02-17 11:24:12'),(48,6,10,14,'2026-02-17 11:24:12'),(49,10,10,6,'2026-02-17 11:24:12'),(50,15,5,0,'2026-02-16 09:19:01'),(51,15,1,2521,'2026-02-17 12:08:30'),(52,15,2,37,'2026-02-21 13:02:03'),(53,15,3,50,'2026-02-21 13:02:03'),(54,15,10,5,'2026-02-17 11:25:17'),(55,1,9,1,'2026-02-18 11:42:30'),(56,16,3,1,'2026-02-21 08:34:42');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'المبيعات','2026-01-03 20:04:39'),(2,'المشتريات','2026-01-03 20:04:51'),(3,'الحسابات','2026-01-03 20:05:11'),(4,'الادارة العامه','2026-01-03 20:09:03');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'منار علي','','','2026-01-20 09:41:27',4,'','2026-01-20 09:42:58'),(2,'ريهام خلف','','','2026-01-20 13:02:13',14,'','2026-01-20 13:02:13'),(3,'بلسم جسرها','','','2026-01-20 13:04:39',13,'','2026-01-20 13:04:39'),(4,'هبه عدلي','','','2026-01-20 13:07:48',13,'','2026-01-20 13:07:48'),(5,'مياده طلعت','','','2026-02-05 02:08:19',4,'','2026-02-05 02:08:19'),(6,'منى عوض','','','2026-02-05 02:11:39',4,'','2026-02-05 02:11:39'),(7,'ميرفت صبحي','','','2026-02-05 02:15:54',5,'','2026-02-05 02:15:54'),(8,'نسمه يحيى','','','2026-02-05 02:17:50',4,'','2026-02-05 02:17:50'),(9,'ايمان حبيب','','','2026-02-05 02:21:33',4,'','2026-02-05 02:21:33'),(10,'رشا فوده','','','2026-02-05 02:23:16',4,'','2026-02-05 02:23:16'),(11,'نهى ابو عيد','','','2026-02-05 02:25:56',60,'','2026-02-05 02:25:56'),(12,'ساره سيف الدين','','','2026-02-05 02:28:58',61,'','2026-02-05 02:28:58'),(13,'اماني جمعة','','','2026-02-05 02:31:31',56,'','2026-02-05 02:31:31'),(14,'رشا الشهاوي','','','2026-02-05 02:35:06',37,'','2026-02-05 02:35:06');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'هاني احمد صلاح',1,4,'01555522404⁩','business.support@nurivina.com','2020-01-03','ACTIVE',NULL),(2,'ساره محمود عبد الحفيظ صالح',2,1,'01006882671⁩','sarah.mahmoud.ze@gmail.com','2022-07-06','ACTIVE',1),(3,'بيتر وجدي',2,1,'01270353334⁩','','2022-01-01','ACTIVE',1),(4,'عبدالله محمود عبد الحفيظ صالح',7,1,'01065819852','abdallah.mahmoud.te@gmail.com','2025-03-11','ACTIVE',1),(5,'يمنى ايمن',3,1,'01022027104','','2025-09-01','ACTIVE',2),(6,'منه خالد المصري',3,1,'01067072078⁩','','2025-08-03','ACTIVE',2),(7,'احمد فريد',7,1,'01280227610','','2025-11-01','ACTIVE',3),(8,'عبدالله عصام',3,1,'','','2026-02-01','ACTIVE',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entry_types`
--

LOCK TABLES `entry_types` WRITE;
/*!40000 ALTER TABLE `entry_types` DISABLE KEYS */;
INSERT INTO `entry_types` VALUES (1,'قيد افتتاحي'),(2,'قيد فاتورة مبيعات'),(3,'قيد تحصيل مبيعات'),(4,'قيد مرتجع مبيعات'),(5,'قيد فاتورة مشتريات'),(6,'قيد سداد مشتريات'),(7,'قيد مرتجع مشتريات'),(8,'قيد مصروف'),(9,'قيد إيراد'),(10,'قيد تسوية'),(11,'قيد إهلاك'),(12,'قيد تحويل مخزني'),(13,'قيد إنتاج / تصنيع'),(14,'قيد تعديل يدوي'),(15,'قيد دفع نقدي'),(16,'قيد استلام نقدي'),(17,'قيد دفع بنكي'),(18,'قيد استلام بنكي'),(19,'قيد رسوم بنكية'),(20,'قيد فروق عملة'),(21,'قيد صرف رواتب'),(22,'قيد مكافآت ومزايا'),(23,'قيد سلفة موظف'),(24,'قيد تسوية سلفة موظف'),(25,'قيد مطالبات مصاريف موظفين'),(26,'قيد استحقاق ضريبي'),(27,'قيد دفع ضريبي'),(28,'قيد مخصصات'),(29,'قيد دخل مستحق'),(30,'قيد مصروف مستحق'),(31,'قيد دخل مدفوع مسبقاً'),(32,'قيد مصروف مدفوع مسبقاً'),(33,'قيد شراء أصل ثابت'),(34,'قيد إهلاك أصل ثابت'),(35,'قيد إعادة تقييم أصول'),(36,'قيد شطب أصول'),(37,'قيد شطب ديون معدومة'),(38,'قيد أرباح / خسائر استثمار'),(39,'قيد إدخال رأس المال'),(40,'قيد سحب رأس المال'),(41,'قيد توزيع أرباح'),(42,'قيد استلام أرباح'),(43,'قيد توزيع أرباح داخلي'),(44,'قيد جرد المخزون'),(45,'قيد تعديل تكلفة بضاعة مباعة'),(46,'قيد نقل مخزون بين المخازن'),(47,'قيد شطب مخزون غير صالح'),(48,'قيد مرتجع مخزون من المورد'),(49,'قيد مرتجع مخزون للعميل'),(50,'قيد دفعة مقدمة للعميل'),(51,'قيد دفعة مقدمة للمورد'),(52,'قيد دفع مقدم مصاريف'),(53,'قيد تحصيل مقدم إيراد'),(54,'قيد استلام قرض'),(55,'قيد سداد قرض'),(56,'قيد استحقاق فوائد قرض'),(57,'قيد استحقاق أصل قرض'),(58,'قيد دفع فوائد قرض'),(59,'قيد استلام فوائد قرض'),(60,'قيد تعديل حسابات'),(61,'قيد إعادة تصنيف حسابات'),(62,'قيد تصحيح قيود سابقة'),(63,'قيد تسوية بين الحسابات'),(64,'قيد إغلاق حسابات شهرية'),(65,'قيد افتتاح حسابات جديدة'),(66,'قيد إعداد ميزان مراجعة'),(67,'قيد إقفال سنوي'),(68,'قيد فتح سنوي'),(69,'قيد إعداد تقرير مالي'),(70,'قيد تسجيل دخل متفرّق'),(71,'قيد تسجيل مصروف متفرّق'),(72,'قيد تعديل عملة أجنبية'),(73,'قيد ضبط فروق سعر الصرف'),(74,'قيد إعادة تسعير المخزون'),(75,'قيد محاسبة عقود طويلة الأجل'),(76,'قيد تسجيل التزامات مستقبلية'),(77,'قيد تعديل إيرادات مؤجلة'),(78,'قيد تعديل مصروفات مؤجلة'),(79,'قيد معالجة خصومات / عروض'),(80,'قيد تسوية بين شركات تابعة'),(81,'قيد محاسبة مشاريع / أقسام'),(82,'قيد سند صرف');
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
  `doctor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_exp_debit` (`debit_account_id`),
  KEY `idx_exp_credit` (`credit_account_id`),
  KEY `fk_exp_city` (`city_id`),
  KEY `fk_exp_employee` (`employee_id`),
  KEY `fk_exp_party` (`party_id`),
  KEY `fk_expenses_doctor` (`doctor_id`),
  CONSTRAINT `fk_exp_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_credit` FOREIGN KEY (`credit_account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_debit` FOREIGN KEY (`debit_account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exp_party` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_expenses_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `expenses_chk_amount` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (2,'2026-01-20','',2000.00,93,41,4,NULL,NULL,'2026-01-20 08:42:26',NULL),(3,'2026-01-20','',6006.00,91,43,4,1,NULL,'2026-01-20 08:46:16',NULL),(4,'2026-01-20','هدير بلوجر',1952.00,89,43,4,1,NULL,'2026-01-20 08:54:19',NULL),(5,'2026-01-20','',10.00,95,41,4,1,NULL,'2026-01-20 09:04:23',NULL),(6,'2026-01-20','',120.00,99,41,4,1,NULL,'2026-01-20 09:21:03',NULL),(7,'2026-01-20','مصاريف اشتراك الانترنت',255.38,99,43,4,1,NULL,'2026-01-20 09:23:12',NULL),(8,'2026-01-20','شركة التسويق Objective',10010.00,22,43,4,1,NULL,'2026-01-20 09:31:06',NULL),(9,'2026-01-20','بروشورات (شركة المصريه)',4504.50,85,43,4,1,NULL,'2026-01-20 09:36:02',NULL),(10,'2026-01-20','فاتورة غاز',20.00,99,41,4,1,NULL,'2026-01-20 09:37:17',NULL),(11,'2026-01-20','تنظيف المكتب',200.00,99,41,4,1,NULL,'2026-01-20 09:38:04',NULL),(12,'2026-01-20','بدل سفر طنطا وكفر الشيخ',135.00,103,41,4,4,NULL,'2026-01-20 09:39:05',NULL),(13,'2026-01-20','مياه شرب',20.00,95,41,4,1,NULL,'2026-01-20 09:39:54',NULL),(14,'2026-01-20','بدل سفر دمياط',80.00,103,41,4,4,NULL,'2026-01-20 09:40:43',NULL),(15,'2026-01-20','',20020.00,83,43,4,5,NULL,'2026-01-20 09:42:42',1),(16,'2026-01-20','بدل سفر الزقازيق',95.00,103,41,4,4,NULL,'2026-01-20 09:57:50',NULL),(17,'2026-01-20','مصاريف تكويد منتج',500.00,22,43,37,1,7,'2026-01-20 10:19:05',NULL),(18,'2026-01-20','بدل سفر دمياط',90.00,103,41,4,4,NULL,'2026-01-20 12:17:18',NULL),(19,'2026-01-24','',1250.00,89,43,NULL,1,NULL,'2026-01-24 10:09:59',NULL),(20,'2026-01-24','بدل سفر طنطا وكفر الشيخ',85.00,103,41,4,4,NULL,'2026-01-24 10:11:07',NULL),(21,'2026-01-31','ميادة بلوجر',1500.00,87,43,NULL,1,NULL,'2026-01-31 08:22:12',NULL),(22,'2026-01-31','',2625.39,120,43,NULL,1,NULL,'2026-01-31 09:02:02',NULL),(23,'2026-01-31','',5594.84,121,43,NULL,1,NULL,'2026-02-02 09:55:58',NULL),(24,'2026-01-31','',122.40,122,43,NULL,1,NULL,'2026-02-02 09:58:25',NULL),(25,'2026-01-31','',8344.02,123,43,NULL,1,NULL,'2026-02-02 09:58:56',NULL),(26,'2026-01-31','',1104.43,124,43,NULL,1,NULL,'2026-02-02 09:59:26',NULL),(27,'2026-01-31','',251.94,125,43,NULL,1,NULL,'2026-02-02 10:00:06',NULL),(28,'2026-01-31','',1.00,126,43,NULL,1,NULL,'2026-02-02 10:00:34',NULL),(29,'2026-01-31','فاتورة غاز',20.00,99,41,NULL,1,NULL,'2026-02-02 10:01:41',NULL),(30,'2026-01-31','بدل سفر طنطا ودمياط',185.00,103,41,4,4,NULL,'2026-02-02 10:04:23',NULL),(31,'2026-01-31','',4300.57,16,42,NULL,1,NULL,'2026-02-02 10:13:26',NULL),(32,'2026-02-01','عشاء مناديب',525.00,102,41,NULL,1,NULL,'2026-02-02 16:16:07',NULL),(33,'2026-02-02','بن',235.00,95,41,NULL,1,NULL,'2026-02-02 16:16:33',NULL),(34,'2026-01-31','',2000.00,93,41,NULL,1,NULL,'2026-02-02 16:17:39',NULL),(35,'2026-01-31','',79000.00,27,43,NULL,NULL,NULL,'2026-02-02 16:20:36',NULL),(36,'2026-02-03','شريط لاصق',40.00,99,41,4,1,NULL,'2026-02-04 10:00:34',NULL),(37,'2026-02-03','مي فكري',1250.00,89,43,NULL,1,NULL,'2026-02-04 10:06:21',NULL),(38,'2026-01-26','مصاريف تكويد منتج',500.00,22,41,37,1,25,'2026-02-04 11:02:00',NULL),(39,'2026-01-26','مصاريف تكويد منتج',500.00,22,41,37,1,42,'2026-02-04 11:03:10',NULL),(40,'2026-02-04','ورق A4 ,باكو فايل شفاف ',250.00,99,41,4,1,NULL,'2026-02-04 14:41:05',NULL),(41,'2026-02-04','مصاريف تحليل المنتجات في وزارة الصحة',14000.00,105,43,NULL,1,NULL,'2026-02-04 14:53:12',NULL),(42,'2026-01-31','هدايا',4080.00,100,43,4,2,NULL,'2026-02-05 02:07:45',NULL),(43,'2026-01-31','شوكولاته',180.00,100,43,4,2,NULL,'2026-02-05 02:11:14',5),(44,'2026-01-31','هدية عيد ميلاد',200.00,100,43,4,2,NULL,'2026-02-05 02:14:24',6),(45,'2026-01-31','شوكولاته',410.00,100,43,5,2,NULL,'2026-02-05 02:17:09',7),(46,'2026-01-31','افتتاح عياده',3000.00,100,43,4,2,NULL,'2026-02-05 02:19:04',8),(47,'2026-01-31','افتتاح عياده',1960.00,100,43,4,2,NULL,'2026-02-05 02:19:48',5),(48,'2026-01-31','افتتاح عياده (فضة)',700.00,100,43,4,2,NULL,'2026-02-05 02:22:37',9),(49,'2026-01-31','سبونسر هيليثي داي',1140.00,86,43,4,2,NULL,'2026-02-05 02:24:28',10),(50,'2026-01-31','',1600.00,103,43,4,2,NULL,'2026-02-05 02:25:16',NULL),(51,'2026-01-31','',3000.00,83,43,60,2,NULL,'2026-02-05 02:28:26',11),(52,'2026-01-31','',750.00,86,43,61,2,NULL,'2026-02-05 02:30:04',12),(53,'2026-01-31','هدية عيد ميلاد (شال)',450.00,100,43,56,2,NULL,'2026-02-05 02:34:04',13),(54,'2026-01-31','',690.00,100,43,37,3,NULL,'2026-02-05 02:35:59',14),(55,'2026-01-31','',265.00,102,43,37,3,NULL,'2026-02-05 02:37:15',NULL),(56,'2026-01-31','',950.00,107,43,37,3,NULL,'2026-02-05 02:38:38',NULL),(57,'2026-01-31','',1490.00,103,43,37,3,NULL,'2026-02-05 02:39:28',NULL),(58,'2026-02-05','فاتورة التليفون',222.32,99,43,NULL,1,NULL,'2026-02-07 09:30:03',NULL),(59,'2026-02-06','فاتورة التليفون',222.32,99,43,NULL,1,NULL,'2026-02-07 09:30:57',NULL),(60,'2026-02-07','فاتورة انترنت',255.39,99,43,NULL,1,NULL,'2026-02-07 09:32:04',NULL),(61,'2026-02-10','زكاه',350.00,98,41,NULL,1,NULL,'2026-02-10 10:20:13',NULL),(62,'2026-02-10','زكاه',2000.00,98,41,NULL,1,NULL,'2026-02-10 10:20:40',NULL),(63,'2026-01-31','',1930.00,18,41,4,4,NULL,'2026-02-10 10:21:39',NULL),(64,'2026-02-10','بدل سفر طنطا ودمياط والزقازيق',300.00,103,41,4,4,NULL,'2026-02-10 10:22:41',NULL),(65,'2026-02-10','شيت مبيعات مخزن الشمس',200.00,22,41,48,1,10,'2026-02-10 10:24:00',NULL),(66,'2026-02-13','تقى خالد',2000.00,89,43,NULL,1,NULL,'2026-02-13 21:58:42',NULL),(67,'2026-02-13','بروشورات',1000.00,85,43,NULL,1,NULL,'2026-02-13 22:00:38',NULL),(68,'2026-02-09','فاتورة مياه',70.00,99,41,NULL,1,NULL,'2026-02-13 22:59:41',NULL),(69,'2026-02-04','لوجو 20 بوكس بلوجر',160.00,77,43,NULL,1,NULL,'2026-02-13 23:02:53',NULL),(70,'2026-02-04','لوجو 40 بوكس هدايا رمضان للدكاترة',320.00,100,43,4,2,NULL,'2026-02-13 23:04:39',NULL),(71,'2026-02-04','20 بوكس للبلوجر',1300.00,77,43,NULL,1,NULL,'2026-02-13 23:05:40',NULL),(72,'2026-02-07','',6000.00,91,43,NULL,1,NULL,'2026-02-13 23:07:00',NULL),(73,'2026-02-10','مقص',45.00,34,41,NULL,1,NULL,'2026-02-13 23:08:36',NULL),(74,'2026-02-12','سجل تجاري',1300.00,99,41,NULL,1,NULL,'2026-02-13 23:16:48',NULL),(75,'2026-02-12','سجل تجاري',667.00,99,43,NULL,1,NULL,'2026-02-13 23:17:29',NULL),(76,'2026-02-13','سجل تجاري',135.00,99,41,NULL,1,NULL,'2026-02-13 23:18:09',NULL),(77,'2026-02-12','نيهال بلوجر',3000.00,89,43,NULL,1,NULL,'2026-02-13 23:19:13',NULL),(78,'2026-02-12','بروشورات',1650.00,85,43,NULL,1,NULL,'2026-02-13 23:20:16',NULL),(79,'2026-02-11','مقص',45.00,34,41,NULL,1,NULL,'2026-02-13 23:21:13',NULL),(80,'2026-02-11','دبل فيس×2',84.00,99,41,NULL,1,NULL,'2026-02-13 23:23:43',NULL),(81,'2026-02-11','كور فوم',50.00,99,41,NULL,1,NULL,'2026-02-13 23:24:58',NULL),(82,'2026-02-11','كيلو ونصف شوكولاته من سوافل هدايا رمضان للدكاترة',480.00,100,41,4,2,NULL,'2026-02-13 23:28:45',NULL),(83,'2026-02-11','2 كيلو شوكولاته من سوافل هدايا رمضان للدكاترة',595.00,100,41,4,2,NULL,'2026-02-13 23:52:03',NULL),(84,'2026-02-11','كيلو ونصف شوكولاته من لينزا هدايا رمضان للدكاترة',530.00,100,41,4,2,NULL,'2026-02-13 23:59:09',NULL),(85,'2026-02-11','3 كيلو تمر هدايا رمضان للدكاتره',285.00,100,41,4,2,NULL,'2026-02-14 00:00:20',NULL),(86,'2026-02-11','3 كيلو تمر هدايا رمضان للدكاتره',320.00,100,41,4,2,NULL,'2026-02-14 00:00:55',NULL),(87,'2026-02-11','علب للتمر هدايا رمضان للدكاتره',440.00,100,41,4,2,NULL,'2026-02-14 00:01:43',NULL),(88,'2026-02-14','4 سبح ورمضان كريم هدايا رمضان للدكاتره',130.00,100,41,4,2,NULL,'2026-02-14 00:02:54',NULL),(89,'2026-02-11','اسفينج هدايا رمضان للدكاتره',190.00,100,41,4,2,NULL,'2026-02-14 00:03:49',NULL),(90,'2026-02-14','زكاه',1800.00,98,41,NULL,1,NULL,'2026-02-14 11:05:25',NULL),(91,'2026-02-14','بن',235.00,95,41,NULL,1,NULL,'2026-02-15 08:28:57',NULL),(92,'2026-02-14','بدل سفر طنطا وكفر الشيخ ومنية النصر',200.00,103,41,4,4,NULL,'2026-02-15 08:30:06',NULL),(93,'2026-02-14','لاصق لكراتين رمضان',40.00,99,41,NULL,1,NULL,'2026-02-15 08:36:50',NULL),(94,'2026-02-14','ملفين كرتون',140.00,99,41,NULL,1,NULL,'2026-02-15 08:38:31',NULL),(95,'2026-02-17','بدل سفر الزقازيق',125.00,103,41,4,4,NULL,'2026-02-17 12:34:09',NULL),(96,'2026-02-17','بلاستر لاصق',60.00,99,41,NULL,1,NULL,'2026-02-17 12:34:58',NULL),(97,'2026-02-17','',400.00,98,41,NULL,1,NULL,'2026-02-17 12:35:20',NULL),(98,'2026-02-18','تنظيف المكتب',200.00,99,41,NULL,1,NULL,'2026-02-18 10:10:32',NULL),(99,'2026-02-18','تقى خالد',1500.00,89,43,NULL,1,NULL,'2026-02-18 10:11:25',NULL),(100,'2026-02-18','الاجتماع الشهري',660.00,102,41,NULL,1,NULL,'2026-02-18 10:12:17',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_job_order_items`
--

LOCK TABLES `external_job_order_items` WRITE;
/*!40000 ALTER TABLE `external_job_order_items` DISABLE KEYS */;
INSERT INTO `external_job_order_items` VALUES (1,1,12,5,2829.000,4.50,12730.50,11),(2,1,13,5,51.000,16.53,843.03,12),(3,1,13,5,2778.000,16.53,45920.34,12);
/*!40000 ALTER TABLE `external_job_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_job_order_services`
--

DROP TABLE IF EXISTS `external_job_order_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_job_order_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_order_id` int NOT NULL,
  `party_id` int NOT NULL,
  `service_date` date DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL,
  `status` enum('unpaid','partially_paid','paid') DEFAULT 'unpaid',
  `note` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  KEY `party_id` (`party_id`),
  CONSTRAINT `external_job_order_services_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`),
  CONSTRAINT `external_job_order_services_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_job_order_services`
--

LOCK TABLES `external_job_order_services` WRITE;
/*!40000 ALTER TABLE `external_job_order_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_job_order_services` ENABLE KEYS */;
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
  `estimated_processing_cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `actual_processing_cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `estimated_raw_material_cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `actual_raw_material_cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `total_estimated_cost` decimal(14,2) DEFAULT '0.00',
  `total_actual_cost` decimal(14,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  KEY `product_id` (`product_id`),
  KEY `process_id` (`process_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `external_job_orders_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `external_job_orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `external_job_orders_ibfk_4` FOREIGN KEY (`process_id`) REFERENCES `processes` (`id`),
  CONSTRAINT `external_job_orders_ibfk_5` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_job_orders`
--

LOCK TABLES `external_job_orders` WRITE;
/*!40000 ALTER TABLE `external_job_orders` DISABLE KEYS */;
INSERT INTO `external_job_orders` VALUES (1,74,15,NULL,5,'completed','2026-01-01',NULL,2829.000,2772.000,0.00,0.00,NULL,57.000,0.00,0.00,25.36,0.00,21.46,0.00,129783.47);
/*!40000 ALTER TABLE `external_job_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_service_invoice_item_taxes`
--

DROP TABLE IF EXISTS `external_service_invoice_item_taxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_service_invoice_item_taxes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_item_id` int NOT NULL,
  `tax_name` varchar(50) NOT NULL,
  `tax_rate` decimal(5,4) NOT NULL,
  `tax_amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_item_id` (`invoice_item_id`),
  CONSTRAINT `external_service_invoice_item_taxes_ibfk_1` FOREIGN KEY (`invoice_item_id`) REFERENCES `external_service_invoice_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_service_invoice_item_taxes`
--

LOCK TABLES `external_service_invoice_item_taxes` WRITE;
/*!40000 ALTER TABLE `external_service_invoice_item_taxes` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_service_invoice_item_taxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_service_invoice_items`
--

DROP TABLE IF EXISTS `external_service_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_service_invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `service_type_id` int NOT NULL,
  `description` text,
  `quantity` decimal(12,3) DEFAULT '1.000',
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(14,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `service_type_id` (`service_type_id`),
  CONSTRAINT `external_service_invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `external_service_invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `external_service_invoice_items_ibfk_2` FOREIGN KEY (`service_type_id`) REFERENCES `service_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_service_invoice_items`
--

LOCK TABLES `external_service_invoice_items` WRITE;
/*!40000 ALTER TABLE `external_service_invoice_items` DISABLE KEYS */;
INSERT INTO `external_service_invoice_items` VALUES (1,1,1,'تصنيع',2829.000,25.36,71734.95);
/*!40000 ALTER TABLE `external_service_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_service_invoices`
--

DROP TABLE IF EXISTS `external_service_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_service_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_order_id` int NOT NULL,
  `party_id` int NOT NULL,
  `invoice_no` varchar(50) DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `status` enum('Draft','Posted','Cancelled') DEFAULT 'Draft',
  `sub_total` decimal(14,2) DEFAULT '0.00',
  `tax_total` decimal(14,2) DEFAULT '0.00',
  `total_amount` decimal(14,2) DEFAULT '0.00',
  `notes` text,
  `journal_entry_id` int DEFAULT NULL,
  `posted_at` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  KEY `party_id` (`party_id`),
  KEY `journal_entry_id` (`journal_entry_id`),
  KEY `posted_by` (`posted_by`),
  CONSTRAINT `external_service_invoices_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`),
  CONSTRAINT `external_service_invoices_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `external_service_invoices_ibfk_3` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`),
  CONSTRAINT `external_service_invoices_ibfk_4` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_service_invoices`
--

LOCK TABLES `external_service_invoices` WRITE;
/*!40000 ALTER TABLE `external_service_invoices` DISABLE KEYS */;
INSERT INTO `external_service_invoices` VALUES (1,1,74,NULL,'2026-01-01','Posted',71734.95,0.00,71734.95,NULL,433,'2026-02-05 19:20:42',NULL,'2026-02-05 19:20:16','2026-02-15 17:02:31');
/*!40000 ALTER TABLE `external_service_invoices` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=615 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction_batches`
--

LOCK TABLES `inventory_transaction_batches` WRITE;
/*!40000 ALTER TABLE `inventory_transaction_batches` DISABLE KEYS */;
INSERT INTO `inventory_transaction_batches` VALUES (1,1,1,1456,47.50),(2,2,2,2352,89.70),(3,3,3,2352,55.30),(4,4,4,2688,98.89),(5,5,5,3456,44.75),(6,6,6,2511,39.83),(7,7,7,1988,22.70),(8,8,2,10,89.70),(9,9,3,3,55.30),(10,10,8,4,109.70),(11,11,6,5,39.83),(12,12,5,4,44.75),(13,13,1,40,47.50),(14,14,2,35,89.70),(15,15,3,27,55.30),(16,16,8,38,109.70),(17,17,6,18,39.83),(18,18,5,15,44.75),(19,19,1,8,47.50),(20,20,2,4,89.70),(21,21,3,59,55.30),(22,22,8,3,109.70),(23,23,4,98,98.98),(24,24,6,35,39.83),(25,25,5,11,44.75),(26,26,7,62,22.70),(27,27,3,6,55.30),(28,28,8,7,109.70),(29,29,6,6,39.83),(30,30,5,3,44.75),(31,31,7,1,22.70),(32,32,1,80,47.50),(33,33,1,80,47.50),(34,34,5,41,44.75),(35,35,5,41,44.75),(36,36,6,47,39.83),(37,37,6,47,39.83),(38,38,4,112,98.89),(39,39,4,112,98.89),(40,40,3,112,55.30),(41,41,3,112,55.30),(42,42,2,112,89.70),(43,43,2,112,89.70),(44,44,5,56,44.75),(45,45,5,56,44.75),(46,46,1,80,47.50),(47,47,1,80,47.50),(56,56,1,10,47.50),(57,57,1,10,47.50),(58,58,5,10,44.75),(59,59,1,10,47.50),(60,60,2,3,89.70),(61,61,5,56,44.75),(62,62,5,56,44.75),(63,63,6,56,39.83),(64,64,6,56,39.83),(65,65,7,88,22.70),(66,66,7,88,22.70),(67,67,4,111,98.89),(68,68,4,111,98.89),(69,69,1,72,47.50),(70,70,1,72,47.50),(71,71,1,45,47.50),(72,72,1,45,47.50),(73,73,5,20,44.75),(74,74,5,20,44.75),(75,75,5,1,44.75),(76,76,4,1,98.89),(77,77,7,4,22.70),(78,78,4,50,98.89),(79,79,1,50,47.50),(80,80,2,10,89.70),(81,81,2,3,89.70),(82,82,3,2,55.30),(83,83,4,4,98.89),(84,84,6,3,39.83),(85,85,2,4,89.70),(86,86,5,20,44.75),(87,87,6,20,39.83),(88,88,1,20,47.50),(89,89,3,11,55.30),(90,90,4,11,98.89),(91,91,1,33,47.50),(92,92,4,22,98.89),(93,93,6,11,39.83),(94,94,1,11,47.50),(95,95,2,20,89.70),(96,96,3,20,55.30),(97,97,4,10,98.89),(98,98,5,20,44.75),(99,99,7,35,22.70),(100,100,3,21,55.30),(101,101,2,2,89.70),(102,102,1,2,47.50),(103,103,1,11,47.50),(104,104,4,11,98.89),(105,105,6,11,39.83),(106,106,5,11,44.75),(107,107,1,21,47.50),(108,108,4,1,98.89),(109,109,6,1,39.83),(110,110,5,4,44.75),(111,111,3,11,55.30),(112,112,1,18,47.50),(113,113,2,2,89.70),(114,114,3,2,55.30),(115,115,2,2,89.70),(116,116,6,2,39.83),(117,117,4,1,98.89),(118,118,2,3,89.70),(119,119,4,2,98.89),(120,120,3,1,55.30),(121,121,6,1,39.83),(122,122,4,10,98.89),(123,123,3,10,55.30),(124,124,5,5,44.75),(125,125,3,21,55.30),(126,126,4,21,98.89),(127,127,3,18,55.30),(128,128,2,5,89.70),(129,129,4,20,98.89),(130,130,3,11,55.30),(131,131,4,11,98.89),(132,132,4,10,98.89),(133,133,6,10,39.83),(134,134,2,10,89.70),(135,135,1,10,47.50),(136,136,5,36,44.75),(137,137,5,36,44.75),(138,138,7,20,22.70),(139,139,7,20,22.70),(140,140,3,30,55.30),(141,141,3,30,55.30),(142,142,4,40,98.89),(143,143,4,40,98.89),(144,144,6,15,39.83),(145,145,6,15,39.83),(146,146,5,2,44.75),(147,147,6,2,39.83),(148,148,3,36,55.30),(149,149,4,25,98.89),(150,150,2,5,89.70),(151,151,5,36,44.75),(152,152,2,3,89.70),(153,153,1,5,47.50),(154,154,1,20,47.50),(155,155,3,10,55.30),(156,156,4,10,98.89),(157,157,7,10,22.70),(158,158,1,12,47.50),(159,159,2,3,89.70),(160,160,4,1,98.89),(161,161,1,72,47.50),(162,162,1,72,47.50),(163,163,3,112,55.30),(164,164,3,112,55.30),(165,165,4,2,98.89),(166,166,2,3,89.70),(167,167,6,2,39.83),(168,168,6,2,39.83),(169,169,1,13,47.50),(170,170,2,4,89.70),(171,171,6,1,39.83),(172,172,4,1,98.89),(173,173,7,2,22.70),(174,174,3,1,55.30),(175,175,1,10,47.50),(176,176,3,1,55.30),(177,177,4,1,98.89),(178,178,5,1,44.75),(179,179,6,1,39.83),(180,180,7,1,22.70),(181,181,1,1,47.50),(182,182,2,2,89.70),(183,183,1,1,47.50),(184,184,7,33,22.70),(185,185,2,22,89.70),(186,186,3,33,55.30),(187,187,1,22,47.50),(188,188,6,10,39.83),(189,189,2,11,89.70),(190,190,3,11,55.30),(191,191,7,11,22.70),(192,192,4,70,98.89),(193,193,4,70,98.89),(194,194,3,70,55.30),(195,195,3,70,55.30),(196,196,7,40,22.70),(197,197,7,40,22.70),(198,198,4,20,98.89),(199,199,5,5,44.75),(200,200,1,5,47.50),(201,201,7,20,22.70),(202,202,3,2,55.30),(203,203,5,1,44.75),(204,204,2,1,89.70),(205,205,6,1,39.83),(206,206,1,1,47.50),(207,207,1,1,47.50),(208,208,1,1,47.50),(209,209,2,1,89.70),(210,210,1,1,47.50),(211,211,7,100,22.70),(212,212,7,100,22.70),(213,213,2,112,89.70),(214,214,2,112,89.70),(215,215,1,72,47.50),(216,216,1,72,47.50),(217,217,3,112,55.30),(218,218,3,112,55.30),(219,219,4,112,98.89),(220,220,4,112,98.89),(221,221,1,2,47.50),(222,222,4,10,98.89),(223,223,5,6,44.75),(224,224,1,2,47.50),(225,225,2,2,89.70),(226,226,4,10,98.89),(227,227,9,2880,4.50),(228,228,10,2829,16.53),(229,229,9,2880,4.50),(230,230,11,2880,4.50),(231,231,10,2829,16.53),(232,232,12,2829,16.53),(233,233,3,11,55.30),(234,234,7,2,22.70),(235,235,1,5,47.50),(236,236,3,42,55.30),(237,237,4,2,98.89),(238,238,4,2,98.89),(239,239,3,1,55.30),(240,240,7,1,22.70),(241,241,1,1,47.50),(242,242,2,1,89.70),(243,243,2,2,89.70),(244,244,1,2,47.50),(245,245,2,3,89.70),(246,246,6,3,39.83),(247,247,2,1,89.70),(248,248,3,2,55.30),(249,249,4,1,98.89),(250,250,3,3,55.30),(251,251,3,5,55.30),(252,252,3,5,55.30),(253,253,7,5,22.70),(254,254,7,5,22.70),(255,255,2,20,89.70),(256,256,4,3,98.89),(257,257,2,5,89.70),(258,258,4,20,98.89),(259,259,7,10,22.70),(260,260,6,5,39.83),(261,261,5,10,44.75),(262,262,4,2,98.89),(263,263,1,20,47.50),(264,264,3,2,55.30),(265,265,6,2,39.83),(266,266,7,2,22.70),(267,267,1,3,47.50),(268,268,2,2,89.70),(269,269,4,3,98.89),(270,270,5,2,44.75),(271,271,2,4,89.70),(272,272,2,1,89.70),(273,273,2,11,89.70),(274,274,6,6,39.83),(275,275,7,5,22.70),(276,276,4,22,98.89),(277,277,1,1,47.50),(278,278,2,5,89.70),(279,279,1,3,47.50),(280,280,4,1,98.89),(281,281,1,5,47.50),(282,282,2,3,89.70),(283,283,6,1,39.83),(284,284,4,2,98.89),(285,285,6,1,39.83),(286,286,1,1,47.50),(287,287,5,1,44.75),(288,288,3,6,55.30),(289,289,3,6,55.30),(290,290,4,6,98.89),(291,291,4,6,98.89),(292,292,5,6,44.75),(293,293,5,6,44.75),(294,294,6,6,39.83),(295,295,6,6,39.83),(296,296,7,6,22.70),(297,297,7,6,22.70),(298,298,2,6,89.70),(299,299,2,6,89.70),(300,300,1,6,47.50),(301,301,1,6,47.50),(302,302,4,20,98.89),(303,303,2,32,89.70),(304,304,6,2,39.83),(305,305,4,1,98.89),(306,306,7,36,22.70),(307,307,7,24,22.70),(308,308,2,12,89.70),(309,309,1,12,47.50),(310,310,4,12,98.89),(311,311,7,12,22.70),(312,312,5,10,44.75),(313,313,6,6,39.83),(314,314,2,5,89.70),(315,315,2,1,89.70),(316,316,1,1,47.50),(317,317,2,10,89.70),(318,318,2,10,89.70),(319,319,1,10,47.50),(320,320,1,10,47.50),(321,321,11,2829,4.50),(322,322,11,51,4.50),(323,322,12,2778,16.53),(324,323,6,1,39.83),(325,324,2,1,89.70),(326,325,7,1,22.70),(327,326,5,1,44.75),(328,327,2,99,89.70),(329,328,2,99,89.70),(330,329,5,56,44.75),(331,330,5,56,44.75),(332,331,6,56,39.83),(333,332,6,56,39.83),(334,333,7,22,22.70),(335,334,7,22,22.70),(336,335,2,40,89.70),(337,336,2,40,89.70),(338,337,7,30,22.70),(339,338,7,30,22.70),(340,339,1,30,47.50),(341,340,1,30,47.50),(342,341,7,7,22.70),(343,342,7,11,22.70),(344,343,6,11,39.83),(345,344,1,1,47.50),(346,345,1,16,47.50),(347,346,5,2,44.75),(348,347,2,13,89.70),(349,348,3,1,55.30),(350,349,5,5,44.75),(351,350,3,5,55.30),(352,351,2,5,89.70),(353,352,1,5,47.50),(354,353,5,10,44.75),(355,354,4,10,98.89),(356,355,7,10,22.70),(357,356,6,2,39.83),(358,357,3,25,55.30),(359,358,3,25,55.30),(360,359,4,5,98.89),(361,360,4,1,98.89),(362,361,5,1,44.75),(363,362,7,2,22.70),(364,363,4,1,98.89),(365,364,3,11,55.30),(366,365,6,3,39.83),(367,366,3,2,55.30),(368,367,2,5,89.70),(369,368,1,6,47.50),(370,369,7,3,22.70),(371,370,5,2,44.75),(372,371,6,1,39.83),(373,372,1,2,47.50),(374,373,2,2,89.70),(375,374,3,1,55.30),(376,375,6,1,39.83),(377,376,5,1,44.75),(378,377,6,1,39.83),(379,378,2,1,89.70),(380,379,1,1,47.50),(381,380,7,1,22.70),(382,381,7,1,22.70),(383,382,5,1,44.75),(384,383,6,1,39.83),(385,384,2,1,89.70),(386,385,1,1,47.50),(387,386,3,11,55.30),(388,387,5,1,44.75),(389,388,4,1,98.89),(390,389,7,1,22.70),(391,390,6,5,39.83),(392,391,3,20,55.30),(393,392,2,10,89.70),(394,393,5,10,44.75),(395,394,7,11,22.70),(396,395,2,7,89.70),(397,396,6,11,39.83),(398,397,4,6,98.89),(399,398,4,6,98.89),(400,399,4,2,98.89),(401,400,7,1,22.70),(402,401,5,4,44.75),(403,402,7,12,22.70),(404,403,7,12,22.70),(405,404,4,104,98.89),(406,405,4,104,98.89),(407,406,1,60,47.50),(408,407,1,60,47.50),(409,408,2,112,89.70),(410,409,2,112,89.70),(411,410,3,112,55.30),(412,411,3,112,55.30),(413,412,3,20,55.30),(414,413,5,11,44.75),(415,414,3,11,55.30),(416,415,4,22,98.89),(417,416,5,56,44.75),(418,417,5,56,44.75),(419,418,3,11,55.30),(420,419,1,11,47.50),(421,420,2,22,89.70),(422,421,3,1,55.30),(423,422,6,1,39.83),(424,423,6,1,39.83),(425,424,3,11,55.30),(426,425,4,11,98.89),(427,426,5,11,44.75),(428,427,6,11,39.83),(429,428,7,11,22.70),(430,429,2,11,89.70),(431,430,1,11,47.50),(432,431,6,10,39.83),(433,432,2,10,89.70),(434,433,7,2,22.70),(435,434,5,15,44.75),(436,435,4,6,98.89),(437,436,7,3,22.70),(438,437,5,6,44.75),(439,438,4,4,98.89),(440,439,2,2,89.70),(441,440,6,2,39.83),(442,441,5,10,44.75),(443,442,3,4,55.30),(444,443,3,4,55.30),(445,444,4,4,98.89),(446,445,4,4,98.89),(447,446,5,4,44.75),(448,447,5,4,44.75),(449,448,6,4,39.83),(450,449,6,4,39.83),(451,450,7,4,22.70),(452,451,7,4,22.70),(453,452,2,4,89.70),(454,453,2,4,89.70),(455,454,1,4,47.50),(456,455,1,4,47.50),(457,456,7,1,22.70),(458,457,1,1,47.50),(459,458,1,1,47.50),(460,459,2,2,89.70),(461,460,4,1,98.89),(462,461,3,21,55.30),(463,462,1,2,47.50),(464,463,1,2,47.50),(465,464,4,25,98.89),(466,465,5,3,44.75),(467,466,2,11,89.70),(468,467,3,1,55.30),(469,468,4,1,98.89),(470,469,7,1,22.70),(471,470,2,5,89.70),(472,471,1,5,47.50),(473,472,13,2772,46.82),(474,473,13,2772,46.82),(475,474,13,2772,46.82),(476,475,13,36,46.82),(477,476,13,36,46.82),(478,477,6,56,39.83),(479,478,6,56,39.83),(480,479,5,11,44.75),(481,480,6,11,39.83),(482,481,4,11,98.89),(483,482,13,11,46.82),(484,483,7,1,22.70),(485,484,3,1,55.30),(486,485,4,1,98.89),(487,486,6,1,39.83),(488,487,2,3,89.70),(489,488,2,2,89.70),(490,489,13,71,46.82),(491,490,13,71,46.82),(492,491,3,10,55.30),(493,492,7,10,22.70),(494,493,5,8,44.75),(495,494,8,8,98.89),(496,495,6,6,39.83),(497,496,4,2,98.89),(498,497,4,2,98.89),(499,498,2,10,89.70),(500,499,5,8,44.75),(501,500,6,16,39.83),(502,501,7,10,22.70),(503,502,13,5,46.82),(504,503,3,1,55.30),(505,504,4,1,98.89),(506,505,5,1,44.75),(507,506,6,1,39.83),(508,507,7,1,22.70),(509,508,2,1,89.70),(510,509,1,1,47.50),(511,510,2,3,89.70),(512,511,3,2,55.30),(513,512,4,2,98.89),(514,513,2,2,89.70),(515,514,3,11,55.30),(516,515,3,5,55.30),(517,516,4,5,98.89),(518,517,5,2,44.75),(519,518,1,2,47.50),(520,519,13,30,46.82),(521,520,13,30,46.82),(522,521,4,2,98.89),(523,522,4,2,98.89),(524,523,3,4,55.30),(525,524,3,4,55.30),(526,525,6,2,39.83),(527,526,6,2,39.83),(528,527,1,2,47.50),(529,528,1,2,47.50),(530,529,5,2,44.75),(531,530,5,2,44.75),(532,531,7,2,22.70),(533,532,7,2,22.70),(534,533,2,10,89.70),(535,534,2,10,89.70),(536,535,13,5,46.82),(537,536,13,5,46.82),(538,537,13,144,46.82),(539,538,13,144,46.82),(540,539,3,112,55.30),(541,540,3,112,55.30),(542,541,1,72,47.50),(543,542,1,72,47.50),(544,543,13,1,46.82),(545,544,13,30,46.82),(546,545,13,33,46.82),(547,546,4,1,98.89),(548,547,7,3,22.70),(549,548,7,100,22.70),(550,549,7,100,22.70),(551,550,5,56,44.75),(552,551,5,56,44.75),(553,552,5,1,44.75),(554,553,14,1,55.30),(555,554,3,1,55.30),(556,555,7,3,22.70),(557,556,2,2,89.70),(558,557,2,3,89.70),(559,558,4,1,98.89),(560,559,13,11,46.82),(561,560,1,11,47.50),(562,561,13,11,46.82),(563,562,2,33,89.70),(564,563,7,22,22.70),(565,564,4,22,98.89),(566,565,1,11,47.50),(567,566,13,11,46.82),(568,567,1,2,47.50),(569,568,1,2,47.50),(570,569,6,5,39.83),(571,570,3,2,55.30),(572,571,4,3,98.89),(573,572,5,3,44.75),(574,573,1,7,47.50),(575,574,2,4,89.70),(576,575,13,15,46.82),(577,576,6,5,39.83),(578,577,3,4,55.30),(579,578,4,3,98.89),(580,579,5,2,44.75),(581,580,1,4,47.50),(582,581,2,3,89.70),(583,582,13,15,46.82),(584,583,6,2,39.83),(585,584,3,1,55.30),(586,585,4,8,98.89),(587,586,5,4,44.75),(588,587,1,2,47.50),(589,588,2,5,89.70),(590,589,13,13,46.82),(591,590,7,2,22.70),(592,591,6,3,39.83),(593,592,13,3,46.82),(594,593,4,2,98.89),(595,594,8,10,109.70),(596,595,2,12,89.70),(597,596,5,12,44.75),(598,597,15,1,39.70),(599,598,6,1,39.83),(600,599,4,112,98.89),(601,600,4,112,98.89),(602,601,2,112,89.70),(603,602,2,112,89.70),(604,603,7,4,22.70),(605,604,4,50,98.89),(606,605,4,50,98.89),(607,606,7,30,22.70),(608,607,7,30,22.70),(609,608,2,20,89.70),(610,609,2,20,89.70),(611,610,1,20,47.50),(612,611,1,20,47.50),(613,612,13,20,46.82),(614,613,13,20,46.82);
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
  `source_type` enum('purchase','manufacturing','transfer','adjustment','sales_invoice','sales_return','purchase_return','external_job_order','issue_voucher','opening') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'adjustment',
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=614 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,10,1,'in','2026-01-01 00:00:00','','opening',NULL),(2,6,1,'in','2026-01-01 00:00:00','','opening',NULL),(3,1,1,'in','2026-01-01 00:00:00','','opening',NULL),(4,2,1,'in','2026-01-01 00:00:00','','opening',NULL),(5,3,1,'in','2026-01-01 00:00:00','','opening',NULL),(6,4,1,'in','2026-01-01 00:00:00','','opening',NULL),(7,5,1,'in','2026-01-01 00:00:00','','opening',NULL),(8,6,7,'in','2026-01-01 00:00:00','','opening',NULL),(9,1,7,'in','2026-01-01 00:00:00','','opening',NULL),(10,2,7,'in','2026-01-01 00:00:00','','opening',NULL),(11,4,7,'in','2026-01-01 00:00:00','','opening',NULL),(12,3,7,'in','2026-01-01 00:00:00','','opening',NULL),(13,10,3,'in','2026-01-01 00:00:00','','opening',NULL),(14,6,3,'in','2026-01-01 00:00:00','','opening',NULL),(15,1,3,'in','2026-01-01 00:00:00','','opening',NULL),(16,2,3,'in','2026-01-01 00:00:00','','opening',NULL),(17,4,3,'in','2026-01-01 00:00:00','','opening',NULL),(18,3,3,'in','2026-01-01 00:00:00','','opening',NULL),(19,10,2,'in','2026-01-01 00:00:00','','opening',NULL),(20,6,2,'in','2026-01-01 00:00:00','','opening',NULL),(21,1,2,'in','2026-01-01 00:00:00','','opening',NULL),(22,2,2,'in','2026-01-01 00:00:00','','opening',NULL),(23,2,2,'in','2026-01-01 00:00:00','','opening',NULL),(24,4,2,'in','2026-01-01 00:00:00','','opening',NULL),(25,3,2,'in','2026-01-01 00:00:00','','opening',NULL),(26,5,2,'in','2026-01-01 00:00:00','','opening',NULL),(27,1,6,'in','2026-01-01 00:00:00','','opening',NULL),(28,2,6,'in','2026-01-01 00:00:00','','opening',NULL),(29,4,6,'in','2026-01-01 00:00:00','','opening',NULL),(30,3,6,'in','2026-01-01 00:00:00','','opening',NULL),(31,5,6,'in','2026-01-01 00:00:00','','opening',NULL),(32,10,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(33,10,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(34,3,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(35,3,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(36,4,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(37,4,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(38,2,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(39,2,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(40,1,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(41,1,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(42,6,1,'out','2026-01-05 20:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',2),(43,6,2,'in','2026-01-05 20:42:00','تحويل من مخزن المخزن الرئيسي','transfer',2),(44,3,1,'out','2026-01-05 20:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',2),(45,3,2,'in','2026-01-05 20:42:00','تحويل من مخزن المخزن الرئيسي','transfer',2),(46,10,1,'out','2026-01-05 20:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',2),(47,10,2,'in','2026-01-05 20:42:00','تحويل من مخزن المخزن الرئيسي','transfer',2),(56,10,3,'out','2026-01-05 20:47:00','تحويل إلى مخزن الاسكندرية الفرعي','transfer',4),(57,10,7,'in','2026-01-05 20:47:00','تحويل من مخزن مخزن الاسكندريه الرئيسي','transfer',4),(58,3,2,'out','2026-01-06 00:00:00','Issue Voucher #IV-1768167823264','issue_voucher',1),(59,10,2,'out','2026-01-10 00:00:00','Issue Voucher #IV-1768169384468','issue_voucher',2),(60,6,2,'out','2026-01-10 00:00:00','Issue Voucher #IV-1768169384468','issue_voucher',3),(61,3,1,'out','2026-01-11 08:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',5),(62,3,2,'in','2026-01-11 08:31:00','تحويل من مخزن المخزن الرئيسي','transfer',5),(63,4,1,'out','2026-01-11 08:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',5),(64,4,2,'in','2026-01-11 08:31:00','تحويل من مخزن المخزن الرئيسي','transfer',5),(65,5,1,'out','2026-01-11 08:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',5),(66,5,2,'in','2026-01-11 08:31:00','تحويل من مخزن المخزن الرئيسي','transfer',5),(67,2,1,'out','2026-01-12 10:06:00','تحويل إلى مخزن التوريد الرئيسي','transfer',6),(68,2,2,'in','2026-01-12 10:06:00','تحويل من مخزن المخزن الرئيسي','transfer',6),(69,10,1,'out','2026-01-12 10:06:00','تحويل إلى مخزن التوريد الرئيسي','transfer',6),(70,10,2,'in','2026-01-12 10:06:00','تحويل من مخزن المخزن الرئيسي','transfer',6),(71,10,2,'out','2026-01-12 10:08:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',7),(72,10,3,'in','2026-01-12 10:08:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',7),(73,3,2,'out','2026-01-12 10:08:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',7),(74,3,3,'in','2026-01-12 10:08:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',7),(75,3,2,'out','2026-01-03 00:00:00','Sales Invoice #SI-2026-000001','sales_invoice',1),(76,2,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000002','sales_invoice',2),(77,5,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000003','sales_invoice',3),(78,2,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000004','sales_invoice',4),(79,10,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000004','sales_invoice',5),(80,6,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000004','sales_invoice',6),(81,6,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000005','sales_invoice',7),(82,1,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000006','sales_invoice',8),(83,2,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000007','sales_invoice',9),(84,4,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000007','sales_invoice',10),(85,6,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000007','sales_invoice',11),(86,3,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000008','sales_invoice',12),(87,4,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000008','sales_invoice',13),(88,10,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000008','sales_invoice',14),(89,1,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000009','sales_invoice',15),(90,2,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000009','sales_invoice',16),(91,10,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',17),(92,2,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',26),(93,4,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',27),(94,10,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',28),(95,6,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',18),(96,1,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',19),(97,2,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',20),(98,3,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',21),(99,5,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',22),(100,1,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000012','sales_invoice',23),(101,6,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000012','sales_invoice',24),(102,10,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000012','sales_invoice',25),(103,10,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000014','sales_invoice',29),(104,2,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000014','sales_invoice',30),(105,4,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000014','sales_invoice',31),(106,3,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000014','sales_invoice',32),(107,10,2,'out','2026-01-13 00:00:00','Sales Invoice #SI-2026-000016','sales_invoice',34),(108,2,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000017','sales_invoice',35),(109,4,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000017','sales_invoice',36),(110,3,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000018','sales_invoice',37),(111,1,2,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000019','sales_invoice',38),(112,10,2,'out','2026-01-03 00:00:00','Issue Voucher #IV-1768424120158','issue_voucher',4),(113,6,2,'out','2026-01-03 00:00:00','Issue Voucher #IV-1768424120158','issue_voucher',5),(114,1,2,'out','2026-01-03 00:00:00','Issue Voucher #IV-1768425518685','issue_voucher',6),(115,6,2,'out','2026-01-03 00:00:00','Issue Voucher #IV-1768425518685','issue_voucher',7),(116,4,2,'out','2026-01-03 00:00:00','Issue Voucher #IV-1768425518685','issue_voucher',8),(117,2,2,'out','2026-01-03 00:00:00','Issue Voucher #IV-1768425518685','issue_voucher',9),(118,6,2,'out','2026-01-05 00:00:00','Issue Voucher #IV-1768425693687','issue_voucher',10),(119,2,2,'out','2026-01-05 00:00:00','Issue Voucher #IV-1768425693687','issue_voucher',11),(120,1,2,'out','2026-01-05 00:00:00','Issue Voucher #IV-1768425693687','issue_voucher',12),(121,4,2,'out','2026-01-05 00:00:00','Issue Voucher #IV-1768425693687','issue_voucher',13),(122,2,2,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000015','sales_invoice',33),(123,1,2,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000015','sales_invoice',64),(124,3,2,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000015','sales_invoice',65),(125,1,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000028','sales_invoice',49),(126,2,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000028','sales_invoice',50),(127,1,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000025','sales_invoice',47),(128,6,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000025','sales_invoice',48),(129,2,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000029','sales_invoice',51),(130,1,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000030','sales_invoice',52),(131,2,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000030','sales_invoice',53),(132,2,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000024','sales_invoice',43),(133,4,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000024','sales_invoice',44),(134,6,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000024','sales_invoice',45),(135,10,2,'out','2026-01-11 00:00:00','Sales Invoice #SI-2026-000024','sales_invoice',46),(136,3,2,'out','2026-01-05 17:50:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(137,3,3,'in','2026-01-05 17:50:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(138,5,2,'out','2026-01-05 17:50:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(139,5,3,'in','2026-01-05 17:50:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(140,1,2,'out','2026-01-05 17:50:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(141,1,3,'in','2026-01-05 17:50:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(142,2,2,'out','2026-01-05 17:50:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(143,2,3,'in','2026-01-05 17:50:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(144,4,2,'out','2026-01-05 17:50:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(145,4,3,'in','2026-01-05 17:50:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(146,3,8,'in','2026-01-12 00:00:00','Sales Return #1 (damaged)','sales_return',1),(147,4,8,'in','2026-01-12 00:00:00','Sales Return #1 (damaged)','sales_return',2),(148,1,3,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000022','sales_invoice',41),(149,2,3,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000021','sales_invoice',39),(150,6,3,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000021','sales_invoice',40),(151,3,3,'out','2026-01-10 00:00:00','Sales Invoice #SI-2026-000023','sales_invoice',42),(152,6,3,'out','2026-01-13 00:00:00','Sales Invoice #SI-2026-000073','sales_invoice',56),(153,10,3,'out','2026-01-13 00:00:00','Sales Invoice #SI-2026-000043','sales_invoice',54),(154,10,3,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000074','sales_invoice',57),(155,1,3,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000075','sales_invoice',58),(156,2,3,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000076','sales_invoice',59),(157,5,3,'out','2026-01-14 00:00:00','Sales Invoice #SI-2026-000077','sales_invoice',60),(158,10,3,'out','2026-01-13 00:00:00','Sales Invoice #SI-2026-000078','sales_invoice',61),(159,6,3,'out','2026-01-15 00:00:00','Sales Invoice #SI-2026-000079','sales_invoice',62),(160,2,2,'out','2026-01-15 00:00:00','Sales Invoice #SI-2026-000085','sales_invoice',72),(161,10,1,'out','2026-01-17 12:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',8),(162,10,2,'in','2026-01-17 12:31:00','تحويل من مخزن المخزن الرئيسي','transfer',8),(163,1,1,'out','2026-01-17 12:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',8),(164,1,2,'in','2026-01-17 12:31:00','تحويل من مخزن المخزن الرئيسي','transfer',8),(165,2,2,'out','2026-01-15 00:00:00','Sales Invoice #SI-2026-000084','sales_invoice',70),(166,6,2,'out','2026-01-15 00:00:00','Sales Invoice #SI-2026-000084','sales_invoice',71),(167,4,8,'in','2026-01-06 00:00:00','Sales Return #2 (damaged)','sales_return',3),(168,4,2,'out','2026-01-06 00:00:00','Issue Voucher #IV-1768729202907','issue_voucher',14),(169,10,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768746746292','issue_voucher',15),(170,6,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768746746292','issue_voucher',16),(171,4,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768746746292','issue_voucher',17),(172,2,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768746746292','issue_voucher',18),(173,5,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768746746292','issue_voucher',19),(174,1,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768746746292','issue_voucher',20),(175,10,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747030859','issue_voucher',21),(176,1,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747120252','issue_voucher',22),(177,2,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747120252','issue_voucher',23),(178,3,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747120252','issue_voucher',24),(179,4,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747120252','issue_voucher',25),(180,5,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747120252','issue_voucher',26),(181,10,2,'out','2026-01-18 00:00:00','Issue Voucher #IV-1768747120252','issue_voucher',27),(182,6,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000094','sales_invoice',85),(183,10,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000097','sales_invoice',88),(184,5,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000086','sales_invoice',73),(185,6,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000087','sales_invoice',74),(186,1,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000088','sales_invoice',75),(187,10,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000089','sales_invoice',76),(188,4,2,'out','2026-01-19 00:00:00','Sales Invoice #SI-2026-000090','sales_invoice',77),(189,6,2,'out','2026-01-19 00:00:00','Sales Invoice #SI-2026-000091','sales_invoice',78),(190,1,2,'out','2026-01-19 00:00:00','Sales Invoice #SI-2026-000091','sales_invoice',79),(191,5,2,'out','2026-01-19 00:00:00','Sales Invoice #SI-2026-000091','sales_invoice',80),(192,2,2,'out','2026-01-18 08:37:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',9),(193,2,3,'in','2026-01-18 08:37:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',9),(194,1,2,'out','2026-01-18 08:37:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',9),(195,1,3,'in','2026-01-18 08:37:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',9),(196,5,2,'out','2026-01-18 08:37:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',9),(197,5,3,'in','2026-01-18 08:37:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',9),(198,2,3,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000101','sales_invoice',90),(199,3,3,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000101','sales_invoice',91),(200,10,3,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000101','sales_invoice',92),(201,5,3,'out','2026-01-19 00:00:00','Sales Invoice #SI-2026-000102','sales_invoice',93),(202,1,7,'out','2026-01-16 00:00:00','Sales Invoice #SI-2026-000103','sales_invoice',94),(203,3,2,'out','2026-01-20 00:00:00','Issue Voucher #IV-1768909730579','issue_voucher',28),(204,6,2,'out','2026-01-20 00:00:00','Issue Voucher #IV-1768909730579','issue_voucher',29),(205,4,2,'out','2026-01-20 00:00:00','Issue Voucher #IV-1768909730579','issue_voucher',30),(206,10,2,'out','2026-01-19 00:00:00','Issue Voucher #IV-1768913971741','issue_voucher',31),(207,10,2,'out','2026-01-19 00:00:00','Issue Voucher #IV-1768914183112','issue_voucher',32),(208,10,2,'out','2026-01-19 00:00:00','Issue Voucher #IV-1768914301890','issue_voucher',33),(209,6,2,'out','2026-01-19 00:00:00','Issue Voucher #IV-1768914301890','issue_voucher',34),(210,10,2,'out','2026-01-19 00:00:00','Issue Voucher #IV-1768914483501','issue_voucher',35),(211,5,1,'out','2026-01-20 13:09:00','تحويل إلى مخزن التوريد الرئيسي','transfer',10),(212,5,2,'in','2026-01-20 13:09:00','تحويل من مخزن المخزن الرئيسي','transfer',10),(213,6,1,'out','2026-01-20 13:09:00','تحويل إلى مخزن التوريد الرئيسي','transfer',10),(214,6,2,'in','2026-01-20 13:09:00','تحويل من مخزن المخزن الرئيسي','transfer',10),(215,10,1,'out','2026-01-20 13:09:00','تحويل إلى مخزن التوريد الرئيسي','transfer',10),(216,10,2,'in','2026-01-20 13:09:00','تحويل من مخزن المخزن الرئيسي','transfer',10),(217,1,1,'out','2026-01-20 13:09:00','تحويل إلى مخزن التوريد الرئيسي','transfer',10),(218,1,2,'in','2026-01-20 13:09:00','تحويل من مخزن المخزن الرئيسي','transfer',10),(219,2,1,'out','2026-01-20 13:09:00','تحويل إلى مخزن التوريد الرئيسي','transfer',10),(220,2,2,'in','2026-01-20 13:09:00','تحويل من مخزن المخزن الرئيسي','transfer',10),(221,10,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000098','sales_invoice',89),(222,2,2,'out','2026-01-17 00:00:00','Sales Invoice #SI-2026-000083','sales_invoice',66),(223,3,2,'out','2026-01-17 00:00:00','Sales Invoice #SI-2026-000083','sales_invoice',67),(224,10,2,'out','2026-01-17 00:00:00','Sales Invoice #SI-2026-000083','sales_invoice',68),(225,6,2,'out','2026-01-17 00:00:00','Sales Invoice #SI-2026-000083','sales_invoice',69),(226,2,3,'out','2026-01-13 00:00:00','Sales Invoice #SI-2026-000080','sales_invoice',63),(227,12,4,'in','2026-01-01 00:00:00','','opening',NULL),(228,13,4,'in','2026-01-01 00:00:00','','opening',NULL),(229,12,4,'out','2026-01-20 21:00:00','تحويل إلى مخزن تحت التشغيل لدى الغير','transfer',11),(230,12,5,'in','2026-01-20 21:00:00','تحويل من مخزن مخزن مستلزمات الانتاج','transfer',11),(231,13,4,'out','2026-01-20 21:00:00','تحويل إلى مخزن تحت التشغيل لدى الغير','transfer',11),(232,13,5,'in','2026-01-20 21:00:00','تحويل من مخزن مخزن مستلزمات الانتاج','transfer',11),(233,1,2,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000106','sales_invoice',97),(234,5,2,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000108','sales_invoice',99),(235,10,2,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000109','sales_invoice',100),(236,1,2,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000107','sales_invoice',98),(237,2,2,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000105','sales_invoice',96),(238,2,2,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000104','sales_invoice',95),(239,1,2,'out','2026-01-21 00:00:00','Issue Voucher #IV-1769249544576','issue_voucher',36),(240,5,2,'out','2026-01-21 00:00:00','Issue Voucher #IV-1769249544576','issue_voucher',37),(241,10,2,'out','2026-01-21 00:00:00','Issue Voucher #IV-1769249544576','issue_voucher',38),(242,6,2,'out','2026-01-21 00:00:00','Issue Voucher #IV-1769249544576','issue_voucher',39),(243,6,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000093','sales_invoice',83),(244,10,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000093','sales_invoice',84),(245,6,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000092','sales_invoice',81),(246,4,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000092','sales_invoice',82),(247,6,2,'out','2026-01-24 00:00:00','Issue Voucher #IV-1769265282547','issue_voucher',40),(248,1,3,'in','2026-01-25 00:00:00','Sales Return #3 (good)','sales_return',4),(249,2,3,'out','2026-01-21 00:00:00','Sales Invoice #SI-2026-000113','sales_invoice',104),(250,1,3,'out','2026-01-24 00:00:00','Sales Invoice #SI-2026-000114','sales_invoice',105),(251,1,3,'out','2026-01-21 19:39:00','تحويل إلى مخزن الاسكندرية الفرعي','transfer',12),(252,1,7,'in','2026-01-21 19:39:00','تحويل من مخزن مخزن الاسكندريه الرئيسي','transfer',12),(253,5,3,'out','2026-01-21 19:39:00','تحويل إلى مخزن الاسكندرية الفرعي','transfer',12),(254,5,7,'in','2026-01-21 19:39:00','تحويل من مخزن مخزن الاسكندريه الرئيسي','transfer',12),(255,6,2,'out','2026-01-25 00:00:00','Sales Invoice #SI-2026-000112','sales_invoice',103),(256,2,2,'out','2026-01-25 00:00:00','Sales Invoice #SI-2026-000111','sales_invoice',102),(257,6,2,'out','2026-01-25 00:00:00','Sales Invoice #SI-2026-000110','sales_invoice',101),(258,2,2,'out','2026-01-26 00:00:00','Sales Invoice #SI-2026-000115','sales_invoice',106),(259,5,2,'out','2026-01-26 00:00:00','Sales Invoice #SI-2026-000115','sales_invoice',107),(260,4,2,'out','2026-01-26 00:00:00','Sales Invoice #SI-2026-000115','sales_invoice',108),(261,3,2,'out','2026-01-26 00:00:00','Sales Invoice #SI-2026-000115','sales_invoice',109),(262,2,3,'out','2026-01-26 00:00:00','Sales Invoice #SI-2026-000116','sales_invoice',110),(263,10,3,'out','2026-01-26 00:00:00','Sales Invoice #SI-2026-000072','sales_invoice',55),(264,1,3,'in','2026-01-27 00:00:00','Sales Return #4 (good)','sales_return',5),(265,4,3,'in','2026-01-27 00:00:00','Sales Return #4 (good)','sales_return',6),(266,5,3,'in','2026-01-27 00:00:00','Sales Return #4 (good)','sales_return',7),(267,10,2,'out','2026-01-24 00:00:00','Sales Invoice #SI-2026-000122','sales_invoice',124),(268,6,2,'out','2026-01-24 00:00:00','Sales Invoice #SI-2026-000122','sales_invoice',125),(269,2,2,'out','2026-01-24 00:00:00','Sales Invoice #SI-2026-000122','sales_invoice',126),(270,3,2,'out','2026-01-24 00:00:00','Sales Invoice #SI-2026-000122','sales_invoice',127),(271,6,2,'out','2026-01-28 00:00:00','Sales Invoice #SI-2026-000123','sales_invoice',128),(272,6,2,'out','2026-01-18 00:00:00','Sales Invoice #SI-2026-000096','sales_invoice',87),(273,6,2,'out','2026-01-28 00:00:00','Sales Invoice #SI-2026-000119','sales_invoice',115),(274,4,2,'out','2026-01-28 00:00:00','Sales Invoice #SI-2026-000117','sales_invoice',111),(275,5,2,'out','2026-01-28 00:00:00','Sales Invoice #SI-2026-000117','sales_invoice',112),(276,2,2,'out','2026-01-28 00:00:00','Sales Invoice #SI-2026-000117','sales_invoice',113),(277,10,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728359692','issue_voucher',41),(278,6,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728471767','issue_voucher',42),(279,10,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728471767','issue_voucher',43),(280,2,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728471767','issue_voucher',44),(281,10,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728568859','issue_voucher',45),(282,6,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728568859','issue_voucher',46),(283,4,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728568859','issue_voucher',47),(284,2,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728660902','issue_voucher',48),(285,4,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728660902','issue_voucher',49),(286,10,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728660902','issue_voucher',50),(287,3,2,'out','2026-01-27 00:00:00','Issue Voucher #IV-1769728660902','issue_voucher',51),(288,1,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(289,1,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(290,2,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(291,2,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(292,3,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(293,3,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(294,4,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(295,4,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(296,5,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(297,5,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(298,6,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(299,6,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(300,10,2,'out','2026-01-27 23:21:00','تحويل إلى مخزن دمياط','transfer',13),(301,10,6,'in','2026-01-27 23:21:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',13),(302,2,2,'out','2026-01-28 00:00:00','Sales Invoice #SI-2026-000118','sales_invoice',114),(303,6,2,'out','2026-01-31 00:00:00','Sales Invoice #SI-2026-000127','sales_invoice',132),(304,4,2,'out','2026-01-31 00:00:00','Sales Invoice #SI-2026-000126','sales_invoice',131),(305,2,2,'out','2026-01-31 00:00:00','Sales Invoice #SI-2026-000125','sales_invoice',130),(306,5,1,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000124','sales_invoice',129),(307,5,1,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000120','sales_invoice',116),(308,6,1,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000120','sales_invoice',117),(309,10,1,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000120','sales_invoice',118),(310,2,3,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000121','sales_invoice',119),(311,5,3,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000121','sales_invoice',120),(312,3,3,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000121','sales_invoice',121),(313,4,3,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000121','sales_invoice',122),(314,6,3,'out','2026-01-29 00:00:00','Sales Invoice #SI-2026-000121','sales_invoice',123),(315,6,2,'out','2026-01-30 00:00:00','Issue Voucher #IV-1769942181529','issue_voucher',52),(316,10,2,'out','2026-01-30 00:00:00','Issue Voucher #IV-1769942181529','issue_voucher',53),(317,6,3,'out','2026-01-25 12:17:00','تحويل إلى مخزن الاسكندرية الفرعي','transfer',14),(318,6,7,'in','2026-01-25 12:17:00','تحويل من مخزن مخزن الاسكندريه الرئيسي','transfer',14),(319,10,3,'out','2026-01-25 12:17:00','تحويل إلى مخزن الاسكندرية الفرعي','transfer',14),(320,10,7,'in','2026-01-25 12:17:00','تحويل من مخزن مخزن الاسكندريه الرئيسي','transfer',14),(321,13,5,'out','2026-02-01 12:31:46',NULL,'external_job_order',1),(322,12,5,'out','2026-02-01 12:31:46',NULL,'external_job_order',1),(323,4,3,'in','2026-01-25 00:00:00','Sales Return #5 (good)','sales_return',8),(324,6,2,'out','2026-02-01 00:00:00','Issue Voucher #IV-1769961846437','issue_voucher',54),(325,5,2,'out','2026-02-01 00:00:00','Issue Voucher #IV-1769961846437','issue_voucher',55),(326,3,2,'out','2026-02-01 00:00:00','Issue Voucher #IV-1769961846437','issue_voucher',56),(327,6,1,'out','2026-02-02 15:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',15),(328,6,2,'in','2026-02-02 15:42:00','تحويل من مخزن المخزن الرئيسي','transfer',15),(329,3,1,'out','2026-02-02 15:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',15),(330,3,2,'in','2026-02-02 15:42:00','تحويل من مخزن المخزن الرئيسي','transfer',15),(331,4,1,'out','2026-02-02 15:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',15),(332,4,2,'in','2026-02-02 15:42:00','تحويل من مخزن المخزن الرئيسي','transfer',15),(333,5,1,'out','2026-02-02 15:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',15),(334,5,2,'in','2026-02-02 15:42:00','تحويل من مخزن المخزن الرئيسي','transfer',15),(335,6,2,'out','2026-02-02 15:44:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',16),(336,6,3,'in','2026-02-02 15:44:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',16),(337,5,2,'out','2026-02-02 15:44:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',16),(338,5,3,'in','2026-02-02 15:44:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',16),(339,10,2,'out','2026-02-02 15:44:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',16),(340,10,3,'in','2026-02-02 15:44:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',16),(341,5,9,'in','2026-01-21 00:00:00','Sales Return #6 (good)','sales_return',9),(342,5,2,'out','2026-02-01 00:00:00','Sales Invoice #SI-2026-000129','sales_invoice',136),(343,4,2,'out','2026-02-01 00:00:00','Sales Invoice #SI-2026-000129','sales_invoice',137),(344,10,7,'out','2026-01-20 00:00:00','Sales Invoice #SI-2026-000133','sales_invoice',146),(345,10,7,'out','2026-01-31 00:00:00','Issue Voucher #IV-1770119364434','issue_voucher',57),(346,3,7,'out','2026-01-31 00:00:00','Issue Voucher #IV-1770119364434','issue_voucher',58),(347,6,7,'out','2026-01-31 00:00:00','Issue Voucher #IV-1770119364434','issue_voucher',59),(348,1,7,'out','2026-01-31 00:00:00','Issue Voucher #IV-1770119364434','issue_voucher',60),(349,3,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000130','sales_invoice',138),(350,1,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000131','sales_invoice',139),(351,6,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000131','sales_invoice',140),(352,10,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000131','sales_invoice',141),(353,3,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000131','sales_invoice',142),(354,2,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000131','sales_invoice',143),(355,5,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000131','sales_invoice',144),(356,4,2,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000132','sales_invoice',145),(357,1,3,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000135','sales_invoice',150),(358,1,3,'in','2026-02-04 00:00:00','Sales Return #7 (good)','sales_return',10),(359,2,2,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000139','sales_invoice',156),(360,2,2,'out','2026-02-04 00:00:00','Sales Invoice #SI-2026-000138','sales_invoice',153),(361,3,2,'out','2026-02-04 00:00:00','Sales Invoice #SI-2026-000138','sales_invoice',154),(362,5,2,'out','2026-02-04 00:00:00','Sales Invoice #SI-2026-000138','sales_invoice',155),(363,2,2,'out','2026-02-04 00:00:00','Sales Invoice #SI-2026-000137','sales_invoice',152),(364,1,2,'out','2026-02-04 00:00:00','Sales Invoice #SI-2026-000136','sales_invoice',151),(365,4,6,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000140','sales_invoice',157),(366,1,6,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000140','sales_invoice',158),(367,6,6,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000140','sales_invoice',159),(368,10,6,'out','2026-02-02 00:00:00','Sales Invoice #SI-2026-000140','sales_invoice',160),(369,5,6,'out','2026-02-02 00:00:00','Issue Voucher #IV-1770219152799','issue_voucher',61),(370,3,6,'out','2026-02-02 00:00:00','Issue Voucher #IV-1770219152799','issue_voucher',62),(371,4,6,'out','2026-02-02 00:00:00','Issue Voucher #IV-1770219152799','issue_voucher',63),(372,10,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770221237530','issue_voucher',64),(373,6,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770221237530','issue_voucher',65),(374,1,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770221237530','issue_voucher',66),(375,4,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770221237530','issue_voucher',67),(376,3,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770453322952','issue_voucher',68),(377,4,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770453322952','issue_voucher',69),(378,6,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770453322952','issue_voucher',70),(379,10,2,'out','2026-02-04 00:00:00','Issue Voucher #IV-1770453322952','issue_voucher',71),(380,5,9,'out','2026-02-05 08:57:00','تحويل إلى مخزن التوريد الرئيسي','transfer',17),(381,5,2,'in','2026-02-05 08:57:00','تحويل من مخزن مخزن near expire','transfer',17),(382,3,2,'out','2026-02-05 00:00:00','Issue Voucher #IV-1770457827913','issue_voucher',72),(383,4,2,'out','2026-02-05 00:00:00','Issue Voucher #IV-1770457827913','issue_voucher',73),(384,6,2,'out','2026-02-05 00:00:00','Issue Voucher #IV-1770457827913','issue_voucher',74),(385,10,2,'out','2026-02-05 00:00:00','Issue Voucher #IV-1770457827913','issue_voucher',75),(386,1,2,'out','2026-02-05 00:00:00','Sales Invoice #SI-2026-000141','sales_invoice',161),(387,3,2,'out','2026-02-05 00:00:00','Sales Invoice #SI-2026-000142','sales_invoice',162),(388,2,2,'out','2026-02-05 00:00:00','Sales Invoice #SI-2026-000143','sales_invoice',163),(389,5,2,'out','2026-02-05 00:00:00','Sales Invoice #SI-2026-000143','sales_invoice',164),(390,4,2,'out','2026-02-07 00:00:00','Sales Invoice #SI-2026-000144','sales_invoice',165),(391,1,2,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000147','sales_invoice',170),(392,6,2,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000147','sales_invoice',171),(393,3,2,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000147','sales_invoice',172),(394,5,2,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000134','sales_invoice',147),(395,6,2,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000134','sales_invoice',148),(396,4,2,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000134','sales_invoice',149),(397,2,1,'out','2026-02-09 09:15:00','تحويل إلى مخزن التوريد الرئيسي','transfer',18),(398,2,2,'in','2026-02-09 09:15:00','تحويل من مخزن المخزن الرئيسي','transfer',18),(399,2,3,'out','2026-02-03 00:00:00','Issue Voucher #IV-1770715248362','issue_voucher',76),(400,5,3,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000149','sales_invoice',174),(401,3,3,'out','2026-02-03 00:00:00','Sales Invoice #SI-2026-000150','sales_invoice',175),(402,5,3,'out','2026-02-07 00:00:00','Sales Invoice #SI-2026-000151','sales_invoice',176),(403,5,3,'out','2026-02-07 00:00:00','Sales Invoice #SI-2026-000152','sales_invoice',177),(404,2,1,'out','2026-02-10 10:13:00','تحويل إلى مخزن التوريد الرئيسي','transfer',19),(405,2,2,'in','2026-02-10 10:13:00','تحويل من مخزن المخزن الرئيسي','transfer',19),(406,10,1,'out','2026-02-10 10:13:00','تحويل إلى مخزن التوريد الرئيسي','transfer',19),(407,10,2,'in','2026-02-10 10:13:00','تحويل من مخزن المخزن الرئيسي','transfer',19),(408,6,1,'out','2026-02-10 10:13:00','تحويل إلى مخزن التوريد الرئيسي','transfer',19),(409,6,2,'in','2026-02-10 10:13:00','تحويل من مخزن المخزن الرئيسي','transfer',19),(410,1,1,'out','2026-02-10 10:13:00','تحويل إلى مخزن التوريد الرئيسي','transfer',19),(411,1,2,'in','2026-02-10 10:13:00','تحويل من مخزن المخزن الرئيسي','transfer',19),(412,1,2,'out','2026-02-10 00:00:00','Sales Invoice #SI-2026-000154','sales_invoice',181),(413,3,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000155','sales_invoice',182),(414,1,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000155','sales_invoice',183),(415,2,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000155','sales_invoice',184),(416,3,1,'out','2026-02-11 08:27:00','تحويل إلى مخزن التوريد الرئيسي','transfer',20),(417,3,2,'in','2026-02-11 08:27:00','تحويل من مخزن المخزن الرئيسي','transfer',20),(418,1,2,'out','2026-02-10 00:00:00','Sales Invoice #SI-2026-000153','sales_invoice',178),(419,10,2,'out','2026-02-10 00:00:00','Sales Invoice #SI-2026-000153','sales_invoice',179),(420,6,2,'out','2026-02-10 00:00:00','Sales Invoice #SI-2026-000153','sales_invoice',180),(421,1,6,'out','2026-02-07 00:00:00','Sales Invoice #SI-2026-000156','sales_invoice',185),(422,4,6,'out','2026-02-07 00:00:00','Sales Invoice #SI-2026-000156','sales_invoice',186),(423,4,6,'out','2026-02-10 00:00:00','Sales Invoice #SI-2026-000157','sales_invoice',187),(424,1,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',188),(425,2,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',189),(426,3,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',190),(427,4,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',191),(428,5,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',192),(429,6,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',193),(430,10,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000158','sales_invoice',194),(431,4,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000159','sales_invoice',195),(432,6,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000159','sales_invoice',196),(433,5,2,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000146','sales_invoice',167),(434,3,2,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000146','sales_invoice',168),(435,2,2,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000146','sales_invoice',169),(436,5,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000160','sales_invoice',197),(437,3,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000160','sales_invoice',198),(438,2,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000160','sales_invoice',199),(439,6,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000161','sales_invoice',200),(440,4,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000161','sales_invoice',201),(441,3,2,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000162','sales_invoice',202),(442,1,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(443,1,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(444,2,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(445,2,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(446,3,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(447,3,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(448,4,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(449,4,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(450,5,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(451,5,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(452,6,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(453,6,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(454,10,2,'out','2026-02-11 00:33:00','تحويل إلى مخزن البحيره','transfer',21),(455,10,10,'in','2026-02-11 00:33:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',21),(456,5,2,'out','2026-02-11 00:00:00','Issue Voucher #IV-1770856648499','issue_voucher',77),(457,10,2,'out','2026-02-11 00:00:00','Issue Voucher #IV-1770856782921','issue_voucher',78),(458,10,2,'out','2026-02-11 00:00:00','Issue Voucher #IV-1770856849466','issue_voucher',79),(459,6,2,'out','2026-02-11 00:00:00','Issue Voucher #IV-1770856998614','issue_voucher',80),(460,2,2,'out','2026-02-09 00:00:00','Sales Invoice #SI-2026-000148','sales_invoice',173),(461,1,2,'out','2026-02-07 00:00:00','Sales Invoice #SI-2026-000145','sales_invoice',166),(462,10,3,'out','2026-02-08 00:00:00','Sales Invoice #SI-2026-000163','sales_invoice',203),(463,10,3,'out','2026-02-11 00:00:00','Sales Invoice #SI-2026-000164','sales_invoice',204),(464,2,3,'out','2026-02-04 00:00:00','Sales Invoice #SI-2026-000165','sales_invoice',205),(465,3,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000167','sales_invoice',208),(466,6,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000168','sales_invoice',209),(467,1,3,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000171','sales_invoice',215),(468,2,3,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000171','sales_invoice',216),(469,5,3,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000171','sales_invoice',217),(470,6,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000166','sales_invoice',206),(471,10,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000166','sales_invoice',207),(472,15,5,'in','2026-02-16 09:09:07',NULL,'external_job_order',1),(473,15,5,'out','2026-02-16 09:16:00','تحويل إلى المخزن الرئيسي','transfer',22),(474,15,1,'in','2026-02-16 09:16:00','تحويل من مخزن مخزن تحت التشغيل لدى الغير','transfer',22),(475,15,1,'out','2026-02-16 09:19:00','تحويل إلى مخزن التوريد الرئيسي','transfer',23),(476,15,2,'in','2026-02-16 09:19:00','تحويل من مخزن المخزن الرئيسي','transfer',23),(477,4,1,'out','2026-02-16 09:19:00','تحويل إلى مخزن التوريد الرئيسي','transfer',23),(478,4,2,'in','2026-02-16 09:19:00','تحويل من مخزن المخزن الرئيسي','transfer',23),(479,3,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000177','sales_invoice',230),(480,4,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000177','sales_invoice',231),(481,2,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000177','sales_invoice',232),(482,15,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000177','sales_invoice',233),(483,5,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000179','sales_invoice',235),(484,1,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000179','sales_invoice',236),(485,2,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000179','sales_invoice',237),(486,4,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000179','sales_invoice',238),(487,6,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000179','sales_invoice',239),(488,6,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000178','sales_invoice',234),(489,15,1,'out','2026-02-16 09:45:00','تحويل إلى مخزن التوريد الرئيسي','transfer',24),(490,15,2,'in','2026-02-16 09:45:00','تحويل من مخزن المخزن الرئيسي','transfer',24),(491,1,2,'in','2026-02-16 00:00:00','Sales Return #8 (good)','sales_return',11),(492,5,2,'in','2026-02-16 00:00:00','Sales Return #8 (good)','sales_return',12),(493,3,2,'in','2026-02-16 00:00:00','Sales Return #8 (good)','sales_return',13),(494,2,2,'in','2026-02-16 00:00:00','Sales Return #8 (good)','sales_return',14),(495,4,2,'in','2026-02-16 00:00:00','Sales Return #8 (good)','sales_return',15),(496,2,1,'out','2026-02-10 10:20:00','تحويل إلى مخزن التوريد الرئيسي','transfer',25),(497,2,2,'in','2026-02-10 10:20:00','تحويل من مخزن المخزن الرئيسي','transfer',25),(498,6,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000176','sales_invoice',229),(499,3,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000180','sales_invoice',240),(500,4,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000180','sales_invoice',241),(501,5,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000180','sales_invoice',242),(502,15,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000180','sales_invoice',243),(503,1,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',222),(504,2,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',223),(505,3,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',224),(506,4,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',225),(507,5,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',226),(508,6,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',227),(509,10,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000174','sales_invoice',228),(510,6,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000173','sales_invoice',221),(511,1,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000172','sales_invoice',218),(512,2,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000172','sales_invoice',219),(513,6,2,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000172','sales_invoice',220),(514,1,3,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000170','sales_invoice',214),(515,1,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000169','sales_invoice',210),(516,2,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000169','sales_invoice',211),(517,3,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000169','sales_invoice',212),(518,10,2,'out','2026-02-14 00:00:00','Sales Invoice #SI-2026-000169','sales_invoice',213),(519,15,2,'out','2026-02-16 11:14:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',26),(520,15,3,'in','2026-02-16 11:14:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',26),(521,2,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(522,2,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(523,1,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(524,1,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(525,4,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(526,4,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(527,10,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(528,10,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(529,3,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(530,3,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(531,5,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(532,5,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(533,6,2,'out','2026-02-16 11:22:00','تحويل إلى مخزن البحيره','transfer',27),(534,6,10,'in','2026-02-16 11:22:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',27),(535,15,2,'out','2026-02-16 11:24:00','تحويل إلى مخزن البحيره','transfer',28),(536,15,10,'in','2026-02-16 11:24:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',28),(537,15,1,'out','2026-02-17 12:07:00','تحويل إلى مخزن التوريد الرئيسي','transfer',29),(538,15,2,'in','2026-02-17 12:07:00','تحويل من مخزن المخزن الرئيسي','transfer',29),(539,1,1,'out','2026-02-17 12:07:00','تحويل إلى مخزن التوريد الرئيسي','transfer',29),(540,1,2,'in','2026-02-17 12:07:00','تحويل من مخزن المخزن الرئيسي','transfer',29),(541,10,1,'out','2026-02-17 12:07:00','تحويل إلى مخزن التوريد الرئيسي','transfer',29),(542,10,2,'in','2026-02-17 12:07:00','تحويل من مخزن المخزن الرئيسي','transfer',29),(543,15,2,'out','2026-02-16 00:00:00','Issue Voucher #IV-1771406026687','issue_voucher',81),(544,15,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000183','sales_invoice',249),(545,15,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000182','sales_invoice',248),(546,2,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000187','sales_invoice',253),(547,5,2,'out','2026-02-16 00:00:00','Sales Invoice #SI-2026-000186','sales_invoice',252),(548,5,1,'out','2026-02-18 10:49:00','تحويل إلى مخزن التوريد الرئيسي','transfer',30),(549,5,2,'in','2026-02-18 10:49:00','تحويل من مخزن المخزن الرئيسي','transfer',30),(550,3,1,'out','2026-02-18 10:49:00','تحويل إلى مخزن التوريد الرئيسي','transfer',31),(551,3,2,'in','2026-02-18 10:49:00','تحويل من مخزن المخزن الرئيسي','transfer',31),(552,3,8,'in','2026-02-16 00:00:00','Sales Return #9 (damaged)','sales_return',16),(553,1,9,'in','2026-02-17 00:00:00','Sales Return #10 (good)','sales_return',17),(554,1,3,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000190','sales_invoice',262),(555,5,3,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000190','sales_invoice',263),(556,6,3,'out','2026-02-15 00:00:00','Sales Invoice #SI-2026-000190','sales_invoice',264),(557,6,3,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000185','sales_invoice',251),(558,2,2,'out','2026-02-18 00:00:00','Issue Voucher #IV-1771524763231','issue_voucher',82),(559,15,2,'out','2026-02-18 00:00:00','Sales Invoice #SI-2026-000188','sales_invoice',254),(560,10,2,'out','2026-02-18 00:00:00','Sales Invoice #SI-2026-000188','sales_invoice',255),(561,15,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000184','sales_invoice',250),(562,6,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000181','sales_invoice',244),(563,5,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000181','sales_invoice',245),(564,2,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000181','sales_invoice',246),(565,10,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000181','sales_invoice',247),(566,15,2,'out','2026-02-17 00:00:00','Sales Invoice #SI-2026-000191','sales_invoice',265),(567,10,2,'out','2026-02-01 18:31:00','تحويل إلى مخزن دمياط','transfer',32),(568,10,6,'in','2026-02-01 18:31:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',32),(569,4,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',83),(570,1,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',84),(571,2,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',85),(572,3,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',86),(573,10,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',87),(574,6,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',88),(575,15,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771590881567','issue_voucher',89),(576,4,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',90),(577,1,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',91),(578,2,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',92),(579,3,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',93),(580,10,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',94),(581,6,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',95),(582,15,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771591474148','issue_voucher',96),(583,4,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',97),(584,1,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',98),(585,2,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',99),(586,3,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',100),(587,10,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',101),(588,6,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',102),(589,15,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',103),(590,5,2,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771592042469','issue_voucher',104),(591,4,2,'out','2026-02-17 00:00:00','Issue Voucher #IV-1771592893732','issue_voucher',105),(592,15,2,'out','2026-02-17 00:00:00','Issue Voucher #IV-1771592968533','issue_voucher',106),(593,2,3,'out','2026-02-19 00:00:00','Sales Invoice #SI-2026-000193','sales_invoice',270),(594,2,3,'out','2026-02-19 00:00:00','Sales Invoice #SI-2026-000193','sales_invoice',270),(595,6,3,'out','2026-02-19 00:00:00','Sales Invoice #SI-2026-000194','sales_invoice',271),(596,3,3,'out','2026-02-19 00:00:00','Sales Invoice #SI-2026-000195','sales_invoice',272),(597,16,3,'in','2026-02-15 00:00:00','Sales Return #11 (good)','sales_return',18),(598,4,3,'out','2026-02-15 00:00:00','Issue Voucher #IV-1771662959978','issue_voucher',107),(599,2,1,'out','2026-02-21 11:57:00','تحويل إلى مخزن التوريد الرئيسي','transfer',33),(600,2,2,'in','2026-02-21 11:57:00','تحويل من مخزن المخزن الرئيسي','transfer',33),(601,6,1,'out','2026-02-21 11:57:00','تحويل إلى مخزن التوريد الرئيسي','transfer',33),(602,6,2,'in','2026-02-21 11:57:00','تحويل من مخزن المخزن الرئيسي','transfer',33),(603,5,3,'out','2026-02-18 00:00:00','Sales Invoice #SI-2026-000201','sales_invoice',279),(604,2,2,'out','2026-02-21 12:55:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',34),(605,2,3,'in','2026-02-21 12:55:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',34),(606,5,2,'out','2026-02-21 12:55:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',34),(607,5,3,'in','2026-02-21 12:55:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',34),(608,6,2,'out','2026-02-21 12:55:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',34),(609,6,3,'in','2026-02-21 12:55:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',34),(610,10,2,'out','2026-02-21 13:01:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',35),(611,10,3,'in','2026-02-21 13:01:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',35),(612,15,2,'out','2026-02-21 13:01:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',35),(613,15,3,'in','2026-02-21 13:01:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',35);
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
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_items`
--

LOCK TABLES `issue_voucher_items` WRITE;
/*!40000 ALTER TABLE `issue_voucher_items` DISABLE KEYS */;
INSERT INTO `issue_voucher_items` VALUES (1,1,3,'001','2028-10-01',10.000,44.75,'','2026-01-11 21:45:15','2026-01-11 21:45:15'),(2,2,10,'001','2028-12-01',10.000,47.50,'','2026-01-11 22:11:11','2026-01-11 22:11:11'),(3,2,6,'002','2028-11-01',3.000,89.70,'','2026-01-11 22:11:11','2026-01-11 22:11:11'),(4,3,10,'001','2028-12-01',18.000,47.50,'','2026-01-14 20:56:10','2026-01-14 20:56:10'),(5,3,6,'002','2028-11-01',2.000,89.70,'','2026-01-14 20:56:10','2026-01-14 20:56:10'),(6,4,1,'001','2028-08-01',2.000,55.30,'','2026-01-14 21:21:30','2026-01-14 21:21:30'),(7,4,6,'002','2028-11-01',2.000,89.70,'','2026-01-14 21:21:30','2026-01-14 21:21:30'),(8,4,4,'001','2028-01-01',2.000,39.83,'','2026-01-14 21:21:30','2026-01-14 21:21:30'),(9,4,2,'006','2028-12-01',1.000,98.89,'','2026-01-14 21:21:30','2026-01-14 21:21:30'),(10,5,6,'002','2028-11-01',3.000,89.70,'','2026-01-14 21:25:42','2026-01-14 21:25:42'),(11,5,2,'006','2028-12-01',2.000,98.89,'','2026-01-14 21:25:42','2026-01-14 21:25:42'),(12,5,1,'001','2028-08-01',1.000,55.30,'','2026-01-14 21:25:42','2026-01-14 21:25:42'),(13,5,4,'001','2028-01-01',1.000,39.83,'','2026-01-14 21:25:42','2026-01-14 21:25:42'),(14,6,4,'001','2028-01-01',2.000,39.83,'','2026-01-18 09:40:52','2026-01-18 09:40:52'),(15,7,10,'001','2028-12-01',13.000,47.50,'','2026-01-18 14:34:57','2026-01-18 14:34:57'),(16,7,6,'002','2028-11-01',4.000,89.70,'','2026-01-18 14:34:57','2026-01-18 14:34:57'),(17,7,4,'001','2028-01-01',1.000,39.83,'','2026-01-18 14:34:57','2026-01-18 14:34:57'),(18,7,2,'003','2028-06-01',1.000,109.70,'','2026-01-18 14:34:57','2026-01-18 14:34:57'),(19,7,5,'001','2027-07-01',2.000,22.70,'','2026-01-18 14:34:57','2026-01-18 14:34:57'),(20,7,1,'001','2028-08-01',1.000,55.30,'','2026-01-18 14:34:57','2026-01-18 14:34:57'),(21,8,10,'001','2028-12-01',10.000,47.50,'','2026-01-18 14:38:35','2026-01-18 14:38:35'),(22,9,1,'001','2028-08-01',1.000,55.30,'','2026-01-18 14:40:48','2026-01-18 14:40:48'),(23,9,2,'006','2028-12-01',1.000,98.89,'','2026-01-18 14:40:48','2026-01-18 14:40:48'),(24,9,3,'001','2028-10-01',1.000,44.75,'','2026-01-18 14:40:48','2026-01-18 14:40:48'),(25,9,4,'001','2028-01-01',1.000,39.83,'','2026-01-18 14:40:48','2026-01-18 14:40:48'),(26,9,5,'001','2027-07-01',1.000,22.70,'','2026-01-18 14:40:48','2026-01-18 14:40:48'),(27,9,10,'001','2028-12-01',1.000,47.50,'','2026-01-18 14:40:48','2026-01-18 14:40:48'),(28,10,3,'001','2028-10-01',1.000,44.75,'','2026-01-20 11:50:50','2026-01-20 11:50:50'),(29,10,6,'002','2028-11-01',1.000,89.70,'','2026-01-20 11:50:50','2026-01-20 11:50:50'),(30,10,4,'001','2028-01-01',1.000,39.83,'','2026-01-20 11:50:50','2026-01-20 11:50:50'),(31,11,10,'001','2028-12-01',1.000,47.50,'','2026-01-20 13:01:18','2026-01-20 13:01:18'),(32,12,10,'001','2028-12-01',1.000,47.50,'','2026-01-20 13:04:02','2026-01-20 13:04:02'),(33,13,10,'001','2028-12-01',1.000,47.50,'','2026-01-20 13:06:03','2026-01-20 13:06:03'),(34,13,6,'002','2028-11-01',1.000,89.70,'','2026-01-20 13:06:03','2026-01-20 13:06:03'),(35,14,10,'001','2028-12-01',1.000,47.50,'','2026-01-20 13:08:46','2026-01-20 13:08:46'),(36,15,1,'001','2028-08-01',1.000,55.30,'','2026-01-24 10:14:05','2026-01-24 10:14:05'),(37,15,5,'001','2027-07-01',1.000,22.70,'','2026-01-24 10:14:05','2026-01-24 10:14:05'),(38,15,10,'001','2028-12-01',1.000,47.50,'','2026-01-24 10:14:05','2026-01-24 10:14:05'),(39,15,6,'002','2028-11-01',1.000,89.70,'','2026-01-24 10:14:05','2026-01-24 10:14:05'),(40,16,6,'002','2028-11-01',1.000,89.70,'','2026-01-24 14:35:26','2026-01-24 14:35:26'),(41,17,10,'001','2028-12-01',1.000,47.50,'','2026-01-29 23:14:15','2026-01-29 23:14:15'),(42,18,6,'002','2028-11-01',5.000,89.70,'','2026-01-29 23:16:06','2026-01-29 23:16:06'),(43,18,10,'001','2028-12-01',3.000,47.50,'','2026-01-29 23:16:06','2026-01-29 23:16:06'),(44,18,2,'006','2028-12-01',1.000,98.89,'','2026-01-29 23:16:06','2026-01-29 23:16:06'),(45,19,10,'001','2028-12-01',5.000,47.50,'','2026-01-29 23:17:38','2026-01-29 23:17:38'),(46,19,6,'002','2028-11-01',3.000,89.70,'','2026-01-29 23:17:38','2026-01-29 23:17:38'),(47,19,4,'001','2028-01-01',1.000,39.83,'','2026-01-29 23:17:38','2026-01-29 23:17:38'),(48,20,2,'006','2028-12-01',2.000,98.89,'','2026-01-29 23:20:41','2026-01-29 23:20:41'),(49,20,4,'001','2028-01-01',1.000,39.83,'','2026-01-29 23:20:41','2026-01-29 23:20:41'),(50,20,10,'001','2028-12-01',1.000,47.50,'','2026-01-29 23:20:41','2026-01-29 23:20:41'),(51,20,3,'001','2028-10-01',1.000,44.75,'','2026-01-29 23:20:41','2026-01-29 23:20:41'),(52,21,6,'002','2028-11-01',1.000,89.70,'','2026-02-01 10:38:50','2026-02-01 10:38:50'),(53,21,10,'001','2028-12-01',1.000,47.50,'','2026-02-01 10:38:50','2026-02-01 10:38:50'),(54,22,6,'002','2028-11-01',1.000,89.70,'','2026-02-01 16:06:26','2026-02-01 16:06:26'),(55,22,5,'001','2027-07-01',1.000,22.70,'','2026-02-01 16:06:26','2026-02-01 16:06:26'),(56,22,3,'001','2028-10-01',1.000,44.75,'','2026-02-01 16:06:26','2026-02-01 16:06:26'),(57,23,10,'001','2028-12-01',16.000,47.50,'','2026-02-03 11:51:32','2026-02-03 11:51:32'),(58,23,3,'001','2028-10-01',2.000,44.75,'','2026-02-03 11:51:32','2026-02-03 11:51:32'),(59,23,6,'002','2028-11-01',13.000,89.70,'','2026-02-03 11:51:32','2026-02-03 11:51:32'),(60,23,1,'001','2028-08-01',1.000,55.30,'','2026-02-03 11:51:32','2026-02-03 11:51:32'),(61,24,5,'001','2027-07-01',3.000,22.70,'','2026-02-04 15:35:54','2026-02-04 15:35:54'),(62,24,3,'001','2028-10-01',2.000,44.75,'','2026-02-04 15:35:54','2026-02-04 15:35:54'),(63,24,4,'001','2028-01-01',1.000,39.83,'','2026-02-04 15:35:54','2026-02-04 15:35:54'),(64,25,10,'001','2028-12-01',2.000,47.50,'','2026-02-04 16:08:28','2026-02-04 16:08:28'),(65,25,6,'002','2028-11-01',2.000,89.70,'','2026-02-04 16:08:28','2026-02-04 16:08:28'),(66,25,1,'001','2028-08-01',1.000,55.30,'','2026-02-04 16:08:28','2026-02-04 16:08:28'),(67,25,4,'001','2028-01-01',1.000,39.83,'','2026-02-04 16:08:28','2026-02-04 16:08:28'),(68,26,3,'001','2028-10-01',1.000,44.75,'','2026-02-07 08:37:27','2026-02-07 08:37:27'),(69,26,4,'001','2028-01-01',1.000,39.83,'','2026-02-07 08:37:27','2026-02-07 08:37:27'),(70,26,6,'002','2028-11-01',1.000,89.70,'','2026-02-07 08:37:27','2026-02-07 08:37:27'),(71,26,10,'001','2028-12-01',1.000,47.50,'','2026-02-07 08:37:27','2026-02-07 08:37:27'),(72,27,3,'001','2028-10-01',1.000,44.75,'','2026-02-07 09:52:12','2026-02-07 09:52:12'),(73,27,4,'001','2028-01-01',1.000,39.83,'','2026-02-07 09:52:12','2026-02-07 09:52:12'),(74,27,6,'002','2028-11-01',1.000,89.70,'','2026-02-07 09:52:12','2026-02-07 09:52:12'),(75,27,10,'001','2028-12-01',1.000,47.50,'','2026-02-07 09:52:12','2026-02-07 09:52:12'),(76,28,2,'006','2028-12-01',2.000,98.89,'','2026-02-10 09:22:41','2026-02-10 09:22:41'),(77,29,5,'001','2027-07-01',1.000,22.70,'','2026-02-12 00:39:39','2026-02-12 00:39:39'),(78,30,10,'001','2028-12-01',1.000,47.50,'','2026-02-12 00:40:42','2026-02-12 00:40:42'),(79,31,10,'001','2028-12-01',1.000,47.50,'','2026-02-12 00:43:11','2026-02-12 00:43:11'),(80,32,6,'002','2028-11-01',2.000,89.70,'','2026-02-12 00:43:55','2026-02-12 00:43:55'),(81,33,15,'26001','2029-02-01',1.000,46.82,'','2026-02-18 09:14:59','2026-02-18 09:14:59'),(82,34,2,'006','2028-12-01',1.000,98.89,'','2026-02-19 18:13:37','2026-02-19 18:13:37'),(83,35,4,'001','2028-01-01',5.000,39.83,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(84,35,1,'001','2028-08-01',2.000,55.30,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(85,35,2,'006','2028-12-01',3.000,98.89,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(86,35,3,'001','2028-10-01',3.000,44.75,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(87,35,10,'001','2028-12-01',7.000,47.50,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(88,35,6,'002','2028-11-01',4.000,89.70,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(89,35,15,'26001','2029-02-01',15.000,46.82,'','2026-02-20 12:39:32','2026-02-20 12:39:32'),(90,36,4,'001','2028-01-01',5.000,39.83,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(91,36,1,'001','2028-08-01',4.000,55.30,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(92,36,2,'006','2028-12-01',3.000,98.89,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(93,36,3,'001','2028-10-01',2.000,44.75,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(94,36,10,'001','2028-12-01',4.000,47.50,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(95,36,6,'002','2028-11-01',3.000,89.70,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(96,36,15,'26001','2029-02-01',15.000,46.82,'','2026-02-20 12:47:41','2026-02-20 12:47:41'),(97,37,4,'001','2028-01-01',2.000,39.83,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(98,37,1,'001','2028-08-01',1.000,55.30,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(99,37,2,'006','2028-12-01',8.000,98.89,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(100,37,3,'001','2028-10-01',4.000,44.75,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(101,37,10,'001','2028-12-01',2.000,47.50,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(102,37,6,'002','2028-11-01',5.000,89.70,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(103,37,15,'26001','2029-02-01',13.000,46.82,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(104,37,5,'001','2027-07-01',2.000,22.70,'','2026-02-20 13:00:06','2026-02-20 13:00:06'),(105,38,4,'001','2028-01-01',3.000,39.83,'','2026-02-20 13:09:06','2026-02-20 13:09:06'),(106,39,15,'26001','2029-02-01',3.000,46.82,'','2026-02-20 13:11:41','2026-02-20 13:11:41'),(107,40,4,'001','2028-01-01',1.000,39.83,'','2026-02-21 08:38:11','2026-02-21 08:38:11');
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
  `party_id` int DEFAULT NULL,
  `sales_return_id` int DEFAULT NULL,
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
  `issue_type` enum('internal','replacement','damage','other') NOT NULL DEFAULT 'internal',
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_no` (`voucher_no`),
  KEY `fk_iv_party` (`party_id`),
  KEY `fk_iv_warehouse` (`warehouse_id`),
  KEY `fk_iv_employee` (`employee_id`),
  KEY `fk_issueVoucher_doctor` (`doctor_id`),
  KEY `fk_iv_sales_return` (`sales_return_id`),
  CONSTRAINT `fk_issueVoucher_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  CONSTRAINT `fk_iv_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_iv_party` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `fk_iv_sales_return` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`),
  CONSTRAINT `fk_iv_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_vouchers`
--

LOCK TABLES `issue_vouchers` WRITE;
/*!40000 ALTER TABLE `issue_vouchers` DISABLE KEYS */;
INSERT INTO `issue_vouchers` VALUES (1,'IV-1768167823264',1,NULL,NULL,2,NULL,NULL,'draft','2026-01-06','تهويضات عروض 1+50% عن شهر 12','2026-01-11 21:45:15','2026-01-11 21:45:15',78,NULL,'internal'),(2,'IV-1768169384468',NULL,NULL,2,2,NULL,NULL,'draft','2026-01-10','','2026-01-11 22:11:11','2026-01-11 22:11:11',80,NULL,'internal'),(3,'IV-1768424120158',NULL,NULL,2,2,NULL,NULL,'draft','2026-01-03','','2026-01-14 20:56:10','2026-01-14 20:56:10',80,NULL,'internal'),(4,'IV-1768425518685',NULL,NULL,5,2,NULL,NULL,'draft','2026-01-03','','2026-01-14 21:21:30','2026-01-14 21:21:30',80,NULL,'internal'),(5,'IV-1768425693687',NULL,NULL,6,2,NULL,NULL,'draft','2026-01-05','','2026-01-14 21:25:42','2026-01-14 21:25:42',80,NULL,'internal'),(6,'IV-1768729202907',1,2,NULL,2,NULL,NULL,'approved','2026-01-06','','2026-01-18 09:40:52','2026-01-18 09:41:37',15,NULL,'replacement'),(7,'IV-1768746746292',NULL,NULL,6,2,NULL,NULL,'draft','2026-01-18','','2026-01-18 14:34:57','2026-01-18 14:34:57',80,NULL,'other'),(8,'IV-1768747030859',NULL,NULL,5,2,NULL,NULL,'draft','2026-01-18','','2026-01-18 14:38:35','2026-01-18 14:38:35',80,NULL,'other'),(9,'IV-1768747120252',NULL,NULL,2,2,NULL,NULL,'draft','2026-01-18','','2026-01-18 14:40:48','2026-01-18 14:40:48',100,NULL,'other'),(10,'IV-1768909730579',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-20','مي فكري حسن','2026-01-20 11:50:50','2026-01-20 13:07:12',82,NULL,'other'),(11,'IV-1768913971741',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-19','','2026-01-20 13:01:18','2026-01-20 13:01:18',100,NULL,'other'),(12,'IV-1768914183112',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-19','','2026-01-20 13:04:02','2026-01-20 13:04:02',80,2,'other'),(13,'IV-1768914301890',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-19','','2026-01-20 13:06:03','2026-01-20 13:07:12',80,3,'other'),(14,'IV-1768914483501',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-19','','2026-01-20 13:08:46','2026-01-20 13:08:46',80,4,'other'),(15,'IV-1769249544576',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-21','','2026-01-24 10:14:05','2026-01-24 10:14:05',80,NULL,'other'),(16,'IV-1769265282547',NULL,NULL,6,2,NULL,NULL,'draft','2026-01-24','','2026-01-24 14:35:26','2026-01-24 14:35:26',80,NULL,'other'),(17,'IV-1769728359692',NULL,NULL,NULL,2,NULL,NULL,'draft','2026-01-27','أميره زيدان بلوجر','2026-01-29 23:14:15','2026-01-29 23:14:15',82,NULL,'other'),(18,'IV-1769728471767',NULL,NULL,6,2,NULL,NULL,'draft','2026-01-27','','2026-01-29 23:16:06','2026-01-29 23:16:06',80,NULL,'other'),(19,'IV-1769728568859',NULL,NULL,5,2,NULL,NULL,'draft','2026-01-27','','2026-01-29 23:17:38','2026-01-29 23:17:38',80,NULL,'other'),(20,'IV-1769728660902',NULL,NULL,2,2,NULL,NULL,'draft','2026-01-27','','2026-01-29 23:20:41','2026-01-29 23:20:41',100,NULL,'other'),(21,'IV-1769942181529',NULL,NULL,1,2,NULL,NULL,'draft','2026-01-30','عينات دكتور هاني صلاح','2026-02-01 10:38:50','2026-02-01 10:38:50',80,NULL,'other'),(22,'IV-1769961846437',NULL,NULL,8,2,NULL,NULL,'draft','2026-02-01','','2026-02-01 16:06:26','2026-02-01 16:06:26',100,NULL,'other'),(23,'IV-1770119364434',NULL,NULL,3,7,NULL,NULL,'draft','2026-01-31','','2026-02-03 11:51:32','2026-02-03 11:51:32',80,NULL,'other'),(24,'IV-1770219152799',NULL,NULL,6,6,NULL,NULL,'draft','2026-02-02','ساره سيف الدين هيلثي داي','2026-02-04 15:35:54','2026-02-04 15:35:54',100,NULL,'other'),(25,'IV-1770221237530',NULL,NULL,5,2,NULL,NULL,'draft','2026-02-04','','2026-02-04 16:08:28','2026-02-04 16:08:28',80,NULL,'other'),(26,'IV-1770453322952',NULL,NULL,NULL,2,NULL,NULL,'draft','2026-02-04','تقى خالد سليمان','2026-02-07 08:37:27','2026-02-07 08:37:27',82,NULL,'other'),(27,'IV-1770457827913',NULL,NULL,NULL,2,NULL,NULL,'draft','2026-02-05','د.نهال احمد','2026-02-07 09:52:12','2026-02-07 09:52:12',82,NULL,'other'),(28,'IV-1770715248362',6,NULL,3,3,NULL,NULL,'draft','2026-02-03','استعواض شهر 12','2026-02-10 09:22:41','2026-02-10 09:22:41',78,NULL,'other'),(29,'IV-1770856648499',NULL,NULL,1,2,NULL,NULL,'draft','2026-02-11','عينه لدكتور هاني احمد صلاح','2026-02-12 00:39:39','2026-02-12 00:39:39',80,NULL,'other'),(30,'IV-1770856782921',NULL,NULL,2,2,NULL,NULL,'draft','2026-02-11','عينه لساره محمود عبد الحفيظ صالح','2026-02-12 00:40:42','2026-02-12 00:40:42',80,NULL,'other'),(31,'IV-1770856849466',84,NULL,NULL,2,NULL,NULL,'draft','2026-02-11','مقابل تكويد المنتجات في مخزن الدرسات','2026-02-12 00:43:11','2026-02-12 00:43:11',77,NULL,'other'),(32,'IV-1770856998614',NULL,NULL,8,2,NULL,NULL,'draft','2026-02-11','','2026-02-12 00:43:55','2026-02-12 00:43:55',80,NULL,'other'),(33,'IV-1771406026687',10,NULL,NULL,2,NULL,NULL,'draft','2026-02-16','مقابل تكويد المنتج face Glow','2026-02-18 09:14:59','2026-02-18 09:14:59',129,NULL,'other'),(34,'IV-1771524763231',5,NULL,NULL,2,NULL,NULL,'draft','2026-02-18','','2026-02-19 18:13:37','2026-02-19 18:13:37',129,NULL,'other'),(35,'IV-1771590881567',NULL,NULL,2,2,NULL,NULL,'draft','2026-02-15','','2026-02-20 12:39:32','2026-02-20 12:39:32',80,NULL,'other'),(36,'IV-1771591474148',NULL,NULL,6,2,NULL,NULL,'draft','2026-02-15','','2026-02-20 12:47:41','2026-02-20 12:47:41',80,NULL,'other'),(37,'IV-1771592042469',NULL,NULL,5,2,NULL,NULL,'draft','2026-02-15','','2026-02-20 13:00:06','2026-02-20 13:00:06',80,NULL,'other'),(38,'IV-1771592893732',NULL,NULL,6,2,NULL,NULL,'draft','2026-02-17','','2026-02-20 13:09:05','2026-02-20 13:09:05',80,NULL,'other'),(39,'IV-1771592968533',NULL,NULL,1,2,NULL,NULL,'draft','2026-02-17','عينات مجانيه للمناديب','2026-02-20 13:11:41','2026-02-20 13:11:41',100,NULL,'other'),(40,'IV-1771662959978',9,11,3,3,NULL,NULL,'approved','2026-02-15','استبدال علبة ليف ان 180 بأخرى 220','2026-02-21 08:38:11','2026-02-21 08:40:29',116,NULL,'replacement');
/*!40000 ALTER TABLE `issue_vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_order_cost_transactions`
--

DROP TABLE IF EXISTS `job_order_cost_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_order_cost_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_order_id` int NOT NULL,
  `invoice_id` int DEFAULT NULL,
  `cost_type` enum('Service','Transport','RawMaterial','Other') NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `job_order_id` (`job_order_id`),
  KEY `invoice_id` (`invoice_id`),
  CONSTRAINT `job_order_cost_transactions_ibfk_1` FOREIGN KEY (`job_order_id`) REFERENCES `external_job_orders` (`id`),
  CONSTRAINT `job_order_cost_transactions_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `external_service_invoices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_order_cost_transactions`
--

LOCK TABLES `job_order_cost_transactions` WRITE;
/*!40000 ALTER TABLE `job_order_cost_transactions` DISABLE KEYS */;
INSERT INTO `job_order_cost_transactions` VALUES (1,1,1,'Service',71734.95,'2026-02-05 19:20:42','فاتورة خدمة #1');
/*!40000 ALTER TABLE `job_order_cost_transactions` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_titles`
--

LOCK TABLES `job_titles` WRITE;
/*!40000 ALTER TABLE `job_titles` DISABLE KEYS */;
INSERT INTO `job_titles` VALUES (1,'مدير عام'),(2,'مشرف مبيعات و دعايا'),(3,'مندوب مبيعات ودعايا'),(4,'محاسب'),(5,'مندوب توزيع'),(6,'مندوب تحصيل'),(7,'مندوب توزيع وتحصيل');
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
) ENGINE=InnoDB AUTO_INCREMENT=658 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
INSERT INTO `journal_entries` VALUES (1,'2026-01-11','قيد افتتاحي للمخزون - ',73,1,'2026-01-11 18:52:23','2026-01-11 18:52:23',1),(2,'2026-01-11','قيد افتتاحي للمخزون - ',73,2,'2026-01-11 18:53:43','2026-01-11 18:53:43',1),(3,'2026-01-11','قيد افتتاحي للمخزون - ',73,3,'2026-01-11 18:54:57','2026-01-11 18:54:57',1),(4,'2026-01-11','قيد افتتاحي للمخزون - ',73,4,'2026-01-11 18:57:01','2026-01-11 18:57:01',1),(5,'2026-01-11','قيد افتتاحي للمخزون - ',73,5,'2026-01-11 18:58:56','2026-01-11 18:58:56',1),(6,'2026-01-11','قيد افتتاحي للمخزون - ',73,6,'2026-01-11 19:01:24','2026-01-11 19:01:24',1),(7,'2026-01-11','قيد افتتاحي للمخزون - ',73,7,'2026-01-11 19:02:29','2026-01-11 19:02:29',1),(8,'2026-01-11','قيد افتتاحي للمخزون - ',73,8,'2026-01-11 19:04:12','2026-01-11 19:04:12',1),(9,'2026-01-11','قيد افتتاحي للمخزون - ',73,9,'2026-01-11 19:05:45','2026-01-11 19:05:45',1),(10,'2026-01-11','قيد افتتاحي للمخزون - ',73,10,'2026-01-11 19:06:50','2026-01-11 19:06:50',1),(11,'2026-01-11','قيد افتتاحي للمخزون - ',73,11,'2026-01-11 19:08:17','2026-01-11 19:08:17',1),(12,'2026-01-11','قيد افتتاحي للمخزون - ',73,12,'2026-01-11 19:09:14','2026-01-11 19:09:14',1),(13,'2026-01-11','قيد افتتاحي للمخزون - ',73,13,'2026-01-11 19:11:38','2026-01-11 19:11:38',1),(14,'2026-01-11','قيد افتتاحي للمخزون - ',73,14,'2026-01-11 19:12:54','2026-01-11 19:12:54',1),(15,'2026-01-11','قيد افتتاحي للمخزون - ',73,15,'2026-01-11 19:14:30','2026-01-11 19:14:30',1),(16,'2026-01-11','قيد افتتاحي للمخزون - ',73,16,'2026-01-11 19:16:05','2026-01-11 19:16:05',1),(17,'2026-01-11','قيد افتتاحي للمخزون - ',73,17,'2026-01-11 19:17:03','2026-01-11 19:17:03',1),(18,'2026-01-11','قيد افتتاحي للمخزون - ',73,18,'2026-01-11 19:19:24','2026-01-11 19:19:24',1),(19,'2026-01-11','قيد افتتاحي للمخزون - ',73,19,'2026-01-11 19:20:44','2026-01-11 19:20:44',1),(20,'2026-01-11','قيد افتتاحي للمخزون - ',73,20,'2026-01-11 19:21:51','2026-01-11 19:21:51',1),(21,'2026-01-11','قيد افتتاحي للمخزون - ',73,21,'2026-01-11 19:23:30','2026-01-11 19:23:30',1),(22,'2026-01-11','قيد افتتاحي للمخزون - ',73,22,'2026-01-11 19:25:05','2026-01-11 19:25:05',1),(23,'2026-01-11','قيد افتتاحي للمخزون - ',73,23,'2026-01-11 19:26:10','2026-01-11 19:26:10',1),(24,'2026-01-11','قيد افتتاحي للمخزون - ',73,24,'2026-01-11 19:27:30','2026-01-11 19:27:30',1),(25,'2026-01-11','قيد افتتاحي للمخزون - ',73,25,'2026-01-11 19:29:30','2026-01-11 19:29:30',1),(26,'2026-01-11','قيد افتتاحي للمخزون - ',73,26,'2026-01-11 19:30:25','2026-01-11 19:30:25',1),(27,'2026-01-11','قيد افتتاحي للمخزون - ',73,27,'2026-01-11 19:31:44','2026-01-11 19:31:44',1),(28,'2026-01-11','قيد افتتاحي للمخزون - ',73,28,'2026-01-11 19:32:52','2026-01-11 19:32:52',1),(29,'2026-01-11','قيد افتتاحي للمخزون - ',73,29,'2026-01-11 19:34:25','2026-01-11 19:34:25',1),(30,'2026-01-11','قيد افتتاحي للمخزون - ',73,30,'2026-01-11 19:35:45','2026-01-11 19:35:45',1),(31,'2026-01-11','قيد افتتاحي للمخزون - ',73,31,'2026-01-11 19:36:45','2026-01-11 19:36:45',1),(32,'2026-01-01','قيد افتتاحي – مستحقات لدى شركة الشحن',75,NULL,'2026-01-11 21:04:12','2026-01-11 21:04:12',1),(33,'2026-01-06','قيد سند صرف مخزني رقم #IV-1768167823264 - تهويضات عروض 1+50% عن شهر 12',76,1,'2026-01-11 21:45:15','2026-01-11 21:45:15',82),(34,'2026-01-10','قيد سند صرف مخزني رقم #IV-1768169384468 - ',76,2,'2026-01-11 22:11:11','2026-01-11 22:11:11',82),(35,'2026-01-08','التحويل الاسبوعي من خزينة شركة الشحن',75,NULL,'2026-01-11 22:18:40','2026-01-11 22:18:40',63),(36,'2026-01-03','قيد إثبات مبيعات - فاتورة #SI-2026-000001',16,1,'2026-01-14 08:42:37','2026-01-14 08:42:37',2),(37,'2026-01-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000001',17,1,'2026-01-14 08:42:37','2026-01-14 08:42:37',2),(38,'2026-01-03','تحصيل فاتورة مبيعات #SI-2026-000001 - cash',74,1,'2026-01-14 08:43:44','2026-01-14 08:43:44',3),(39,'2026-01-04','قيد إثبات مبيعات - فاتورة #SI-2026-000002',16,2,'2026-01-14 08:44:01','2026-01-14 08:44:01',2),(40,'2026-01-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000002',17,2,'2026-01-14 08:44:01','2026-01-14 08:44:01',2),(41,'2026-01-04','تحصيل فاتورة مبيعات #SI-2026-000002 - cash',74,2,'2026-01-14 08:44:33','2026-01-14 08:44:33',3),(42,'2026-01-04','قيد إثبات مبيعات - فاتورة #SI-2026-000003',16,3,'2026-01-14 08:45:10','2026-01-14 08:45:10',2),(43,'2026-01-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000003',17,3,'2026-01-14 08:45:10','2026-01-14 08:45:10',2),(44,'2026-01-07','تحصيل فاتورة مبيعات #SI-2026-000003 - cash',74,3,'2026-01-14 08:45:44','2026-01-14 08:45:44',3),(45,'2026-01-04','قيد إثبات مبيعات - فاتورة #SI-2026-000004',16,4,'2026-01-14 08:46:03','2026-01-14 08:46:03',2),(46,'2026-01-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000004',17,4,'2026-01-14 08:46:03','2026-01-14 08:46:03',2),(47,'2026-01-05','قيد إثبات مبيعات - فاتورة #SI-2026-000005',16,5,'2026-01-14 08:46:20','2026-01-14 08:46:20',2),(48,'2026-01-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000005',17,5,'2026-01-14 08:46:20','2026-01-14 08:46:20',2),(49,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000005 - cash',74,4,'2026-01-14 08:46:43','2026-01-14 08:46:43',3),(50,'2026-01-05','قيد إثبات مبيعات - فاتورة #SI-2026-000006',16,6,'2026-01-14 08:48:45','2026-01-14 08:48:45',2),(51,'2026-01-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000006',17,6,'2026-01-14 08:48:45','2026-01-14 08:48:45',2),(52,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000006 - cash',74,5,'2026-01-14 08:49:14','2026-01-14 08:49:14',3),(53,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000007',16,7,'2026-01-14 08:49:37','2026-01-14 08:49:37',2),(54,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000007',17,7,'2026-01-14 08:49:37','2026-01-14 08:49:37',2),(55,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000008',16,8,'2026-01-14 08:49:54','2026-01-14 08:49:54',2),(56,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000008',17,8,'2026-01-14 08:49:54','2026-01-14 08:49:54',2),(57,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000009',16,9,'2026-01-14 08:50:08','2026-01-14 08:50:08',2),(58,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000009',17,9,'2026-01-14 08:50:08','2026-01-14 08:50:08',2),(59,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000010',16,10,'2026-01-14 08:50:20','2026-01-14 08:50:20',2),(60,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000010',17,10,'2026-01-14 08:50:20','2026-01-14 08:50:20',2),(61,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000013',16,13,'2026-01-14 08:50:35','2026-01-14 08:50:35',2),(62,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000013',17,13,'2026-01-14 08:50:35','2026-01-14 08:50:35',2),(63,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000011',16,11,'2026-01-14 08:51:01','2026-01-14 08:51:01',2),(64,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000011',17,11,'2026-01-14 08:51:01','2026-01-14 08:51:01',2),(65,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000012',16,12,'2026-01-14 08:51:39','2026-01-14 08:51:39',2),(66,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000012',17,12,'2026-01-14 08:51:39','2026-01-14 08:51:39',2),(67,'2026-01-12','تحصيل فاتورة مبيعات #SI-2026-000012 - cash',74,6,'2026-01-14 08:52:27','2026-01-14 08:52:27',3),(68,'2026-01-11','قيد إثبات مبيعات - فاتورة #SI-2026-000014',16,14,'2026-01-14 09:13:12','2026-01-14 09:13:12',2),(69,'2026-01-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000014',17,14,'2026-01-14 09:13:12','2026-01-14 09:13:12',2),(70,'2026-01-13','قيد إثبات مبيعات - فاتورة #SI-2026-000016',16,16,'2026-01-14 09:13:54','2026-01-14 09:13:54',2),(71,'2026-01-13','قيد تكلفة مبيعات - فاتورة #SI-2026-000016',17,16,'2026-01-14 09:13:54','2026-01-14 09:13:54',2),(72,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000017',16,17,'2026-01-14 09:14:48','2026-01-14 09:14:48',2),(73,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000017',17,17,'2026-01-14 09:14:48','2026-01-14 09:14:48',2),(74,'2026-01-12','تحصيل فاتورة مبيعات #SI-2026-000017 - cash',74,7,'2026-01-14 09:15:15','2026-01-14 09:15:15',3),(75,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000018',16,18,'2026-01-14 09:16:02','2026-01-14 09:16:02',2),(76,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000018',17,18,'2026-01-14 09:16:02','2026-01-14 09:16:02',2),(77,'2026-01-12','تحصيل فاتورة مبيعات #SI-2026-000018 - cash',74,8,'2026-01-14 09:16:28','2026-01-14 09:16:28',3),(78,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000019',16,19,'2026-01-14 09:17:26','2026-01-14 09:17:26',2),(79,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000019',17,19,'2026-01-14 09:17:26','2026-01-14 09:17:26',2),(80,'2026-01-13','تحصيل فاتورة مبيعات #SI-2026-000019 - cash',74,9,'2026-01-14 09:17:54','2026-01-14 09:17:54',3),(81,'2026-01-03','قيد سند صرف مخزني رقم #IV-1768424120158 - ',76,3,'2026-01-14 20:56:10','2026-01-14 20:56:10',82),(82,'2026-01-03','قيد سند صرف مخزني رقم #IV-1768425518685 - ',76,4,'2026-01-14 21:21:30','2026-01-14 21:21:30',82),(83,'2026-01-05','قيد سند صرف مخزني رقم #IV-1768425693687 - ',76,5,'2026-01-14 21:25:43','2026-01-14 21:25:43',82),(84,'2026-01-14','قيد إثبات مبيعات - فاتورة #SI-2026-000015',16,15,'2026-01-15 15:49:29','2026-01-15 15:49:29',2),(85,'2026-01-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000015',17,15,'2026-01-15 15:49:29','2026-01-15 15:49:29',2),(86,'2026-01-12','قيد إثبات مبيعات - فاتورة #SI-2026-000028',16,28,'2026-01-15 15:54:13','2026-01-15 15:54:13',2),(87,'2026-01-12','قيد تكلفة مبيعات - فاتورة #SI-2026-000028',17,28,'2026-01-15 15:54:13','2026-01-15 15:54:13',2),(88,'2026-01-11','قيد إثبات مبيعات - فاتورة #SI-2026-000025',16,25,'2026-01-15 17:08:48','2026-01-15 17:08:48',2),(89,'2026-01-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000025',17,25,'2026-01-15 17:08:48','2026-01-15 17:08:48',2),(90,'2026-01-13','تحصيل فاتورة مبيعات #SI-2026-000025 - cash',74,10,'2026-01-15 17:09:58','2026-01-15 17:09:58',3),(91,'2026-01-12','قيد إثبات مبيعات - فاتورة #SI-2026-000029',16,29,'2026-01-15 17:10:34','2026-01-15 17:10:34',2),(92,'2026-01-12','قيد تكلفة مبيعات - فاتورة #SI-2026-000029',17,29,'2026-01-15 17:10:34','2026-01-15 17:10:34',2),(93,'2026-01-12','قيد إثبات مبيعات - فاتورة #SI-2026-000030',16,30,'2026-01-15 17:10:55','2026-01-15 17:10:55',2),(94,'2026-01-12','قيد تكلفة مبيعات - فاتورة #SI-2026-000030',17,30,'2026-01-15 17:10:55','2026-01-15 17:10:55',2),(95,'2026-01-13','تحصيل فاتورة مبيعات #SI-2026-000030 - cash',74,11,'2026-01-15 17:11:39','2026-01-15 17:11:39',3),(96,'2026-01-11','قيد إثبات مبيعات - فاتورة #SI-2026-000024',16,24,'2026-01-15 17:17:49','2026-01-15 17:17:49',2),(97,'2026-01-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000024',17,24,'2026-01-15 17:17:49','2026-01-15 17:17:49',2),(98,'2026-01-12','مرتجع مبيعات فاتورة #SI-2026-000031',18,1,'2026-01-17 08:09:40','2026-01-17 08:09:40',4),(99,'2026-01-12','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000031',77,1,'2026-01-17 08:09:41','2026-01-17 08:09:41',4),(100,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000020',78,20,'2026-01-17 08:26:52','2026-01-17 08:26:52',1),(101,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000020 - cash',74,12,'2026-01-17 08:28:48','2026-01-17 08:28:48',3),(102,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000066',78,66,'2026-01-17 08:30:41','2026-01-17 08:30:41',1),(103,'2026-01-14','تحصيل فاتورة مبيعات #SI-2026-000066 - cash',74,13,'2026-01-17 08:31:34','2026-01-17 08:31:34',3),(104,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000035',78,35,'2026-01-17 08:33:31','2026-01-17 08:33:31',1),(105,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000064',78,64,'2026-01-17 08:38:07','2026-01-17 08:38:07',1),(106,'2026-01-13','تحصيل فاتورة مبيعات #SI-2026-000064 - cash',74,14,'2026-01-17 08:38:37','2026-01-17 08:38:37',3),(107,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000026',78,26,'2026-01-17 08:40:12','2026-01-17 08:40:12',1),(108,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000026 - cash',74,15,'2026-01-17 08:41:13','2026-01-17 08:41:13',3),(109,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000027',78,27,'2026-01-17 08:42:54','2026-01-17 08:42:54',1),(110,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000027 - cash',74,16,'2026-01-17 08:43:29','2026-01-17 08:43:29',3),(111,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000031',78,31,'2026-01-17 08:44:35','2026-01-17 08:44:35',1),(112,'2026-01-12','تحصيل فاتورة مبيعات #SI-2026-000031 - cash',74,17,'2026-01-17 08:45:27','2026-01-17 08:45:27',3),(113,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000067',78,67,'2026-01-17 08:46:58','2026-01-17 08:46:58',1),(114,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000032',78,32,'2026-01-17 08:48:08','2026-01-17 08:48:08',1),(115,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000033',78,33,'2026-01-17 08:50:21','2026-01-17 08:50:21',1),(116,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000081',78,81,'2026-01-17 08:54:20','2026-01-17 08:54:20',1),(117,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000082',78,82,'2026-01-17 08:57:30','2026-01-17 08:57:30',1),(118,'2026-01-01','رصيد البنك الخاص اول المده',75,NULL,'2026-01-17 09:17:40','2026-01-17 09:17:40',1),(119,'2026-01-01','رصيد اول المده بنك الشركه',75,NULL,'2026-01-17 09:20:13','2026-01-17 09:20:13',1),(120,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000022',16,22,'2026-01-17 10:49:41','2026-01-17 10:49:41',2),(121,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000022',17,22,'2026-01-17 10:49:41','2026-01-17 10:49:41',2),(122,'2026-01-04','قيد إثبات مبيعات - فاتورة #SI-2026-000021',16,21,'2026-01-17 10:50:08','2026-01-17 10:50:08',2),(123,'2026-01-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000021',17,21,'2026-01-17 10:50:08','2026-01-17 10:50:08',2),(124,'2026-01-10','قيد إثبات مبيعات - فاتورة #SI-2026-000023',16,23,'2026-01-17 10:50:45','2026-01-17 10:50:45',2),(125,'2026-01-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000023',17,23,'2026-01-17 10:50:45','2026-01-17 10:50:45',2),(126,'2026-01-13','قيد إثبات مبيعات - فاتورة #SI-2026-000073',16,73,'2026-01-17 10:51:36','2026-01-17 10:51:36',2),(127,'2026-01-13','قيد تكلفة مبيعات - فاتورة #SI-2026-000073',17,73,'2026-01-17 10:51:36','2026-01-17 10:51:36',2),(128,'2026-01-13','تحصيل فاتورة مبيعات #SI-2026-000073 - cash',74,18,'2026-01-17 10:52:08','2026-01-17 10:52:08',3),(129,'2026-01-13','قيد إثبات مبيعات - فاتورة #SI-2026-000043',16,43,'2026-01-17 11:19:20','2026-01-17 11:19:20',2),(130,'2026-01-13','قيد تكلفة مبيعات - فاتورة #SI-2026-000043',17,43,'2026-01-17 11:19:20','2026-01-17 11:19:20',2),(131,'2026-01-14','قيد إثبات مبيعات - فاتورة #SI-2026-000074',16,74,'2026-01-17 11:20:25','2026-01-17 11:20:25',2),(132,'2026-01-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000074',17,74,'2026-01-17 11:20:25','2026-01-17 11:20:25',2),(133,'2026-01-14','قيد إثبات مبيعات - فاتورة #SI-2026-000075',16,75,'2026-01-17 11:21:29','2026-01-17 11:21:29',2),(134,'2026-01-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000075',17,75,'2026-01-17 11:21:29','2026-01-17 11:21:29',2),(135,'2026-01-14','قيد إثبات مبيعات - فاتورة #SI-2026-000076',16,76,'2026-01-17 11:22:02','2026-01-17 11:22:02',2),(136,'2026-01-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000076',17,76,'2026-01-17 11:22:02','2026-01-17 11:22:02',2),(137,'2026-01-14','قيد إثبات مبيعات - فاتورة #SI-2026-000077',16,77,'2026-01-17 11:22:44','2026-01-17 11:22:44',2),(138,'2026-01-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000077',17,77,'2026-01-17 11:22:44','2026-01-17 11:22:44',2),(139,'2026-01-13','قيد إثبات مبيعات - فاتورة #SI-2026-000078',16,78,'2026-01-17 11:23:18','2026-01-17 11:23:18',2),(140,'2026-01-13','قيد تكلفة مبيعات - فاتورة #SI-2026-000078',17,78,'2026-01-17 11:23:18','2026-01-17 11:23:18',2),(141,'2026-01-15','قيد إثبات مبيعات - فاتورة #SI-2026-000079',16,79,'2026-01-17 11:24:03','2026-01-17 11:24:03',2),(142,'2026-01-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000079',17,79,'2026-01-17 11:24:03','2026-01-17 11:24:03',2),(143,'2026-01-15','تحصيل فاتورة مبيعات #SI-2026-000079 - cash',74,19,'2026-01-17 11:24:39','2026-01-17 11:24:39',3),(144,'2026-01-15','قيد إثبات مبيعات - فاتورة #SI-2026-000085',16,85,'2026-01-17 12:15:30','2026-01-17 12:15:30',2),(145,'2026-01-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000085',17,85,'2026-01-17 12:15:30','2026-01-17 12:15:30',2),(146,'2026-01-15','تحصيل فاتورة مبيعات #SI-2026-000085 - cash',74,20,'2026-01-17 12:16:19','2026-01-17 12:16:19',3),(147,'2026-01-14','التحويل الاسبوعى',75,NULL,'2026-01-17 12:49:28','2026-01-17 12:49:28',63),(148,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000045',78,45,'2026-01-17 14:13:37','2026-01-17 14:13:37',1),(149,'2026-01-10','تحصيل فاتورة مبيعات #SI-2026-000045 - cash',74,21,'2026-01-17 14:14:18','2026-01-17 14:14:18',3),(150,'2026-01-10','تحصيل فاتورة مبيعات #SI-2026-000045 - cash',74,22,'2026-01-17 14:14:47','2026-01-17 14:14:47',3),(151,'2026-01-10','تحصيل فاتورة مبيعات #SI-2026-000021 - cash',74,23,'2026-01-17 14:16:09','2026-01-17 14:16:09',3),(152,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000071',78,71,'2026-01-17 14:18:59','2026-01-17 14:18:59',1),(153,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000071 - cash',74,24,'2026-01-17 14:19:44','2026-01-17 14:19:44',3),(154,'2026-01-15','قيد إثبات مبيعات - فاتورة #SI-2026-000084',16,84,'2026-01-17 15:11:25','2026-01-17 15:11:25',2),(155,'2026-01-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000084',17,84,'2026-01-17 15:11:25','2026-01-17 15:11:25',2),(156,'2026-01-17','تحصيل فاتورة مبيعات #SI-2026-000084 - cash',74,25,'2026-01-17 15:12:18','2026-01-17 15:12:18',3),(157,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000048',78,48,'2026-01-17 15:13:27','2026-01-17 15:13:27',1),(158,'2026-01-17','تحصيل فاتورة مبيعات #SI-2026-000048 - cash',74,26,'2026-01-17 15:14:12','2026-01-17 15:14:12',3),(159,'2026-01-06','مرتجع مبيعات فاتورة #SI-2026-000026',18,2,'2026-01-18 09:39:33','2026-01-18 09:39:33',4),(160,'2026-01-06','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000026',77,2,'2026-01-18 09:39:33','2026-01-18 09:39:33',4),(161,'2026-01-06','قيد سند صرف مخزني رقم #IV-1768729202907 -  (استبدال)',76,6,'2026-01-18 09:40:52','2026-01-18 09:40:52',82),(162,'2026-01-18','قيد سند صرف مخزني رقم #IV-1768746746292 - ',76,7,'2026-01-18 14:34:57','2026-01-18 14:34:57',82),(163,'2026-01-18','قيد سند صرف مخزني رقم #IV-1768747030859 - ',76,8,'2026-01-18 14:38:35','2026-01-18 14:38:35',82),(164,'2026-01-18','قيد سند صرف مخزني رقم #IV-1768747120252 - ',76,9,'2026-01-18 14:40:48','2026-01-18 14:40:48',82),(165,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000094',16,94,'2026-01-18 15:06:46','2026-01-18 15:06:46',2),(166,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000094',17,94,'2026-01-18 15:06:46','2026-01-18 15:06:46',2),(167,'2026-01-18','تحصيل فاتورة مبيعات #SI-2026-000094 - cash',74,27,'2026-01-18 15:07:16','2026-01-18 15:07:16',3),(168,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000097',16,97,'2026-01-18 15:24:06','2026-01-18 15:24:06',2),(169,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000097',17,97,'2026-01-18 15:24:06','2026-01-18 15:24:06',2),(170,'2026-01-18','تحصيل فاتورة مبيعات #SI-2026-000097 - cash',74,28,'2026-01-18 15:24:45','2026-01-18 15:24:45',3),(171,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000099',78,99,'2026-01-20 08:04:48','2026-01-20 08:04:48',1),(172,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000100',78,100,'2026-01-20 08:10:56','2026-01-20 08:10:56',1),(173,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000062',78,62,'2026-01-20 08:16:30','2026-01-20 08:16:30',1),(174,'2026-01-19','تحصيل فاتورة مبيعات #SI-2026-000062 - cash',74,29,'2026-01-20 08:19:26','2026-01-20 08:19:26',3),(175,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000086',16,86,'2026-01-20 08:19:54','2026-01-20 08:19:54',2),(176,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000086',17,86,'2026-01-20 08:19:54','2026-01-20 08:19:54',2),(177,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000087',16,87,'2026-01-20 08:20:12','2026-01-20 08:20:12',2),(178,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000087',17,87,'2026-01-20 08:20:12','2026-01-20 08:20:12',2),(179,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000088',16,88,'2026-01-20 08:20:29','2026-01-20 08:20:29',2),(180,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000088',17,88,'2026-01-20 08:20:29','2026-01-20 08:20:29',2),(181,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000089',16,89,'2026-01-20 08:20:50','2026-01-20 08:20:50',2),(182,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000089',17,89,'2026-01-20 08:20:50','2026-01-20 08:20:50',2),(183,'2026-01-19','تحصيل فاتورة مبيعات #SI-2026-000064 - cash',74,30,'2026-01-20 08:23:01','2026-01-20 08:23:01',3),(184,'2026-01-19','قيد إثبات مبيعات - فاتورة #SI-2026-000090',16,90,'2026-01-20 08:26:05','2026-01-20 08:26:05',2),(185,'2026-01-19','قيد تكلفة مبيعات - فاتورة #SI-2026-000090',17,90,'2026-01-20 08:26:05','2026-01-20 08:26:05',2),(186,'2026-01-19','قيد إثبات مبيعات - فاتورة #SI-2026-000091',16,91,'2026-01-20 08:26:39','2026-01-20 08:26:39',2),(187,'2026-01-19','قيد تكلفة مبيعات - فاتورة #SI-2026-000091',17,91,'2026-01-20 08:26:39','2026-01-20 08:26:39',2),(188,'2026-01-19','تحصيل فاتورة مبيعات #SI-2026-000067 - cash',74,31,'2026-01-20 08:30:18','2026-01-20 08:30:18',3),(189,'2026-01-20','مصروف #2',79,2,'2026-01-20 08:42:27','2026-01-20 08:42:27',8),(190,'2026-01-20','مصروف #3',79,3,'2026-01-20 08:46:16','2026-01-20 08:46:16',8),(191,'2026-01-20','هدير بلوجر',79,4,'2026-01-20 08:54:19','2026-01-20 08:54:19',8),(192,'2026-01-20','مصروف #5',79,5,'2026-01-20 09:04:23','2026-01-20 09:04:23',8),(193,'2026-01-01','رصيد اول المده خزينه',75,NULL,'2026-01-20 09:13:38','2026-01-20 09:13:38',1),(194,'2026-01-20','مصروف #6',79,6,'2026-01-20 09:21:03','2026-01-20 09:21:03',8),(195,'2026-01-20','مصاريف اشتراك الانترنت',79,7,'2026-01-20 09:23:12','2026-01-20 09:23:12',8),(196,'2026-01-20','شركة التسويق Objective',79,8,'2026-01-20 09:31:06','2026-01-20 09:31:06',8),(197,'2026-01-20','بروشورات (شركة المصريه)',79,9,'2026-01-20 09:36:02','2026-01-20 09:36:02',8),(198,'2026-01-20','فاتورة غاز',79,10,'2026-01-20 09:37:17','2026-01-20 09:37:17',8),(199,'2026-01-20','تنظيف المكتب',79,11,'2026-01-20 09:38:04','2026-01-20 09:38:04',8),(200,'2026-01-20','بدل سفر طنطا وكفر الشيخ',79,12,'2026-01-20 09:39:05','2026-01-20 09:39:05',8),(201,'2026-01-20','مياه شرب',79,13,'2026-01-20 09:39:54','2026-01-20 09:39:54',8),(202,'2026-01-20','بدل سفر دمياط',79,14,'2026-01-20 09:40:43','2026-01-20 09:40:43',8),(203,'2026-01-20','مصروف #15',79,15,'2026-01-20 09:42:42','2026-01-20 09:42:42',8),(204,'2026-01-20','بدل سفر الزقازيق',79,16,'2026-01-20 09:57:50','2026-01-20 09:57:50',8),(205,'2026-01-20','مصاريف تكويد منتج',79,17,'2026-01-20 10:19:05','2026-01-20 10:19:05',8),(206,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000101',16,101,'2026-01-20 11:18:41','2026-01-20 11:18:41',2),(207,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000101',17,101,'2026-01-20 11:18:41','2026-01-20 11:18:41',2),(208,'2026-01-19','قيد إثبات مبيعات - فاتورة #SI-2026-000102',16,102,'2026-01-20 11:22:52','2026-01-20 11:22:52',2),(209,'2026-01-19','قيد تكلفة مبيعات - فاتورة #SI-2026-000102',17,102,'2026-01-20 11:22:52','2026-01-20 11:22:52',2),(210,'2026-01-16','قيد إثبات مبيعات - فاتورة #SI-2026-000103',16,103,'2026-01-20 11:34:50','2026-01-20 11:34:50',2),(211,'2026-01-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000103',17,103,'2026-01-20 11:34:50','2026-01-20 11:34:50',2),(212,'2026-01-16','تحصيل فاتورة مبيعات #SI-2026-000103 - bank_transfer',74,32,'2026-01-20 11:36:17','2026-01-20 11:36:17',3),(213,'2026-01-19','تحصيل فاتورة مبيعات #SI-2026-000102 - cash',74,33,'2026-01-20 11:40:55','2026-01-20 11:40:55',3),(214,'2026-01-20','قيد سند صرف مخزني رقم #IV-1768909730579 - مي فكري حسن',76,10,'2026-01-20 11:50:50','2026-01-20 11:50:50',82),(215,'2026-01-20','بدل سفر دمياط',79,18,'2026-01-20 12:17:18','2026-01-20 12:17:18',8),(216,'2026-01-19','قيد سند صرف مخزني رقم #IV-1768913971741 - ',76,11,'2026-01-20 13:01:19','2026-01-20 13:01:19',82),(217,'2026-01-19','قيد سند صرف مخزني رقم #IV-1768914183112 - ',76,12,'2026-01-20 13:04:02','2026-01-20 13:04:02',82),(218,'2026-01-19','قيد سند صرف مخزني رقم #IV-1768914301890 - ',76,13,'2026-01-20 13:06:03','2026-01-20 13:06:03',82),(219,'2026-01-19','قيد سند صرف مخزني رقم #IV-1768914483501 - ',76,14,'2026-01-20 13:08:46','2026-01-20 13:08:46',82),(220,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000098',16,98,'2026-01-20 14:03:23','2026-01-20 14:03:23',2),(221,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000098',17,98,'2026-01-20 14:03:23','2026-01-20 14:03:23',2),(222,'2026-01-17','قيد إثبات مبيعات - فاتورة #SI-2026-000083',16,83,'2026-01-20 14:04:18','2026-01-20 14:04:18',2),(223,'2026-01-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000083',17,83,'2026-01-20 14:04:18','2026-01-20 14:04:18',2),(224,'2026-01-13','قيد إثبات مبيعات - فاتورة #SI-2026-000080',16,80,'2026-01-20 14:05:50','2026-01-20 14:05:50',2),(225,'2026-01-13','قيد تكلفة مبيعات - فاتورة #SI-2026-000080',17,80,'2026-01-20 14:05:50','2026-01-20 14:05:50',2),(226,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000047',78,47,'2026-01-20 14:11:30','2026-01-20 14:11:30',1),(227,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000046',78,46,'2026-01-20 14:12:08','2026-01-20 14:12:08',1),(228,'2026-01-20','قيد افتتاحي للمخزون - ',73,227,'2026-01-20 20:48:17','2026-01-20 20:48:17',1),(229,'2026-01-20','قيد افتتاحي للمخزون - ',73,228,'2026-01-20 20:48:58','2026-01-20 20:48:58',1),(230,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000106',16,106,'2026-01-21 09:55:50','2026-01-21 09:55:50',2),(231,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000106',17,106,'2026-01-21 09:55:50','2026-01-21 09:55:50',2),(232,'2026-01-01','رصيد أول المدة (مورد) - فاتورة #PI-2026-000001',80,1,'2026-01-21 10:10:37','2026-01-21 10:10:37',1),(233,'2026-01-01','مستحقات لهاني صلاح',75,NULL,'2026-01-21 10:58:04','2026-01-21 10:58:04',1),(234,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000108',16,108,'2026-01-24 08:28:41','2026-01-24 08:28:41',2),(235,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000108',17,108,'2026-01-24 08:28:41','2026-01-24 08:28:41',2),(236,'2026-01-21','تحصيل فاتورة مبيعات #SI-2026-000108 - cash',74,34,'2026-01-24 08:29:36','2026-01-24 08:29:36',3),(237,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000109',16,109,'2026-01-24 08:34:04','2026-01-24 08:34:04',2),(238,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000109',17,109,'2026-01-24 08:34:04','2026-01-24 08:34:04',2),(239,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000107',16,107,'2026-01-24 08:34:29','2026-01-24 08:34:29',2),(240,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000107',17,107,'2026-01-24 08:34:29','2026-01-24 08:34:29',2),(241,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000105',16,105,'2026-01-24 08:35:20','2026-01-24 08:35:20',2),(242,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000105',17,105,'2026-01-24 08:35:21','2026-01-24 08:35:21',2),(243,'2026-01-21','تحصيل فاتورة مبيعات #SI-2026-000105 - cash',74,35,'2026-01-24 08:36:20','2026-01-24 08:36:20',3),(244,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000104',16,104,'2026-01-24 08:36:47','2026-01-24 08:36:47',2),(245,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000104',17,104,'2026-01-24 08:36:47','2026-01-24 08:36:47',2),(246,'2026-01-21','تحصيل فاتورة مبيعات #SI-2026-000104 - cash',74,36,'2026-01-24 08:37:21','2026-01-24 08:37:21',3),(247,'2026-01-21','تحصيل فاتورة مبيعات #SI-2026-000054 - cash',74,37,'2026-01-24 08:39:50','2026-01-24 08:39:50',3),(248,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000054',78,54,'2026-01-24 08:41:06','2026-01-24 08:41:06',1),(249,'2026-01-21','التحويل الاسبوعي',75,NULL,'2026-01-24 09:26:41','2026-01-24 09:26:41',63),(250,'2026-01-24','مصروف #19',79,19,'2026-01-24 10:09:59','2026-01-24 10:09:59',8),(251,'2026-01-24','بدل سفر طنطا وكفر الشيخ',79,20,'2026-01-24 10:11:07','2026-01-24 10:11:07',8),(252,'2026-01-21','قيد سند صرف مخزني رقم #IV-1769249544576 - ',76,15,'2026-01-24 10:14:05','2026-01-24 10:14:05',82),(253,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000093',16,93,'2026-01-24 14:30:22','2026-01-24 14:30:22',2),(254,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000093',17,93,'2026-01-24 14:30:22','2026-01-24 14:30:22',2),(255,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000092',16,92,'2026-01-24 14:31:22','2026-01-24 14:31:22',2),(256,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000092',17,92,'2026-01-24 14:31:22','2026-01-24 14:31:22',2),(257,'2026-01-24','قيد سند صرف مخزني رقم #IV-1769265282547 - ',76,16,'2026-01-24 14:35:26','2026-01-24 14:35:26',82),(258,'2026-01-25','تحصيل فاتورة مبيعات #SI-2026-000027 - cheque',74,38,'2026-01-25 11:30:12','2026-01-25 11:30:12',3),(259,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000069',78,69,'2026-01-25 12:48:47','2026-01-25 12:48:47',1),(260,'2026-01-25','تحصيل فاتورة مبيعات #SI-2026-000069 - cash',74,39,'2026-01-25 12:49:35','2026-01-25 12:49:35',3),(261,'2026-01-25','مرتجع مبيعات فاتورة #SI-2026-000069',18,3,'2026-01-25 13:59:12','2026-01-25 13:59:12',4),(262,'2026-01-25','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000069',77,3,'2026-01-25 13:59:12','2026-01-25 13:59:12',4),(263,'2026-01-25','تحصيل فاتورة مبيعات #SI-2026-000046 - cheque (مع خصم منبع)',74,40,'2026-01-25 19:03:40','2026-01-25 19:03:40',3),(264,'2026-01-21','قيد إثبات مبيعات - فاتورة #SI-2026-000113',16,113,'2026-01-25 19:17:26','2026-01-25 19:17:26',2),(265,'2026-01-21','قيد تكلفة مبيعات - فاتورة #SI-2026-000113',17,113,'2026-01-25 19:17:26','2026-01-25 19:17:26',2),(266,'2026-01-21','تحصيل فاتورة مبيعات #SI-2026-000113 - cash',74,41,'2026-01-25 19:18:11','2026-01-25 19:18:11',3),(267,'2026-01-24','قيد إثبات مبيعات - فاتورة #SI-2026-000114',16,114,'2026-01-25 19:23:25','2026-01-25 19:23:25',2),(268,'2026-01-24','قيد تكلفة مبيعات - فاتورة #SI-2026-000114',17,114,'2026-01-25 19:23:25','2026-01-25 19:23:25',2),(269,'2026-01-24','تحصيل فاتورة مبيعات #SI-2026-000114 - cash',74,42,'2026-01-25 19:24:07','2026-01-25 19:24:07',3),(270,'2026-01-25','قيد إثبات مبيعات - فاتورة #SI-2026-000112',16,112,'2026-01-27 08:07:58','2026-01-27 08:07:58',2),(271,'2026-01-25','قيد تكلفة مبيعات - فاتورة #SI-2026-000112',17,112,'2026-01-27 08:07:58','2026-01-27 08:07:58',2),(272,'2026-01-25','قيد إثبات مبيعات - فاتورة #SI-2026-000111',16,111,'2026-01-27 08:08:23','2026-01-27 08:08:23',2),(273,'2026-01-25','قيد تكلفة مبيعات - فاتورة #SI-2026-000111',17,111,'2026-01-27 08:08:23','2026-01-27 08:08:23',2),(274,'2026-01-26','تحصيل فاتورة مبيعات #SI-2026-000111 - cash',74,43,'2026-01-27 08:08:55','2026-01-27 08:08:55',3),(275,'2026-01-25','قيد إثبات مبيعات - فاتورة #SI-2026-000110',16,110,'2026-01-27 08:09:22','2026-01-27 08:09:22',2),(276,'2026-01-25','قيد تكلفة مبيعات - فاتورة #SI-2026-000110',17,110,'2026-01-27 08:09:22','2026-01-27 08:09:22',2),(277,'2026-01-26','تحصيل فاتورة مبيعات #SI-2026-000110 - cash',74,44,'2026-01-27 08:09:44','2026-01-27 08:09:44',3),(278,'2026-01-26','قيد إثبات مبيعات - فاتورة #SI-2026-000115',16,115,'2026-01-27 08:11:43','2026-01-27 08:11:43',2),(279,'2026-01-26','قيد تكلفة مبيعات - فاتورة #SI-2026-000115',17,115,'2026-01-27 08:11:43','2026-01-27 08:11:43',2),(280,'2026-01-26','تحصيل فاتورة مبيعات #SI-2026-000066 - cash',74,45,'2026-01-27 08:14:55','2026-01-27 08:14:55',3),(281,'2026-01-26','قيد إثبات مبيعات - فاتورة #SI-2026-000116',16,116,'2026-01-27 08:28:23','2026-01-27 08:28:23',2),(282,'2026-01-26','قيد تكلفة مبيعات - فاتورة #SI-2026-000116',17,116,'2026-01-27 08:28:23','2026-01-27 08:28:23',2),(283,'2026-01-26','قيد إثبات مبيعات - فاتورة #SI-2026-000072',16,72,'2026-01-27 08:29:16','2026-01-27 08:29:16',2),(284,'2026-01-26','قيد تكلفة مبيعات - فاتورة #SI-2026-000072',17,72,'2026-01-27 08:29:16','2026-01-27 08:29:16',2),(285,'2026-01-26','تحصيل فاتورة مبيعات #SI-2026-000071 - cash',74,46,'2026-01-27 08:44:08','2026-01-27 08:44:08',3),(286,'2026-01-27','مرتجع مبيعات فاتورة #SI-2026-000081',18,4,'2026-01-27 08:53:53','2026-01-27 08:53:53',4),(287,'2026-01-27','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000081',77,4,'2026-01-27 08:53:53','2026-01-27 08:53:53',4),(288,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000053',78,53,'2026-01-27 08:57:35','2026-01-27 08:57:35',1),(289,'2026-01-26','تحصيل فاتورة مبيعات #SI-2026-000053 - cash',74,47,'2026-01-27 09:02:34','2026-01-27 09:02:34',3),(290,'2026-01-24','قيد إثبات مبيعات - فاتورة #SI-2026-000122',16,122,'2026-01-29 22:51:03','2026-01-29 22:51:03',2),(291,'2026-01-24','قيد تكلفة مبيعات - فاتورة #SI-2026-000122',17,122,'2026-01-29 22:51:03','2026-01-29 22:51:03',2),(292,'2026-01-28','تحصيل فاتورة مبيعات #SI-2026-000122 - cash',74,48,'2026-01-29 22:57:16','2026-01-29 22:57:16',3),(293,'2026-01-28','قيد إثبات مبيعات - فاتورة #SI-2026-000123',16,123,'2026-01-29 22:59:33','2026-01-29 22:59:33',2),(294,'2026-01-28','قيد تكلفة مبيعات - فاتورة #SI-2026-000123',17,123,'2026-01-29 22:59:33','2026-01-29 22:59:33',2),(295,'2026-01-29','تحصيل فاتورة مبيعات #SI-2026-000123 - cash',74,49,'2026-01-29 23:00:57','2026-01-29 23:00:57',3),(296,'2026-01-18','قيد إثبات مبيعات - فاتورة #SI-2026-000096',16,96,'2026-01-29 23:01:57','2026-01-29 23:01:57',2),(297,'2026-01-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000096',17,96,'2026-01-29 23:01:57','2026-01-29 23:01:57',2),(298,'2026-01-28','تحصيل فاتورة مبيعات #SI-2026-000096 - cash',74,50,'2026-01-29 23:03:13','2026-01-29 23:03:13',3),(299,'2026-01-28','قيد إثبات مبيعات - فاتورة #SI-2026-000119',16,119,'2026-01-29 23:05:05','2026-01-29 23:05:05',2),(300,'2026-01-28','قيد تكلفة مبيعات - فاتورة #SI-2026-000119',17,119,'2026-01-29 23:05:05','2026-01-29 23:05:05',2),(301,'2026-01-28','قيد إثبات مبيعات - فاتورة #SI-2026-000117',16,117,'2026-01-29 23:05:48','2026-01-29 23:05:48',2),(302,'2026-01-28','قيد تكلفة مبيعات - فاتورة #SI-2026-000117',17,117,'2026-01-29 23:05:48','2026-01-29 23:05:48',2),(303,'2026-01-27','قيد سند صرف مخزني رقم #IV-1769728359692 - أميره زيدان بلوجر',76,17,'2026-01-29 23:14:15','2026-01-29 23:14:15',82),(304,'2026-01-27','قيد سند صرف مخزني رقم #IV-1769728471767 - ',76,18,'2026-01-29 23:16:06','2026-01-29 23:16:06',82),(305,'2026-01-27','قيد سند صرف مخزني رقم #IV-1769728568859 - ',76,19,'2026-01-29 23:17:38','2026-01-29 23:17:38',82),(306,'2026-01-27','قيد سند صرف مخزني رقم #IV-1769728660902 - ',76,20,'2026-01-29 23:20:41','2026-01-29 23:20:41',82),(307,'2026-01-28','قيد إثبات مبيعات - فاتورة #SI-2026-000118',16,118,'2026-01-29 23:27:44','2026-01-29 23:27:44',2),(308,'2026-01-28','قيد تكلفة مبيعات - فاتورة #SI-2026-000118',17,118,'2026-01-29 23:27:44','2026-01-29 23:27:44',2),(309,'2026-01-31','ميادة بلوجر',79,21,'2026-01-31 08:22:12','2026-01-31 08:22:12',8),(310,'2026-01-27','مصروف #22',79,22,'2026-01-31 09:02:02','2026-01-31 09:02:02',8),(311,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000042',78,42,'2026-01-31 09:15:08','2026-01-31 09:15:08',1),(312,'2026-01-29','تحصيل فاتورة مبيعات #SI-2026-000042 - cash',74,51,'2026-01-31 09:15:58','2026-01-31 09:15:58',3),(313,'2026-01-01','إثبات فروق وسداد ضريبة دخل عن فترات سابقة وفقًا لإخطار مصلحة الضرائب.',75,NULL,'2026-02-01 09:51:04','2026-02-01 11:40:46',8),(314,'2026-01-01','سداد ضرائب',75,NULL,'2026-02-01 09:56:00','2026-02-01 09:56:00',17),(315,'2026-01-31','قيد إثبات مبيعات - فاتورة #SI-2026-000127',16,127,'2026-02-01 10:03:47','2026-02-01 10:03:47',2),(316,'2026-01-31','قيد تكلفة مبيعات - فاتورة #SI-2026-000127',17,127,'2026-02-01 10:03:47','2026-02-01 10:03:47',2),(317,'2026-01-31','قيد إثبات مبيعات - فاتورة #SI-2026-000126',16,126,'2026-02-01 10:09:54','2026-02-01 10:09:54',2),(318,'2026-01-31','قيد تكلفة مبيعات - فاتورة #SI-2026-000126',17,126,'2026-02-01 10:09:54','2026-02-01 10:09:54',2),(319,'2026-01-31','قيد إثبات مبيعات - فاتورة #SI-2026-000125',16,125,'2026-02-01 10:11:29','2026-02-01 10:11:29',2),(320,'2026-01-31','قيد تكلفة مبيعات - فاتورة #SI-2026-000125',17,125,'2026-02-01 10:11:29','2026-02-01 10:11:29',2),(321,'2026-01-29','قيد إثبات مبيعات - فاتورة #SI-2026-000124',16,124,'2026-02-01 10:13:54','2026-02-01 10:13:54',2),(322,'2026-01-29','قيد تكلفة مبيعات - فاتورة #SI-2026-000124',17,124,'2026-02-01 10:13:54','2026-02-01 10:13:54',2),(323,'2026-01-29','قيد إثبات مبيعات - فاتورة #SI-2026-000120',16,120,'2026-02-01 10:14:11','2026-02-01 10:14:11',2),(324,'2026-01-29','قيد تكلفة مبيعات - فاتورة #SI-2026-000120',17,120,'2026-02-01 10:14:11','2026-02-01 10:14:11',2),(325,'2026-01-29','قيد إثبات مبيعات - فاتورة #SI-2026-000121',16,121,'2026-02-01 10:14:25','2026-02-01 10:14:25',2),(326,'2026-01-29','قيد تكلفة مبيعات - فاتورة #SI-2026-000121',17,121,'2026-02-01 10:14:25','2026-02-01 10:14:25',2),(327,'2026-01-13','رصيد أول المدة - فاتورة #SI-2026-000050',78,50,'2026-02-01 10:14:50','2026-02-01 10:14:50',1),(328,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000070',78,70,'2026-02-01 10:16:33','2026-02-01 10:16:33',1),(329,'2026-01-30','قيد سند صرف مخزني رقم #IV-1769942181529 - عينات دكتور هاني صلاح',76,21,'2026-02-01 10:38:50','2026-02-01 10:38:50',82),(330,'2026-02-01','صرف خامات لأمر تشغيل خارجي #1',81,1,'2026-02-01 12:31:46','2026-02-01 12:31:46',13),(331,'2026-02-01','إلغاء/عكس تحصيل فاتورة #SI-2026-000046 - السند رقم 40',75,40,'2026-02-01 13:50:55','2026-02-01 13:50:55',10),(332,'2026-01-25','مرتجع مبيعات فاتورة #SI-2026-000046',18,5,'2026-02-01 14:05:10','2026-02-01 14:05:10',4),(333,'2026-01-25','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000046',77,5,'2026-02-01 14:05:10','2026-02-01 14:05:10',4),(334,'2026-01-25','تحصيل فاتورة مبيعات #SI-2026-000046 - cheque',74,52,'2026-02-01 14:14:29','2026-02-01 14:14:29',3),(335,'2026-02-01','قيد سند صرف مخزني رقم #IV-1769961846437 - ',76,22,'2026-02-01 16:06:27','2026-02-01 16:06:27',82),(336,'2026-01-31','مصروف #23',79,23,'2026-02-02 09:55:58','2026-02-03 09:25:07',8),(337,'2026-01-31','مصروف #24',79,24,'2026-02-02 09:58:25','2026-02-03 09:25:07',8),(338,'2026-01-31','مصروف #25',79,25,'2026-02-02 09:58:56','2026-02-03 09:25:07',8),(339,'2026-01-31','مصروف #26',79,26,'2026-02-02 09:59:26','2026-02-03 09:25:07',8),(340,'2026-01-31','مصروف #27',79,27,'2026-02-02 10:00:06','2026-02-03 09:25:07',8),(341,'2026-01-31','مصروف #28',79,28,'2026-02-02 10:00:34','2026-02-03 09:25:07',8),(342,'2026-01-31','فاتورة غاز',79,29,'2026-02-02 10:01:41','2026-02-03 09:52:15',8),(343,'2026-01-31','بدل سفر طنطا ودمياط',79,30,'2026-02-02 10:04:23','2026-02-02 10:04:23',8),(344,'2026-01-28','التحويل الاسبوعي',75,NULL,'2026-02-02 10:10:27','2026-02-02 10:10:27',63),(345,'2026-01-31','مصروف #31',79,31,'2026-02-02 10:13:26','2026-02-02 10:13:26',8),(346,'2026-01-21','مرتجع مبيعات فاتورة #SI-2026-000099',18,6,'2026-02-02 16:05:02','2026-02-02 16:05:02',4),(347,'2026-01-21','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000099',77,6,'2026-02-02 16:05:02','2026-02-02 16:05:02',4),(348,'2026-02-01','عشاء مناديب',79,32,'2026-02-02 16:16:07','2026-02-02 16:16:07',8),(349,'2026-02-02','بن',79,33,'2026-02-02 16:16:33','2026-02-02 16:16:33',8),(350,'2026-01-31','مصروف #34',79,34,'2026-02-02 16:17:39','2026-02-02 16:17:39',8),(351,'2026-01-31','مصروف #35',79,35,'2026-02-02 16:20:36','2026-02-02 16:20:36',8),(352,'2026-01-31','سداد جزئي لجاري هاني صلاح نقدًا من الخزينه',75,NULL,'2026-02-02 16:33:01','2026-02-02 16:33:01',82),(353,'2026-02-01','قيد إثبات مبيعات - فاتورة #SI-2026-000129',16,129,'2026-02-03 07:59:14','2026-02-03 07:59:14',2),(354,'2026-02-01','قيد تكلفة مبيعات - فاتورة #SI-2026-000129',17,129,'2026-02-03 07:59:14','2026-02-03 07:59:14',2),(355,'2026-02-02','تحصيل فاتورة مبيعات #SI-2026-000125 - cash',74,53,'2026-02-03 08:08:52','2026-02-03 08:08:52',3),(356,'2026-02-01','تحصيل فاتورة مبيعات #SI-2026-000126 - cash',74,54,'2026-02-03 08:09:52','2026-02-03 08:09:52',3),(357,'2026-01-20','قيد إثبات مبيعات - فاتورة #SI-2026-000133',16,133,'2026-02-03 11:39:51','2026-02-03 11:39:51',2),(358,'2026-01-20','قيد تكلفة مبيعات - فاتورة #SI-2026-000133',17,133,'2026-02-03 11:39:51','2026-02-03 11:39:51',2),(359,'2026-01-21','تحصيل فاتورة مبيعات #SI-2026-000133 - cash',74,55,'2026-02-03 11:40:40','2026-02-03 11:40:40',3),(360,'2026-01-31','قيد سند صرف مخزني رقم #IV-1770119364434 - ',76,23,'2026-02-03 11:51:32','2026-02-03 11:51:32',82),(361,'2026-02-02','قيد إثبات مبيعات - فاتورة #SI-2026-000130',16,130,'2026-02-04 09:29:57','2026-02-04 09:29:57',2),(362,'2026-02-02','قيد تكلفة مبيعات - فاتورة #SI-2026-000130',17,130,'2026-02-04 09:29:57','2026-02-04 09:29:57',2),(363,'2026-02-03','تحصيل فاتورة مبيعات #SI-2026-000130 - cash',74,56,'2026-02-04 09:30:31','2026-02-04 09:30:31',3),(364,'2026-02-02','قيد إثبات مبيعات - فاتورة #SI-2026-000131',16,131,'2026-02-04 09:30:47','2026-02-04 09:30:47',2),(365,'2026-02-02','قيد تكلفة مبيعات - فاتورة #SI-2026-000131',17,131,'2026-02-04 09:30:47','2026-02-04 09:30:47',2),(366,'2026-02-02','قيد إثبات مبيعات - فاتورة #SI-2026-000132',16,132,'2026-02-04 09:31:05','2026-02-04 09:31:05',2),(367,'2026-02-02','قيد تكلفة مبيعات - فاتورة #SI-2026-000132',17,132,'2026-02-04 09:31:05','2026-02-04 09:31:05',2),(368,'2026-02-03','تحصيل فاتورة مبيعات #SI-2026-000132 - cash',74,57,'2026-02-04 09:31:29','2026-02-04 09:31:29',3),(369,'2026-02-04','تحصيل فاتورة مبيعات #SI-2026-000026 - cheque',74,58,'2026-02-04 09:33:35','2026-02-04 09:33:35',3),(370,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000068',78,68,'2026-02-04 09:37:12','2026-02-04 09:37:12',1),(371,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000065',78,65,'2026-02-04 09:37:54','2026-02-04 09:37:54',1),(372,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000063',78,63,'2026-02-04 09:38:30','2026-02-04 09:38:30',1),(373,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000061',78,61,'2026-02-04 09:39:08','2026-02-04 09:39:08',1),(374,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000060',78,60,'2026-02-04 09:39:40','2026-02-04 09:39:40',1),(375,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000059',78,59,'2026-02-04 09:39:55','2026-02-04 09:39:55',1),(376,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000058',78,58,'2026-02-04 09:40:16','2026-02-04 09:40:16',1),(377,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000057',78,57,'2026-02-04 09:41:23','2026-02-04 09:41:23',1),(378,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000056',78,56,'2026-02-04 09:42:02','2026-02-04 09:42:02',1),(379,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000055',78,55,'2026-02-04 09:42:16','2026-02-04 09:42:16',1),(380,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000052',78,52,'2026-02-04 09:43:56','2026-02-04 09:43:56',1),(381,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000051',78,51,'2026-02-04 09:44:14','2026-02-04 09:44:14',1),(382,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000049',78,49,'2026-02-04 09:44:29','2026-02-04 09:44:29',1),(383,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000044',78,44,'2026-02-04 09:45:00','2026-02-04 09:45:00',1),(384,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000041',78,41,'2026-02-04 09:45:43','2026-02-04 09:45:43',1),(385,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000040',78,40,'2026-02-04 09:45:59','2026-02-04 09:45:59',1),(386,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000039',78,39,'2026-02-04 09:46:18','2026-02-04 09:46:18',1),(387,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000038',78,38,'2026-02-04 09:46:32','2026-02-04 09:46:32',1),(388,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000037',78,37,'2026-02-04 09:46:44','2026-02-04 09:46:44',1),(389,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000036',78,36,'2026-02-04 09:47:00','2026-02-04 09:47:00',1),(390,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000034',78,34,'2026-02-04 09:47:21','2026-02-04 09:47:21',1),(391,'2026-01-26','تحصيل فاتورة مبيعات #SI-2026-000116 - cash',74,59,'2026-02-04 09:57:34','2026-02-04 09:57:34',3),(392,'2026-02-03','شريط لاصق',79,36,'2026-02-04 10:00:34','2026-02-04 10:00:34',8),(393,'2026-02-03','مي فكري',79,37,'2026-02-04 10:06:21','2026-02-04 10:06:21',8),(394,'2026-02-03','تحصيل فاتورة مبيعات #SI-2026-000041 - cash',74,60,'2026-02-04 10:11:24','2026-02-04 10:11:24',3),(395,'2026-02-03','قيد إثبات مبيعات - فاتورة #SI-2026-000135',16,135,'2026-02-04 10:13:49','2026-02-04 10:13:49',2),(396,'2026-02-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000135',17,135,'2026-02-04 10:13:49','2026-02-04 10:13:49',2),(397,'2026-01-26','مصاريف تكويد منتج',79,38,'2026-02-04 11:02:00','2026-02-04 11:02:00',8),(398,'2026-01-26','مصاريف تكويد منتج',79,39,'2026-02-04 11:03:10','2026-02-04 11:03:10',8),(399,'2026-01-31','تحصيل فاتورة مبيعات #SI-2026-000117 - cash',74,61,'2026-02-04 11:30:26','2026-02-04 11:30:26',3),(400,'2026-02-04','مرتجع مبيعات فاتورة #SI-2026-000135',18,7,'2026-02-04 14:34:19','2026-02-04 14:34:19',4),(401,'2026-02-04','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000135',77,7,'2026-02-04 14:34:19','2026-02-04 14:34:19',4),(402,'2026-02-04','ورق A4 ,باكو فايل شفاف ',79,40,'2026-02-04 14:41:05','2026-02-04 14:41:05',8),(403,'2026-01-31','تحصيل فاتورة مبيعات #SI-2026-000117 - cash',74,62,'2026-02-04 14:43:36','2026-02-04 14:43:36',3),(404,'2026-02-04','مصاريف تحليل المنتجات في وزارة الصحة',79,41,'2026-02-04 14:53:12','2026-02-04 14:53:12',8),(405,'2026-02-03','قيد إثبات مبيعات - فاتورة #SI-2026-000139',16,139,'2026-02-04 15:22:42','2026-02-04 15:22:42',2),(406,'2026-02-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000139',17,139,'2026-02-04 15:22:42','2026-02-04 15:22:42',2),(407,'2026-02-04','قيد إثبات مبيعات - فاتورة #SI-2026-000138',16,138,'2026-02-04 15:22:57','2026-02-04 15:22:57',2),(408,'2026-02-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000138',17,138,'2026-02-04 15:22:57','2026-02-04 15:22:57',2),(409,'2026-02-04','قيد إثبات مبيعات - فاتورة #SI-2026-000137',16,137,'2026-02-04 15:23:07','2026-02-04 15:23:07',2),(410,'2026-02-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000137',17,137,'2026-02-04 15:23:07','2026-02-04 15:23:07',2),(411,'2026-02-04','قيد إثبات مبيعات - فاتورة #SI-2026-000136',16,136,'2026-02-04 15:23:26','2026-02-04 15:23:26',2),(412,'2026-02-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000136',17,136,'2026-02-04 15:23:26','2026-02-04 15:23:26',2),(413,'2026-02-02','قيد إثبات مبيعات - فاتورة #SI-2026-000140',16,140,'2026-02-04 15:30:32','2026-02-04 15:30:32',2),(414,'2026-02-04','تحصيل فاتورة مبيعات #SI-2026-000140 - cash',74,63,'2026-02-04 15:31:37','2026-02-04 15:31:37',3),(415,'2026-02-02','قيد سند صرف مخزني رقم #IV-1770219152799 - ساره سيف الدين هيلثي داي',76,24,'2026-02-04 15:35:54','2026-02-04 15:35:54',82),(416,'2026-02-04','قيد سند صرف مخزني رقم #IV-1770221237530 - ',76,25,'2026-02-04 16:08:28','2026-02-04 16:08:28',82),(417,'2026-02-04','هدايا',79,42,'2026-02-05 02:07:45','2026-02-05 02:07:45',8),(418,'2026-01-31','شوكولاته',79,43,'2026-02-05 02:11:14','2026-02-05 02:11:14',8),(419,'2026-01-31','هدية عيد ميلاد',79,44,'2026-02-05 02:14:24','2026-02-05 02:14:24',8),(420,'2026-01-31','شوكولاته',79,45,'2026-02-05 02:17:09','2026-02-05 02:17:09',8),(421,'2026-01-31','افتتاح عياده',79,46,'2026-02-05 02:19:04','2026-02-05 02:19:04',8),(422,'2026-01-31','افتتاح عياده',79,47,'2026-02-05 02:19:49','2026-02-05 02:19:49',8),(423,'2026-01-31','افتتاح عياده (فضة)',79,48,'2026-02-05 02:22:37','2026-02-05 02:22:37',8),(424,'2026-01-31','سبونسر هيليثي داي',79,49,'2026-02-05 02:24:28','2026-02-05 02:24:28',8),(425,'2026-01-31','مصروف #50',79,50,'2026-02-05 02:25:16','2026-02-05 02:25:16',8),(426,'2026-01-31','مصروف #51',79,51,'2026-02-05 02:28:26','2026-02-05 02:28:26',8),(427,'2026-01-31','مصروف #52',79,52,'2026-02-05 02:30:04','2026-02-05 02:30:04',8),(428,'2026-01-31','هدية عيد ميلاد (شال)',79,53,'2026-02-05 02:34:04','2026-02-05 02:34:04',8),(429,'2026-01-31','مصروف #54',79,54,'2026-02-05 02:35:59','2026-02-05 02:35:59',8),(430,'2026-01-31','مصروف #55',79,55,'2026-02-05 02:37:15','2026-02-05 02:37:15',8),(431,'2026-01-31','مصروف #56',79,56,'2026-02-05 02:38:38','2026-02-05 02:38:38',8),(432,'2026-01-31','مصروف #57',79,57,'2026-02-05 02:39:29','2026-02-05 02:39:29',8),(433,'2026-02-05','فاتورة خدمة #1 - أمر تشغيل #1',82,1,'2026-02-05 19:20:41','2026-02-05 19:20:41',13),(434,'2026-02-04','قيد سند صرف مخزني رقم #IV-1770453322952 - تقى خالد سليمان',76,26,'2026-02-07 08:37:27','2026-02-07 08:37:27',82),(435,'2026-02-05','تحصيل فاتورة مبيعات #SI-2026-000137 - cash',74,64,'2026-02-07 09:02:38','2026-02-07 09:02:38',3),(436,'2026-02-05','تحصيل فاتورة مبيعات #SI-2026-000138 - cash',74,65,'2026-02-07 09:04:16','2026-02-07 09:04:16',3),(437,'2026-02-04','التحويل الاسبوعي',75,NULL,'2026-02-07 09:11:51','2026-02-07 09:11:51',63),(438,'2026-02-05','فاتورة التليفون',79,58,'2026-02-07 09:30:03','2026-02-07 09:30:03',8),(439,'2026-02-06','فاتورة التليفون',79,59,'2026-02-07 09:30:57','2026-02-07 09:30:57',8),(440,'2026-02-07','فاتورة انترنت',79,60,'2026-02-07 09:32:04','2026-02-07 09:32:04',8),(441,'2026-02-05','قيد سند صرف مخزني رقم #IV-1770457827913 - د.نهال احمد',76,27,'2026-02-07 09:52:13','2026-02-07 09:52:13',82),(442,'2026-02-05','قيد إثبات مبيعات - فاتورة #SI-2026-000141',16,141,'2026-02-07 09:55:27','2026-02-07 09:55:27',2),(443,'2026-02-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000141',17,141,'2026-02-07 09:55:27','2026-02-07 09:55:27',2),(444,'2026-02-05','قيد إثبات مبيعات - فاتورة #SI-2026-000142',16,142,'2026-02-07 09:55:49','2026-02-07 09:55:49',2),(445,'2026-02-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000142',17,142,'2026-02-07 09:55:49','2026-02-07 09:55:49',2),(446,'2026-02-05','قيد إثبات مبيعات - فاتورة #SI-2026-000143',16,143,'2026-02-07 09:56:03','2026-02-07 09:56:03',2),(447,'2026-02-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000143',17,143,'2026-02-07 09:56:03','2026-02-07 09:56:03',2),(448,'2026-02-07','قيد إثبات مبيعات - فاتورة #SI-2026-000144',16,144,'2026-02-08 09:07:00','2026-02-08 09:07:00',2),(449,'2026-02-07','قيد تكلفة مبيعات - فاتورة #SI-2026-000144',17,144,'2026-02-08 09:07:00','2026-02-08 09:07:00',2),(450,'2026-02-07','تحصيل فاتورة مبيعات #SI-2026-000054 - cash',74,66,'2026-02-08 09:09:07','2026-02-08 09:09:07',3),(451,'2026-02-08','تحصيل فاتورة مبيعات #SI-2026-000143 - cash',74,67,'2026-02-09 09:12:39','2026-02-09 09:12:39',3),(452,'2026-02-08','تحصيل فاتورة مبيعات #SI-2026-000066 - cash',74,68,'2026-02-09 09:31:18','2026-02-09 09:31:18',3),(453,'2026-02-08','تحصيل فاتورة مبيعات #SI-2026-000015 - cash',74,69,'2026-02-09 09:32:33','2026-02-09 09:32:33',3),(454,'2026-02-08','قيد إثبات مبيعات - فاتورة #SI-2026-000147',16,147,'2026-02-09 09:44:07','2026-02-09 09:44:07',2),(455,'2026-02-08','قيد تكلفة مبيعات - فاتورة #SI-2026-000147',17,147,'2026-02-09 09:44:07','2026-02-09 09:44:07',2),(456,'2026-02-03','قيد إثبات مبيعات - فاتورة #SI-2026-000134',16,134,'2026-02-10 08:14:28','2026-02-10 08:14:28',2),(457,'2026-02-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000134',17,134,'2026-02-10 08:14:28','2026-02-10 08:14:28',2),(458,'2026-02-09','تحصيل فاتورة مبيعات #SI-2026-000034 - cash',74,70,'2026-02-10 08:17:34','2026-02-10 08:17:34',3),(459,'2026-02-09','تحصيل فاتورة مبيعات #SI-2026-000064 - cash',74,71,'2026-02-10 08:19:51','2026-02-10 08:19:51',3),(460,'2026-02-09','تحصيل فاتورة مبيعات #SI-2026-000014 - cash',74,72,'2026-02-10 08:21:43','2026-02-10 08:21:43',3),(461,'2026-02-03','قيد سند صرف مخزني رقم #IV-1770715248362 - استعواض شهر 12',76,28,'2026-02-10 09:22:42','2026-02-10 09:22:42',82),(462,'2026-02-03','قيد إثبات مبيعات - فاتورة #SI-2026-000149',16,149,'2026-02-10 09:24:56','2026-02-10 09:24:56',2),(463,'2026-02-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000149',17,149,'2026-02-10 09:24:56','2026-02-10 09:24:56',2),(464,'2026-02-03','تحصيل فاتورة مبيعات #SI-2026-000149 - cash',74,73,'2026-02-10 09:25:42','2026-02-10 09:25:42',3),(465,'2026-02-03','قيد إثبات مبيعات - فاتورة #SI-2026-000150',16,150,'2026-02-10 09:28:30','2026-02-10 09:28:30',2),(466,'2026-02-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000150',17,150,'2026-02-10 09:28:30','2026-02-10 09:28:30',2),(467,'2026-02-03','تحصيل فاتورة مبيعات #SI-2026-000150 - cash',74,74,'2026-02-10 09:29:00','2026-02-10 09:29:00',3),(468,'2026-02-07','قيد إثبات مبيعات - فاتورة #SI-2026-000151',16,151,'2026-02-10 09:36:25','2026-02-10 09:36:25',2),(469,'2026-02-07','قيد تكلفة مبيعات - فاتورة #SI-2026-000151',17,151,'2026-02-10 09:36:25','2026-02-10 09:36:25',2),(470,'2026-02-07','قيد إثبات مبيعات - فاتورة #SI-2026-000152',16,152,'2026-02-10 09:39:08','2026-02-10 09:39:08',2),(471,'2026-02-07','قيد تكلفة مبيعات - فاتورة #SI-2026-000152',17,152,'2026-02-10 09:39:08','2026-02-10 09:39:08',2),(472,'2026-02-10','زكاه',79,61,'2026-02-10 10:20:13','2026-02-10 10:20:13',8),(473,'2026-02-10','زكاه',79,62,'2026-02-10 10:20:40','2026-02-10 10:20:40',8),(474,'2026-01-31','مصروف #63',79,63,'2026-02-10 10:21:39','2026-02-10 10:21:39',8),(475,'2026-02-10','بدل سفر طنطا ودمياط والزقازيق',79,64,'2026-02-10 10:22:41','2026-02-10 10:22:41',8),(476,'2026-02-10','شيت مبيعات مخزن الشمس',79,65,'2026-02-10 10:24:00','2026-02-10 10:24:00',8),(477,'2026-02-10','قيد إثبات مبيعات - فاتورة #SI-2026-000154',16,154,'2026-02-11 08:10:08','2026-02-11 08:10:08',2),(478,'2026-02-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000154',17,154,'2026-02-11 08:10:09','2026-02-11 08:10:09',2),(479,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000070 - cash',74,75,'2026-02-11 08:10:58','2026-02-11 08:10:58',3),(480,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000058 - cash',74,76,'2026-02-11 08:11:58','2026-02-11 08:11:58',3),(481,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000009 - cash',74,77,'2026-02-11 08:13:10','2026-02-11 08:13:10',3),(482,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000106 - cash',74,78,'2026-02-11 08:14:15','2026-02-11 08:14:15',3),(483,'2026-02-11','قيد إثبات مبيعات - فاتورة #SI-2026-000155',16,155,'2026-02-11 08:18:55','2026-02-11 08:18:55',2),(484,'2026-02-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000155',17,155,'2026-02-11 08:18:55','2026-02-11 08:18:55',2),(485,'2026-02-10','قيد إثبات مبيعات - فاتورة #SI-2026-000153',16,153,'2026-02-11 23:22:38','2026-02-11 23:22:38',2),(486,'2026-02-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000153',17,153,'2026-02-11 23:22:38','2026-02-11 23:22:38',2),(487,'2026-02-07','قيد إثبات مبيعات - فاتورة #SI-2026-000156',16,156,'2026-02-11 23:26:12','2026-02-11 23:26:12',2),(488,'2026-02-07','قيد تكلفة مبيعات - فاتورة #SI-2026-000156',17,156,'2026-02-11 23:26:12','2026-02-11 23:26:12',2),(489,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000156 - bank_transfer',74,79,'2026-02-11 23:26:54','2026-02-11 23:26:54',3),(490,'2026-02-10','قيد إثبات مبيعات - فاتورة #SI-2026-000157',16,157,'2026-02-11 23:28:56','2026-02-11 23:28:56',2),(491,'2026-02-10','قيد تكلفة مبيعات - فاتورة #SI-2026-000157',17,157,'2026-02-11 23:28:56','2026-02-11 23:28:56',2),(492,'2026-02-11','تحصيل فاتورة مبيعات #SI-2026-000157 - bank_transfer',74,80,'2026-02-11 23:29:28','2026-02-11 23:29:28',3),(493,'2026-02-09','قيد إثبات مبيعات - فاتورة #SI-2026-000158',16,158,'2026-02-11 23:37:14','2026-02-11 23:37:14',2),(494,'2026-02-09','قيد تكلفة مبيعات - فاتورة #SI-2026-000158',17,158,'2026-02-11 23:37:14','2026-02-11 23:37:14',2),(495,'2026-02-09','قيد إثبات مبيعات - فاتورة #SI-2026-000159',16,159,'2026-02-11 23:42:26','2026-02-11 23:42:26',2),(496,'2026-02-09','قيد تكلفة مبيعات - فاتورة #SI-2026-000159',17,159,'2026-02-11 23:42:26','2026-02-11 23:42:26',2),(497,'2026-02-08','قيد إثبات مبيعات - فاتورة #SI-2026-000146',16,146,'2026-02-11 23:54:21','2026-02-11 23:54:21',2),(498,'2026-02-08','قيد تكلفة مبيعات - فاتورة #SI-2026-000146',17,146,'2026-02-11 23:54:21','2026-02-11 23:54:21',2),(499,'2026-02-11','قيد إثبات مبيعات - فاتورة #SI-2026-000160',16,160,'2026-02-11 23:57:39','2026-02-11 23:57:39',2),(500,'2026-02-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000160',17,160,'2026-02-11 23:57:39','2026-02-11 23:57:39',2),(501,'2026-02-09','قيد إثبات مبيعات - فاتورة #SI-2026-000161',16,161,'2026-02-12 00:21:02','2026-02-12 00:21:02',2),(502,'2026-02-09','قيد تكلفة مبيعات - فاتورة #SI-2026-000161',17,161,'2026-02-12 00:21:02','2026-02-12 00:21:02',2),(503,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000161 - cash',74,81,'2026-02-12 00:21:48','2026-02-12 00:21:48',3),(504,'2026-02-11','قيد إثبات مبيعات - فاتورة #SI-2026-000162',16,162,'2026-02-12 00:28:57','2026-02-12 00:28:57',2),(505,'2026-02-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000162',17,162,'2026-02-12 00:28:57','2026-02-12 00:28:57',2),(506,'2026-02-11','قيد سند صرف مخزني رقم #IV-1770856648499 - عينه لدكتور هاني احمد صلاح',76,29,'2026-02-12 00:39:39','2026-02-12 00:39:39',82),(507,'2026-02-11','قيد سند صرف مخزني رقم #IV-1770856782921 - عينه لساره محمود عبد الحفيظ صالح',76,30,'2026-02-12 00:40:42','2026-02-12 00:40:42',82),(508,'2026-02-11','قيد سند صرف مخزني رقم #IV-1770856849466 - مقابل تكويد المنتجات في مخزن الدرسات',76,31,'2026-02-12 00:43:11','2026-02-12 00:43:11',82),(509,'2026-02-11','قيد سند صرف مخزني رقم #IV-1770856998614 - ',76,32,'2026-02-12 00:43:55','2026-02-12 00:43:55',82),(510,'2026-02-09','قيد إثبات مبيعات - فاتورة #SI-2026-000148',16,148,'2026-02-12 00:44:37','2026-02-12 00:44:37',2),(511,'2026-02-09','قيد تكلفة مبيعات - فاتورة #SI-2026-000148',17,148,'2026-02-12 00:44:37','2026-02-12 00:44:37',2),(512,'2026-02-07','قيد إثبات مبيعات - فاتورة #SI-2026-000145',16,145,'2026-02-12 00:46:34','2026-02-12 00:46:34',2),(513,'2026-02-07','قيد تكلفة مبيعات - فاتورة #SI-2026-000145',17,145,'2026-02-12 00:46:34','2026-02-12 00:46:34',2),(514,'2026-02-08','قيد إثبات مبيعات - فاتورة #SI-2026-000163',16,163,'2026-02-12 09:57:34','2026-02-12 09:57:34',2),(515,'2026-02-08','قيد تكلفة مبيعات - فاتورة #SI-2026-000163',17,163,'2026-02-12 09:57:34','2026-02-12 09:57:34',2),(516,'2026-02-08','تحصيل فاتورة مبيعات #SI-2026-000082 - cash',74,82,'2026-02-12 10:00:39','2026-02-12 10:00:39',3),(517,'2026-02-11','قيد إثبات مبيعات - فاتورة #SI-2026-000164',16,164,'2026-02-12 10:06:51','2026-02-12 10:06:51',2),(518,'2026-02-11','قيد تكلفة مبيعات - فاتورة #SI-2026-000164',17,164,'2026-02-12 10:06:51','2026-02-12 10:06:51',2),(519,'2026-02-11','تحصيل فاتورة مبيعات #SI-2026-000164 - cash',74,83,'2026-02-12 10:17:20','2026-02-12 10:17:20',3),(520,'2026-02-11','تحصيل فاتورة مبيعات #SI-2026-000031 - cash',74,84,'2026-02-12 11:59:46','2026-02-12 11:59:46',3),(521,'2026-02-11','تحصيل فاتورة مبيعات #SI-2026-000028 - cash',74,85,'2026-02-12 12:01:06','2026-02-12 12:01:06',3),(522,'2026-02-11','تحصيل فاتورة مبيعات #SI-2026-000054 - cash',74,86,'2026-02-12 12:34:29','2026-02-12 12:34:29',3),(523,'2026-02-04','قيد إثبات مبيعات - فاتورة #SI-2026-000165',16,165,'2026-02-12 17:41:14','2026-02-12 17:41:14',2),(524,'2026-02-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000165',17,165,'2026-02-12 17:41:15','2026-02-12 17:41:15',2),(525,'2026-02-13','تقى خالد',79,66,'2026-02-13 21:58:42','2026-02-13 21:58:42',8),(526,'2026-02-13','بروشورات',79,67,'2026-02-13 22:00:38','2026-02-13 22:00:38',8),(527,'2026-02-09','فاتورة مياه',79,68,'2026-02-13 22:59:44','2026-02-13 22:59:44',8),(528,'2026-02-04','لوجو 20 بوكس بلوجر',79,69,'2026-02-13 23:02:53','2026-02-13 23:02:53',8),(529,'2026-02-04','لوجو 40 بوكس هدايا رمضان للدكاترة',79,70,'2026-02-13 23:04:40','2026-02-13 23:04:40',8),(530,'2026-02-04','20 بوكس للبلوجر',79,71,'2026-02-13 23:05:40','2026-02-13 23:05:40',8),(531,'2026-02-07','مصروف #72',79,72,'2026-02-13 23:07:01','2026-02-13 23:07:01',8),(532,'2026-02-10','مقص',79,73,'2026-02-13 23:08:37','2026-02-13 23:08:37',8),(533,'2026-02-12','سجل تجاري',79,74,'2026-02-13 23:16:49','2026-02-13 23:16:49',8),(534,'2026-02-12','سجل تجاري',79,75,'2026-02-13 23:17:29','2026-02-13 23:17:29',8),(535,'2026-02-13','سجل تجاري',79,76,'2026-02-13 23:18:09','2026-02-13 23:18:09',8),(536,'2026-02-12','نيهال بلوجر',79,77,'2026-02-13 23:19:13','2026-02-13 23:19:13',8),(537,'2026-02-12','بروشورات',79,78,'2026-02-13 23:20:16','2026-02-13 23:20:16',8),(538,'2026-02-11','مقص',79,79,'2026-02-13 23:21:13','2026-02-13 23:21:13',8),(539,'2026-02-11','دبل فيس×2',79,80,'2026-02-13 23:23:43','2026-02-13 23:23:43',8),(540,'2026-02-11','كور فوم',79,81,'2026-02-13 23:24:58','2026-02-13 23:24:58',8),(541,'2026-02-11','كيلو ونصف شوكولاته من سوافل هدايا رمضان للدكاترة',79,82,'2026-02-13 23:28:46','2026-02-13 23:28:46',8),(542,'2026-02-11','2 كيلو شوكولاته من سوافل هدايا رمضان للدكاترة',79,83,'2026-02-13 23:52:03','2026-02-13 23:52:03',8),(543,'2026-02-11','كيلو ونصف شوكولاته من لينزا هدايا رمضان للدكاترة',79,84,'2026-02-13 23:59:09','2026-02-13 23:59:09',8),(544,'2026-02-11','3 كيلو تمر هدايا رمضان للدكاتره',79,85,'2026-02-14 00:00:20','2026-02-14 00:00:20',8),(545,'2026-02-11','3 كيلو تمر هدايا رمضان للدكاتره',79,86,'2026-02-14 00:00:55','2026-02-14 00:00:55',8),(546,'2026-02-11','علب للتمر هدايا رمضان للدكاتره',79,87,'2026-02-14 00:01:43','2026-02-14 00:01:43',8),(547,'2026-02-14','4 سبح ورمضان كريم هدايا رمضان للدكاتره',79,88,'2026-02-14 00:02:54','2026-02-14 00:02:54',8),(548,'2026-02-11','اسفينج هدايا رمضان للدكاتره',79,89,'2026-02-14 00:03:49','2026-02-14 00:03:49',8),(549,'2026-02-11','تحصيل فاتورة مبيعات #SI-2026-000155 - cash',74,87,'2026-02-14 08:27:58','2026-02-14 08:27:58',3),(550,'2026-02-14','زكاه',79,90,'2026-02-14 11:05:25','2026-02-14 11:05:25',8),(551,'2026-02-14','بن',79,91,'2026-02-15 08:28:57','2026-02-15 08:28:57',8),(552,'2026-02-14','بدل سفر طنطا وكفر الشيخ ومنية النصر',79,92,'2026-02-15 08:30:06','2026-02-15 08:30:06',8),(553,'2026-02-14','لاصق لكراتين رمضان',79,93,'2026-02-15 08:36:50','2026-02-15 08:36:50',8),(554,'2026-02-14','ملفين كرتون',79,94,'2026-02-15 08:38:31','2026-02-15 08:38:31',8),(555,'2026-02-14','قيد إثبات مبيعات - فاتورة #SI-2026-000167',16,167,'2026-02-15 08:39:46','2026-02-15 08:39:46',2),(556,'2026-02-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000167',17,167,'2026-02-15 08:39:46','2026-02-15 08:39:46',2),(557,'2026-02-14','تحصيل فاتورة مبيعات #SI-2026-000167 - cash',74,88,'2026-02-15 08:40:21','2026-02-15 08:40:21',3),(558,'2026-02-14','قيد إثبات مبيعات - فاتورة #SI-2026-000168',16,168,'2026-02-15 08:54:39','2026-02-15 08:54:39',2),(559,'2026-02-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000168',17,168,'2026-02-15 08:54:39','2026-02-15 08:54:39',2),(560,'2026-02-14','قيد إثبات مبيعات - فاتورة #SI-2026-000171',16,171,'2026-02-15 09:08:54','2026-02-15 09:08:54',2),(561,'2026-02-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000171',17,171,'2026-02-15 09:08:54','2026-02-15 09:08:54',2),(562,'2026-02-14','تحصيل فاتورة مبيعات #SI-2026-000171 - cash',74,89,'2026-02-15 09:09:30','2026-02-15 09:09:30',3),(563,'2026-02-14','قيد إثبات مبيعات - فاتورة #SI-2026-000166',16,166,'2026-02-15 09:27:11','2026-02-15 09:27:11',2),(564,'2026-02-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000166',17,166,'2026-02-15 09:27:11','2026-02-15 09:27:11',2),(565,'2026-02-14','تحصيل فاتورة مبيعات #SI-2026-000131 - cash',74,90,'2026-02-15 09:53:59','2026-02-15 09:53:59',3),(566,'2026-02-11','التحويل الاسبوعي',75,NULL,'2026-02-15 10:00:25','2026-02-15 10:00:25',63),(567,'2026-02-15','رصيد أول المدة - فاتورة #SI-2026-000175',78,175,'2026-02-15 11:07:44','2026-02-15 11:07:44',1),(568,'2026-01-31','سداد فاتورة مشتريات #PI-2026-000001 - bank_transfer',83,1,'2026-02-15 14:43:12','2026-02-15 14:43:12',6),(569,'2026-02-16','إقفال أمر تشغيل خارجي #1 - استلام منتج تام',84,1,'2026-02-16 09:09:07','2026-02-16 09:09:07',13),(570,'2026-02-16','قيد إثبات مبيعات - فاتورة #SI-2026-000177',16,177,'2026-02-16 09:23:47','2026-02-16 09:23:47',2),(571,'2026-02-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000177',17,177,'2026-02-16 09:23:47','2026-02-16 09:23:47',2),(572,'2026-02-16','قيد إثبات مبيعات - فاتورة #SI-2026-000179',16,179,'2026-02-16 09:32:21','2026-02-16 09:32:21',2),(573,'2026-02-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000179',17,179,'2026-02-16 09:32:21','2026-02-16 09:32:21',2),(574,'2026-02-16','قيد إثبات مبيعات - فاتورة #SI-2026-000178',16,178,'2026-02-16 09:32:36','2026-02-16 09:32:36',2),(575,'2026-02-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000178',17,178,'2026-02-16 09:32:36','2026-02-16 09:32:36',2),(576,'2026-02-16','مرتجع مبيعات فاتورة #SI-2026-000068',18,8,'2026-02-17 08:53:02','2026-02-17 08:53:02',4),(577,'2026-02-16','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000068',77,8,'2026-02-17 08:53:02','2026-02-17 08:53:02',4),(578,'2026-02-16','تحصيل فاتورة مبيعات #SI-2026-000068 - cash',74,91,'2026-02-17 08:54:27','2026-02-17 08:54:27',3),(579,'2026-02-15','قيد إثبات مبيعات - فاتورة #SI-2026-000176',16,176,'2026-02-17 10:21:54','2026-02-17 10:21:54',2),(580,'2026-02-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000176',17,176,'2026-02-17 10:21:54','2026-02-17 10:21:54',2),(581,'2026-02-16','تحصيل فاتورة مبيعات #SI-2026-000015 - cash',74,92,'2026-02-17 10:24:08','2026-02-17 10:24:08',3),(582,'2026-02-16','تحصيل فاتورة مبيعات #SI-2026-000115 - cash',74,93,'2026-02-17 10:24:58','2026-02-17 10:24:58',3),(583,'2026-02-16','قيد إثبات مبيعات - فاتورة #SI-2026-000180',16,180,'2026-02-17 10:47:52','2026-02-17 10:47:52',2),(584,'2026-02-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000180',17,180,'2026-02-17 10:47:52','2026-02-17 10:47:52',2),(585,'2026-02-15','قيد إثبات مبيعات - فاتورة #SI-2026-000174',16,174,'2026-02-17 11:00:19','2026-02-17 11:00:19',2),(586,'2026-02-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000174',17,174,'2026-02-17 11:00:19','2026-02-17 11:00:19',2),(587,'2026-02-15','قيد إثبات مبيعات - فاتورة #SI-2026-000173',16,173,'2026-02-17 11:00:30','2026-02-17 11:00:30',2),(588,'2026-02-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000173',17,173,'2026-02-17 11:00:30','2026-02-17 11:00:30',2),(589,'2026-02-15','قيد إثبات مبيعات - فاتورة #SI-2026-000172',16,172,'2026-02-17 11:00:45','2026-02-17 11:00:45',2),(590,'2026-02-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000172',17,172,'2026-02-17 11:00:45','2026-02-17 11:00:45',2),(591,'2026-02-15','قيد إثبات مبيعات - فاتورة #SI-2026-000170',16,170,'2026-02-17 11:01:16','2026-02-17 11:01:16',2),(592,'2026-02-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000170',17,170,'2026-02-17 11:01:16','2026-02-17 11:01:16',2),(593,'2026-02-14','قيد إثبات مبيعات - فاتورة #SI-2026-000169',16,169,'2026-02-17 11:01:35','2026-02-17 11:01:35',2),(594,'2026-02-14','قيد تكلفة مبيعات - فاتورة #SI-2026-000169',17,169,'2026-02-17 11:01:35','2026-02-17 11:01:35',2),(595,'2026-02-12','تحصيل فاتورة مبيعات #SI-2026-000169 - cash',74,94,'2026-02-17 11:02:07','2026-02-17 11:02:07',3),(596,'2026-02-12','تحصيل فاتورة مبيعات #SI-2026-000162 - cash',74,95,'2026-02-17 11:03:22','2026-02-17 11:03:22',3),(597,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000148 - cash',74,96,'2026-02-17 11:03:47','2026-02-17 11:03:47',3),(598,'2026-02-10','تحصيل فاتورة مبيعات #SI-2026-000142 - cash',74,97,'2026-02-17 11:04:51','2026-02-17 11:04:51',3),(599,'2026-02-17','بدل سفر الزقازيق',79,95,'2026-02-17 12:34:09','2026-02-17 12:34:09',8),(600,'2026-02-17','بلاستر لاصق',79,96,'2026-02-17 12:34:58','2026-02-17 12:34:58',8),(601,'2026-02-17','مصروف #97',79,97,'2026-02-17 12:35:20','2026-02-17 12:35:20',8),(602,'2026-02-16','قيد سند صرف مخزني رقم #IV-1771406026687 - مقابل تكويد المنتج face Glow',76,33,'2026-02-18 09:14:59','2026-02-18 09:14:59',82),(603,'2026-02-17','قيد إثبات مبيعات - فاتورة #SI-2026-000183',16,183,'2026-02-18 09:17:34','2026-02-18 09:17:34',2),(604,'2026-02-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000183',17,183,'2026-02-18 09:17:34','2026-02-18 09:17:34',2),(605,'2026-02-17','قيد إثبات مبيعات - فاتورة #SI-2026-000182',16,182,'2026-02-18 09:17:53','2026-02-18 09:17:53',2),(606,'2026-02-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000182',17,182,'2026-02-18 09:17:53','2026-02-18 09:17:53',2),(607,'2026-02-16','قيد إثبات مبيعات - فاتورة #SI-2026-000187',16,187,'2026-02-18 09:46:55','2026-02-18 09:46:55',2),(608,'2026-02-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000187',17,187,'2026-02-18 09:46:55','2026-02-18 09:46:55',2),(609,'2026-02-16','قيد إثبات مبيعات - فاتورة #SI-2026-000186',16,186,'2026-02-18 09:47:29','2026-02-18 09:47:29',2),(610,'2026-02-16','قيد تكلفة مبيعات - فاتورة #SI-2026-000186',17,186,'2026-02-18 09:47:29','2026-02-18 09:47:29',2),(611,'2026-02-18','تنظيف المكتب',79,98,'2026-02-18 10:10:32','2026-02-18 10:10:32',8),(612,'2026-02-18','تقى خالد',79,99,'2026-02-18 10:11:25','2026-02-18 10:11:25',8),(613,'2026-02-18','الاجتماع الشهري',79,100,'2026-02-18 10:12:17','2026-02-18 10:12:17',8),(614,'2026-02-16','مرتجع مبيعات فاتورة #SI-2026-000033',18,9,'2026-02-18 11:40:01','2026-02-18 11:40:01',4),(615,'2026-02-16','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000033',77,9,'2026-02-18 11:40:02','2026-02-18 11:40:02',4),(616,'2026-02-17','مرتجع مبيعات فاتورة #SI-2026-000033',18,10,'2026-02-18 11:42:30','2026-02-18 11:42:30',4),(617,'2026-02-17','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000033',77,10,'2026-02-18 11:42:30','2026-02-18 11:42:30',4),(618,'2026-02-15','تحصيل فاتورة مبيعات #SI-2026-000101 - cash',74,98,'2026-02-19 15:11:25','2026-02-19 15:11:25',3),(619,'2026-02-15','تحصيل فاتورة مبيعات #SI-2026-000046 - cheque',74,99,'2026-02-19 15:25:22','2026-02-19 15:25:22',3),(620,'2026-02-16','تحصيل فاتورة مبيعات #SI-2026-000175 - cash',74,100,'2026-02-19 15:45:39','2026-02-19 15:45:39',3),(621,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000038 - cash',74,101,'2026-02-19 17:43:53','2026-02-19 17:43:53',3),(622,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000039 - cash',74,102,'2026-02-19 17:45:41','2026-02-19 17:45:41',3),(623,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000063 - cash',74,103,'2026-02-19 17:48:11','2026-02-19 17:48:11',3),(624,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000179 - cash',74,104,'2026-02-19 17:49:17','2026-02-19 17:49:17',3),(625,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000174 - cash',74,105,'2026-02-19 17:50:01','2026-02-19 17:50:01',3),(626,'2026-02-15','قيد إثبات مبيعات - فاتورة #SI-2026-000190',16,190,'2026-02-19 17:50:47','2026-02-19 17:50:47',2),(627,'2026-02-15','قيد تكلفة مبيعات - فاتورة #SI-2026-000190',17,190,'2026-02-19 17:50:48','2026-02-19 17:50:48',2),(628,'2026-02-15','تحصيل فاتورة مبيعات #SI-2026-000190 - cash',74,106,'2026-02-19 17:51:11','2026-02-19 17:51:11',3),(629,'2026-02-17','قيد إثبات مبيعات - فاتورة #SI-2026-000185',16,185,'2026-02-19 17:53:46','2026-02-19 17:53:46',2),(630,'2026-02-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000185',17,185,'2026-02-19 17:53:46','2026-02-19 17:53:46',2),(631,'2026-02-18','قيد سند صرف مخزني رقم #IV-1771524763231 - ',76,34,'2026-02-19 18:13:38','2026-02-19 18:13:38',82),(632,'2026-02-18','قيد إثبات مبيعات - فاتورة #SI-2026-000188',16,188,'2026-02-19 18:14:29','2026-02-19 18:14:29',2),(633,'2026-02-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000188',17,188,'2026-02-19 18:14:29','2026-02-19 18:14:29',2),(634,'2026-02-17','قيد إثبات مبيعات - فاتورة #SI-2026-000184',16,184,'2026-02-19 18:17:41','2026-02-19 18:17:41',2),(635,'2026-02-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000184',17,184,'2026-02-19 18:17:41','2026-02-19 18:17:41',2),(636,'2026-02-17','قيد إثبات مبيعات - فاتورة #SI-2026-000181',16,181,'2026-02-19 18:19:44','2026-02-19 18:19:44',2),(637,'2026-02-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000181',17,181,'2026-02-19 18:19:44','2026-02-19 18:19:44',2),(638,'2026-02-17','قيد إثبات مبيعات - فاتورة #SI-2026-000191',16,191,'2026-02-19 18:24:34','2026-02-19 18:24:34',2),(639,'2026-02-17','قيد تكلفة مبيعات - فاتورة #SI-2026-000191',17,191,'2026-02-19 18:24:34','2026-02-19 18:24:34',2),(640,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000034 - cash',74,107,'2026-02-19 18:27:34','2026-02-19 18:27:34',3),(641,'2026-02-15','قيد سند صرف مخزني رقم #IV-1771590881567 - ',76,35,'2026-02-20 12:39:33','2026-02-20 12:39:33',82),(642,'2026-02-15','قيد سند صرف مخزني رقم #IV-1771591474148 - ',76,36,'2026-02-20 12:47:41','2026-02-20 12:47:41',82),(643,'2026-02-15','قيد سند صرف مخزني رقم #IV-1771592042469 - ',76,37,'2026-02-20 13:00:06','2026-02-20 13:00:06',82),(644,'2026-02-17','قيد سند صرف مخزني رقم #IV-1771592893732 - ',76,38,'2026-02-20 13:09:06','2026-02-20 13:09:06',82),(645,'2026-02-17','قيد سند صرف مخزني رقم #IV-1771592968533 - عينات مجانيه للمناديب',76,39,'2026-02-20 13:11:41','2026-02-20 13:11:41',82),(646,'2026-02-19','قيد إثبات مبيعات - فاتورة #SI-2026-000193',16,193,'2026-02-21 08:20:27','2026-02-21 08:20:27',2),(647,'2026-02-19','قيد تكلفة مبيعات - فاتورة #SI-2026-000193',17,193,'2026-02-21 08:20:27','2026-02-21 08:20:27',2),(648,'2026-02-19','قيد إثبات مبيعات - فاتورة #SI-2026-000194',16,194,'2026-02-21 08:21:47','2026-02-21 08:21:47',2),(649,'2026-02-19','قيد تكلفة مبيعات - فاتورة #SI-2026-000194',17,194,'2026-02-21 08:21:47','2026-02-21 08:21:47',2),(650,'2026-02-19','قيد إثبات مبيعات - فاتورة #SI-2026-000195',16,195,'2026-02-21 08:25:57','2026-02-21 08:25:57',2),(651,'2026-02-19','قيد تكلفة مبيعات - فاتورة #SI-2026-000195',17,195,'2026-02-21 08:25:57','2026-02-21 08:25:57',2),(652,'2026-02-15','مرتجع مبيعات فاتورة #SI-2026-000040',18,11,'2026-02-21 08:34:42','2026-02-21 08:34:42',4),(653,'2026-02-15','تكلفة مبيعات (مرتجع) فاتورة #SI-2026-000040',77,11,'2026-02-21 08:34:42','2026-02-21 08:34:42',4),(654,'2026-02-15','قيد سند صرف مخزني رقم #IV-1771662959978 - استبدال علبة ليف ان 180 بأخرى 220 (استبدال)',76,40,'2026-02-21 08:38:11','2026-02-21 08:38:11',82),(655,'2026-02-18','قيد إثبات مبيعات - فاتورة #SI-2026-000201',16,201,'2026-02-21 12:05:48','2026-02-21 12:05:48',2),(656,'2026-02-18','قيد تكلفة مبيعات - فاتورة #SI-2026-000201',17,201,'2026-02-21 12:05:48','2026-02-21 12:05:48',2),(657,'2026-02-18','تحصيل فاتورة مبيعات #SI-2026-000201 - cash',74,108,'2026-02-21 12:06:31','2026-02-21 12:06:31',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=1367 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_lines`
--

LOCK TABLES `journal_entry_lines` WRITE;
/*!40000 ALTER TABLE `journal_entry_lines` DISABLE KEYS */;
INSERT INTO `journal_entry_lines` VALUES (1,1,110,69160.00,0.00,'مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml - ','2026-01-11 18:52:23','2026-01-20 11:12:11'),(2,1,117,0.00,69160.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml','2026-01-11 18:52:23','2026-01-21 09:27:41'),(3,2,110,210974.40,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 18:53:43','2026-01-11 18:53:43'),(4,2,117,0.00,210974.40,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 18:53:43','2026-01-21 09:27:41'),(5,3,110,130065.60,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 18:54:57','2026-01-11 18:54:57'),(6,3,117,0.00,130065.60,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 18:54:57','2026-01-21 09:27:41'),(7,4,110,265816.32,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 18:57:01','2026-01-11 18:57:01'),(8,4,117,0.00,265816.32,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 18:57:01','2026-01-21 09:27:41'),(9,5,110,154656.00,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 18:58:56','2026-01-11 18:58:56'),(10,5,117,0.00,154656.00,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 18:58:56','2026-01-21 09:27:41'),(11,6,110,100013.13,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:01:24','2026-01-11 19:01:24'),(12,6,117,0.00,100013.13,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:01:24','2026-01-21 09:27:41'),(13,7,110,45127.60,0.00,'مخزون افتتاحي - Nurivina whitening Cream 50gm - ','2026-01-11 19:02:29','2026-01-11 19:02:29'),(14,7,117,0.00,45127.60,'رأس المال - مخزون افتتاحي - Nurivina whitening Cream 50gm','2026-01-11 19:02:29','2026-01-21 09:27:41'),(15,8,110,897.00,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 19:04:12','2026-01-11 19:04:12'),(16,8,117,0.00,897.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 19:04:12','2026-01-21 09:27:41'),(17,9,110,165.90,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:05:45','2026-01-11 19:05:45'),(18,9,117,0.00,165.90,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:05:45','2026-01-21 09:27:41'),(19,10,110,438.80,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:06:50','2026-01-11 19:06:50'),(20,10,117,0.00,438.80,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:06:50','2026-01-21 09:27:41'),(21,11,110,199.15,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:08:17','2026-01-11 19:08:17'),(22,11,117,0.00,199.15,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:08:17','2026-01-21 09:27:41'),(23,12,110,179.00,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:09:14','2026-01-11 19:09:14'),(24,12,117,0.00,179.00,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:09:14','2026-01-21 09:27:41'),(25,13,110,1900.00,0.00,'مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml - ','2026-01-11 19:11:38','2026-01-11 19:11:38'),(26,13,117,0.00,1900.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml','2026-01-11 19:11:38','2026-01-21 09:27:41'),(27,14,110,3139.50,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 19:12:54','2026-01-11 19:12:54'),(28,14,117,0.00,3139.50,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 19:12:54','2026-01-21 09:27:41'),(29,15,110,1493.10,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:14:30','2026-01-11 19:14:30'),(30,15,117,0.00,1493.10,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:14:30','2026-01-21 09:27:41'),(31,16,110,4168.60,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:16:05','2026-01-11 19:16:05'),(32,16,117,0.00,4168.60,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:16:05','2026-01-21 09:27:41'),(33,17,110,716.94,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:17:03','2026-01-11 19:17:03'),(34,17,117,0.00,716.94,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:17:03','2026-01-21 09:27:41'),(35,18,110,671.25,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:19:24','2026-01-11 19:19:24'),(36,18,117,0.00,671.25,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:19:24','2026-01-21 09:27:41'),(37,19,110,380.00,0.00,'مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml - ','2026-01-11 19:20:44','2026-01-11 19:20:44'),(38,19,117,0.00,380.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml','2026-01-11 19:20:44','2026-01-21 09:27:41'),(39,20,110,358.80,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 19:21:51','2026-01-11 19:21:51'),(40,20,117,0.00,358.80,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 19:21:51','2026-01-21 09:27:41'),(41,21,110,3262.70,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:23:30','2026-01-11 19:23:30'),(42,21,117,0.00,3262.70,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:23:30','2026-01-21 09:27:41'),(43,22,110,329.10,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:25:05','2026-01-11 19:25:05'),(44,22,117,0.00,329.10,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:25:05','2026-01-21 09:27:41'),(45,23,110,9700.04,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:26:10','2026-01-11 19:26:10'),(46,23,117,0.00,9700.04,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:26:10','2026-01-21 09:27:41'),(47,24,110,1394.05,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:27:30','2026-01-11 19:27:30'),(48,24,117,0.00,1394.05,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:27:30','2026-01-21 09:27:41'),(49,25,110,492.25,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:29:30','2026-02-07 09:49:35'),(50,25,117,0.00,492.25,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:29:30','2026-02-07 09:49:35'),(51,26,110,1407.40,0.00,'مخزون افتتاحي - Nurivina whitening Cream 50gm - ','2026-01-11 19:30:25','2026-01-11 19:30:25'),(52,26,117,0.00,1407.40,'رأس المال - مخزون افتتاحي - Nurivina whitening Cream 50gm','2026-01-11 19:30:25','2026-01-21 09:27:41'),(53,27,110,331.80,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:31:44','2026-01-11 19:31:44'),(54,27,117,0.00,331.80,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:31:44','2026-01-21 09:27:41'),(55,28,110,767.90,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:32:52','2026-01-11 19:32:52'),(56,28,117,0.00,767.90,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:32:52','2026-01-21 09:27:41'),(57,29,110,238.98,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:34:25','2026-01-11 19:34:25'),(58,29,117,0.00,238.98,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:34:25','2026-01-21 09:27:41'),(59,30,110,134.25,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:35:45','2026-01-11 19:35:45'),(60,30,117,0.00,134.25,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:35:45','2026-01-21 09:27:41'),(61,31,110,22.70,0.00,'مخزون افتتاحي - Nurivina whitening Cream 50gm - ','2026-01-11 19:36:45','2026-01-11 19:36:45'),(62,31,117,0.00,22.70,'رأس المال - مخزون افتتاحي - Nurivina whitening Cream 50gm','2026-01-11 19:36:45','2026-01-21 09:27:41'),(63,32,42,8211.98,0.00,'رصيد افتتاحي','2026-01-11 21:04:12','2026-01-11 21:04:12'),(64,32,117,0.00,8211.98,'رصيد افتتاحي','2026-01-11 21:04:12','2026-01-21 09:27:41'),(65,33,78,447.50,0.00,'سند صرف مخزني رقم #IV-1768167823264','2026-01-11 21:45:15','2026-01-11 21:45:15'),(66,33,110,0.00,447.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768167823264','2026-01-11 21:45:15','2026-01-11 21:45:15'),(67,34,80,744.10,0.00,'سند صرف مخزني رقم #IV-1768169384468','2026-01-11 22:11:11','2026-01-11 22:11:11'),(68,34,110,0.00,744.10,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768169384468','2026-01-11 22:11:11','2026-01-11 22:11:11'),(69,35,43,8186.98,0.00,'ايداع المستحقات إلى حساب البنك الأهلي','2026-01-11 22:18:40','2026-01-11 22:18:40'),(70,35,42,0.00,8186.98,'سحب المستحقات من حساب خزينة شركة الشحن','2026-01-11 22:18:40','2026-01-11 22:18:40'),(71,36,28,0.00,175.00,'إيراد مبيعات - فاتورة #SI-2026-000001','2026-01-14 08:42:37','2026-01-14 08:42:37'),(72,36,47,175.00,0.00,'مديونية عميل - فاتورة #SI-2026-000001','2026-01-14 08:42:37','2026-01-14 08:42:37'),(73,37,15,44.75,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000001','2026-01-14 08:42:37','2026-01-14 08:42:37'),(74,37,110,0.00,44.75,'مخزون تام الصنع - فاتورة #SI-2026-000001','2026-01-14 08:42:37','2026-01-14 08:42:37'),(75,38,43,175.00,0.00,'تحصيل - cash','2026-01-14 08:43:44','2026-01-14 08:43:44'),(76,38,47,0.00,175.00,'تخفيض مديونية العميل','2026-01-14 08:43:44','2026-01-14 08:43:44'),(77,39,28,0.00,301.00,'إيراد مبيعات - فاتورة #SI-2026-000002','2026-01-14 08:44:01','2026-01-14 08:44:01'),(78,39,47,301.00,0.00,'مديونية عميل - فاتورة #SI-2026-000002','2026-01-14 08:44:01','2026-01-14 08:44:01'),(79,40,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000002','2026-01-14 08:44:01','2026-01-14 08:44:01'),(80,40,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000002','2026-01-14 08:44:01','2026-01-14 08:44:01'),(81,41,41,301.00,0.00,'تحصيل - cash','2026-01-14 08:44:33','2026-01-14 08:44:33'),(82,41,47,0.00,301.00,'تخفيض مديونية العميل','2026-01-14 08:44:33','2026-01-14 08:44:33'),(83,42,28,0.00,816.00,'إيراد مبيعات - فاتورة #SI-2026-000003','2026-01-14 08:45:10','2026-01-14 08:45:10'),(84,42,47,816.00,0.00,'مديونية عميل - فاتورة #SI-2026-000003','2026-01-14 08:45:10','2026-01-14 08:45:10'),(85,43,15,90.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000003','2026-01-14 08:45:10','2026-01-14 08:45:10'),(86,43,110,0.00,90.80,'مخزون تام الصنع - فاتورة #SI-2026-000003','2026-01-14 08:45:10','2026-01-14 08:45:10'),(87,44,42,816.00,0.00,'تحصيل - cash','2026-01-14 08:45:44','2026-01-14 08:45:44'),(88,44,47,0.00,816.00,'تخفيض مديونية العميل','2026-01-14 08:45:44','2026-01-14 08:45:44'),(89,45,28,0.00,23147.80,'إيراد مبيعات - فاتورة #SI-2026-000004','2026-01-14 08:46:03','2026-01-14 08:46:03'),(90,45,65,0.00,3240.69,'ضريبة القيمة المضافة - فاتورة #SI-2026-000004','2026-01-14 08:46:03','2026-01-14 08:46:03'),(91,45,47,26388.49,0.00,'مديونية عميل - فاتورة #SI-2026-000004','2026-01-14 08:46:03','2026-01-14 08:46:03'),(92,46,15,8216.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000004','2026-01-14 08:46:03','2026-01-14 08:46:03'),(93,46,110,0.00,8216.50,'مخزون تام الصنع - فاتورة #SI-2026-000004','2026-01-14 08:46:03','2026-01-14 08:46:03'),(94,47,28,0.00,1326.00,'إيراد مبيعات - فاتورة #SI-2026-000005','2026-01-14 08:46:20','2026-01-14 08:46:20'),(95,47,47,1326.00,0.00,'مديونية عميل - فاتورة #SI-2026-000005','2026-01-14 08:46:20','2026-01-14 08:46:20'),(96,48,15,269.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000005','2026-01-14 08:46:20','2026-01-14 08:46:20'),(97,48,110,0.00,269.10,'مخزون تام الصنع - فاتورة #SI-2026-000005','2026-01-14 08:46:20','2026-01-14 08:46:20'),(98,49,42,1326.00,0.00,'تحصيل - cash','2026-01-14 08:46:43','2026-01-14 08:46:43'),(99,49,47,0.00,1326.00,'تخفيض مديونية العميل','2026-01-14 08:46:43','2026-01-14 08:46:43'),(100,50,28,0.00,495.00,'إيراد مبيعات - فاتورة #SI-2026-000006','2026-01-14 08:48:45','2026-01-14 08:48:45'),(101,50,115,0.00,65.00,'إيراد شحن - فاتورة #SI-2026-000006','2026-01-14 08:48:45','2026-01-14 08:48:45'),(102,50,47,560.00,0.00,'مديونية عميل - فاتورة #SI-2026-000006','2026-01-14 08:48:45','2026-01-14 08:48:45'),(103,51,15,110.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000006','2026-01-14 08:48:45','2026-01-14 08:48:45'),(104,51,110,0.00,110.60,'مخزون تام الصنع - فاتورة #SI-2026-000006','2026-01-14 08:48:45','2026-01-14 08:48:45'),(105,52,42,560.00,0.00,'تحصيل - cash','2026-01-14 08:49:14','2026-01-14 08:49:14'),(106,52,47,0.00,560.00,'تخفيض مديونية العميل','2026-01-14 08:49:14','2026-01-14 08:49:14'),(107,53,28,0.00,3344.00,'إيراد مبيعات - فاتورة #SI-2026-000007','2026-01-14 08:49:37','2026-01-14 08:49:37'),(108,53,47,3344.00,0.00,'مديونية عميل - فاتورة #SI-2026-000007','2026-01-14 08:49:37','2026-01-14 08:49:37'),(109,54,15,873.85,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000007','2026-01-14 08:49:37','2026-01-14 08:49:37'),(110,54,110,0.00,873.85,'مخزون تام الصنع - فاتورة #SI-2026-000007','2026-01-14 08:49:37','2026-01-14 08:49:37'),(111,55,28,0.00,7400.00,'إيراد مبيعات - فاتورة #SI-2026-000008','2026-01-14 08:49:54','2026-01-14 08:49:54'),(112,55,47,7400.00,0.00,'مديونية عميل - فاتورة #SI-2026-000008','2026-01-14 08:49:54','2026-01-14 08:49:54'),(113,56,15,2641.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000008','2026-01-14 08:49:54','2026-01-14 08:49:54'),(114,56,110,0.00,2641.60,'مخزون تام الصنع - فاتورة #SI-2026-000008','2026-01-14 08:49:54','2026-01-14 08:49:54'),(115,57,28,0.00,5700.00,'إيراد مبيعات - فاتورة #SI-2026-000009','2026-01-14 08:50:08','2026-01-14 08:50:08'),(116,57,47,5700.00,0.00,'مديونية عميل - فاتورة #SI-2026-000009','2026-01-14 08:50:08','2026-01-14 08:50:08'),(117,58,15,1696.09,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000009','2026-01-14 08:50:08','2026-01-14 08:50:08'),(118,58,110,0.00,1696.09,'مخزون تام الصنع - فاتورة #SI-2026-000009','2026-01-14 08:50:08','2026-01-14 08:50:08'),(119,59,28,0.00,4631.22,'إيراد مبيعات - فاتورة #SI-2026-000010','2026-01-14 08:50:20','2026-01-14 08:50:20'),(120,59,65,0.00,648.37,'ضريبة القيمة المضافة - فاتورة #SI-2026-000010','2026-01-14 08:50:20','2026-01-14 08:50:20'),(121,59,47,5279.59,0.00,'مديونية عميل - فاتورة #SI-2026-000010','2026-01-14 08:50:20','2026-01-14 08:50:20'),(122,60,15,1567.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000010','2026-01-14 08:50:20','2026-01-14 08:50:20'),(123,60,110,0.00,1567.50,'مخزون تام الصنع - فاتورة #SI-2026-000010','2026-01-14 08:50:20','2026-01-14 08:50:20'),(124,61,28,0.00,10530.00,'إيراد مبيعات - فاتورة #SI-2026-000013','2026-01-14 08:50:35','2026-01-14 08:50:35'),(125,61,47,10530.00,0.00,'مديونية عميل - فاتورة #SI-2026-000013','2026-01-14 08:50:35','2026-01-14 08:50:35'),(126,62,15,3136.21,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000013','2026-01-14 08:50:35','2026-01-14 08:50:35'),(127,62,110,0.00,3136.21,'مخزون تام الصنع - فاتورة #SI-2026-000013','2026-01-14 08:50:35','2026-01-14 08:50:35'),(128,63,28,0.00,21305.80,'إيراد مبيعات - فاتورة #SI-2026-000011','2026-01-14 08:51:01','2026-01-14 08:51:01'),(129,63,65,0.00,2982.81,'ضريبة القيمة المضافة - فاتورة #SI-2026-000011','2026-01-14 08:51:01','2026-01-14 08:51:01'),(130,63,47,24288.61,0.00,'مديونية عميل - فاتورة #SI-2026-000011','2026-01-14 08:51:01','2026-01-14 08:51:01'),(131,64,15,5578.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000011','2026-01-14 08:51:01','2026-01-14 08:51:01'),(132,64,110,0.00,5578.40,'مخزون تام الصنع - فاتورة #SI-2026-000011','2026-01-14 08:51:01','2026-01-14 08:51:01'),(133,65,28,0.00,6868.00,'إيراد مبيعات - فاتورة #SI-2026-000012','2026-01-14 08:51:39','2026-01-14 08:51:39'),(134,65,108,206.04,0.00,'خصم مسموح به - فاتورة #SI-2026-000012','2026-01-14 08:51:39','2026-01-14 08:51:39'),(135,65,47,6661.96,0.00,'مديونية عميل - فاتورة #SI-2026-000012','2026-01-14 08:51:39','2026-01-14 08:51:39'),(136,66,15,1435.70,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000012','2026-01-14 08:51:39','2026-01-14 08:51:39'),(137,66,110,0.00,1435.70,'مخزون تام الصنع - فاتورة #SI-2026-000012','2026-01-14 08:51:39','2026-01-14 08:51:39'),(138,67,42,6661.96,0.00,'تحصيل - cash','2026-01-14 08:52:27','2026-01-14 08:52:27'),(139,67,47,0.00,6661.96,'تخفيض مديونية العميل','2026-01-14 08:52:27','2026-01-14 08:52:27'),(140,68,28,0.00,9945.00,'إيراد مبيعات - فاتورة #SI-2026-000014','2026-01-14 09:13:12','2026-01-14 09:13:12'),(141,68,47,9945.00,0.00,'مديونية عميل - فاتورة #SI-2026-000014','2026-01-14 09:13:12','2026-01-14 09:13:12'),(142,69,15,2540.67,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000014','2026-01-14 09:13:12','2026-01-14 09:13:12'),(143,69,110,0.00,2540.67,'مخزون تام الصنع - فاتورة #SI-2026-000014','2026-01-14 09:13:12','2026-01-14 09:13:12'),(144,70,28,0.00,3740.00,'إيراد مبيعات - فاتورة #SI-2026-000016','2026-01-14 09:13:54','2026-01-14 09:13:54'),(145,70,47,3740.00,0.00,'مديونية عميل - فاتورة #SI-2026-000016','2026-01-14 09:13:54','2026-01-14 09:13:54'),(146,71,15,997.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000016','2026-01-14 09:13:54','2026-01-14 09:13:54'),(147,71,110,0.00,997.50,'مخزون تام الصنع - فاتورة #SI-2026-000016','2026-01-14 09:13:54','2026-01-14 09:13:54'),(148,72,28,0.00,525.00,'إيراد مبيعات - فاتورة #SI-2026-000017','2026-01-14 09:14:48','2026-01-14 09:14:48'),(149,72,47,525.00,0.00,'مديونية عميل - فاتورة #SI-2026-000017','2026-01-14 09:14:48','2026-01-14 09:14:48'),(150,73,15,138.72,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000017','2026-01-14 09:14:48','2026-01-14 09:14:48'),(151,73,110,0.00,138.72,'مخزون تام الصنع - فاتورة #SI-2026-000017','2026-01-14 09:14:48','2026-01-14 09:14:48'),(152,74,42,525.00,0.00,'تحصيل - cash','2026-01-14 09:15:15','2026-01-14 09:15:15'),(153,74,47,0.00,525.00,'تخفيض مديونية العميل','2026-01-14 09:15:15','2026-01-14 09:15:15'),(154,75,28,0.00,700.00,'إيراد مبيعات - فاتورة #SI-2026-000018','2026-01-14 09:16:02','2026-01-14 09:16:02'),(155,75,115,0.00,65.00,'إيراد شحن - فاتورة #SI-2026-000018','2026-01-14 09:16:02','2026-01-14 09:16:02'),(156,75,47,765.00,0.00,'مديونية عميل - فاتورة #SI-2026-000018','2026-01-14 09:16:02','2026-01-14 09:16:02'),(157,76,15,179.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000018','2026-01-14 09:16:02','2026-01-14 09:16:02'),(158,76,110,0.00,179.00,'مخزون تام الصنع - فاتورة #SI-2026-000018','2026-01-14 09:16:02','2026-01-14 09:16:02'),(159,77,42,765.00,0.00,'تحصيل - cash','2026-01-14 09:16:28','2026-01-14 09:16:28'),(160,77,47,0.00,765.00,'تخفيض مديونية العميل','2026-01-14 09:16:28','2026-01-14 09:16:28'),(161,78,28,0.00,2475.00,'إيراد مبيعات - فاتورة #SI-2026-000019','2026-01-14 09:17:26','2026-01-14 09:17:26'),(162,78,47,2475.00,0.00,'مديونية عميل - فاتورة #SI-2026-000019','2026-01-14 09:17:26','2026-01-14 09:17:26'),(163,79,15,608.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000019','2026-01-14 09:17:26','2026-01-14 09:17:26'),(164,79,110,0.00,608.30,'مخزون تام الصنع - فاتورة #SI-2026-000019','2026-01-14 09:17:26','2026-01-14 09:17:26'),(165,80,42,2475.00,0.00,'تحصيل - cash','2026-01-14 09:17:54','2026-01-14 09:17:54'),(166,80,47,0.00,2475.00,'تخفيض مديونية العميل','2026-01-14 09:17:54','2026-01-14 09:17:54'),(167,81,80,1034.40,0.00,'سند صرف مخزني رقم #IV-1768424120158','2026-01-14 20:56:10','2026-01-14 20:56:10'),(168,81,110,0.00,1034.40,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768424120158','2026-01-14 20:56:10','2026-01-14 20:56:10'),(169,82,80,468.55,0.00,'سند صرف مخزني رقم #IV-1768425518685','2026-01-14 21:21:30','2026-01-14 21:21:30'),(170,82,110,0.00,468.55,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768425518685','2026-01-14 21:21:30','2026-01-14 21:21:30'),(171,83,80,562.01,0.00,'سند صرف مخزني رقم #IV-1768425693687','2026-01-14 21:25:43','2026-01-14 21:25:43'),(172,83,110,0.00,562.01,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768425693687','2026-01-14 21:25:43','2026-01-14 21:25:43'),(173,84,28,0.00,6372.00,'إيراد مبيعات - فاتورة #SI-2026-000015','2026-01-15 15:49:29','2026-01-15 15:49:29'),(174,84,47,6372.00,0.00,'مديونية عميل - فاتورة #SI-2026-000015','2026-01-15 15:49:29','2026-01-15 15:49:29'),(175,85,15,1765.65,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000015','2026-01-15 15:49:29','2026-01-15 15:49:29'),(176,85,110,0.00,1765.65,'مخزون تام الصنع - فاتورة #SI-2026-000015','2026-01-15 15:49:29','2026-01-15 15:49:29'),(177,86,28,0.00,11704.00,'إيراد مبيعات - فاتورة #SI-2026-000028','2026-01-15 15:54:13','2026-01-15 15:54:13'),(178,86,47,11704.00,0.00,'مديونية عميل - فاتورة #SI-2026-000028','2026-01-15 15:54:13','2026-01-15 15:54:13'),(179,87,15,3237.99,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000028','2026-01-15 15:54:13','2026-01-15 15:54:13'),(180,87,110,0.00,3237.99,'مخزون تام الصنع - فاتورة #SI-2026-000028','2026-01-15 15:54:13','2026-01-15 15:54:13'),(181,88,28,0.00,5907.50,'إيراد مبيعات - فاتورة #SI-2026-000025','2026-01-15 17:08:48','2026-01-15 17:08:48'),(182,88,47,5907.50,0.00,'مديونية عميل - فاتورة #SI-2026-000025','2026-01-15 17:08:48','2026-01-15 17:08:48'),(183,89,15,1443.90,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000025','2026-01-15 17:08:48','2026-01-15 17:08:48'),(184,89,110,0.00,1443.90,'مخزون تام الصنع - فاتورة #SI-2026-000025','2026-01-15 17:08:48','2026-01-15 17:08:48'),(185,90,42,5907.50,0.00,'تحصيل - cash','2026-01-15 17:09:58','2026-01-15 17:09:58'),(186,90,47,0.00,5907.50,'تخفيض مديونية العميل','2026-01-15 17:09:58','2026-01-15 17:09:58'),(187,91,28,0.00,6880.00,'إيراد مبيعات - فاتورة #SI-2026-000029','2026-01-15 17:10:34','2026-01-15 17:10:34'),(188,91,47,6880.00,0.00,'مديونية عميل - فاتورة #SI-2026-000029','2026-01-15 17:10:34','2026-01-15 17:10:34'),(189,92,15,1977.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000029','2026-01-15 17:10:34','2026-01-15 17:10:34'),(190,92,110,0.00,1977.80,'مخزون تام الصنع - فاتورة #SI-2026-000029','2026-01-15 17:10:34','2026-01-15 17:10:34'),(191,93,28,0.00,6080.00,'إيراد مبيعات - فاتورة #SI-2026-000030','2026-01-15 17:10:55','2026-01-15 17:10:55'),(192,93,47,6080.00,0.00,'مديونية عميل - فاتورة #SI-2026-000030','2026-01-15 17:10:55','2026-01-15 17:10:55'),(193,94,15,1696.09,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000030','2026-01-15 17:10:55','2026-01-15 17:10:55'),(194,94,110,0.00,1696.09,'مخزون تام الصنع - فاتورة #SI-2026-000030','2026-01-15 17:10:55','2026-01-15 17:10:55'),(195,95,41,6080.00,0.00,'تحصيل - cash','2026-01-15 17:11:39','2026-01-15 17:11:39'),(196,95,47,0.00,6080.00,'تخفيض مديونية العميل','2026-01-15 17:11:39','2026-01-15 17:11:39'),(197,96,28,0.00,11520.00,'إيراد مبيعات - فاتورة #SI-2026-000024','2026-01-15 17:17:49','2026-01-15 17:17:49'),(198,96,47,11520.00,0.00,'مديونية عميل - فاتورة #SI-2026-000024','2026-01-15 17:17:49','2026-01-15 17:17:49'),(199,97,15,2759.20,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000024','2026-01-15 17:17:49','2026-01-15 17:17:49'),(200,97,110,0.00,2759.20,'مخزون تام الصنع - فاتورة #SI-2026-000024','2026-01-15 17:17:49','2026-01-15 17:17:49'),(201,98,6,730.00,0.00,'Sales Return #1 - Revenue Reversal','2026-01-17 08:09:40','2026-01-17 08:09:40'),(202,98,47,0.00,730.00,'Refund/Credit - Return #1','2026-01-17 08:09:40','2026-01-17 08:09:40'),(203,99,112,169.16,0.00,'Cost Reversal (Return #1)','2026-01-17 08:09:41','2026-01-17 08:09:41'),(204,99,15,0.00,169.16,'COGS Reversal - Return #1','2026-01-17 08:09:41','2026-01-17 08:09:41'),(205,100,47,1630.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000020','2026-01-17 08:26:52','2026-01-17 08:26:52'),(206,100,117,0.00,1630.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000020','2026-01-17 08:26:52','2026-01-21 09:27:41'),(207,101,41,1630.00,0.00,'تحصيل - cash','2026-01-17 08:28:48','2026-01-17 08:28:48'),(208,101,47,0.00,1630.00,'تخفيض مديونية العميل','2026-01-17 08:28:48','2026-01-17 08:28:48'),(209,102,47,27482.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000066','2026-01-17 08:30:42','2026-01-17 08:30:42'),(210,102,117,0.00,27482.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000066','2026-01-17 08:30:42','2026-01-21 09:27:41'),(211,103,41,12000.00,0.00,'تحصيل - cash','2026-01-17 08:31:34','2026-01-17 08:31:34'),(212,103,47,0.00,12000.00,'تخفيض مديونية العميل','2026-01-17 08:31:34','2026-01-17 08:31:34'),(213,104,47,637.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000035','2026-01-17 08:33:31','2026-01-17 08:33:31'),(214,104,117,0.00,637.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000035','2026-01-17 08:33:31','2026-01-21 09:27:41'),(215,105,47,20695.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000064','2026-01-17 08:38:07','2026-01-17 08:38:07'),(216,105,117,0.00,20695.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000064','2026-01-17 08:38:07','2026-01-21 09:27:41'),(217,106,41,12000.00,0.00,'تحصيل - cash','2026-01-17 08:38:37','2026-01-17 08:38:37'),(218,106,47,0.00,12000.00,'تخفيض مديونية العميل','2026-01-17 08:38:37','2026-01-17 08:38:37'),(219,107,47,54165.99,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000026','2026-01-17 08:40:12','2026-01-17 08:40:12'),(220,107,117,0.00,54165.99,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000026','2026-01-17 08:40:12','2026-01-21 09:27:41'),(221,108,43,34411.43,0.00,'تحصيل - cash','2026-01-17 08:41:13','2026-01-17 08:41:13'),(222,108,47,0.00,34411.43,'تخفيض مديونية العميل','2026-01-17 08:41:13','2026-01-17 08:41:13'),(223,109,47,34968.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000027','2026-01-17 08:42:54','2026-01-17 08:42:54'),(224,109,117,0.00,34968.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000027','2026-01-17 08:42:54','2026-01-21 09:27:41'),(225,110,43,4585.00,0.00,'تحصيل - cash','2026-01-17 08:43:29','2026-01-17 08:43:29'),(226,110,47,0.00,4585.00,'تخفيض مديونية العميل','2026-01-17 08:43:29','2026-01-17 08:43:29'),(227,111,47,35387.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000031','2026-01-17 08:44:35','2026-01-17 08:44:35'),(228,111,117,0.00,35387.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000031','2026-01-17 08:44:35','2026-01-21 09:27:41'),(229,112,41,18000.00,0.00,'تحصيل - cash','2026-01-17 08:45:27','2026-01-17 08:45:27'),(230,112,47,0.00,18000.00,'تخفيض مديونية العميل','2026-01-17 08:45:27','2026-01-17 08:45:27'),(231,113,47,16230.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000067','2026-01-17 08:46:58','2026-01-17 08:46:58'),(232,113,117,0.00,16230.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000067','2026-01-17 08:46:58','2026-01-21 09:27:41'),(233,114,47,6230.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000032','2026-01-17 08:48:08','2026-01-17 08:48:08'),(234,114,117,0.00,6230.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000032','2026-01-17 08:48:08','2026-01-21 09:27:41'),(235,115,47,71674.43,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000033','2026-01-17 08:50:21','2026-01-17 08:50:21'),(236,115,117,0.00,71674.43,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000033','2026-01-17 08:50:21','2026-01-21 09:27:41'),(237,116,47,1258.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000081','2026-01-17 08:54:20','2026-01-17 08:54:20'),(238,116,117,0.00,1258.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000081','2026-01-17 08:54:20','2026-01-21 09:27:41'),(239,117,47,2320.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000082','2026-01-17 08:57:30','2026-01-17 08:57:30'),(240,117,117,0.00,2320.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000082','2026-01-17 08:57:30','2026-01-21 09:27:41'),(241,118,43,108958.86,0.00,NULL,'2026-01-17 09:17:40','2026-01-20 09:09:49'),(242,118,117,0.00,108958.86,NULL,'2026-01-17 09:17:40','2026-01-21 09:27:41'),(243,119,44,45606.57,0.00,'اثبات رصيد اول المده في البنك الشركه','2026-01-17 09:20:13','2026-01-20 09:09:49'),(244,119,117,0.00,45606.57,'اثبات رصيد اول المده في البنك الشركه','2026-01-17 09:20:13','2026-01-21 09:27:41'),(245,120,28,0.00,6930.00,'إيراد مبيعات - فاتورة #SI-2026-000022','2026-01-17 10:49:41','2026-01-17 10:49:41'),(246,120,65,0.00,970.20,'ضريبة القيمة المضافة - فاتورة #SI-2026-000022','2026-01-17 10:49:41','2026-01-17 10:49:41'),(247,120,47,7900.20,0.00,'مديونية عميل - فاتورة #SI-2026-000022','2026-01-17 10:49:41','2026-01-17 10:49:41'),(248,121,15,1990.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000022','2026-01-17 10:49:41','2026-01-17 10:49:41'),(249,121,110,0.00,1990.80,'مخزون تام الصنع - فاتورة #SI-2026-000022','2026-01-17 10:49:41','2026-01-17 10:49:41'),(250,122,28,0.00,10680.00,'إيراد مبيعات - فاتورة #SI-2026-000021','2026-01-17 10:50:08','2026-01-17 10:50:08'),(251,122,47,10680.00,0.00,'مديونية عميل - فاتورة #SI-2026-000021','2026-01-17 10:50:08','2026-01-17 10:50:08'),(252,123,15,3028.85,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000021','2026-01-17 10:50:08','2026-01-17 10:50:08'),(253,123,110,0.00,3028.85,'مخزون تام الصنع - فاتورة #SI-2026-000021','2026-01-17 10:50:08','2026-01-17 10:50:08'),(254,124,28,0.00,5250.00,'إيراد مبيعات - فاتورة #SI-2026-000023','2026-01-17 10:50:45','2026-01-17 10:50:45'),(255,124,65,0.00,735.00,'ضريبة القيمة المضافة - فاتورة #SI-2026-000023','2026-01-17 10:50:45','2026-01-17 10:50:45'),(256,124,47,5985.00,0.00,'مديونية عميل - فاتورة #SI-2026-000023','2026-01-17 10:50:45','2026-01-17 10:50:45'),(257,125,15,1611.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000023','2026-01-17 10:50:45','2026-01-17 10:50:45'),(258,125,110,0.00,1611.00,'مخزون تام الصنع - فاتورة #SI-2026-000023','2026-01-17 10:50:45','2026-01-17 10:50:45'),(259,126,28,0.00,1326.00,'إيراد مبيعات - فاتورة #SI-2026-000073','2026-01-17 10:51:36','2026-01-17 10:51:36'),(260,126,108,39.78,0.00,'خصم مسموح به - فاتورة #SI-2026-000073','2026-01-17 10:51:36','2026-01-17 10:51:36'),(261,126,47,1286.22,0.00,'مديونية عميل - فاتورة #SI-2026-000073','2026-01-17 10:51:36','2026-01-17 10:51:36'),(262,127,15,269.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000073','2026-01-17 10:51:36','2026-01-17 10:51:36'),(263,127,110,0.00,269.10,'مخزون تام الصنع - فاتورة #SI-2026-000073','2026-01-17 10:51:36','2026-01-17 10:51:36'),(264,128,41,1286.22,0.00,'تحصيل - cash','2026-01-17 10:52:08','2026-01-17 10:52:08'),(265,128,47,0.00,1286.22,'تخفيض مديونية العميل','2026-01-17 10:52:08','2026-01-17 10:52:08'),(266,129,28,0.00,825.00,'إيراد مبيعات - فاتورة #SI-2026-000043','2026-01-17 11:19:20','2026-01-17 11:19:20'),(267,129,47,825.00,0.00,'مديونية عميل - فاتورة #SI-2026-000043','2026-01-17 11:19:20','2026-01-17 11:19:20'),(268,130,15,237.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000043','2026-01-17 11:19:20','2026-01-17 11:19:20'),(269,130,110,0.00,237.50,'مخزون تام الصنع - فاتورة #SI-2026-000043','2026-01-17 11:19:20','2026-01-17 11:19:20'),(270,131,28,0.00,2987.60,'إيراد مبيعات - فاتورة #SI-2026-000074','2026-01-17 11:20:25','2026-01-17 11:20:25'),(271,131,65,0.00,418.26,'ضريبة القيمة المضافة - فاتورة #SI-2026-000074','2026-01-17 11:20:25','2026-01-17 11:20:25'),(272,131,47,3405.86,0.00,'مديونية عميل - فاتورة #SI-2026-000074','2026-01-17 11:20:25','2026-01-17 11:20:25'),(273,132,15,950.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000074','2026-01-17 11:20:25','2026-01-17 11:20:25'),(274,132,110,0.00,950.00,'مخزون تام الصنع - فاتورة #SI-2026-000074','2026-01-17 11:20:25','2026-01-17 11:20:25'),(275,133,28,0.00,2640.00,'إيراد مبيعات - فاتورة #SI-2026-000075','2026-01-17 11:21:29','2026-01-17 11:21:29'),(276,133,47,2640.00,0.00,'مديونية عميل - فاتورة #SI-2026-000075','2026-01-17 11:21:29','2026-01-17 11:21:29'),(277,134,15,553.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000075','2026-01-17 11:21:29','2026-01-17 11:21:29'),(278,134,110,0.00,553.00,'مخزون تام الصنع - فاتورة #SI-2026-000075','2026-01-17 11:21:29','2026-01-17 11:21:29'),(279,135,28,0.00,3440.00,'إيراد مبيعات - فاتورة #SI-2026-000076','2026-01-17 11:22:02','2026-01-17 11:22:02'),(280,135,47,3440.00,0.00,'مديونية عميل - فاتورة #SI-2026-000076','2026-01-17 11:22:02','2026-01-17 11:22:02'),(281,136,15,1042.95,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000076','2026-01-17 11:22:02','2026-01-17 11:22:02'),(282,136,110,0.00,1042.95,'مخزون تام الصنع - فاتورة #SI-2026-000076','2026-01-17 11:22:02','2026-01-17 11:22:02'),(283,137,28,0.00,1920.00,'إيراد مبيعات - فاتورة #SI-2026-000077','2026-01-17 11:22:44','2026-01-17 11:22:44'),(284,137,47,1920.00,0.00,'مديونية عميل - فاتورة #SI-2026-000077','2026-01-17 11:22:44','2026-01-17 11:22:44'),(285,138,15,227.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000077','2026-01-17 11:22:44','2026-01-17 11:22:44'),(286,138,110,0.00,227.00,'مخزون تام الصنع - فاتورة #SI-2026-000077','2026-01-17 11:22:44','2026-01-17 11:22:44'),(287,139,28,0.00,2112.00,'إيراد مبيعات - فاتورة #SI-2026-000078','2026-01-17 11:23:18','2026-01-17 11:23:18'),(288,139,47,2112.00,0.00,'مديونية عميل - فاتورة #SI-2026-000078','2026-01-17 11:23:18','2026-01-17 11:23:18'),(289,140,15,570.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000078','2026-01-17 11:23:18','2026-01-17 11:23:18'),(290,140,110,0.00,570.00,'مخزون تام الصنع - فاتورة #SI-2026-000078','2026-01-17 11:23:18','2026-01-17 11:23:18'),(291,141,28,0.00,1130.06,'إيراد مبيعات - فاتورة #SI-2026-000079','2026-01-17 11:24:03','2026-01-17 11:24:03'),(292,141,47,1130.06,0.00,'مديونية عميل - فاتورة #SI-2026-000079','2026-01-17 11:24:03','2026-01-17 11:24:03'),(293,142,15,269.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000079','2026-01-17 11:24:03','2026-01-17 11:24:03'),(294,142,110,0.00,269.10,'مخزون تام الصنع - فاتورة #SI-2026-000079','2026-01-17 11:24:03','2026-01-17 11:24:03'),(295,143,41,1130.06,0.00,'تحصيل - cash','2026-01-17 11:24:39','2026-01-17 11:24:39'),(296,143,47,0.00,1130.06,'تخفيض مديونية العميل','2026-01-17 11:24:39','2026-01-17 11:24:39'),(297,144,28,0.00,430.00,'إيراد مبيعات - فاتورة #SI-2026-000085','2026-01-17 12:15:30','2026-01-17 12:15:30'),(298,144,115,0.00,75.00,'إيراد شحن - فاتورة #SI-2026-000085','2026-01-17 12:15:30','2026-01-17 12:15:30'),(299,144,47,505.00,0.00,'مديونية عميل - فاتورة #SI-2026-000085','2026-01-17 12:15:30','2026-01-17 12:15:30'),(300,145,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000085','2026-01-17 12:15:30','2026-01-17 12:15:30'),(301,145,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000085','2026-01-17 12:15:30','2026-01-17 12:15:30'),(302,146,42,505.00,0.00,'تحصيل - cash','2026-01-17 12:16:19','2026-01-17 12:16:19'),(303,146,47,0.00,505.00,'تخفيض مديونية العميل','2026-01-17 12:16:19','2026-01-17 12:16:19'),(304,147,43,3501.28,0.00,'سحب المستحقات من خزينة شركة الشحن','2026-01-17 12:49:28','2026-01-17 12:49:28'),(305,147,42,0.00,3501.28,'تحويل المستحقات الى حساب بنك QNB','2026-01-17 12:49:28','2026-01-17 12:49:28'),(306,148,47,12960.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000045','2026-01-17 14:13:37','2026-01-17 14:13:37'),(307,148,117,0.00,12960.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000045','2026-01-17 14:13:37','2026-01-21 09:27:41'),(308,149,41,8600.00,0.00,'تحصيل - cash','2026-01-17 14:14:18','2026-01-17 14:14:18'),(309,149,47,0.00,8600.00,'تخفيض مديونية العميل','2026-01-17 14:14:18','2026-01-17 14:14:18'),(310,150,41,4360.00,0.00,'تحصيل - cash','2026-01-17 14:14:47','2026-01-17 14:14:47'),(311,150,47,0.00,4360.00,'تخفيض مديونية العميل','2026-01-17 14:14:47','2026-01-17 14:14:47'),(312,151,41,10680.00,0.00,'تحصيل - cash','2026-01-17 14:16:09','2026-01-17 14:16:09'),(313,151,47,0.00,10680.00,'تخفيض مديونية العميل','2026-01-17 14:16:09','2026-01-17 14:16:09'),(314,152,47,11115.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000071','2026-01-17 14:18:59','2026-01-17 14:18:59'),(315,152,117,0.00,11115.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000071','2026-01-17 14:18:59','2026-01-21 09:27:41'),(316,153,41,3465.00,0.00,'تحصيل - cash','2026-01-17 14:19:44','2026-01-17 14:19:44'),(317,153,47,0.00,3465.00,'تخفيض مديونية العميل','2026-01-17 14:19:44','2026-01-17 14:19:44'),(318,154,28,0.00,2057.00,'إيراد مبيعات - فاتورة #SI-2026-000084','2026-01-17 15:11:25','2026-01-17 15:11:25'),(319,154,108,61.71,0.00,'خصم مسموح به - فاتورة #SI-2026-000084','2026-01-17 15:11:25','2026-01-17 15:11:25'),(320,154,47,1995.29,0.00,'مديونية عميل - فاتورة #SI-2026-000084','2026-01-17 15:11:25','2026-01-17 15:11:25'),(321,155,15,466.88,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000084','2026-01-17 15:11:25','2026-01-17 15:11:25'),(322,155,110,0.00,466.88,'مخزون تام الصنع - فاتورة #SI-2026-000084','2026-01-17 15:11:25','2026-01-17 15:11:25'),(323,156,42,1995.29,0.00,'تحصيل - cash','2026-01-17 15:12:18','2026-01-17 15:12:18'),(324,156,47,0.00,1995.29,'تخفيض مديونية العميل','2026-01-17 15:12:18','2026-01-17 15:12:18'),(325,157,47,884.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000048','2026-01-17 15:13:27','2026-01-17 15:13:27'),(326,157,117,0.00,884.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000048','2026-01-17 15:13:27','2026-01-21 09:27:41'),(327,158,42,884.00,0.00,'تحصيل - cash','2026-01-17 15:14:12','2026-01-17 15:14:12'),(328,158,47,0.00,884.00,'تخفيض مديونية العميل','2026-01-17 15:14:12','2026-01-17 15:14:12'),(329,159,6,540.00,0.00,'Sales Return #2 - Revenue Reversal','2026-01-18 09:39:33','2026-01-18 09:39:33'),(330,159,47,0.00,540.00,'Refund/Credit - Return #2','2026-01-18 09:39:33','2026-01-18 09:39:33'),(331,160,112,79.66,0.00,'Cost Reversal (Return #2)','2026-01-18 09:39:33','2026-01-18 09:39:33'),(332,160,15,0.00,79.66,'COGS Reversal - Return #2','2026-01-18 09:39:33','2026-01-18 09:39:33'),(333,161,47,540.00,0.00,'تسوية استبدال بضاعة - سند رقم #IV-1768729202907','2026-01-18 09:40:52','2026-01-18 09:40:52'),(334,161,116,0.00,540.00,'تسوية استبدال بضاعة - سند رقم #IV-1768729202907','2026-01-18 09:40:52','2026-01-18 09:40:52'),(335,161,15,79.66,0.00,'تكلفة بضاعة بديلة - سند رقم #IV-1768729202907','2026-01-18 09:40:52','2026-01-18 09:40:52'),(336,161,110,0.00,79.66,'مخزون تام الصنع - تكلفة بضاعة بديلة - سند رقم #IV-1768729202907','2026-01-18 09:40:52','2026-01-18 09:40:52'),(337,162,80,1215.72,0.00,'سند صرف مخزني رقم #IV-1768746746292','2026-01-18 14:34:57','2026-01-18 14:34:57'),(338,162,110,0.00,1215.72,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768746746292','2026-01-18 14:34:57','2026-01-18 14:34:57'),(339,163,80,475.00,0.00,'سند صرف مخزني رقم #IV-1768747030859','2026-01-18 14:38:35','2026-01-18 14:38:35'),(340,163,110,0.00,475.00,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768747030859','2026-01-18 14:38:35','2026-01-18 14:38:35'),(341,164,100,308.97,0.00,'سند صرف مخزني رقم #IV-1768747120252','2026-01-18 14:40:48','2026-01-18 14:40:48'),(342,164,110,0.00,308.97,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768747120252','2026-01-18 14:40:48','2026-01-18 14:40:48'),(343,165,28,0.00,704.00,'إيراد مبيعات - فاتورة #SI-2026-000094','2026-01-18 15:06:46','2026-01-18 15:06:46'),(344,165,47,704.00,0.00,'مديونية عميل - فاتورة #SI-2026-000094','2026-01-18 15:06:46','2026-01-18 15:06:46'),(345,166,15,179.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000094','2026-01-18 15:06:46','2026-01-18 15:06:46'),(346,166,110,0.00,179.40,'مخزون تام الصنع - فاتورة #SI-2026-000094','2026-01-18 15:06:46','2026-01-18 15:06:46'),(347,167,41,704.00,0.00,'تحصيل - cash','2026-01-18 15:07:16','2026-01-18 15:07:16'),(348,167,47,0.00,704.00,'تخفيض مديونية العميل','2026-01-18 15:07:16','2026-01-18 15:07:16'),(349,168,28,0.00,154.00,'إيراد مبيعات - فاتورة #SI-2026-000097','2026-01-18 15:24:06','2026-01-18 15:24:06'),(350,168,47,154.00,0.00,'مديونية عميل - فاتورة #SI-2026-000097','2026-01-18 15:24:06','2026-01-18 15:24:06'),(351,169,15,47.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000097','2026-01-18 15:24:06','2026-01-18 15:24:06'),(352,169,110,0.00,47.50,'مخزون تام الصنع - فاتورة #SI-2026-000097','2026-01-18 15:24:06','2026-01-18 15:24:06'),(353,170,41,154.00,0.00,'تحصيل - cash','2026-01-18 15:24:45','2026-01-18 15:24:45'),(354,170,47,0.00,154.00,'تخفيض مديونية العميل','2026-01-18 15:24:45','2026-01-18 15:24:45'),(355,171,47,13732.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000099','2026-01-20 08:04:48','2026-01-20 08:04:48'),(356,171,117,0.00,13732.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000099','2026-01-20 08:04:48','2026-01-21 09:27:41'),(357,172,47,11761.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000100','2026-01-20 08:10:56','2026-01-20 08:10:56'),(358,172,117,0.00,11761.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000100','2026-01-20 08:10:56','2026-01-21 09:27:41'),(359,173,47,18975.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000062','2026-01-20 08:16:30','2026-01-20 08:16:30'),(360,173,117,0.00,18975.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000062','2026-01-20 08:16:30','2026-01-21 09:27:41'),(361,174,41,6075.00,0.00,'تحصيل - cash','2026-01-20 08:19:26','2026-01-20 08:19:26'),(362,174,47,0.00,6075.00,'تخفيض مديونية العميل','2026-01-20 08:19:26','2026-01-20 08:19:26'),(363,175,28,0.00,5400.00,'إيراد مبيعات - فاتورة #SI-2026-000086','2026-01-20 08:19:54','2026-01-20 08:19:54'),(364,175,47,5400.00,0.00,'مديونية عميل - فاتورة #SI-2026-000086','2026-01-20 08:19:54','2026-01-20 08:19:54'),(365,176,15,749.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000086','2026-01-20 08:19:54','2026-01-20 08:19:54'),(366,176,110,0.00,749.10,'مخزون تام الصنع - فاتورة #SI-2026-000086','2026-01-20 08:19:54','2026-01-20 08:19:54'),(367,177,28,0.00,7800.00,'إيراد مبيعات - فاتورة #SI-2026-000087','2026-01-20 08:20:12','2026-01-20 08:20:12'),(368,177,47,7800.00,0.00,'مديونية عميل - فاتورة #SI-2026-000087','2026-01-20 08:20:12','2026-01-20 08:20:12'),(369,178,15,1973.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000087','2026-01-20 08:20:12','2026-01-20 08:20:12'),(370,178,110,0.00,1973.40,'مخزون تام الصنع - فاتورة #SI-2026-000087','2026-01-20 08:20:12','2026-01-20 08:20:12'),(371,179,28,0.00,7425.00,'إيراد مبيعات - فاتورة #SI-2026-000088','2026-01-20 08:20:29','2026-01-20 08:20:29'),(372,179,47,7425.00,0.00,'مديونية عميل - فاتورة #SI-2026-000088','2026-01-20 08:20:29','2026-01-20 08:20:29'),(373,180,15,1824.90,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000088','2026-01-20 08:20:29','2026-01-20 08:20:29'),(374,180,110,0.00,1824.90,'مخزون تام الصنع - فاتورة #SI-2026-000088','2026-01-20 08:20:29','2026-01-20 08:20:29'),(375,181,28,0.00,3300.00,'إيراد مبيعات - فاتورة #SI-2026-000089','2026-01-20 08:20:50','2026-01-20 08:20:50'),(376,181,47,3300.00,0.00,'مديونية عميل - فاتورة #SI-2026-000089','2026-01-20 08:20:50','2026-01-20 08:20:50'),(377,182,15,1045.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000089','2026-01-20 08:20:50','2026-01-20 08:20:50'),(378,182,110,0.00,1045.00,'مخزون تام الصنع - فاتورة #SI-2026-000089','2026-01-20 08:20:50','2026-01-20 08:20:50'),(379,183,41,5000.00,0.00,'تحصيل - cash','2026-01-20 08:23:01','2026-01-20 08:23:01'),(380,183,47,0.00,5000.00,'تخفيض مديونية العميل','2026-01-20 08:23:01','2026-01-20 08:23:01'),(381,184,28,0.00,2184.30,'إيراد مبيعات - فاتورة #SI-2026-000090','2026-01-20 08:26:05','2026-01-20 08:26:05'),(382,184,47,2184.30,0.00,'مديونية عميل - فاتورة #SI-2026-000090','2026-01-20 08:26:05','2026-01-20 08:26:05'),(383,185,15,398.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000090','2026-01-20 08:26:05','2026-01-20 08:26:05'),(384,185,110,0.00,398.30,'مخزون تام الصنع - فاتورة #SI-2026-000090','2026-01-20 08:26:05','2026-01-20 08:26:05'),(385,186,28,0.00,9265.00,'إيراد مبيعات - فاتورة #SI-2026-000091','2026-01-20 08:26:39','2026-01-20 08:26:39'),(386,186,47,9265.00,0.00,'مديونية عميل - فاتورة #SI-2026-000091','2026-01-20 08:26:39','2026-01-20 08:26:39'),(387,187,15,1844.70,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000091','2026-01-20 08:26:39','2026-01-20 08:26:39'),(388,187,110,0.00,1844.70,'مخزون تام الصنع - فاتورة #SI-2026-000091','2026-01-20 08:26:39','2026-01-20 08:26:39'),(389,188,41,3000.00,0.00,'تحصيل - cash','2026-01-20 08:30:18','2026-01-20 08:30:18'),(390,188,47,0.00,3000.00,'تخفيض مديونية العميل','2026-01-20 08:30:18','2026-01-20 08:30:18'),(391,189,93,2000.00,0.00,'مصروف #2','2026-01-20 08:42:27','2026-01-20 08:42:27'),(392,189,41,0.00,2000.00,'مصروف #2','2026-01-20 08:42:27','2026-01-20 08:42:27'),(393,190,91,6006.00,0.00,'مصروف #3','2026-01-20 08:46:16','2026-01-20 08:46:16'),(394,190,43,0.00,6006.00,'مصروف #3','2026-01-20 08:46:16','2026-01-20 08:46:16'),(395,191,89,1952.00,0.00,'هدير بلوجر','2026-01-20 08:54:19','2026-01-20 08:54:19'),(396,191,43,0.00,1952.00,'هدير بلوجر','2026-01-20 08:54:19','2026-01-20 08:54:19'),(397,192,95,10.00,0.00,'مصروف #5','2026-01-20 09:04:23','2026-01-20 09:04:23'),(398,192,41,0.00,10.00,'مصروف #5','2026-01-20 09:04:23','2026-01-20 09:04:23'),(399,193,41,3650.00,0.00,'رصيد اول المده خزينه','2026-01-20 09:13:39','2026-01-20 09:13:39'),(400,193,117,0.00,3650.00,'رصيد اول المده خزينه','2026-01-20 09:13:39','2026-01-21 09:27:41'),(401,194,99,120.00,0.00,'مصروف #6','2026-01-20 09:21:03','2026-01-20 09:21:03'),(402,194,41,0.00,120.00,'مصروف #6','2026-01-20 09:21:03','2026-01-20 09:21:03'),(403,195,99,255.38,0.00,'مصاريف اشتراك الانترنت','2026-01-20 09:23:12','2026-01-20 09:23:12'),(404,195,43,0.00,255.38,'مصاريف اشتراك الانترنت','2026-01-20 09:23:12','2026-01-20 09:23:12'),(405,196,22,10010.00,0.00,'شركة التسويق Objective','2026-01-20 09:31:06','2026-01-20 09:31:06'),(406,196,43,0.00,10010.00,'شركة التسويق Objective','2026-01-20 09:31:06','2026-01-20 09:31:06'),(407,197,85,4504.50,0.00,'بروشورات (شركة المصريه)','2026-01-20 09:36:02','2026-01-20 09:36:02'),(408,197,43,0.00,4504.50,'بروشورات (شركة المصريه)','2026-01-20 09:36:02','2026-01-20 09:36:02'),(409,198,99,20.00,0.00,'فاتورة غاز','2026-01-20 09:37:17','2026-01-20 09:37:17'),(410,198,41,0.00,20.00,'فاتورة غاز','2026-01-20 09:37:17','2026-01-20 09:37:17'),(411,199,99,200.00,0.00,'تنظيف المكتب','2026-01-20 09:38:04','2026-01-20 09:38:04'),(412,199,41,0.00,200.00,'تنظيف المكتب','2026-01-20 09:38:04','2026-01-20 09:38:04'),(413,200,103,135.00,0.00,'بدل سفر طنطا وكفر الشيخ','2026-01-20 09:39:05','2026-01-20 09:39:05'),(414,200,41,0.00,135.00,'بدل سفر طنطا وكفر الشيخ','2026-01-20 09:39:05','2026-01-20 09:39:05'),(415,201,95,20.00,0.00,'مياه شرب','2026-01-20 09:39:54','2026-01-20 09:39:54'),(416,201,41,0.00,20.00,'مياه شرب','2026-01-20 09:39:54','2026-01-20 09:39:54'),(417,202,103,80.00,0.00,'بدل سفر دمياط','2026-01-20 09:40:43','2026-01-20 09:40:43'),(418,202,41,0.00,80.00,'بدل سفر دمياط','2026-01-20 09:40:43','2026-01-20 09:40:43'),(419,203,83,20020.00,0.00,'مصروف #15','2026-01-20 09:42:42','2026-01-20 09:42:42'),(420,203,43,0.00,20020.00,'مصروف #15','2026-01-20 09:42:42','2026-01-20 09:42:42'),(421,204,103,95.00,0.00,'بدل سفر الزقازيق','2026-01-20 09:57:50','2026-01-20 09:57:50'),(422,204,41,0.00,95.00,'بدل سفر الزقازيق','2026-01-20 09:57:50','2026-01-20 09:57:50'),(423,205,22,500.00,0.00,'مصاريف تكويد منتج','2026-01-20 10:19:05','2026-01-20 10:19:05'),(424,205,43,0.00,500.00,'مصاريف تكويد منتج','2026-01-20 10:19:05','2026-01-20 10:19:05'),(425,206,28,0.00,8760.00,'إيراد مبيعات - فاتورة #SI-2026-000101','2026-01-20 11:18:41','2026-01-20 11:18:41'),(426,206,47,8760.00,0.00,'مديونية عميل - فاتورة #SI-2026-000101','2026-01-20 11:18:41','2026-01-20 11:18:41'),(427,207,15,2439.05,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000101','2026-01-20 11:18:41','2026-01-20 11:18:41'),(428,207,110,0.00,2439.05,'مخزون تام الصنع - فاتورة #SI-2026-000101','2026-01-20 11:18:41','2026-01-20 11:18:41'),(429,208,28,0.00,4080.00,'إيراد مبيعات - فاتورة #SI-2026-000102','2026-01-20 11:22:52','2026-01-20 11:22:52'),(430,208,108,122.40,0.00,'خصم مسموح به - فاتورة #SI-2026-000102','2026-01-20 11:22:52','2026-01-20 11:22:52'),(431,208,47,3957.60,0.00,'مديونية عميل - فاتورة #SI-2026-000102','2026-01-20 11:22:52','2026-01-20 11:22:52'),(432,209,15,454.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000102','2026-01-20 11:22:52','2026-01-20 11:22:52'),(433,209,110,0.00,454.00,'مخزون تام الصنع - فاتورة #SI-2026-000102','2026-01-20 11:22:52','2026-01-20 11:22:52'),(434,210,28,0.00,495.00,'إيراد مبيعات - فاتورة #SI-2026-000103','2026-01-20 11:34:50','2026-01-20 11:34:50'),(435,210,47,495.00,0.00,'مديونية عميل - فاتورة #SI-2026-000103','2026-01-20 11:34:50','2026-01-20 11:34:50'),(436,211,15,110.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000103','2026-01-20 11:34:50','2026-01-20 11:34:50'),(437,211,110,0.00,110.60,'مخزون تام الصنع - فاتورة #SI-2026-000103','2026-01-20 11:34:50','2026-01-20 11:34:50'),(438,212,43,495.00,0.00,'تحصيل - bank_transfer','2026-01-20 11:36:17','2026-01-20 11:36:17'),(439,212,47,0.00,495.00,'تخفيض مديونية العميل','2026-01-20 11:36:17','2026-01-20 11:36:17'),(440,213,41,3957.60,0.00,'تحصيل - cash','2026-01-20 11:40:55','2026-01-20 11:40:55'),(441,213,47,0.00,3957.60,'تخفيض مديونية العميل','2026-01-20 11:40:55','2026-01-20 11:40:55'),(442,214,82,174.28,0.00,'سند صرف مخزني رقم #IV-1768909730579','2026-01-20 11:50:50','2026-01-20 11:50:50'),(443,214,110,0.00,174.28,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768909730579','2026-01-20 11:50:50','2026-01-20 11:50:50'),(444,215,103,90.00,0.00,'بدل سفر دمياط','2026-01-20 12:17:18','2026-01-20 12:17:18'),(445,215,41,0.00,90.00,'بدل سفر دمياط','2026-01-20 12:17:18','2026-01-20 12:17:18'),(446,216,100,47.50,0.00,'سند صرف مخزني رقم #IV-1768913971741','2026-01-20 13:01:19','2026-01-20 13:01:19'),(447,216,110,0.00,47.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768913971741','2026-01-20 13:01:19','2026-01-20 13:01:19'),(448,217,80,47.50,0.00,'سند صرف مخزني رقم #IV-1768914183112','2026-01-20 13:04:02','2026-01-20 13:04:02'),(449,217,110,0.00,47.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768914183112','2026-01-20 13:04:02','2026-01-20 13:04:02'),(450,218,80,137.20,0.00,'سند صرف مخزني رقم #IV-1768914301890','2026-01-20 13:06:03','2026-01-20 13:06:03'),(451,218,110,0.00,137.20,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768914301890','2026-01-20 13:06:03','2026-01-20 13:06:03'),(452,219,80,47.50,0.00,'سند صرف مخزني رقم #IV-1768914483501','2026-01-20 13:08:46','2026-01-20 13:08:46'),(453,219,110,0.00,47.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768914483501','2026-01-20 13:08:46','2026-01-20 13:08:46'),(454,220,28,0.00,374.00,'إيراد مبيعات - فاتورة #SI-2026-000098','2026-01-20 14:03:23','2026-01-20 14:03:23'),(455,220,47,374.00,0.00,'مديونية عميل - فاتورة #SI-2026-000098','2026-01-20 14:03:23','2026-01-20 14:03:23'),(456,221,15,95.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000098','2026-01-20 14:03:23','2026-01-20 14:03:23'),(457,221,110,0.00,95.00,'مخزون تام الصنع - فاتورة #SI-2026-000098','2026-01-20 14:03:23','2026-01-20 14:03:23'),(458,222,28,0.00,5824.00,'إيراد مبيعات - فاتورة #SI-2026-000083','2026-01-20 14:04:18','2026-01-20 14:04:18'),(459,222,108,291.20,0.00,'خصم مسموح به - فاتورة #SI-2026-000083','2026-01-20 14:04:18','2026-01-20 14:04:18'),(460,222,47,5532.80,0.00,'مديونية عميل - فاتورة #SI-2026-000083','2026-01-20 14:04:18','2026-01-20 14:04:18'),(461,223,15,1531.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000083','2026-01-20 14:04:18','2026-01-20 14:04:18'),(462,223,110,0.00,1531.80,'مخزون تام الصنع - فاتورة #SI-2026-000083','2026-01-20 14:04:18','2026-01-20 14:04:18'),(463,224,28,0.00,3225.00,'إيراد مبيعات - فاتورة #SI-2026-000080','2026-01-20 14:05:50','2026-01-20 14:05:50'),(464,224,47,3225.00,0.00,'مديونية عميل - فاتورة #SI-2026-000080','2026-01-20 14:05:50','2026-01-20 14:05:50'),(465,225,15,988.90,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000080','2026-01-20 14:05:50','2026-01-20 14:05:50'),(466,225,110,0.00,988.90,'مخزون تام الصنع - فاتورة #SI-2026-000080','2026-01-20 14:05:50','2026-01-20 14:05:50'),(467,226,47,1030.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000047','2026-01-20 14:11:30','2026-01-20 14:11:30'),(468,226,117,0.00,1030.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000047','2026-01-20 14:11:30','2026-01-21 09:27:41'),(469,227,47,49750.53,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000046','2026-01-20 14:12:08','2026-01-20 14:12:08'),(470,227,117,0.00,49750.53,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000046','2026-01-20 14:12:08','2026-01-21 09:27:41'),(471,228,111,12960.00,0.00,'مخزون افتتاحي - Attractive Pump Neck 24 Black - ','2026-01-20 20:48:17','2026-01-20 20:48:17'),(472,228,117,0.00,12960.00,'رأس المال - مخزون افتتاحي - Attractive Pump Neck 24 Black','2026-01-20 20:48:17','2026-01-21 09:27:41'),(473,229,111,46763.37,0.00,'مخزون افتتاحي - Nurivina Face Glow Cleasing Gel 150ML Bottle - ','2026-01-20 20:48:58','2026-02-15 16:44:18'),(474,229,117,0.00,46763.37,'رأس المال - مخزون افتتاحي - Nurivina Face Glow Cleasing Gel 150ML Bottle','2026-01-20 20:48:58','2026-02-15 16:44:18'),(475,230,28,0.00,2475.00,'إيراد مبيعات - فاتورة #SI-2026-000106','2026-01-21 09:55:50','2026-01-21 09:55:50'),(476,230,47,2475.00,0.00,'مديونية عميل - فاتورة #SI-2026-000106','2026-01-21 09:55:50','2026-01-21 09:55:50'),(477,231,15,608.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000106','2026-01-21 09:55:50','2026-01-21 09:55:50'),(478,231,110,0.00,608.30,'مخزون تام الصنع - فاتورة #SI-2026-000106','2026-01-21 09:55:50','2026-01-21 09:55:50'),(479,232,117,259115.00,0.00,'إثبات رصيد افتتاحى للمورد - فاتورة #PI-2026-000001','2026-01-21 10:10:37','2026-01-21 10:10:37'),(480,232,62,0.00,259115.00,'مقابل رصيد افتتاحى - فاتورة #PI-2026-000001','2026-01-21 10:10:37','2026-01-21 10:10:37'),(481,233,117,296776.00,0.00,'اثبات مديونية على المنشأة لصالح هاني صلاح','2026-01-21 10:58:04','2026-01-21 10:58:04'),(482,233,51,0.00,296776.00,'اثبات مستحقات هاني صلاح على المنشأة في بداية المدة','2026-01-21 10:58:04','2026-01-21 10:58:04'),(483,234,28,0.00,360.00,'إيراد مبيعات - فاتورة #SI-2026-000108','2026-01-24 08:28:41','2026-01-24 08:28:41'),(484,234,47,360.00,0.00,'مديونية عميل - فاتورة #SI-2026-000108','2026-01-24 08:28:41','2026-01-24 08:28:41'),(485,235,15,45.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000108','2026-01-24 08:28:41','2026-01-24 08:28:41'),(486,235,110,0.00,45.40,'مخزون تام الصنع - فاتورة #SI-2026-000108','2026-01-24 08:28:41','2026-01-24 08:28:41'),(487,236,42,360.00,0.00,'تحصيل - cash','2026-01-24 08:29:36','2026-01-24 08:29:36'),(488,236,47,0.00,360.00,'تخفيض مديونية العميل','2026-01-24 08:29:36','2026-01-24 08:29:36'),(489,237,28,0.00,880.00,'إيراد مبيعات - فاتورة #SI-2026-000109','2026-01-24 08:34:04','2026-01-24 08:34:04'),(490,237,47,880.00,0.00,'مديونية عميل - فاتورة #SI-2026-000109','2026-01-24 08:34:04','2026-01-24 08:34:04'),(491,238,15,237.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000109','2026-01-24 08:34:04','2026-01-24 08:34:04'),(492,238,110,0.00,237.50,'مخزون تام الصنع - فاتورة #SI-2026-000109','2026-01-24 08:34:04','2026-01-24 08:34:04'),(493,239,28,0.00,10164.00,'إيراد مبيعات - فاتورة #SI-2026-000107','2026-01-24 08:34:29','2026-01-24 08:34:29'),(494,239,47,10164.00,0.00,'مديونية عميل - فاتورة #SI-2026-000107','2026-01-24 08:34:29','2026-01-24 08:34:29'),(495,240,15,2322.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000107','2026-01-24 08:34:29','2026-01-24 08:34:29'),(496,240,110,0.00,2322.60,'مخزون تام الصنع - فاتورة #SI-2026-000107','2026-01-24 08:34:29','2026-01-24 08:34:29'),(497,241,28,0.00,731.00,'إيراد مبيعات - فاتورة #SI-2026-000105','2026-01-24 08:35:20','2026-01-24 08:35:20'),(498,241,47,731.00,0.00,'مديونية عميل - فاتورة #SI-2026-000105','2026-01-24 08:35:20','2026-01-24 08:35:20'),(499,242,15,197.78,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000105','2026-01-24 08:35:21','2026-01-24 08:35:21'),(500,242,110,0.00,197.78,'مخزون تام الصنع - فاتورة #SI-2026-000105','2026-01-24 08:35:21','2026-01-24 08:35:21'),(501,243,42,731.00,0.00,'تحصيل - cash','2026-01-24 08:36:20','2026-01-24 08:36:20'),(502,243,47,0.00,731.00,'تخفيض مديونية العميل','2026-01-24 08:36:20','2026-01-24 08:36:20'),(503,244,28,0.00,731.00,'إيراد مبيعات - فاتورة #SI-2026-000104','2026-01-24 08:36:47','2026-01-24 08:36:47'),(504,244,47,731.00,0.00,'مديونية عميل - فاتورة #SI-2026-000104','2026-01-24 08:36:47','2026-01-24 08:36:47'),(505,245,15,197.78,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000104','2026-01-24 08:36:47','2026-01-24 08:36:47'),(506,245,110,0.00,197.78,'مخزون تام الصنع - فاتورة #SI-2026-000104','2026-01-24 08:36:47','2026-01-24 08:36:47'),(507,246,42,731.00,0.00,'تحصيل - cash','2026-01-24 08:37:21','2026-01-24 08:37:21'),(508,246,47,0.00,731.00,'تخفيض مديونية العميل','2026-01-24 08:37:21','2026-01-24 08:37:21'),(509,247,41,3720.00,0.00,'تحصيل - cash','2026-01-24 08:39:50','2026-01-24 08:39:50'),(510,247,47,0.00,3720.00,'تخفيض مديونية العميل','2026-01-24 08:39:50','2026-01-24 08:39:50'),(511,248,47,26680.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000054','2026-01-24 08:41:06','2026-01-24 08:41:06'),(512,248,117,0.00,26680.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000054','2026-01-24 08:41:06','2026-01-27 08:31:21'),(513,249,43,14880.35,0.00,'سحب المستحقات من شركة الشحن','2026-01-24 09:26:41','2026-01-24 09:26:41'),(514,249,42,0.00,14880.35,'تحويل المستحقات الى حساب بنك QNB','2026-01-24 09:26:41','2026-01-24 09:26:41'),(515,250,89,1250.00,0.00,'مصروف #19','2026-01-24 10:09:59','2026-01-24 10:09:59'),(516,250,43,0.00,1250.00,'مصروف #19','2026-01-24 10:09:59','2026-01-24 10:09:59'),(517,251,103,85.00,0.00,'بدل سفر طنطا وكفر الشيخ','2026-01-24 10:11:07','2026-01-24 10:11:07'),(518,251,41,0.00,85.00,'بدل سفر طنطا وكفر الشيخ','2026-01-24 10:11:07','2026-01-24 10:11:07'),(519,252,80,215.20,0.00,'سند صرف مخزني رقم #IV-1769249544576','2026-01-24 10:14:05','2026-01-24 10:14:05'),(520,252,110,0.00,215.20,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769249544576','2026-01-24 10:14:05','2026-01-24 10:14:05'),(521,253,28,0.00,1198.80,'إيراد مبيعات - فاتورة #SI-2026-000093','2026-01-24 14:30:22','2026-01-24 14:30:22'),(522,253,47,1198.80,0.00,'مديونية عميل - فاتورة #SI-2026-000093','2026-01-24 14:30:22','2026-01-24 14:30:22'),(523,254,15,274.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000093','2026-01-24 14:30:22','2026-01-24 14:30:22'),(524,254,110,0.00,274.40,'مخزون تام الصنع - فاتورة #SI-2026-000093','2026-01-24 14:30:22','2026-01-24 14:30:22'),(525,255,28,0.00,1919.70,'إيراد مبيعات - فاتورة #SI-2026-000092','2026-01-24 14:31:22','2026-01-24 14:31:22'),(526,255,47,1919.70,0.00,'مديونية عميل - فاتورة #SI-2026-000092','2026-01-24 14:31:22','2026-01-24 14:31:22'),(527,256,15,388.59,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000092','2026-01-24 14:31:22','2026-01-24 14:31:22'),(528,256,110,0.00,388.59,'مخزون تام الصنع - فاتورة #SI-2026-000092','2026-01-24 14:31:22','2026-01-24 14:31:22'),(529,257,80,89.70,0.00,'سند صرف مخزني رقم #IV-1769265282547','2026-01-24 14:35:26','2026-01-24 14:35:26'),(530,257,110,0.00,89.70,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769265282547','2026-01-24 14:35:26','2026-01-24 14:35:26'),(531,258,43,30380.00,0.00,'تحصيل - cheque','2026-01-25 11:30:12','2026-01-25 11:30:12'),(532,258,47,0.00,30380.00,'تخفيض مديونية العميل','2026-01-25 11:30:12','2026-01-25 11:30:12'),(533,259,47,2640.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000069','2026-01-25 12:48:47','2026-01-25 12:48:47'),(534,259,117,0.00,2640.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000069','2026-01-25 12:48:47','2026-01-27 08:31:21'),(535,260,41,1850.00,0.00,'تحصيل - cash','2026-01-25 12:49:35','2026-01-25 12:49:35'),(536,260,47,0.00,1850.00,'تخفيض مديونية العميل','2026-01-25 12:49:35','2026-01-25 12:49:35'),(537,261,6,790.00,0.00,'Sales Return #3 - Revenue Reversal','2026-01-25 13:59:12','2026-01-25 13:59:12'),(538,261,47,0.00,790.00,'Refund/Credit - Return #3','2026-01-25 13:59:12','2026-01-25 13:59:12'),(539,262,110,110.60,0.00,'Cost Reversal (Return #3)','2026-01-25 13:59:12','2026-01-25 13:59:12'),(540,262,15,0.00,110.60,'COGS Reversal - Return #3','2026-01-25 13:59:12','2026-01-25 13:59:12'),(541,263,43,26217.00,0.00,'تحصيل - cheque','2026-01-25 19:03:40','2026-01-25 19:03:40'),(542,263,56,209.40,0.00,'خصم ضريبة من المنبع','2026-01-25 19:03:40','2026-01-25 19:03:40'),(543,263,47,0.00,26426.40,'تخفيض مديونية العميل','2026-01-25 19:03:40','2026-01-25 19:03:40'),(544,264,28,0.00,365.50,'إيراد مبيعات - فاتورة #SI-2026-000113','2026-01-25 19:17:26','2026-01-25 19:17:26'),(545,264,108,10.96,0.00,'خصم مسموح به - فاتورة #SI-2026-000113','2026-01-25 19:17:26','2026-01-25 19:17:26'),(546,264,47,354.54,0.00,'مديونية عميل - فاتورة #SI-2026-000113','2026-01-25 19:17:26','2026-01-25 19:17:26'),(547,265,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000113','2026-01-25 19:17:26','2026-01-25 19:17:26'),(548,265,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000113','2026-01-25 19:17:26','2026-01-25 19:17:26'),(549,266,41,354.54,0.00,'تحصيل - cash','2026-01-25 19:18:11','2026-01-25 19:18:11'),(550,266,47,0.00,354.54,'تخفيض مديونية العميل','2026-01-25 19:18:11','2026-01-25 19:18:11'),(551,267,28,0.00,841.50,'إيراد مبيعات - فاتورة #SI-2026-000114','2026-01-25 19:23:25','2026-01-25 19:23:25'),(552,267,108,25.25,0.00,'خصم مسموح به - فاتورة #SI-2026-000114','2026-01-25 19:23:25','2026-01-25 19:23:25'),(553,267,47,816.25,0.00,'مديونية عميل - فاتورة #SI-2026-000114','2026-01-25 19:23:25','2026-01-25 19:23:25'),(554,268,15,165.90,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000114','2026-01-25 19:23:25','2026-01-25 19:23:25'),(555,268,110,0.00,165.90,'مخزون تام الصنع - فاتورة #SI-2026-000114','2026-01-25 19:23:25','2026-01-25 19:23:25'),(556,269,41,816.25,0.00,'تحصيل - cash','2026-01-25 19:24:07','2026-01-25 19:24:07'),(557,269,47,0.00,816.25,'تخفيض مديونية العميل','2026-01-25 19:24:07','2026-01-25 19:24:07'),(558,270,28,0.00,6385.60,'إيراد مبيعات - فاتورة #SI-2026-000112','2026-01-27 08:07:58','2026-01-27 08:07:58'),(559,270,65,0.00,893.98,'ضريبة القيمة المضافة - فاتورة #SI-2026-000112','2026-01-27 08:07:58','2026-01-27 08:07:58'),(560,270,47,7279.58,0.00,'مديونية عميل - فاتورة #SI-2026-000112','2026-01-27 08:07:58','2026-01-27 08:07:58'),(561,271,15,1794.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000112','2026-01-27 08:07:58','2026-01-27 08:07:58'),(562,271,110,0.00,1794.00,'مخزون تام الصنع - فاتورة #SI-2026-000112','2026-01-27 08:07:58','2026-01-27 08:07:58'),(563,272,28,0.00,1032.00,'إيراد مبيعات - فاتورة #SI-2026-000111','2026-01-27 08:08:23','2026-01-27 08:08:23'),(564,272,47,1032.00,0.00,'مديونية عميل - فاتورة #SI-2026-000111','2026-01-27 08:08:23','2026-01-27 08:08:23'),(565,273,15,296.67,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000111','2026-01-27 08:08:23','2026-01-27 08:08:23'),(566,273,110,0.00,296.67,'مخزون تام الصنع - فاتورة #SI-2026-000111','2026-01-27 08:08:23','2026-01-27 08:08:23'),(567,274,42,1032.00,0.00,'تحصيل - cash','2026-01-27 08:08:55','2026-01-27 08:08:55'),(568,274,47,0.00,1032.00,'تخفيض مديونية العميل','2026-01-27 08:08:55','2026-01-27 08:08:55'),(569,275,28,0.00,1700.00,'إيراد مبيعات - فاتورة #SI-2026-000110','2026-01-27 08:09:22','2026-01-27 08:09:22'),(570,275,108,51.00,0.00,'خصم مسموح به - فاتورة #SI-2026-000110','2026-01-27 08:09:22','2026-01-27 08:09:22'),(571,275,47,1649.00,0.00,'مديونية عميل - فاتورة #SI-2026-000110','2026-01-27 08:09:22','2026-01-27 08:09:22'),(572,276,15,448.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000110','2026-01-27 08:09:22','2026-01-27 08:09:22'),(573,276,110,0.00,448.50,'مخزون تام الصنع - فاتورة #SI-2026-000110','2026-01-27 08:09:22','2026-01-27 08:09:22'),(574,277,42,1649.00,0.00,'تحصيل - cash','2026-01-27 08:09:44','2026-01-27 08:09:44'),(575,277,47,0.00,1649.00,'تخفيض مديونية العميل','2026-01-27 08:09:44','2026-01-27 08:09:44'),(576,278,28,0.00,10692.00,'إيراد مبيعات - فاتورة #SI-2026-000115','2026-01-27 08:11:43','2026-01-27 08:11:43'),(577,278,47,10692.00,0.00,'مديونية عميل - فاتورة #SI-2026-000115','2026-01-27 08:11:43','2026-01-27 08:11:43'),(578,279,15,2851.45,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000115','2026-01-27 08:11:43','2026-01-27 08:11:43'),(579,279,110,0.00,2851.45,'مخزون تام الصنع - فاتورة #SI-2026-000115','2026-01-27 08:11:43','2026-01-27 08:11:43'),(580,280,41,8500.00,0.00,'تحصيل - cash','2026-01-27 08:14:55','2026-01-27 08:14:55'),(581,280,47,0.00,8500.00,'تخفيض مديونية العميل','2026-01-27 08:14:55','2026-01-27 08:14:55'),(582,281,28,0.00,731.00,'إيراد مبيعات - فاتورة #SI-2026-000116','2026-01-27 08:28:23','2026-01-27 08:28:23'),(583,281,108,21.93,0.00,'خصم مسموح به - فاتورة #SI-2026-000116','2026-01-27 08:28:23','2026-01-27 08:28:23'),(584,281,47,709.07,0.00,'مديونية عميل - فاتورة #SI-2026-000116','2026-01-27 08:28:23','2026-01-27 08:28:23'),(585,282,15,197.78,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000116','2026-01-27 08:28:23','2026-01-27 08:28:23'),(586,282,110,0.00,197.78,'مخزون تام الصنع - فاتورة #SI-2026-000116','2026-01-27 08:28:23','2026-01-27 08:28:23'),(587,283,28,0.00,3520.00,'إيراد مبيعات - فاتورة #SI-2026-000072','2026-01-27 08:29:16','2026-01-27 08:29:16'),(588,283,108,176.00,0.00,'خصم مسموح به - فاتورة #SI-2026-000072','2026-01-27 08:29:16','2026-01-27 08:29:16'),(589,283,47,3344.00,0.00,'مديونية عميل - فاتورة #SI-2026-000072','2026-01-27 08:29:16','2026-01-27 08:29:16'),(590,284,15,950.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000072','2026-01-27 08:29:16','2026-01-27 08:29:16'),(591,284,110,0.00,950.00,'مخزون تام الصنع - فاتورة #SI-2026-000072','2026-01-27 08:29:16','2026-01-27 08:29:16'),(592,285,41,3465.00,0.00,'تحصيل - cash','2026-01-27 08:44:08','2026-01-27 08:44:08'),(593,285,47,0.00,3465.00,'تخفيض مديونية العميل','2026-01-27 08:44:08','2026-01-27 08:44:08'),(594,286,6,1258.00,0.00,'Sales Return #4 - Revenue Reversal','2026-01-27 08:53:53','2026-01-27 08:53:53'),(595,286,47,0.00,1258.00,'Refund/Credit - Return #4','2026-01-27 08:53:53','2026-01-27 08:53:53'),(596,287,110,235.66,0.00,'Cost Reversal (Return #4)','2026-01-27 08:53:53','2026-01-27 08:53:53'),(597,287,15,0.00,235.66,'COGS Reversal - Return #4','2026-01-27 08:53:53','2026-01-27 08:53:53'),(598,288,47,21840.01,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000053','2026-01-27 08:57:35','2026-01-27 08:57:35'),(599,288,117,0.00,21840.01,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000053','2026-01-27 08:57:35','2026-01-27 08:59:53'),(600,289,41,21840.00,0.00,'تحصيل - cash','2026-01-27 09:02:34','2026-01-27 09:02:34'),(601,289,47,0.00,21840.00,'تخفيض مديونية العميل','2026-01-27 09:02:34','2026-01-27 09:02:34'),(602,290,28,0.00,2655.04,'إيراد مبيعات - فاتورة #SI-2026-000122','2026-01-29 22:51:03','2026-01-29 22:51:03'),(603,290,47,2655.04,0.00,'مديونية عميل - فاتورة #SI-2026-000122','2026-01-29 22:51:03','2026-01-29 22:51:03'),(604,291,15,708.07,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000122','2026-01-29 22:51:03','2026-01-29 22:51:03'),(605,291,110,0.00,708.07,'مخزون تام الصنع - فاتورة #SI-2026-000122','2026-01-29 22:51:03','2026-01-29 22:51:03'),(606,292,41,2655.03,0.00,'تحصيل - cash','2026-01-29 22:57:16','2026-01-29 22:57:16'),(607,292,47,0.00,2655.03,'تخفيض مديونية العميل','2026-01-29 22:57:16','2026-01-29 22:57:16'),(608,293,28,0.00,1768.00,'إيراد مبيعات - فاتورة #SI-2026-000123','2026-01-29 22:59:33','2026-01-29 22:59:33'),(609,293,108,53.04,0.00,'خصم مسموح به - فاتورة #SI-2026-000123','2026-01-29 22:59:33','2026-01-29 22:59:33'),(610,293,47,1714.96,0.00,'مديونية عميل - فاتورة #SI-2026-000123','2026-01-29 22:59:33','2026-01-29 22:59:33'),(611,294,15,358.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000123','2026-01-29 22:59:33','2026-01-29 22:59:33'),(612,294,110,0.00,358.80,'مخزون تام الصنع - فاتورة #SI-2026-000123','2026-01-29 22:59:33','2026-01-29 22:59:33'),(613,295,42,1714.96,0.00,'تحصيل - cash','2026-01-29 23:00:57','2026-01-29 23:00:57'),(614,295,47,0.00,1714.96,'تخفيض مديونية العميل','2026-01-29 23:00:57','2026-01-29 23:00:57'),(615,296,28,0.00,260.00,'إيراد مبيعات - فاتورة #SI-2026-000096','2026-01-29 23:01:57','2026-01-29 23:01:57'),(616,296,47,260.00,0.00,'مديونية عميل - فاتورة #SI-2026-000096','2026-01-29 23:01:57','2026-01-29 23:01:57'),(617,297,15,89.70,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000096','2026-01-29 23:01:57','2026-01-29 23:01:57'),(618,297,110,0.00,89.70,'مخزون تام الصنع - فاتورة #SI-2026-000096','2026-01-29 23:01:57','2026-01-29 23:01:57'),(619,298,41,260.00,0.00,'تحصيل - cash','2026-01-29 23:03:13','2026-01-29 23:03:13'),(620,298,47,0.00,260.00,'تخفيض مديونية العميل','2026-01-29 23:03:13','2026-01-29 23:03:13'),(621,299,28,0.00,3900.00,'إيراد مبيعات - فاتورة #SI-2026-000119','2026-01-29 23:05:05','2026-01-29 23:05:05'),(622,299,47,3900.00,0.00,'مديونية عميل - فاتورة #SI-2026-000119','2026-01-29 23:05:05','2026-01-29 23:05:05'),(623,300,15,986.70,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000119','2026-01-29 23:05:05','2026-01-29 23:05:05'),(624,300,110,0.00,986.70,'مخزون تام الصنع - فاتورة #SI-2026-000119','2026-01-29 23:05:05','2026-01-29 23:05:05'),(625,301,28,0.00,8920.00,'إيراد مبيعات - فاتورة #SI-2026-000117','2026-01-29 23:05:48','2026-01-29 23:05:48'),(626,301,47,8920.00,0.00,'مديونية عميل - فاتورة #SI-2026-000117','2026-01-29 23:05:48','2026-01-29 23:05:48'),(627,302,15,2528.06,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000117','2026-01-29 23:05:48','2026-01-29 23:05:48'),(628,302,110,0.00,2528.06,'مخزون تام الصنع - فاتورة #SI-2026-000117','2026-01-29 23:05:48','2026-01-29 23:05:48'),(629,303,82,47.50,0.00,'سند صرف مخزني رقم #IV-1769728359692','2026-01-29 23:14:15','2026-01-29 23:14:15'),(630,303,110,0.00,47.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769728359692','2026-01-29 23:14:15','2026-01-29 23:14:15'),(631,304,80,689.89,0.00,'سند صرف مخزني رقم #IV-1769728471767','2026-01-29 23:16:06','2026-01-29 23:16:06'),(632,304,110,0.00,689.89,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769728471767','2026-01-29 23:16:06','2026-01-29 23:16:06'),(633,305,80,546.43,0.00,'سند صرف مخزني رقم #IV-1769728568859','2026-01-29 23:17:38','2026-01-29 23:17:38'),(634,305,110,0.00,546.43,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769728568859','2026-01-29 23:17:38','2026-01-29 23:17:38'),(635,306,100,329.86,0.00,'سند صرف مخزني رقم #IV-1769728660902','2026-01-29 23:20:41','2026-01-29 23:20:41'),(636,306,110,0.00,329.86,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769728660902','2026-01-29 23:20:41','2026-01-29 23:20:41'),(637,307,28,0.00,6880.00,'إيراد مبيعات - فاتورة #SI-2026-000118','2026-01-29 23:27:44','2026-01-29 23:27:44'),(638,307,47,6880.00,0.00,'مديونية عميل - فاتورة #SI-2026-000118','2026-01-29 23:27:44','2026-01-29 23:27:44'),(639,308,15,1977.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000118','2026-01-29 23:27:44','2026-01-29 23:27:44'),(640,308,110,0.00,1977.80,'مخزون تام الصنع - فاتورة #SI-2026-000118','2026-01-29 23:27:44','2026-01-29 23:27:44'),(641,309,87,1500.00,0.00,'ميادة بلوجر','2026-01-31 08:22:12','2026-01-31 08:22:12'),(642,309,43,0.00,1500.00,'ميادة بلوجر','2026-01-31 08:22:12','2026-01-31 08:22:12'),(643,310,120,2625.39,0.00,'مصروف #22','2026-01-31 09:02:02','2026-02-02 09:54:13'),(644,310,43,0.00,2625.39,'مصروف #22','2026-01-31 09:02:02','2026-02-02 09:54:13'),(645,311,47,8400.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000042','2026-01-31 09:15:08','2026-01-31 09:15:08'),(646,311,117,0.00,8400.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000042','2026-01-31 09:15:08','2026-01-31 09:15:08'),(647,312,41,8400.00,0.00,'تحصيل - cash','2026-01-31 09:15:58','2026-01-31 09:15:58'),(648,312,47,0.00,8400.00,'تخفيض مديونية العميل','2026-01-31 09:15:58','2026-01-31 09:15:58'),(649,313,119,11862.00,0.00,NULL,'2026-02-01 09:51:04','2026-02-01 09:51:04'),(650,313,66,0.00,11862.00,NULL,'2026-02-01 09:51:04','2026-02-01 09:51:04'),(651,314,66,11862.00,0.00,NULL,'2026-02-01 09:56:00','2026-02-01 09:56:00'),(652,314,43,0.00,11862.00,NULL,'2026-02-01 09:56:00','2026-02-01 09:56:00'),(653,315,28,0.00,12859.39,'إيراد مبيعات - فاتورة #SI-2026-000127','2026-02-01 10:03:47','2026-02-01 10:03:47'),(654,315,47,12859.39,0.00,'مديونية عميل - فاتورة #SI-2026-000127','2026-02-01 10:03:47','2026-02-01 10:03:47'),(655,316,15,2870.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000127','2026-02-01 10:03:47','2026-02-01 10:03:47'),(656,316,110,0.00,2870.40,'مخزون تام الصنع - فاتورة #SI-2026-000127','2026-02-01 10:03:47','2026-02-01 10:03:47'),(657,317,28,0.00,540.00,'إيراد مبيعات - فاتورة #SI-2026-000126','2026-02-01 10:09:54','2026-02-01 10:09:54'),(658,317,47,540.00,0.00,'مديونية عميل - فاتورة #SI-2026-000126','2026-02-01 10:09:54','2026-02-01 10:09:54'),(659,318,15,79.66,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000126','2026-02-01 10:09:54','2026-02-01 10:09:54'),(660,318,110,0.00,79.66,'مخزون تام الصنع - فاتورة #SI-2026-000126','2026-02-01 10:09:54','2026-02-01 10:09:54'),(661,319,28,0.00,430.00,'إيراد مبيعات - فاتورة #SI-2026-000125','2026-02-01 10:11:29','2026-02-01 10:11:29'),(662,319,115,0.00,75.00,'إيراد شحن - فاتورة #SI-2026-000125','2026-02-01 10:11:29','2026-02-01 10:11:29'),(663,319,47,505.00,0.00,'مديونية عميل - فاتورة #SI-2026-000125','2026-02-01 10:11:29','2026-02-01 10:11:29'),(664,320,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000125','2026-02-01 10:11:29','2026-02-01 10:11:29'),(665,320,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000125','2026-02-01 10:11:29','2026-02-01 10:11:29'),(666,321,28,0.00,5760.00,'إيراد مبيعات - فاتورة #SI-2026-000124','2026-02-01 10:13:54','2026-02-01 10:13:54'),(667,321,47,5760.00,0.00,'مديونية عميل - فاتورة #SI-2026-000124','2026-02-01 10:13:54','2026-02-01 10:13:54'),(668,322,15,817.20,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000124','2026-02-01 10:13:54','2026-02-01 10:13:54'),(669,322,110,0.00,817.20,'مخزون تام الصنع - فاتورة #SI-2026-000124','2026-02-01 10:13:54','2026-02-01 10:13:54'),(670,323,28,0.00,9760.00,'إيراد مبيعات - فاتورة #SI-2026-000120','2026-02-01 10:14:11','2026-02-01 10:14:11'),(671,323,47,9760.00,0.00,'مديونية عميل - فاتورة #SI-2026-000120','2026-02-01 10:14:11','2026-02-01 10:14:11'),(672,324,15,2191.20,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000120','2026-02-01 10:14:11','2026-02-01 10:14:11'),(673,324,110,0.00,2191.20,'مخزون تام الصنع - فاتورة #SI-2026-000120','2026-02-01 10:14:11','2026-02-01 10:14:11'),(674,325,28,0.00,10022.04,'إيراد مبيعات - فاتورة #SI-2026-000121','2026-02-01 10:14:25','2026-02-01 10:14:25'),(675,325,65,0.00,1403.09,'ضريبة القيمة المضافة - فاتورة #SI-2026-000121','2026-02-01 10:14:25','2026-02-01 10:14:25'),(676,325,47,11425.13,0.00,'مديونية عميل - فاتورة #SI-2026-000121','2026-02-01 10:14:25','2026-02-01 10:14:25'),(677,326,15,2594.06,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000121','2026-02-01 10:14:25','2026-02-01 10:14:25'),(678,326,110,0.00,2594.06,'مخزون تام الصنع - فاتورة #SI-2026-000121','2026-02-01 10:14:25','2026-02-01 10:14:25'),(679,327,47,6867.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000050','2026-02-01 10:14:50','2026-02-01 10:14:50'),(680,327,117,0.00,6867.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000050','2026-02-01 10:14:50','2026-02-01 10:14:50'),(681,328,47,6975.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000070','2026-02-01 10:16:33','2026-02-01 10:16:33'),(682,328,117,0.00,6975.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000070','2026-02-01 10:16:33','2026-02-01 10:16:33'),(683,329,80,137.20,0.00,'سند صرف مخزني رقم #IV-1769942181529','2026-02-01 10:38:50','2026-02-01 10:38:50'),(684,329,110,0.00,137.20,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769942181529','2026-02-01 10:38:50','2026-02-01 10:38:50'),(685,330,127,59493.87,0.00,'منصرف خامات ومستلزمات - أمر #1','2026-02-01 12:31:46','2026-02-15 16:48:59'),(686,330,111,0.00,59493.87,'منصرف خامات ومستلزمات - أمر #1','2026-02-01 12:31:46','2026-02-15 16:48:59'),(687,331,43,0.00,26217.00,'عكس قيد: تحصيل - cheque','2026-02-01 13:50:55','2026-02-01 13:50:55'),(688,331,56,0.00,209.40,'عكس قيد: خصم ضريبة من المنبع','2026-02-01 13:50:55','2026-02-01 13:50:55'),(689,331,47,26426.40,0.00,'عكس قيد: تخفيض مديونية العميل','2026-02-01 13:50:55','2026-02-01 13:50:55'),(690,332,6,209.00,0.00,'Sales Return #5 - Revenue Reversal','2026-02-01 14:05:10','2026-02-01 14:05:10'),(691,332,47,0.00,209.00,'Refund/Credit - Return #5','2026-02-01 14:05:10','2026-02-01 14:05:10'),(692,333,110,39.83,0.00,'Cost Reversal (Return #5)','2026-02-01 14:05:10','2026-02-01 14:05:10'),(693,333,15,0.00,39.83,'COGS Reversal - Return #5','2026-02-01 14:05:10','2026-02-01 14:05:10'),(694,334,43,26217.00,0.00,'تحصيل - cheque','2026-02-01 14:14:29','2026-02-01 14:14:29'),(695,334,47,0.00,26217.00,'تخفيض مديونية العميل','2026-02-01 14:14:29','2026-02-01 14:14:29'),(696,335,100,157.15,0.00,'سند صرف مخزني رقم #IV-1769961846437','2026-02-01 16:06:27','2026-02-01 16:06:27'),(697,335,110,0.00,157.15,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1769961846437','2026-02-01 16:06:27','2026-02-01 16:06:27'),(698,336,121,5594.84,0.00,'مصروف #23','2026-02-02 09:55:58','2026-02-02 09:55:58'),(699,336,43,0.00,5594.84,'مصروف #23','2026-02-02 09:55:58','2026-02-02 09:55:58'),(700,337,122,122.40,0.00,'مصروف #24','2026-02-02 09:58:25','2026-02-02 09:58:25'),(701,337,43,0.00,122.40,'مصروف #24','2026-02-02 09:58:25','2026-02-02 09:58:25'),(702,338,123,8344.02,0.00,'مصروف #25','2026-02-02 09:58:56','2026-02-02 09:58:56'),(703,338,43,0.00,8344.02,'مصروف #25','2026-02-02 09:58:56','2026-02-02 09:58:56'),(704,339,124,1104.43,0.00,'مصروف #26','2026-02-02 09:59:26','2026-02-02 09:59:26'),(705,339,43,0.00,1104.43,'مصروف #26','2026-02-02 09:59:26','2026-02-02 09:59:26'),(706,340,125,251.94,0.00,'مصروف #27','2026-02-02 10:00:06','2026-02-02 10:00:06'),(707,340,43,0.00,251.94,'مصروف #27','2026-02-02 10:00:06','2026-02-02 10:00:06'),(708,341,126,1.00,0.00,'مصروف #28','2026-02-02 10:00:34','2026-02-02 10:00:34'),(709,341,43,0.00,1.00,'مصروف #28','2026-02-02 10:00:34','2026-02-02 10:00:34'),(710,342,99,20.00,0.00,'فاتورة غاز','2026-02-02 10:01:41','2026-02-02 10:01:41'),(711,342,41,0.00,20.00,'فاتورة غاز','2026-02-02 10:01:41','2026-02-02 10:01:41'),(712,343,103,185.00,0.00,'بدل سفر طنطا ودمياط','2026-02-02 10:04:23','2026-02-02 10:04:23'),(713,343,41,0.00,185.00,'بدل سفر طنطا ودمياط','2026-02-02 10:04:23','2026-02-02 10:04:23'),(714,344,42,0.00,3772.21,'تحويل المستحقات الى حساب بنك QNB','2026-02-02 10:10:27','2026-02-02 10:10:27'),(715,344,43,3772.21,0.00,'سحب المستحقات من شركة الشحن','2026-02-02 10:10:27','2026-02-02 10:10:27'),(716,345,16,4300.57,0.00,'مصروف #31','2026-02-02 10:13:26','2026-02-02 10:13:26'),(717,345,42,0.00,4300.57,'مصروف #31','2026-02-02 10:13:26','2026-02-02 10:13:26'),(718,346,6,872.55,0.00,'Sales Return #6 - Revenue Reversal','2026-02-02 16:05:02','2026-02-02 16:05:02'),(719,346,47,0.00,872.55,'Refund/Credit - Return #6','2026-02-02 16:05:02','2026-02-02 16:05:02'),(720,347,110,158.90,0.00,'Cost Reversal (Return #6)','2026-02-02 16:05:02','2026-02-02 16:05:02'),(721,347,15,0.00,158.90,'COGS Reversal - Return #6','2026-02-02 16:05:02','2026-02-02 16:05:02'),(722,348,102,525.00,0.00,'عشاء مناديب','2026-02-02 16:16:07','2026-02-02 16:16:07'),(723,348,41,0.00,525.00,'عشاء مناديب','2026-02-02 16:16:07','2026-02-02 16:16:07'),(724,349,95,235.00,0.00,'بن','2026-02-02 16:16:33','2026-02-02 16:16:33'),(725,349,41,0.00,235.00,'بن','2026-02-02 16:16:33','2026-02-02 16:16:33'),(726,350,93,2000.00,0.00,'مصروف #34','2026-02-02 16:17:39','2026-02-02 16:17:39'),(727,350,41,0.00,2000.00,'مصروف #34','2026-02-02 16:17:39','2026-02-02 16:17:39'),(728,351,27,79000.00,0.00,'مصروف #35','2026-02-02 16:20:36','2026-02-02 16:20:36'),(729,351,43,0.00,79000.00,'مصروف #35','2026-02-02 16:20:36','2026-02-02 16:20:36'),(730,352,51,51000.00,0.00,'سداد جزء من مديونية هاني صلاح من الخزينة','2026-02-02 16:33:01','2026-02-02 16:33:01'),(731,352,41,0.00,51000.00,'سداد جزئي لجاري هاني صلاح نقدًا','2026-02-02 16:33:01','2026-02-02 16:33:01'),(732,353,28,0.00,3825.00,'إيراد مبيعات - فاتورة #SI-2026-000129','2026-02-03 07:59:14','2026-02-03 07:59:14'),(733,353,47,3825.00,0.00,'مديونية عميل - فاتورة #SI-2026-000129','2026-02-03 07:59:14','2026-02-03 07:59:14'),(734,354,15,687.83,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000129','2026-02-03 07:59:14','2026-02-03 07:59:14'),(735,354,110,0.00,687.83,'مخزون تام الصنع - فاتورة #SI-2026-000129','2026-02-03 07:59:14','2026-02-03 07:59:14'),(736,355,42,505.00,0.00,'تحصيل - cash','2026-02-03 08:08:52','2026-02-03 08:08:52'),(737,355,47,0.00,505.00,'تخفيض مديونية العميل','2026-02-03 08:08:52','2026-02-03 08:08:52'),(738,356,42,540.00,0.00,'تحصيل - cash','2026-02-03 08:09:52','2026-02-03 08:09:52'),(739,356,47,0.00,540.00,'تخفيض مديونية العميل','2026-02-03 08:09:52','2026-02-03 08:09:52'),(740,357,28,0.00,110.00,'إيراد مبيعات - فاتورة #SI-2026-000133','2026-02-03 11:39:51','2026-02-03 11:39:51'),(741,357,47,110.00,0.00,'مديونية عميل - فاتورة #SI-2026-000133','2026-02-03 11:39:51','2026-02-03 11:39:51'),(742,358,15,47.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000133','2026-02-03 11:39:51','2026-02-03 11:39:51'),(743,358,110,0.00,47.50,'مخزون تام الصنع - فاتورة #SI-2026-000133','2026-02-03 11:39:51','2026-02-03 11:39:51'),(744,359,41,110.00,0.00,'تحصيل - cash','2026-02-03 11:40:40','2026-02-03 11:40:40'),(745,359,47,0.00,110.00,'تخفيض مديونية العميل','2026-02-03 11:40:40','2026-02-03 11:40:40'),(746,360,80,2070.90,0.00,'سند صرف مخزني رقم #IV-1770119364434','2026-02-03 11:51:32','2026-02-03 11:51:32'),(747,360,110,0.00,2070.90,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770119364434','2026-02-03 11:51:32','2026-02-03 11:51:32'),(748,361,28,0.00,1062.50,'إيراد مبيعات - فاتورة #SI-2026-000130','2026-02-04 09:29:57','2026-02-04 09:29:57'),(749,361,108,53.13,0.00,'خصم مسموح به - فاتورة #SI-2026-000130','2026-02-04 09:29:57','2026-02-04 09:29:57'),(750,361,47,1009.37,0.00,'مديونية عميل - فاتورة #SI-2026-000130','2026-02-04 09:29:57','2026-02-04 09:29:57'),(751,362,15,223.75,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000130','2026-02-04 09:29:57','2026-02-04 09:29:57'),(752,362,110,0.00,223.75,'مخزون تام الصنع - فاتورة #SI-2026-000130','2026-02-04 09:29:57','2026-02-04 09:29:57'),(753,363,42,1009.37,0.00,'تحصيل - cash','2026-02-04 09:30:31','2026-02-04 09:30:31'),(754,363,47,0.00,1009.37,'تخفيض مديونية العميل','2026-02-04 09:30:31','2026-02-04 09:30:31'),(755,364,28,0.00,12367.50,'إيراد مبيعات - فاتورة #SI-2026-000131','2026-02-04 09:30:47','2026-02-04 09:30:47'),(756,364,47,12367.50,0.00,'مديونية عميل - فاتورة #SI-2026-000131','2026-02-04 09:30:47','2026-02-04 09:30:47'),(757,365,15,2625.90,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000131','2026-02-04 09:30:47','2026-02-04 09:30:47'),(758,365,110,0.00,2625.90,'مخزون تام الصنع - فاتورة #SI-2026-000131','2026-02-04 09:30:47','2026-02-04 09:30:47'),(759,366,28,0.00,540.00,'إيراد مبيعات - فاتورة #SI-2026-000132','2026-02-04 09:31:05','2026-02-04 09:31:05'),(760,366,115,0.00,75.00,'إيراد شحن - فاتورة #SI-2026-000132','2026-02-04 09:31:05','2026-02-04 09:31:05'),(761,366,47,615.00,0.00,'مديونية عميل - فاتورة #SI-2026-000132','2026-02-04 09:31:05','2026-02-04 09:31:05'),(762,367,15,79.66,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000132','2026-02-04 09:31:05','2026-02-04 09:31:05'),(763,367,110,0.00,79.66,'مخزون تام الصنع - فاتورة #SI-2026-000132','2026-02-04 09:31:05','2026-02-04 09:31:05'),(764,368,42,615.00,0.00,'تحصيل - cash','2026-02-04 09:31:29','2026-02-04 09:31:29'),(765,368,47,0.00,615.00,'تخفيض مديونية العميل','2026-02-04 09:31:29','2026-02-04 09:31:29'),(766,369,44,18947.93,0.00,'تحصيل - cheque','2026-02-04 09:33:35','2026-02-04 09:33:35'),(767,369,47,0.00,18947.93,'تخفيض مديونية العميل','2026-02-04 09:33:35','2026-02-04 09:33:35'),(768,370,47,10125.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000068','2026-02-04 09:37:12','2026-02-04 09:37:12'),(769,370,117,0.00,10125.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000068','2026-02-04 09:37:12','2026-02-04 09:37:12'),(770,371,47,4590.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000065','2026-02-04 09:37:54','2026-02-04 09:37:54'),(771,371,117,0.00,4590.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000065','2026-02-04 09:37:54','2026-02-04 09:37:54'),(772,372,47,16650.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000063','2026-02-04 09:38:30','2026-02-04 09:38:30'),(773,372,117,0.00,16650.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000063','2026-02-04 09:38:30','2026-02-04 09:38:30'),(774,373,47,536.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000061','2026-02-04 09:39:08','2026-02-04 09:39:08'),(775,373,117,0.00,536.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000061','2026-02-04 09:39:08','2026-02-04 09:39:08'),(776,374,47,569.50,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000060','2026-02-04 09:39:40','2026-02-04 09:39:40'),(777,374,117,0.00,569.50,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000060','2026-02-04 09:39:40','2026-02-04 09:39:40'),(778,375,47,1600.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000059','2026-02-04 09:39:55','2026-02-04 09:39:55'),(779,375,117,0.00,1600.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000059','2026-02-04 09:39:55','2026-02-04 09:39:55'),(780,376,47,13660.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000058','2026-02-04 09:40:16','2026-02-04 09:40:16'),(781,376,117,0.00,13660.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000058','2026-02-04 09:40:16','2026-02-04 09:40:16'),(782,377,47,4100.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000057','2026-02-04 09:41:23','2026-02-04 09:41:23'),(783,377,117,0.00,4100.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000057','2026-02-04 09:41:23','2026-02-04 09:41:23'),(784,378,47,3119.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000056','2026-02-04 09:42:02','2026-02-04 09:42:02'),(785,378,117,0.00,3119.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000056','2026-02-04 09:42:02','2026-02-04 09:42:02'),(786,379,47,7200.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000055','2026-02-04 09:42:16','2026-02-04 09:42:16'),(787,379,117,0.00,7200.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000055','2026-02-04 09:42:16','2026-02-04 09:42:16'),(788,380,47,1775.25,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000052','2026-02-04 09:43:56','2026-02-04 09:43:56'),(789,380,117,0.00,1775.25,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000052','2026-02-04 09:43:56','2026-02-04 09:43:56'),(790,381,47,7166.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000051','2026-02-04 09:44:14','2026-02-04 09:44:14'),(791,381,117,0.00,7166.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000051','2026-02-04 09:44:14','2026-02-04 09:44:14'),(792,382,47,2316.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000049','2026-02-04 09:44:29','2026-02-04 09:44:29'),(793,382,117,0.00,2316.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000049','2026-02-04 09:44:29','2026-02-04 09:44:29'),(794,383,47,1419.90,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000044','2026-02-04 09:45:00','2026-02-04 09:45:00'),(795,383,117,0.00,1419.90,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000044','2026-02-04 09:45:00','2026-02-04 09:45:00'),(796,384,47,15296.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000041','2026-02-04 09:45:43','2026-02-04 09:45:43'),(797,384,117,0.00,15296.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000041','2026-02-04 09:45:43','2026-02-04 09:45:43'),(798,385,47,9234.09,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000040','2026-02-04 09:45:59','2026-02-04 09:45:59'),(799,385,117,0.00,9234.09,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000040','2026-02-04 09:45:59','2026-02-04 09:45:59'),(800,386,47,27497.20,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000039','2026-02-04 09:46:18','2026-02-04 09:46:18'),(801,386,117,0.00,27497.20,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000039','2026-02-04 09:46:18','2026-02-04 09:46:18'),(802,387,47,1904.60,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000038','2026-02-04 09:46:32','2026-02-04 09:46:32'),(803,387,117,0.00,1904.60,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000038','2026-02-04 09:46:32','2026-02-04 09:46:32'),(804,388,47,3354.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000037','2026-02-04 09:46:44','2026-02-04 09:46:44'),(805,388,117,0.00,3354.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000037','2026-02-04 09:46:44','2026-02-04 09:46:44'),(806,389,47,4296.70,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000036','2026-02-04 09:47:00','2026-02-04 09:47:00'),(807,389,117,0.00,4296.70,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000036','2026-02-04 09:47:00','2026-02-04 09:47:00'),(808,390,47,12623.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000034','2026-02-04 09:47:21','2026-02-04 09:47:21'),(809,390,117,0.00,12623.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000034','2026-02-04 09:47:21','2026-02-04 09:47:21'),(810,391,41,709.07,0.00,'تحصيل - cash','2026-02-04 09:57:34','2026-02-04 09:57:34'),(811,391,47,0.00,709.07,'تخفيض مديونية العميل','2026-02-04 09:57:34','2026-02-04 09:57:34'),(812,392,99,40.00,0.00,'شريط لاصق','2026-02-04 10:00:34','2026-02-04 10:00:34'),(813,392,41,0.00,40.00,'شريط لاصق','2026-02-04 10:00:34','2026-02-04 10:00:34'),(814,393,89,1250.00,0.00,'مي فكري','2026-02-04 10:06:21','2026-02-04 10:06:21'),(815,393,43,0.00,1250.00,'مي فكري','2026-02-04 10:06:21','2026-02-04 10:06:21'),(816,394,41,7630.00,0.00,'تحصيل - cash','2026-02-04 10:11:24','2026-02-04 10:11:24'),(817,394,47,0.00,7630.00,'تخفيض مديونية العميل','2026-02-04 10:11:24','2026-02-04 10:11:24'),(818,395,28,0.00,6600.00,'إيراد مبيعات - فاتورة #SI-2026-000135','2026-02-04 10:13:49','2026-02-04 10:13:49'),(819,395,47,6600.00,0.00,'مديونية عميل - فاتورة #SI-2026-000135','2026-02-04 10:13:49','2026-02-04 10:13:49'),(820,396,15,1382.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000135','2026-02-04 10:13:49','2026-02-04 10:13:49'),(821,396,110,0.00,1382.50,'مخزون تام الصنع - فاتورة #SI-2026-000135','2026-02-04 10:13:49','2026-02-04 10:13:49'),(822,397,22,500.00,0.00,'مصاريف تكويد منتج','2026-02-04 11:02:00','2026-02-04 11:02:00'),(823,397,41,0.00,500.00,'مصاريف تكويد منتج','2026-02-04 11:02:00','2026-02-04 11:02:00'),(824,398,22,500.00,0.00,'مصاريف تكويد منتج','2026-02-04 11:03:10','2026-02-04 11:03:10'),(825,398,41,0.00,500.00,'مصاريف تكويد منتج','2026-02-04 11:03:10','2026-02-04 11:03:10'),(826,399,41,6000.00,0.00,'تحصيل - cash','2026-02-04 11:30:26','2026-02-04 11:30:26'),(827,399,47,0.00,6000.00,'تخفيض مديونية العميل','2026-02-04 11:30:26','2026-02-04 11:30:26'),(828,400,6,6600.00,0.00,'Sales Return #7 - Revenue Reversal','2026-02-04 14:34:19','2026-02-04 14:34:19'),(829,400,47,0.00,6600.00,'Refund/Credit - Return #7','2026-02-04 14:34:19','2026-02-04 14:34:19'),(830,401,110,1382.50,0.00,'Cost Reversal (Return #7)','2026-02-04 14:34:19','2026-02-04 14:34:19'),(831,401,15,0.00,1382.50,'COGS Reversal - Return #7','2026-02-04 14:34:19','2026-02-04 14:34:19'),(832,402,99,250.00,0.00,'ورق A4 ,باكو فايل شفاف ','2026-02-04 14:41:05','2026-02-04 14:41:05'),(833,402,41,0.00,250.00,'ورق A4 ,باكو فايل شفاف ','2026-02-04 14:41:05','2026-02-04 14:41:05'),(834,403,41,2920.00,0.00,'تحصيل - cash','2026-02-04 14:43:36','2026-02-04 14:43:36'),(835,403,47,0.00,2920.00,'تخفيض مديونية العميل','2026-02-04 14:43:36','2026-02-04 14:43:36'),(836,404,105,14000.00,0.00,'مصاريف تحليل المنتجات في وزارة الصحة','2026-02-04 14:53:12','2026-02-04 14:53:12'),(837,404,43,0.00,14000.00,'مصاريف تحليل المنتجات في وزارة الصحة','2026-02-04 14:53:12','2026-02-04 14:53:12'),(838,405,28,0.00,1720.00,'إيراد مبيعات - فاتورة #SI-2026-000139','2026-02-04 15:22:42','2026-02-04 15:22:42'),(839,405,47,1720.00,0.00,'مديونية عميل - فاتورة #SI-2026-000139','2026-02-04 15:22:42','2026-02-04 15:22:42'),(840,406,15,494.45,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000139','2026-02-04 15:22:42','2026-02-04 15:22:42'),(841,406,110,0.00,494.45,'مخزون تام الصنع - فاتورة #SI-2026-000139','2026-02-04 15:22:42','2026-02-04 15:22:42'),(842,407,28,0.00,986.00,'إيراد مبيعات - فاتورة #SI-2026-000138','2026-02-04 15:22:57','2026-02-04 15:22:57'),(843,407,47,986.00,0.00,'مديونية عميل - فاتورة #SI-2026-000138','2026-02-04 15:22:57','2026-02-04 15:22:57'),(844,408,15,189.04,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000138','2026-02-04 15:22:57','2026-02-04 15:22:57'),(845,408,110,0.00,189.04,'مخزون تام الصنع - فاتورة #SI-2026-000138','2026-02-04 15:22:57','2026-02-04 15:22:57'),(846,409,28,0.00,430.00,'إيراد مبيعات - فاتورة #SI-2026-000137','2026-02-04 15:23:07','2026-02-04 15:23:07'),(847,409,115,0.00,75.00,'إيراد شحن - فاتورة #SI-2026-000137','2026-02-04 15:23:07','2026-02-04 15:23:07'),(848,409,47,505.00,0.00,'مديونية عميل - فاتورة #SI-2026-000137','2026-02-04 15:23:07','2026-02-04 15:23:07'),(849,410,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000137','2026-02-04 15:23:07','2026-02-04 15:23:07'),(850,410,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000137','2026-02-04 15:23:07','2026-02-04 15:23:07'),(851,411,28,0.00,2640.00,'إيراد مبيعات - فاتورة #SI-2026-000136','2026-02-04 15:23:26','2026-02-04 15:23:26'),(852,411,47,2640.00,0.00,'مديونية عميل - فاتورة #SI-2026-000136','2026-02-04 15:23:26','2026-02-04 15:23:26'),(853,412,15,608.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000136','2026-02-04 15:23:26','2026-02-04 15:23:26'),(854,412,110,0.00,608.30,'مخزون تام الصنع - فاتورة #SI-2026-000136','2026-02-04 15:23:26','2026-02-04 15:23:26'),(855,413,28,0.00,4057.42,'إيراد مبيعات - فاتورة #SI-2026-000140','2026-02-04 15:30:32','2026-02-04 15:30:32'),(856,413,47,4057.42,0.00,'مديونية عميل - فاتورة #SI-2026-000140','2026-02-04 15:30:32','2026-02-04 15:30:32'),(857,414,41,4057.00,0.00,'تحصيل - cash','2026-02-04 15:31:37','2026-02-04 15:31:37'),(858,414,47,0.00,4057.00,'تخفيض مديونية العميل','2026-02-04 15:31:37','2026-02-04 15:31:37'),(859,415,100,197.43,0.00,'سند صرف مخزني رقم #IV-1770219152799','2026-02-04 15:35:54','2026-02-04 15:35:54'),(860,415,110,0.00,197.43,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770219152799','2026-02-04 15:35:54','2026-02-04 15:35:54'),(861,416,80,369.53,0.00,'سند صرف مخزني رقم #IV-1770221237530','2026-02-04 16:08:28','2026-02-04 16:08:28'),(862,416,110,0.00,369.53,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770221237530','2026-02-04 16:08:28','2026-02-04 16:08:28'),(863,417,100,4080.00,0.00,'هدايا','2026-02-05 02:07:45','2026-02-05 02:07:45'),(864,417,43,0.00,4080.00,'هدايا','2026-02-05 02:07:45','2026-02-05 02:07:45'),(865,418,100,180.00,0.00,'شوكولاته','2026-02-05 02:11:14','2026-02-05 02:11:14'),(866,418,43,0.00,180.00,'شوكولاته','2026-02-05 02:11:14','2026-02-05 02:11:14'),(867,419,100,200.00,0.00,'هدية عيد ميلاد','2026-02-05 02:14:24','2026-02-05 02:14:24'),(868,419,43,0.00,200.00,'هدية عيد ميلاد','2026-02-05 02:14:24','2026-02-05 02:14:24'),(869,420,100,410.00,0.00,'شوكولاته','2026-02-05 02:17:09','2026-02-05 02:17:09'),(870,420,43,0.00,410.00,'شوكولاته','2026-02-05 02:17:09','2026-02-05 02:17:09'),(871,421,100,3000.00,0.00,'افتتاح عياده','2026-02-05 02:19:04','2026-02-05 02:19:04'),(872,421,43,0.00,3000.00,'افتتاح عياده','2026-02-05 02:19:04','2026-02-05 02:19:04'),(873,422,100,1960.00,0.00,'افتتاح عياده','2026-02-05 02:19:49','2026-02-05 02:19:49'),(874,422,43,0.00,1960.00,'افتتاح عياده','2026-02-05 02:19:49','2026-02-05 02:19:49'),(875,423,100,700.00,0.00,'افتتاح عياده (فضة)','2026-02-05 02:22:37','2026-02-05 02:22:37'),(876,423,43,0.00,700.00,'افتتاح عياده (فضة)','2026-02-05 02:22:37','2026-02-05 02:22:37'),(877,424,86,1140.00,0.00,'سبونسر هيليثي داي','2026-02-05 02:24:28','2026-02-05 02:24:28'),(878,424,43,0.00,1140.00,'سبونسر هيليثي داي','2026-02-05 02:24:28','2026-02-05 02:24:28'),(879,425,103,1600.00,0.00,'مصروف #50','2026-02-05 02:25:16','2026-02-05 02:25:16'),(880,425,43,0.00,1600.00,'مصروف #50','2026-02-05 02:25:16','2026-02-05 02:25:16'),(881,426,83,3000.00,0.00,'مصروف #51','2026-02-05 02:28:26','2026-02-05 02:28:26'),(882,426,43,0.00,3000.00,'مصروف #51','2026-02-05 02:28:26','2026-02-05 02:28:26'),(883,427,86,750.00,0.00,'مصروف #52','2026-02-05 02:30:04','2026-02-05 02:30:04'),(884,427,43,0.00,750.00,'مصروف #52','2026-02-05 02:30:04','2026-02-05 02:30:04'),(885,428,100,450.00,0.00,'هدية عيد ميلاد (شال)','2026-02-05 02:34:04','2026-02-05 02:34:04'),(886,428,43,0.00,450.00,'هدية عيد ميلاد (شال)','2026-02-05 02:34:04','2026-02-05 02:34:04'),(887,429,100,690.00,0.00,'مصروف #54','2026-02-05 02:35:59','2026-02-05 02:35:59'),(888,429,43,0.00,690.00,'مصروف #54','2026-02-05 02:35:59','2026-02-05 02:35:59'),(889,430,102,265.00,0.00,'مصروف #55','2026-02-05 02:37:15','2026-02-05 02:37:15'),(890,430,43,0.00,265.00,'مصروف #55','2026-02-05 02:37:15','2026-02-05 02:37:15'),(891,431,107,950.00,0.00,'مصروف #56','2026-02-05 02:38:38','2026-02-05 02:38:38'),(892,431,43,0.00,950.00,'مصروف #56','2026-02-05 02:38:38','2026-02-05 02:38:38'),(893,432,103,1490.00,0.00,'مصروف #57','2026-02-05 02:39:29','2026-02-05 02:39:29'),(894,432,43,0.00,1490.00,'مصروف #57','2026-02-05 02:39:29','2026-02-05 02:39:29'),(895,433,128,71734.95,0.00,'خدمات أمر تشغيل #1','2026-02-05 19:20:42','2026-02-15 14:51:17'),(896,433,62,0.00,71734.95,'مستحق لـ مصنع ECC','2026-02-05 19:20:42','2026-02-15 14:51:17'),(897,434,82,221.78,0.00,'سند صرف مخزني رقم #IV-1770453322952','2026-02-07 08:37:27','2026-02-07 08:37:27'),(898,434,110,0.00,221.78,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770453322952','2026-02-07 08:37:27','2026-02-07 08:37:27'),(899,435,42,505.00,0.00,'تحصيل - cash','2026-02-07 09:02:38','2026-02-07 09:02:38'),(900,435,47,0.00,505.00,'تخفيض مديونية العميل','2026-02-07 09:02:38','2026-02-07 09:02:38'),(901,436,42,986.00,0.00,'تحصيل - cash','2026-02-07 09:04:16','2026-02-07 09:04:16'),(902,436,47,0.00,986.00,'تخفيض مديونية العميل','2026-02-07 09:04:16','2026-02-07 09:04:16'),(903,437,42,0.00,3609.84,'تحويل المستحقات الى حساب بنك QNB','2026-02-07 09:11:51','2026-02-07 09:11:51'),(904,437,43,3609.84,0.00,'سحب المستحقات من شركة الشحن','2026-02-07 09:11:51','2026-02-07 09:11:51'),(905,438,99,222.32,0.00,'فاتورة التليفون','2026-02-07 09:30:03','2026-02-07 09:30:03'),(906,438,43,0.00,222.32,'فاتورة التليفون','2026-02-07 09:30:03','2026-02-07 09:30:03'),(907,439,99,222.32,0.00,'فاتورة التليفون','2026-02-07 09:30:57','2026-02-07 09:30:57'),(908,439,43,0.00,222.32,'فاتورة التليفون','2026-02-07 09:30:57','2026-02-07 09:30:57'),(909,440,99,255.39,0.00,'فاتورة انترنت','2026-02-07 09:32:04','2026-02-07 09:32:04'),(910,440,43,0.00,255.39,'فاتورة انترنت','2026-02-07 09:32:04','2026-02-07 09:32:04'),(911,441,82,221.78,0.00,'سند صرف مخزني رقم #IV-1770457827913','2026-02-07 09:52:13','2026-02-07 09:52:13'),(912,441,110,0.00,221.78,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770457827913','2026-02-07 09:52:13','2026-02-07 09:52:13'),(913,442,28,0.00,2475.00,'إيراد مبيعات - فاتورة #SI-2026-000141','2026-02-07 09:55:27','2026-02-07 09:55:27'),(914,442,47,2475.00,0.00,'مديونية عميل - فاتورة #SI-2026-000141','2026-02-07 09:55:27','2026-02-07 09:55:27'),(915,443,15,608.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000141','2026-02-07 09:55:27','2026-02-07 09:55:27'),(916,443,110,0.00,608.30,'مخزون تام الصنع - فاتورة #SI-2026-000141','2026-02-07 09:55:27','2026-02-07 09:55:27'),(917,444,28,0.00,250.00,'إيراد مبيعات - فاتورة #SI-2026-000142','2026-02-07 09:55:49','2026-02-07 09:55:49'),(918,444,115,0.00,75.00,'إيراد شحن - فاتورة #SI-2026-000142','2026-02-07 09:55:49','2026-02-07 09:55:49'),(919,444,47,325.00,0.00,'مديونية عميل - فاتورة #SI-2026-000142','2026-02-07 09:55:49','2026-02-07 09:55:49'),(920,445,15,44.75,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000142','2026-02-07 09:55:49','2026-02-07 09:55:49'),(921,445,110,0.00,44.75,'مخزون تام الصنع - فاتورة #SI-2026-000142','2026-02-07 09:55:49','2026-02-07 09:55:49'),(922,446,28,0.00,430.00,'إيراد مبيعات - فاتورة #SI-2026-000143','2026-02-07 09:56:03','2026-02-07 09:56:03'),(923,446,47,430.00,0.00,'مديونية عميل - فاتورة #SI-2026-000143','2026-02-07 09:56:03','2026-02-07 09:56:03'),(924,447,15,121.59,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000143','2026-02-07 09:56:03','2026-02-07 09:56:03'),(925,447,110,0.00,121.59,'مخزون تام الصنع - فاتورة #SI-2026-000143','2026-02-07 09:56:03','2026-02-07 09:56:03'),(926,448,28,0.00,1080.00,'إيراد مبيعات - فاتورة #SI-2026-000144','2026-02-08 09:07:00','2026-02-08 09:07:00'),(927,448,47,1080.00,0.00,'مديونية عميل - فاتورة #SI-2026-000144','2026-02-08 09:07:00','2026-02-08 09:07:00'),(928,449,15,199.15,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000144','2026-02-08 09:07:00','2026-02-08 09:07:00'),(929,449,110,0.00,199.15,'مخزون تام الصنع - فاتورة #SI-2026-000144','2026-02-08 09:07:00','2026-02-08 09:07:00'),(930,450,41,5000.00,0.00,'تحصيل - cash','2026-02-08 09:09:07','2026-02-08 09:09:07'),(931,450,47,0.00,5000.00,'تخفيض مديونية العميل','2026-02-08 09:09:07','2026-02-08 09:09:07'),(932,451,42,430.00,0.00,'تحصيل - cash','2026-02-09 09:12:39','2026-02-09 09:12:39'),(933,451,47,0.00,430.00,'تخفيض مديونية العميل','2026-02-09 09:12:39','2026-02-09 09:12:39'),(934,452,41,6982.00,0.00,'تحصيل - cash','2026-02-09 09:31:18','2026-02-09 09:31:18'),(935,452,47,0.00,6982.00,'تخفيض مديونية العميل','2026-02-09 09:31:18','2026-02-09 09:31:18'),(936,453,41,3018.00,0.00,'تحصيل - cash','2026-02-09 09:32:33','2026-02-09 09:32:33'),(937,453,47,0.00,3018.00,'تخفيض مديونية العميل','2026-02-09 09:32:33','2026-02-09 09:32:33'),(938,454,28,0.00,10296.00,'إيراد مبيعات - فاتورة #SI-2026-000147','2026-02-09 09:44:07','2026-02-09 09:44:07'),(939,454,47,10296.00,0.00,'مديونية عميل - فاتورة #SI-2026-000147','2026-02-09 09:44:07','2026-02-09 09:44:07'),(940,455,15,2450.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000147','2026-02-09 09:44:07','2026-02-09 09:44:07'),(941,455,110,0.00,2450.50,'مخزون تام الصنع - فاتورة #SI-2026-000147','2026-02-09 09:44:07','2026-02-09 09:44:07'),(942,456,28,0.00,6576.00,'إيراد مبيعات - فاتورة #SI-2026-000134','2026-02-10 08:14:28','2026-02-10 08:14:28'),(943,456,47,6576.00,0.00,'مديونية عميل - فاتورة #SI-2026-000134','2026-02-10 08:14:28','2026-02-10 08:14:28'),(944,457,15,1315.73,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000134','2026-02-10 08:14:28','2026-02-10 08:14:28'),(945,457,110,0.00,1315.73,'مخزون تام الصنع - فاتورة #SI-2026-000134','2026-02-10 08:14:28','2026-02-10 08:14:28'),(946,458,41,5000.00,0.00,'تحصيل - cash','2026-02-10 08:17:34','2026-02-10 08:17:34'),(947,458,47,0.00,5000.00,'تخفيض مديونية العميل','2026-02-10 08:17:34','2026-02-10 08:17:34'),(948,459,41,3695.00,0.00,'تحصيل - cash','2026-02-10 08:19:51','2026-02-10 08:19:51'),(949,459,47,0.00,3695.00,'تخفيض مديونية العميل','2026-02-10 08:19:51','2026-02-10 08:19:51'),(950,460,41,6305.00,0.00,'تحصيل - cash','2026-02-10 08:21:43','2026-02-10 08:21:43'),(951,460,47,0.00,6305.00,'تخفيض مديونية العميل','2026-02-10 08:21:43','2026-02-10 08:21:43'),(952,461,78,197.78,0.00,'سند صرف مخزني رقم #IV-1770715248362','2026-02-10 09:22:42','2026-02-10 09:22:42'),(953,461,110,0.00,197.78,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770715248362','2026-02-10 09:22:42','2026-02-10 09:22:42'),(954,462,28,0.00,204.00,'إيراد مبيعات - فاتورة #SI-2026-000149','2026-02-10 09:24:56','2026-02-10 09:24:56'),(955,462,108,6.12,0.00,'خصم مسموح به - فاتورة #SI-2026-000149','2026-02-10 09:24:56','2026-02-10 09:24:56'),(956,462,47,197.88,0.00,'مديونية عميل - فاتورة #SI-2026-000149','2026-02-10 09:24:56','2026-02-10 09:24:56'),(957,463,15,22.70,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000149','2026-02-10 09:24:56','2026-02-10 09:24:56'),(958,463,110,0.00,22.70,'مخزون تام الصنع - فاتورة #SI-2026-000149','2026-02-10 09:24:56','2026-02-10 09:24:56'),(959,464,41,197.88,0.00,'تحصيل - cash','2026-02-10 09:25:42','2026-02-10 09:25:42'),(960,464,47,0.00,197.88,'تخفيض مديونية العميل','2026-02-10 09:25:42','2026-02-10 09:25:42'),(961,465,28,0.00,850.00,'إيراد مبيعات - فاتورة #SI-2026-000150','2026-02-10 09:28:30','2026-02-10 09:28:30'),(962,465,108,25.50,0.00,'خصم مسموح به - فاتورة #SI-2026-000150','2026-02-10 09:28:30','2026-02-10 09:28:30'),(963,465,47,824.50,0.00,'مديونية عميل - فاتورة #SI-2026-000150','2026-02-10 09:28:30','2026-02-10 09:28:30'),(964,466,15,179.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000150','2026-02-10 09:28:30','2026-02-10 09:28:30'),(965,466,110,0.00,179.00,'مخزون تام الصنع - فاتورة #SI-2026-000150','2026-02-10 09:28:30','2026-02-10 09:28:30'),(966,467,41,824.50,0.00,'تحصيل - cash','2026-02-10 09:29:00','2026-02-10 09:29:00'),(967,467,47,0.00,824.50,'تخفيض مديونية العميل','2026-02-10 09:29:00','2026-02-10 09:29:00'),(968,468,28,0.00,1680.00,'إيراد مبيعات - فاتورة #SI-2026-000151','2026-02-10 09:36:25','2026-02-10 09:36:25'),(969,468,65,0.00,235.20,'ضريبة القيمة المضافة - فاتورة #SI-2026-000151','2026-02-10 09:36:25','2026-02-10 09:36:25'),(970,468,47,1915.20,0.00,'مديونية عميل - فاتورة #SI-2026-000151','2026-02-10 09:36:25','2026-02-10 09:36:25'),(971,469,15,272.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000151','2026-02-10 09:36:25','2026-02-10 09:36:25'),(972,469,110,0.00,272.40,'مخزون تام الصنع - فاتورة #SI-2026-000151','2026-02-10 09:36:25','2026-02-10 09:36:25'),(973,470,28,0.00,1680.00,'إيراد مبيعات - فاتورة #SI-2026-000152','2026-02-10 09:39:08','2026-02-10 09:39:08'),(974,470,65,0.00,235.20,'ضريبة القيمة المضافة - فاتورة #SI-2026-000152','2026-02-10 09:39:08','2026-02-10 09:39:08'),(975,470,47,1915.20,0.00,'مديونية عميل - فاتورة #SI-2026-000152','2026-02-10 09:39:08','2026-02-10 09:39:08'),(976,471,15,272.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000152','2026-02-10 09:39:08','2026-02-10 09:39:08'),(977,471,110,0.00,272.40,'مخزون تام الصنع - فاتورة #SI-2026-000152','2026-02-10 09:39:08','2026-02-10 09:39:08'),(978,472,98,350.00,0.00,'زكاه','2026-02-10 10:20:13','2026-02-10 10:20:13'),(979,472,41,0.00,350.00,'زكاه','2026-02-10 10:20:13','2026-02-10 10:20:13'),(980,473,98,2000.00,0.00,'زكاه','2026-02-10 10:20:40','2026-02-10 10:20:40'),(981,473,41,0.00,2000.00,'زكاه','2026-02-10 10:20:40','2026-02-10 10:20:40'),(982,474,18,1930.00,0.00,'مصروف #63','2026-02-10 10:21:39','2026-02-10 10:21:39'),(983,474,41,0.00,1930.00,'مصروف #63','2026-02-10 10:21:39','2026-02-10 10:21:39'),(984,475,103,300.00,0.00,'بدل سفر طنطا ودمياط والزقازيق','2026-02-10 10:22:41','2026-02-10 10:22:41'),(985,475,41,0.00,300.00,'بدل سفر طنطا ودمياط والزقازيق','2026-02-10 10:22:41','2026-02-10 10:22:41'),(986,476,22,200.00,0.00,'شيت مبيعات مخزن الشمس','2026-02-10 10:24:00','2026-02-10 10:24:00'),(987,476,41,0.00,200.00,'شيت مبيعات مخزن الشمس','2026-02-10 10:24:00','2026-02-10 10:24:00'),(988,477,28,0.00,4950.00,'إيراد مبيعات - فاتورة #SI-2026-000154','2026-02-11 08:10:08','2026-02-11 08:10:08'),(989,477,47,4950.00,0.00,'مديونية عميل - فاتورة #SI-2026-000154','2026-02-11 08:10:08','2026-02-11 08:10:08'),(990,478,15,1106.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000154','2026-02-11 08:10:09','2026-02-11 08:10:09'),(991,478,110,0.00,1106.00,'مخزون تام الصنع - فاتورة #SI-2026-000154','2026-02-11 08:10:09','2026-02-11 08:10:09'),(992,479,41,5000.00,0.00,'تحصيل - cash','2026-02-11 08:10:58','2026-02-11 08:10:58'),(993,479,47,0.00,5000.00,'تخفيض مديونية العميل','2026-02-11 08:10:58','2026-02-11 08:10:58'),(994,480,41,13660.00,0.00,'تحصيل - cash','2026-02-11 08:11:58','2026-02-11 08:11:58'),(995,480,47,0.00,13660.00,'تخفيض مديونية العميل','2026-02-11 08:11:58','2026-02-11 08:11:58'),(996,481,41,5700.00,0.00,'تحصيل - cash','2026-02-11 08:13:10','2026-02-11 08:13:10'),(997,481,47,0.00,5700.00,'تخفيض مديونية العميل','2026-02-11 08:13:10','2026-02-11 08:13:10'),(998,482,41,640.00,0.00,'تحصيل - cash','2026-02-11 08:14:15','2026-02-11 08:14:15'),(999,482,47,0.00,640.00,'تخفيض مديونية العميل','2026-02-11 08:14:15','2026-02-11 08:14:15'),(1000,483,28,0.00,11520.00,'إيراد مبيعات - فاتورة #SI-2026-000155','2026-02-11 08:18:55','2026-02-11 08:18:55'),(1001,483,47,11520.00,0.00,'مديونية عميل - فاتورة #SI-2026-000155','2026-02-11 08:18:55','2026-02-11 08:18:55'),(1002,484,15,3276.13,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000155','2026-02-11 08:18:55','2026-02-11 08:18:55'),(1003,484,110,0.00,3276.13,'مخزون تام الصنع - فاتورة #SI-2026-000155','2026-02-11 08:18:55','2026-02-11 08:18:55'),(1004,485,28,0.00,11925.00,'إيراد مبيعات - فاتورة #SI-2026-000153','2026-02-11 23:22:38','2026-02-11 23:22:38'),(1005,485,47,11925.00,0.00,'مديونية عميل - فاتورة #SI-2026-000153','2026-02-11 23:22:38','2026-02-11 23:22:38'),(1006,486,15,3104.20,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000153','2026-02-11 23:22:38','2026-02-11 23:22:38'),(1007,486,110,0.00,3104.20,'مخزون تام الصنع - فاتورة #SI-2026-000153','2026-02-11 23:22:38','2026-02-11 23:22:38'),(1008,487,28,0.00,360.00,'إيراد مبيعات - فاتورة #SI-2026-000156','2026-02-11 23:26:12','2026-02-11 23:26:12'),(1009,487,47,360.00,0.00,'مديونية عميل - فاتورة #SI-2026-000156','2026-02-11 23:26:12','2026-02-11 23:26:12'),(1010,488,15,95.13,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000156','2026-02-11 23:26:12','2026-02-11 23:26:12'),(1011,488,110,0.00,95.13,'مخزون تام الصنع - فاتورة #SI-2026-000156','2026-02-11 23:26:12','2026-02-11 23:26:12'),(1012,489,43,360.00,0.00,'تحصيل - bank_transfer','2026-02-11 23:26:54','2026-02-11 23:26:54'),(1013,489,47,0.00,360.00,'تخفيض مديونية العميل','2026-02-11 23:26:54','2026-02-11 23:26:54'),(1014,490,28,0.00,189.00,'إيراد مبيعات - فاتورة #SI-2026-000157','2026-02-11 23:28:56','2026-02-11 23:28:56'),(1015,490,47,189.00,0.00,'مديونية عميل - فاتورة #SI-2026-000157','2026-02-11 23:28:56','2026-02-11 23:28:56'),(1016,491,15,39.83,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000157','2026-02-11 23:28:56','2026-02-11 23:28:56'),(1017,491,110,0.00,39.83,'مخزون تام الصنع - فاتورة #SI-2026-000157','2026-02-11 23:28:56','2026-02-11 23:28:56'),(1018,492,43,189.00,0.00,'تحصيل - bank_transfer','2026-02-11 23:29:28','2026-02-11 23:29:28'),(1019,492,47,0.00,189.00,'تخفيض مديونية العميل','2026-02-11 23:29:28','2026-02-11 23:29:28'),(1020,493,28,0.00,18080.00,'إيراد مبيعات - فاتورة #SI-2026-000158','2026-02-11 23:37:14','2026-02-11 23:37:14'),(1021,493,47,18080.00,0.00,'مديونية عميل - فاتورة #SI-2026-000158','2026-02-11 23:37:14','2026-02-11 23:37:14'),(1022,494,15,4385.37,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000158','2026-02-11 23:37:14','2026-02-11 23:37:14'),(1023,494,110,0.00,4385.37,'مخزون تام الصنع - فاتورة #SI-2026-000158','2026-02-11 23:37:14','2026-02-11 23:37:14'),(1024,495,28,0.00,6105.12,'إيراد مبيعات - فاتورة #SI-2026-000159','2026-02-11 23:42:26','2026-02-11 23:42:26'),(1025,495,47,6105.12,0.00,'مديونية عميل - فاتورة #SI-2026-000159','2026-02-11 23:42:26','2026-02-11 23:42:26'),(1026,496,15,1295.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000159','2026-02-11 23:42:26','2026-02-11 23:42:26'),(1027,496,110,0.00,1295.30,'مخزون تام الصنع - فاتورة #SI-2026-000159','2026-02-11 23:42:26','2026-02-11 23:42:26'),(1028,497,28,0.00,5448.00,'إيراد مبيعات - فاتورة #SI-2026-000146','2026-02-11 23:54:21','2026-02-11 23:54:21'),(1029,497,47,5448.00,0.00,'مديونية عميل - فاتورة #SI-2026-000146','2026-02-11 23:54:21','2026-02-11 23:54:21'),(1030,498,15,1309.99,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000146','2026-02-11 23:54:21','2026-02-11 23:54:21'),(1031,498,110,0.00,1309.99,'مخزون تام الصنع - فاتورة #SI-2026-000146','2026-02-11 23:54:21','2026-02-11 23:54:21'),(1032,499,28,0.00,3152.00,'إيراد مبيعات - فاتورة #SI-2026-000160','2026-02-11 23:57:39','2026-02-11 23:57:39'),(1033,499,47,3152.00,0.00,'مديونية عميل - فاتورة #SI-2026-000160','2026-02-11 23:57:39','2026-02-11 23:57:39'),(1034,500,15,732.16,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000160','2026-02-11 23:57:39','2026-02-11 23:57:39'),(1035,500,110,0.00,732.16,'مخزون تام الصنع - فاتورة #SI-2026-000160','2026-02-11 23:57:39','2026-02-11 23:57:39'),(1036,501,28,0.00,1343.00,'إيراد مبيعات - فاتورة #SI-2026-000161','2026-02-12 00:21:02','2026-02-12 00:21:02'),(1037,501,108,40.29,0.00,'خصم مسموح به - فاتورة #SI-2026-000161','2026-02-12 00:21:02','2026-02-12 00:21:02'),(1038,501,47,1302.71,0.00,'مديونية عميل - فاتورة #SI-2026-000161','2026-02-12 00:21:02','2026-02-12 00:21:02'),(1039,502,15,259.06,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000161','2026-02-12 00:21:02','2026-02-12 00:21:02'),(1040,502,110,0.00,259.06,'مخزون تام الصنع - فاتورة #SI-2026-000161','2026-02-12 00:21:02','2026-02-12 00:21:02'),(1041,503,42,1302.71,0.00,'تحصيل - cash','2026-02-12 00:21:48','2026-02-12 00:21:48'),(1042,503,47,0.00,1302.71,'تخفيض مديونية العميل','2026-02-12 00:21:48','2026-02-12 00:21:48'),(1043,504,28,0.00,2125.00,'إيراد مبيعات - فاتورة #SI-2026-000162','2026-02-12 00:28:57','2026-02-12 00:28:57'),(1044,504,108,106.25,0.00,'خصم مسموح به - فاتورة #SI-2026-000162','2026-02-12 00:28:57','2026-02-12 00:28:57'),(1045,504,47,2018.75,0.00,'مديونية عميل - فاتورة #SI-2026-000162','2026-02-12 00:28:57','2026-02-12 00:28:57'),(1046,505,15,447.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000162','2026-02-12 00:28:57','2026-02-12 00:28:57'),(1047,505,110,0.00,447.50,'مخزون تام الصنع - فاتورة #SI-2026-000162','2026-02-12 00:28:57','2026-02-12 00:28:57'),(1048,506,80,22.70,0.00,'سند صرف مخزني رقم #IV-1770856648499','2026-02-12 00:39:39','2026-02-12 00:39:39'),(1049,506,110,0.00,22.70,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770856648499','2026-02-12 00:39:39','2026-02-12 00:39:39'),(1050,507,80,47.50,0.00,'سند صرف مخزني رقم #IV-1770856782921','2026-02-12 00:40:42','2026-02-12 00:40:42'),(1051,507,110,0.00,47.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770856782921','2026-02-12 00:40:42','2026-02-12 00:40:42'),(1052,508,77,47.50,0.00,'سند صرف مخزني رقم #IV-1770856849466','2026-02-12 00:43:11','2026-02-12 00:43:11'),(1053,508,110,0.00,47.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770856849466','2026-02-12 00:43:11','2026-02-12 00:43:11'),(1054,509,80,179.40,0.00,'سند صرف مخزني رقم #IV-1770856998614','2026-02-12 00:43:55','2026-02-12 00:43:55'),(1055,509,110,0.00,179.40,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1770856998614','2026-02-12 00:43:55','2026-02-12 00:43:55'),(1056,510,28,0.00,430.00,'إيراد مبيعات - فاتورة #SI-2026-000148','2026-02-12 00:44:37','2026-02-12 00:44:37'),(1057,510,115,0.00,75.00,'إيراد شحن - فاتورة #SI-2026-000148','2026-02-12 00:44:37','2026-02-12 00:44:37'),(1058,510,47,505.00,0.00,'مديونية عميل - فاتورة #SI-2026-000148','2026-02-12 00:44:37','2026-02-12 00:44:37'),(1059,511,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000148','2026-02-12 00:44:37','2026-02-12 00:44:37'),(1060,511,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000148','2026-02-12 00:44:37','2026-02-12 00:44:37'),(1061,512,28,0.00,5082.00,'إيراد مبيعات - فاتورة #SI-2026-000145','2026-02-12 00:46:34','2026-02-12 00:46:34'),(1062,512,47,5082.00,0.00,'مديونية عميل - فاتورة #SI-2026-000145','2026-02-12 00:46:34','2026-02-12 00:46:34'),(1063,513,15,1161.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000145','2026-02-12 00:46:34','2026-02-12 00:46:34'),(1064,513,110,0.00,1161.30,'مخزون تام الصنع - فاتورة #SI-2026-000145','2026-02-12 00:46:34','2026-02-12 00:46:34'),(1065,514,28,0.00,396.00,'إيراد مبيعات - فاتورة #SI-2026-000163','2026-02-12 09:57:34','2026-02-12 09:57:34'),(1066,514,108,60.00,0.00,'خصم مسموح به - فاتورة #SI-2026-000163','2026-02-12 09:57:34','2026-02-12 09:57:34'),(1067,514,47,336.00,0.00,'مديونية عميل - فاتورة #SI-2026-000163','2026-02-12 09:57:34','2026-02-12 09:57:34'),(1068,515,15,95.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000163','2026-02-12 09:57:34','2026-02-12 09:57:34'),(1069,515,110,0.00,95.00,'مخزون تام الصنع - فاتورة #SI-2026-000163','2026-02-12 09:57:34','2026-02-12 09:57:34'),(1070,516,41,2320.00,0.00,'تحصيل - cash','2026-02-12 10:00:39','2026-02-12 10:00:39'),(1071,516,47,0.00,2320.00,'تخفيض مديونية العميل','2026-02-12 10:00:39','2026-02-12 10:00:39'),(1072,517,28,0.00,374.00,'إيراد مبيعات - فاتورة #SI-2026-000164','2026-02-12 10:06:51','2026-02-12 10:06:51'),(1073,517,108,11.00,0.00,'خصم مسموح به - فاتورة #SI-2026-000164','2026-02-12 10:06:51','2026-02-12 10:06:51'),(1074,517,47,363.00,0.00,'مديونية عميل - فاتورة #SI-2026-000164','2026-02-12 10:06:51','2026-02-12 10:06:51'),(1075,518,15,95.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000164','2026-02-12 10:06:51','2026-02-12 10:06:51'),(1076,518,110,0.00,95.00,'مخزون تام الصنع - فاتورة #SI-2026-000164','2026-02-12 10:06:51','2026-02-12 10:06:51'),(1077,519,41,363.00,0.00,'تحصيل - cash','2026-02-12 10:17:20','2026-02-12 10:17:20'),(1078,519,47,0.00,363.00,'تخفيض مديونية العميل','2026-02-12 10:17:20','2026-02-12 10:17:20'),(1079,520,41,17387.00,0.00,'تحصيل - cash','2026-02-12 11:59:46','2026-02-12 11:59:46'),(1080,520,47,0.00,17387.00,'تخفيض مديونية العميل','2026-02-12 11:59:46','2026-02-12 11:59:46'),(1081,521,41,2613.00,0.00,'تحصيل - cash','2026-02-12 12:01:06','2026-02-12 12:01:06'),(1082,521,47,0.00,2613.00,'تخفيض مديونية العميل','2026-02-12 12:01:06','2026-02-12 12:01:06'),(1083,522,41,5000.00,0.00,'تحصيل - cash','2026-02-12 12:34:29','2026-02-12 12:34:29'),(1084,522,47,0.00,5000.00,'تخفيض مديونية العميل','2026-02-12 12:34:29','2026-02-12 12:34:29'),(1085,523,28,0.00,8600.00,'إيراد مبيعات - فاتورة #SI-2026-000165','2026-02-12 17:41:15','2026-02-12 17:41:15'),(1086,523,47,8600.00,0.00,'مديونية عميل - فاتورة #SI-2026-000165','2026-02-12 17:41:15','2026-02-12 17:41:15'),(1087,524,15,2710.07,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000165','2026-02-12 17:41:15','2026-02-12 17:41:15'),(1088,524,110,0.00,2710.07,'مخزون تام الصنع - فاتورة #SI-2026-000165','2026-02-12 17:41:15','2026-02-12 17:41:15'),(1089,525,89,2000.00,0.00,'تقى خالد','2026-02-13 21:58:43','2026-02-13 21:58:43'),(1090,525,43,0.00,2000.00,'تقى خالد','2026-02-13 21:58:43','2026-02-13 21:58:43'),(1091,526,85,1000.00,0.00,'بروشورات','2026-02-13 22:00:38','2026-02-13 23:48:15'),(1092,526,43,0.00,1000.00,'بروشورات','2026-02-13 22:00:38','2026-02-13 23:48:15'),(1093,527,99,70.00,0.00,'فاتورة مياه','2026-02-13 22:59:44','2026-02-13 22:59:44'),(1094,527,41,0.00,70.00,'فاتورة مياه','2026-02-13 22:59:44','2026-02-13 22:59:44'),(1095,528,77,160.00,0.00,'لوجو 20 بوكس بلوجر','2026-02-13 23:02:53','2026-02-13 23:02:53'),(1096,528,43,0.00,160.00,'لوجو 20 بوكس بلوجر','2026-02-13 23:02:53','2026-02-13 23:02:53'),(1097,529,100,320.00,0.00,'لوجو 40 بوكس هدايا رمضان للدكاترة','2026-02-13 23:04:40','2026-02-13 23:04:40'),(1098,529,43,0.00,320.00,'لوجو 40 بوكس هدايا رمضان للدكاترة','2026-02-13 23:04:40','2026-02-13 23:04:40'),(1099,530,77,1300.00,0.00,'20 بوكس للبلوجر','2026-02-13 23:05:40','2026-02-13 23:05:40'),(1100,530,43,0.00,1300.00,'20 بوكس للبلوجر','2026-02-13 23:05:40','2026-02-13 23:05:40'),(1101,531,91,6000.00,0.00,'مصروف #72','2026-02-13 23:07:01','2026-02-13 23:07:01'),(1102,531,43,0.00,6000.00,'مصروف #72','2026-02-13 23:07:01','2026-02-13 23:07:01'),(1103,532,34,45.00,0.00,'مقص','2026-02-13 23:08:37','2026-02-13 23:08:37'),(1104,532,41,0.00,45.00,'مقص','2026-02-13 23:08:37','2026-02-13 23:08:37'),(1105,533,99,1300.00,0.00,'سجل تجاري','2026-02-13 23:16:49','2026-02-13 23:16:49'),(1106,533,41,0.00,1300.00,'سجل تجاري','2026-02-13 23:16:49','2026-02-13 23:16:49'),(1107,534,99,667.00,0.00,'سجل تجاري','2026-02-13 23:17:29','2026-02-13 23:17:29'),(1108,534,43,0.00,667.00,'سجل تجاري','2026-02-13 23:17:29','2026-02-13 23:17:29'),(1109,535,99,135.00,0.00,'سجل تجاري','2026-02-13 23:18:09','2026-02-13 23:18:09'),(1110,535,41,0.00,135.00,'سجل تجاري','2026-02-13 23:18:09','2026-02-13 23:18:09'),(1111,536,89,3000.00,0.00,'نيهال بلوجر','2026-02-13 23:19:13','2026-02-13 23:19:13'),(1112,536,43,0.00,3000.00,'نيهال بلوجر','2026-02-13 23:19:13','2026-02-13 23:19:13'),(1113,537,85,1650.00,0.00,'بروشورات','2026-02-13 23:20:16','2026-02-13 23:20:16'),(1114,537,43,0.00,1650.00,'بروشورات','2026-02-13 23:20:16','2026-02-13 23:20:16'),(1115,538,34,45.00,0.00,'مقص','2026-02-13 23:21:13','2026-02-13 23:21:13'),(1116,538,41,0.00,45.00,'مقص','2026-02-13 23:21:13','2026-02-13 23:21:13'),(1117,539,99,84.00,0.00,'دبل فيس×2','2026-02-13 23:23:43','2026-02-13 23:23:43'),(1118,539,41,0.00,84.00,'دبل فيس×2','2026-02-13 23:23:43','2026-02-13 23:23:43'),(1119,540,99,50.00,0.00,'كور فوم','2026-02-13 23:24:58','2026-02-13 23:24:58'),(1120,540,41,0.00,50.00,'كور فوم','2026-02-13 23:24:58','2026-02-13 23:24:58'),(1121,541,100,480.00,0.00,'كيلو ونصف شوكولاته من سوافل هدايا رمضان للدكاترة','2026-02-13 23:28:46','2026-02-13 23:28:46'),(1122,541,41,0.00,480.00,'كيلو ونصف شوكولاته من سوافل هدايا رمضان للدكاترة','2026-02-13 23:28:46','2026-02-13 23:28:46'),(1123,542,100,595.00,0.00,'2 كيلو شوكولاته من سوافل هدايا رمضان للدكاترة','2026-02-13 23:52:03','2026-02-13 23:52:03'),(1124,542,41,0.00,595.00,'2 كيلو شوكولاته من سوافل هدايا رمضان للدكاترة','2026-02-13 23:52:03','2026-02-13 23:52:03'),(1125,543,100,530.00,0.00,'كيلو ونصف شوكولاته من لينزا هدايا رمضان للدكاترة','2026-02-13 23:59:09','2026-02-13 23:59:09'),(1126,543,41,0.00,530.00,'كيلو ونصف شوكولاته من لينزا هدايا رمضان للدكاترة','2026-02-13 23:59:09','2026-02-13 23:59:09'),(1127,544,100,285.00,0.00,'3 كيلو تمر هدايا رمضان للدكاتره','2026-02-14 00:00:20','2026-02-14 00:00:20'),(1128,544,41,0.00,285.00,'3 كيلو تمر هدايا رمضان للدكاتره','2026-02-14 00:00:20','2026-02-14 00:00:20'),(1129,545,100,320.00,0.00,'3 كيلو تمر هدايا رمضان للدكاتره','2026-02-14 00:00:55','2026-02-14 00:00:55'),(1130,545,41,0.00,320.00,'3 كيلو تمر هدايا رمضان للدكاتره','2026-02-14 00:00:55','2026-02-14 00:00:55'),(1131,546,100,440.00,0.00,'علب للتمر هدايا رمضان للدكاتره','2026-02-14 00:01:43','2026-02-14 00:01:43'),(1132,546,41,0.00,440.00,'علب للتمر هدايا رمضان للدكاتره','2026-02-14 00:01:43','2026-02-14 00:01:43'),(1133,547,100,130.00,0.00,'4 سبح ورمضان كريم هدايا رمضان للدكاتره','2026-02-14 00:02:54','2026-02-14 00:02:54'),(1134,547,41,0.00,130.00,'4 سبح ورمضان كريم هدايا رمضان للدكاتره','2026-02-14 00:02:54','2026-02-14 00:02:54'),(1135,548,100,190.00,0.00,'اسفينج هدايا رمضان للدكاتره','2026-02-14 00:03:49','2026-02-14 00:03:49'),(1136,548,41,0.00,190.00,'اسفينج هدايا رمضان للدكاتره','2026-02-14 00:03:49','2026-02-14 00:03:49'),(1137,549,41,11520.00,0.00,'تحصيل - cash','2026-02-14 08:27:58','2026-02-14 08:27:58'),(1138,549,47,0.00,11520.00,'تخفيض مديونية العميل','2026-02-14 08:27:58','2026-02-14 08:27:58'),(1139,550,98,1800.00,0.00,'زكاه','2026-02-14 11:05:25','2026-02-14 11:05:25'),(1140,550,41,0.00,1800.00,'زكاه','2026-02-14 11:05:25','2026-02-14 11:05:25'),(1141,551,95,235.00,0.00,'بن','2026-02-15 08:28:57','2026-02-15 08:28:57'),(1142,551,41,0.00,235.00,'بن','2026-02-15 08:28:57','2026-02-15 08:28:57'),(1143,552,103,200.00,0.00,'بدل سفر طنطا وكفر الشيخ ومنية النصر','2026-02-15 08:30:06','2026-02-15 08:30:06'),(1144,552,41,0.00,200.00,'بدل سفر طنطا وكفر الشيخ ومنية النصر','2026-02-15 08:30:06','2026-02-15 08:30:06'),(1145,553,99,40.00,0.00,'لاصق لكراتين رمضان','2026-02-15 08:36:50','2026-02-15 08:36:50'),(1146,553,41,0.00,40.00,'لاصق لكراتين رمضان','2026-02-15 08:36:50','2026-02-15 08:36:50'),(1147,554,99,140.00,0.00,'ملفين كرتون','2026-02-15 08:38:31','2026-02-15 08:38:31'),(1148,554,41,0.00,140.00,'ملفين كرتون','2026-02-15 08:38:31','2026-02-15 08:38:31'),(1149,555,28,0.00,500.02,'إيراد مبيعات - فاتورة #SI-2026-000167','2026-02-15 08:39:46','2026-02-15 08:39:46'),(1150,555,47,500.02,0.00,'مديونية عميل - فاتورة #SI-2026-000167','2026-02-15 08:39:46','2026-02-15 08:39:46'),(1151,556,15,134.25,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000167','2026-02-15 08:39:46','2026-02-15 08:39:46'),(1152,556,110,0.00,134.25,'مخزون تام الصنع - فاتورة #SI-2026-000167','2026-02-15 08:39:46','2026-02-15 08:39:46'),(1153,557,41,500.02,0.00,'تحصيل - cash','2026-02-15 08:40:21','2026-02-15 08:40:21'),(1154,557,47,0.00,500.02,'تخفيض مديونية العميل','2026-02-15 08:40:21','2026-02-15 08:40:21'),(1155,558,28,0.00,4056.00,'إيراد مبيعات - فاتورة #SI-2026-000168','2026-02-15 08:54:39','2026-02-15 08:54:39'),(1156,558,47,4056.00,0.00,'مديونية عميل - فاتورة #SI-2026-000168','2026-02-15 08:54:39','2026-02-15 08:54:39'),(1157,559,15,986.70,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000168','2026-02-15 08:54:39','2026-02-15 08:54:39'),(1158,559,110,0.00,986.70,'مخزون تام الصنع - فاتورة #SI-2026-000168','2026-02-15 08:54:39','2026-02-15 08:54:39'),(1159,560,28,0.00,850.00,'إيراد مبيعات - فاتورة #SI-2026-000171','2026-02-15 09:08:54','2026-02-15 09:08:54'),(1160,560,108,25.00,0.00,'خصم مسموح به - فاتورة #SI-2026-000171','2026-02-15 09:08:54','2026-02-15 09:08:54'),(1161,560,47,825.00,0.00,'مديونية عميل - فاتورة #SI-2026-000171','2026-02-15 09:08:54','2026-02-15 09:08:54'),(1162,561,15,176.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000171','2026-02-15 09:08:54','2026-02-15 09:08:54'),(1163,561,110,0.00,176.89,'مخزون تام الصنع - فاتورة #SI-2026-000171','2026-02-15 09:08:54','2026-02-15 09:08:54'),(1164,562,41,825.00,0.00,'تحصيل - cash','2026-02-15 09:09:30','2026-02-15 09:09:30'),(1165,562,47,0.00,825.00,'تخفيض مديونية العميل','2026-02-15 09:09:30','2026-02-15 09:09:30'),(1166,563,28,0.00,2960.00,'إيراد مبيعات - فاتورة #SI-2026-000166','2026-02-15 09:27:11','2026-02-15 09:27:11'),(1167,563,47,2960.00,0.00,'مديونية عميل - فاتورة #SI-2026-000166','2026-02-15 09:27:11','2026-02-15 09:27:11'),(1168,564,15,686.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000166','2026-02-15 09:27:11','2026-02-15 09:27:11'),(1169,564,110,0.00,686.00,'مخزون تام الصنع - فاتورة #SI-2026-000166','2026-02-15 09:27:11','2026-02-15 09:27:11'),(1170,565,41,4300.00,0.00,'تحصيل - cash','2026-02-15 09:53:59','2026-02-15 09:53:59'),(1171,565,47,0.00,4300.00,'تخفيض مديونية العميل','2026-02-15 09:53:59','2026-02-15 09:53:59'),(1172,566,43,2576.47,0.00,'سحب المستحقات من خزينة شركة الشحن','2026-02-15 10:00:25','2026-02-15 10:00:25'),(1173,566,42,0.00,2576.47,'تحويل المستحقات الى حساب بنك QNB','2026-02-15 10:00:25','2026-02-15 10:00:25'),(1174,567,47,9502.30,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000175','2026-02-15 11:07:44','2026-02-15 11:07:44'),(1175,567,117,0.00,9502.30,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000175','2026-02-15 11:07:44','2026-02-15 11:07:44'),(1176,568,62,40020.00,0.00,'تخفيض التزامات المورد','2026-02-15 14:43:12','2026-02-15 14:43:12'),(1177,568,43,0.00,40020.00,'خروج - bank_transfer','2026-02-15 14:43:12','2026-02-15 14:43:12'),(1178,569,110,129783.47,0.00,'استلام منتج تام - أمر #1','2026-02-16 09:09:07','2026-02-16 09:09:07'),(1179,569,127,0.00,59493.87,'إقفال خامات تحت التشغيل - أمر #1','2026-02-16 09:09:07','2026-02-16 09:09:07'),(1180,569,128,0.00,71734.95,'إقفال خدمات تحت التشغيل - أمر #1','2026-02-16 09:09:07','2026-02-16 09:09:07'),(1181,569,62,1445.35,0.00,'خصم تكلفة تصنيع هالك (57 وحدة) - أمر #1','2026-02-16 09:09:07','2026-02-16 09:09:07'),(1182,570,28,0.00,8475.00,'إيراد مبيعات - فاتورة #SI-2026-000177','2026-02-16 09:23:47','2026-02-16 09:23:47'),(1183,570,47,8475.00,0.00,'مديونية عميل - فاتورة #SI-2026-000177','2026-02-16 09:23:47','2026-02-16 09:23:47'),(1184,571,15,2533.19,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000177','2026-02-16 09:23:47','2026-02-16 09:23:47'),(1185,571,110,0.00,2533.19,'مخزون تام الصنع - فاتورة #SI-2026-000177','2026-02-16 09:23:47','2026-02-16 09:23:47'),(1186,572,28,0.00,2320.60,'إيراد مبيعات - فاتورة #SI-2026-000179','2026-02-16 09:32:21','2026-02-16 09:32:21'),(1187,572,47,2320.60,0.00,'مديونية عميل - فاتورة #SI-2026-000179','2026-02-16 09:32:21','2026-02-16 09:32:21'),(1188,573,15,485.82,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000179','2026-02-16 09:32:21','2026-02-16 09:32:21'),(1189,573,110,0.00,485.82,'مخزون تام الصنع - فاتورة #SI-2026-000179','2026-02-16 09:32:21','2026-02-16 09:32:21'),(1190,574,28,0.00,884.00,'إيراد مبيعات - فاتورة #SI-2026-000178','2026-02-16 09:32:36','2026-02-16 09:32:36'),(1191,574,47,884.00,0.00,'مديونية عميل - فاتورة #SI-2026-000178','2026-02-16 09:32:36','2026-02-16 09:32:36'),(1192,575,15,179.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000178','2026-02-16 09:32:36','2026-02-16 09:32:36'),(1193,575,110,0.00,179.40,'مخزون تام الصنع - فاتورة #SI-2026-000178','2026-02-16 09:32:36','2026-02-16 09:32:36'),(1194,576,6,8490.00,0.00,'Sales Return #8 - Revenue Reversal','2026-02-17 08:53:02','2026-02-17 08:53:02'),(1195,576,47,0.00,8490.00,'Refund/Credit - Return #8','2026-02-17 08:53:02','2026-02-17 08:53:02'),(1196,577,110,2168.10,0.00,'Cost Reversal (Return #8)','2026-02-17 08:53:02','2026-02-17 08:53:02'),(1197,577,15,0.00,2168.10,'COGS Reversal - Return #8','2026-02-17 08:53:02','2026-02-17 08:53:02'),(1198,578,41,1635.00,0.00,'تحصيل - cash','2026-02-17 08:54:27','2026-02-17 08:54:27'),(1199,578,47,0.00,1635.00,'تخفيض مديونية العميل','2026-02-17 08:54:27','2026-02-17 08:54:27'),(1200,579,28,0.00,4420.00,'إيراد مبيعات - فاتورة #SI-2026-000176','2026-02-17 10:21:54','2026-02-17 10:21:54'),(1201,579,47,4420.00,0.00,'مديونية عميل - فاتورة #SI-2026-000176','2026-02-17 10:21:54','2026-02-17 10:21:54'),(1202,580,15,897.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000176','2026-02-17 10:21:54','2026-02-17 10:21:54'),(1203,580,110,0.00,897.00,'مخزون تام الصنع - فاتورة #SI-2026-000176','2026-02-17 10:21:54','2026-02-17 10:21:54'),(1204,581,41,3354.00,0.00,'تحصيل - cash','2026-02-17 10:24:08','2026-02-17 10:28:36'),(1205,581,47,0.00,3354.00,'تخفيض مديونية العميل','2026-02-17 10:24:08','2026-02-17 10:28:36'),(1206,582,41,3146.00,0.00,'تحصيل - cash','2026-02-17 10:24:58','2026-02-17 10:24:58'),(1207,582,47,0.00,3146.00,'تخفيض مديونية العميل','2026-02-17 10:24:58','2026-02-17 10:24:58'),(1208,583,28,0.00,6926.40,'إيراد مبيعات - فاتورة #SI-2026-000180','2026-02-17 10:47:52','2026-02-17 10:47:52'),(1209,583,47,6926.40,0.00,'مديونية عميل - فاتورة #SI-2026-000180','2026-02-17 10:47:52','2026-02-17 10:47:52'),(1210,584,15,1456.38,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000180','2026-02-17 10:47:52','2026-02-17 10:47:52'),(1211,584,110,0.00,1456.38,'مخزون تام الصنع - فاتورة #SI-2026-000180','2026-02-17 10:47:52','2026-02-17 10:47:52'),(1212,585,28,0.00,1695.00,'إيراد مبيعات - فاتورة #SI-2026-000174','2026-02-17 11:00:19','2026-02-17 11:00:19'),(1213,585,47,1695.00,0.00,'مديونية عميل - فاتورة #SI-2026-000174','2026-02-17 11:00:19','2026-02-17 11:00:19'),(1214,586,15,398.67,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000174','2026-02-17 11:00:19','2026-02-17 11:00:19'),(1215,586,110,0.00,398.67,'مخزون تام الصنع - فاتورة #SI-2026-000174','2026-02-17 11:00:19','2026-02-17 11:00:19'),(1216,587,28,0.00,1326.00,'إيراد مبيعات - فاتورة #SI-2026-000173','2026-02-17 11:00:30','2026-02-17 11:00:30'),(1217,587,47,1326.00,0.00,'مديونية عميل - فاتورة #SI-2026-000173','2026-02-17 11:00:30','2026-02-17 11:00:30'),(1218,588,15,269.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000173','2026-02-17 11:00:30','2026-02-17 11:00:30'),(1219,588,110,0.00,269.10,'مخزون تام الصنع - فاتورة #SI-2026-000173','2026-02-17 11:00:30','2026-02-17 11:00:30'),(1220,589,28,0.00,2176.00,'إيراد مبيعات - فاتورة #SI-2026-000172','2026-02-17 11:00:45','2026-02-17 11:00:45'),(1221,589,47,2176.00,0.00,'مديونية عميل - فاتورة #SI-2026-000172','2026-02-17 11:00:45','2026-02-17 11:00:45'),(1222,590,15,487.78,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000172','2026-02-17 11:00:45','2026-02-17 11:00:45'),(1223,590,110,0.00,487.78,'مخزون تام الصنع - فاتورة #SI-2026-000172','2026-02-17 11:00:45','2026-02-17 11:00:45'),(1224,591,28,0.00,2805.00,'إيراد مبيعات - فاتورة #SI-2026-000170','2026-02-17 11:01:16','2026-02-17 11:01:16'),(1225,591,108,84.15,0.00,'خصم مسموح به - فاتورة #SI-2026-000170','2026-02-17 11:01:16','2026-02-17 11:01:16'),(1226,591,47,2720.85,0.00,'مديونية عميل - فاتورة #SI-2026-000170','2026-02-17 11:01:16','2026-02-17 11:01:16'),(1227,592,15,608.30,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000170','2026-02-17 11:01:16','2026-02-17 11:01:16'),(1228,592,110,0.00,608.30,'مخزون تام الصنع - فاتورة #SI-2026-000170','2026-02-17 11:01:16','2026-02-17 11:01:16'),(1229,593,28,0.00,4029.00,'إيراد مبيعات - فاتورة #SI-2026-000169','2026-02-17 11:01:35','2026-02-17 11:01:35'),(1230,593,108,201.45,0.00,'خصم مسموح به - فاتورة #SI-2026-000169','2026-02-17 11:01:35','2026-02-17 11:01:35'),(1231,593,47,3827.55,0.00,'مديونية عميل - فاتورة #SI-2026-000169','2026-02-17 11:01:35','2026-02-17 11:01:35'),(1232,594,15,955.45,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000169','2026-02-17 11:01:35','2026-02-17 11:01:35'),(1233,594,110,0.00,955.45,'مخزون تام الصنع - فاتورة #SI-2026-000169','2026-02-17 11:01:35','2026-02-17 11:01:35'),(1234,595,42,3827.55,0.00,'تحصيل - cash','2026-02-17 11:02:07','2026-02-17 11:02:07'),(1235,595,47,0.00,3827.55,'تخفيض مديونية العميل','2026-02-17 11:02:07','2026-02-17 11:02:07'),(1236,596,42,2018.75,0.00,'تحصيل - cash','2026-02-17 11:03:22','2026-02-17 11:03:22'),(1237,596,47,0.00,2018.75,'تخفيض مديونية العميل','2026-02-17 11:03:22','2026-02-17 11:03:22'),(1238,597,42,505.00,0.00,'تحصيل - cash','2026-02-17 11:03:47','2026-02-17 11:03:47'),(1239,597,47,0.00,505.00,'تخفيض مديونية العميل','2026-02-17 11:03:47','2026-02-17 11:03:47'),(1240,598,42,325.00,0.00,'تحصيل - cash','2026-02-17 11:04:51','2026-02-17 11:04:51'),(1241,598,47,0.00,325.00,'تخفيض مديونية العميل','2026-02-17 11:04:51','2026-02-17 11:04:51'),(1242,599,103,125.00,0.00,'بدل سفر الزقازيق','2026-02-17 12:34:09','2026-02-17 12:34:09'),(1243,599,41,0.00,125.00,'بدل سفر الزقازيق','2026-02-17 12:34:09','2026-02-17 12:34:09'),(1244,600,99,60.00,0.00,'بلاستر لاصق','2026-02-17 12:34:58','2026-02-17 12:34:58'),(1245,600,41,0.00,60.00,'بلاستر لاصق','2026-02-17 12:34:58','2026-02-17 12:34:58'),(1246,601,98,400.00,0.00,'مصروف #97','2026-02-17 12:35:20','2026-02-17 12:35:20'),(1247,601,41,0.00,400.00,'مصروف #97','2026-02-17 12:35:20','2026-02-17 12:35:20'),(1248,602,129,46.82,0.00,'سند صرف مخزني رقم #IV-1771406026687','2026-02-18 09:14:59','2026-02-18 09:14:59'),(1249,602,110,0.00,46.82,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771406026687','2026-02-18 09:14:59','2026-02-18 09:14:59'),(1250,603,28,0.00,3315.60,'إيراد مبيعات - فاتورة #SI-2026-000183','2026-02-18 09:17:34','2026-02-18 09:17:34'),(1251,603,65,0.00,464.18,'ضريبة القيمة المضافة - فاتورة #SI-2026-000183','2026-02-18 09:17:34','2026-02-18 09:17:34'),(1252,603,47,3779.78,0.00,'مديونية عميل - فاتورة #SI-2026-000183','2026-02-18 09:17:34','2026-02-18 09:17:34'),(1253,604,15,1404.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000183','2026-02-18 09:17:34','2026-02-18 09:17:34'),(1254,604,110,0.00,1404.60,'مخزون تام الصنع - فاتورة #SI-2026-000183','2026-02-18 09:17:34','2026-02-18 09:17:34'),(1255,605,28,0.00,3789.18,'إيراد مبيعات - فاتورة #SI-2026-000182','2026-02-18 09:17:53','2026-02-18 09:17:53'),(1256,605,65,0.00,530.49,'ضريبة القيمة المضافة - فاتورة #SI-2026-000182','2026-02-18 09:17:53','2026-02-18 09:17:53'),(1257,605,47,4319.67,0.00,'مديونية عميل - فاتورة #SI-2026-000182','2026-02-18 09:17:53','2026-02-18 09:17:53'),(1258,606,15,1545.06,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000182','2026-02-18 09:17:53','2026-02-18 09:17:53'),(1259,606,110,0.00,1545.06,'مخزون تام الصنع - فاتورة #SI-2026-000182','2026-02-18 09:17:53','2026-02-18 09:17:53'),(1260,607,28,0.00,430.00,'إيراد مبيعات - فاتورة #SI-2026-000187','2026-02-18 09:46:55','2026-02-18 09:46:55'),(1261,607,47,430.00,0.00,'مديونية عميل - فاتورة #SI-2026-000187','2026-02-18 09:46:55','2026-02-18 09:46:55'),(1262,608,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000187','2026-02-18 09:46:55','2026-02-18 09:46:55'),(1263,608,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000187','2026-02-18 09:46:55','2026-02-18 09:46:55'),(1264,609,28,0.00,720.00,'إيراد مبيعات - فاتورة #SI-2026-000186','2026-02-18 09:47:29','2026-02-18 09:47:29'),(1265,609,47,720.00,0.00,'مديونية عميل - فاتورة #SI-2026-000186','2026-02-18 09:47:29','2026-02-18 09:47:29'),(1266,610,15,68.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000186','2026-02-18 09:47:29','2026-02-18 09:47:29'),(1267,610,110,0.00,68.10,'مخزون تام الصنع - فاتورة #SI-2026-000186','2026-02-18 09:47:29','2026-02-18 09:47:29'),(1268,611,99,200.00,0.00,'تنظيف المكتب','2026-02-18 10:10:32','2026-02-18 10:10:32'),(1269,611,41,0.00,200.00,'تنظيف المكتب','2026-02-18 10:10:32','2026-02-18 10:10:32'),(1270,612,89,1500.00,0.00,'تقى خالد','2026-02-18 10:11:25','2026-02-18 10:11:25'),(1271,612,43,0.00,1500.00,'تقى خالد','2026-02-18 10:11:25','2026-02-18 10:11:25'),(1272,613,102,660.00,0.00,'الاجتماع الشهري','2026-02-18 10:12:17','2026-02-18 10:12:17'),(1273,613,41,0.00,660.00,'الاجتماع الشهري','2026-02-18 10:12:17','2026-02-18 10:12:17'),(1274,614,6,200.00,0.00,'Sales Return #9 - Revenue Reversal','2026-02-18 11:40:01','2026-02-18 11:40:01'),(1275,614,47,0.00,200.00,'Refund/Credit - Return #9','2026-02-18 11:40:01','2026-02-18 11:40:01'),(1276,615,112,44.75,0.00,'Cost Reversal (Return #9)','2026-02-18 11:40:02','2026-02-18 11:40:02'),(1277,615,15,0.00,44.75,'COGS Reversal - Return #9','2026-02-18 11:40:02','2026-02-18 11:40:02'),(1278,616,6,232.00,0.00,'Sales Return #10 - Revenue Reversal','2026-02-18 11:42:30','2026-02-18 11:42:30'),(1279,616,47,0.00,232.00,'Refund/Credit - Return #10','2026-02-18 11:42:30','2026-02-18 11:42:30'),(1280,617,110,55.30,0.00,'Cost Reversal (Return #10)','2026-02-18 11:42:30','2026-02-18 11:42:30'),(1281,617,15,0.00,55.30,'COGS Reversal - Return #10','2026-02-18 11:42:30','2026-02-18 11:42:30'),(1282,618,41,8760.00,0.00,'تحصيل - cash','2026-02-19 15:11:25','2026-02-19 15:11:25'),(1283,618,47,0.00,8760.00,'تخفيض مديونية العميل','2026-02-19 15:11:25','2026-02-19 15:11:25'),(1284,619,43,23314.00,0.00,'تحصيل - cheque','2026-02-19 15:25:22','2026-02-19 15:25:22'),(1285,619,47,0.00,23314.00,'تخفيض مديونية العميل','2026-02-19 15:25:22','2026-02-19 15:25:22'),(1286,620,41,1300.00,0.00,'تحصيل - cash','2026-02-19 15:45:39','2026-02-19 15:45:39'),(1287,620,47,0.00,1300.00,'تخفيض مديونية العميل','2026-02-19 15:45:39','2026-02-19 15:45:39'),(1288,621,41,1904.60,0.00,'تحصيل - cash','2026-02-19 17:43:53','2026-02-19 17:43:53'),(1289,621,47,0.00,1904.60,'تخفيض مديونية العميل','2026-02-19 17:43:53','2026-02-19 17:43:53'),(1290,622,41,3830.00,0.00,'تحصيل - cash','2026-02-19 17:45:41','2026-02-19 17:45:41'),(1291,622,47,0.00,3830.00,'تخفيض مديونية العميل','2026-02-19 17:45:41','2026-02-19 17:45:41'),(1292,623,41,8500.00,0.00,'تحصيل - cash','2026-02-19 17:48:11','2026-02-19 17:48:11'),(1293,623,47,0.00,8500.00,'تخفيض مديونية العميل','2026-02-19 17:48:11','2026-02-19 17:48:11'),(1294,624,41,2320.60,0.00,'تحصيل - cash','2026-02-19 17:49:17','2026-02-19 17:49:17'),(1295,624,47,0.00,2320.60,'تخفيض مديونية العميل','2026-02-19 17:49:17','2026-02-19 17:49:17'),(1296,625,41,247.50,0.00,'تحصيل - cash','2026-02-19 17:50:01','2026-02-19 17:50:01'),(1297,625,47,0.00,247.50,'تخفيض مديونية العميل','2026-02-19 17:50:01','2026-02-19 17:50:01'),(1298,626,28,0.00,1776.50,'إيراد مبيعات - فاتورة #SI-2026-000190','2026-02-19 17:50:48','2026-02-19 17:50:48'),(1299,626,47,1776.50,0.00,'مديونية عميل - فاتورة #SI-2026-000190','2026-02-19 17:50:48','2026-02-19 17:50:48'),(1300,627,15,302.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000190','2026-02-19 17:50:48','2026-02-19 17:50:48'),(1301,627,110,0.00,302.80,'مخزون تام الصنع - فاتورة #SI-2026-000190','2026-02-19 17:50:48','2026-02-19 17:50:48'),(1302,628,41,1776.50,0.00,'تحصيل - cash','2026-02-19 17:51:11','2026-02-19 17:51:11'),(1303,628,47,0.00,1776.50,'تخفيض مديونية العميل','2026-02-19 17:51:11','2026-02-19 17:51:11'),(1304,629,28,0.00,1326.00,'إيراد مبيعات - فاتورة #SI-2026-000185','2026-02-19 17:53:46','2026-02-19 17:53:46'),(1305,629,108,39.78,0.00,'خصم مسموح به - فاتورة #SI-2026-000185','2026-02-19 17:53:46','2026-02-19 17:53:46'),(1306,629,47,1286.22,0.00,'مديونية عميل - فاتورة #SI-2026-000185','2026-02-19 17:53:46','2026-02-19 17:53:46'),(1307,630,15,269.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000185','2026-02-19 17:53:46','2026-02-19 17:53:46'),(1308,630,110,0.00,269.10,'مخزون تام الصنع - فاتورة #SI-2026-000185','2026-02-19 17:53:46','2026-02-19 17:53:46'),(1309,631,129,98.89,0.00,'سند صرف مخزني رقم #IV-1771524763231','2026-02-19 18:13:38','2026-02-19 18:13:38'),(1310,631,110,0.00,98.89,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771524763231','2026-02-19 18:13:38','2026-02-19 18:13:38'),(1311,632,28,0.00,3200.00,'إيراد مبيعات - فاتورة #SI-2026-000188','2026-02-19 18:14:29','2026-02-19 18:14:29'),(1312,632,47,3200.00,0.00,'مديونية عميل - فاتورة #SI-2026-000188','2026-02-19 18:14:29','2026-02-19 18:14:29'),(1313,633,15,1037.52,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000188','2026-02-19 18:14:29','2026-02-19 18:14:29'),(1314,633,110,0.00,1037.52,'مخزون تام الصنع - فاتورة #SI-2026-000188','2026-02-19 18:14:29','2026-02-19 18:14:29'),(1315,634,28,0.00,1404.00,'إيراد مبيعات - فاتورة #SI-2026-000184','2026-02-19 18:17:41','2026-02-19 18:17:41'),(1316,634,47,1404.00,0.00,'مديونية عميل - فاتورة #SI-2026-000184','2026-02-19 18:17:41','2026-02-19 18:17:41'),(1317,635,15,515.02,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000184','2026-02-19 18:17:41','2026-02-19 18:17:41'),(1318,635,110,0.00,515.02,'مخزون تام الصنع - فاتورة #SI-2026-000184','2026-02-19 18:17:41','2026-02-19 18:17:41'),(1319,636,28,0.00,21893.04,'إيراد مبيعات - فاتورة #SI-2026-000181','2026-02-19 18:19:44','2026-02-19 18:19:44'),(1320,636,65,0.00,3065.03,'ضريبة القيمة المضافة - فاتورة #SI-2026-000181','2026-02-19 18:19:44','2026-02-19 18:19:44'),(1321,636,47,24958.06,0.00,'مديونية عميل - فاتورة #SI-2026-000181','2026-02-19 18:19:44','2026-02-19 18:19:44'),(1322,637,15,6157.58,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000181','2026-02-19 18:19:44','2026-02-19 18:19:44'),(1323,637,110,0.00,6157.58,'مخزون تام الصنع - فاتورة #SI-2026-000181','2026-02-19 18:19:44','2026-02-19 18:19:44'),(1324,638,28,0.00,1440.00,'إيراد مبيعات - فاتورة #SI-2026-000191','2026-02-19 18:24:34','2026-02-19 18:24:34'),(1325,638,47,1440.00,0.00,'مديونية عميل - فاتورة #SI-2026-000191','2026-02-19 18:24:34','2026-02-19 18:24:34'),(1326,639,15,515.02,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000191','2026-02-19 18:24:34','2026-02-19 18:24:34'),(1327,639,110,0.00,515.02,'مخزون تام الصنع - فاتورة #SI-2026-000191','2026-02-19 18:24:34','2026-02-19 18:24:34'),(1328,640,41,2000.00,0.00,'تحصيل - cash','2026-02-19 18:27:34','2026-02-19 18:27:34'),(1329,640,47,0.00,2000.00,'تخفيض مديونية العميل','2026-02-19 18:27:34','2026-02-19 18:27:34'),(1330,641,80,2134.27,0.00,'سند صرف مخزني رقم #IV-1771590881567','2026-02-20 12:39:33','2026-02-20 12:39:33'),(1331,641,110,0.00,2134.27,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771590881567','2026-02-20 12:39:33','2026-02-20 12:39:33'),(1332,642,80,1967.92,0.00,'سند صرف مخزني رقم #IV-1771591474148','2026-02-20 12:47:41','2026-02-20 12:47:41'),(1333,642,110,0.00,1967.92,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771591474148','2026-02-20 12:47:41','2026-02-20 12:47:41'),(1334,643,80,2302.64,0.00,'سند صرف مخزني رقم #IV-1771592042469','2026-02-20 13:00:06','2026-02-20 13:00:06'),(1335,643,110,0.00,2302.64,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771592042469','2026-02-20 13:00:06','2026-02-20 13:00:06'),(1336,644,80,119.49,0.00,'سند صرف مخزني رقم #IV-1771592893732','2026-02-20 13:09:06','2026-02-20 13:09:06'),(1337,644,110,0.00,119.49,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771592893732','2026-02-20 13:09:06','2026-02-20 13:09:06'),(1338,645,100,140.46,0.00,'سند صرف مخزني رقم #IV-1771592968533','2026-02-20 13:11:41','2026-02-20 13:11:41'),(1339,645,110,0.00,140.46,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1771592968533','2026-02-20 13:11:41','2026-02-20 13:11:41'),(1340,646,28,0.00,4128.00,'إيراد مبيعات - فاتورة #SI-2026-000193','2026-02-21 08:20:27','2026-02-21 08:20:27'),(1341,646,47,4128.00,0.00,'مديونية عميل - فاتورة #SI-2026-000193','2026-02-21 08:20:27','2026-02-21 08:20:27'),(1342,647,15,1316.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000193','2026-02-21 08:20:27','2026-02-21 08:20:27'),(1343,647,110,0.00,1316.40,'مخزون تام الصنع - فاتورة #SI-2026-000193','2026-02-21 08:20:27','2026-02-21 08:20:27'),(1344,648,28,0.00,4992.00,'إيراد مبيعات - فاتورة #SI-2026-000194','2026-02-21 08:21:47','2026-02-21 08:21:47'),(1345,648,47,4992.00,0.00,'مديونية عميل - فاتورة #SI-2026-000194','2026-02-21 08:21:47','2026-02-21 08:21:47'),(1346,649,15,1076.40,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000194','2026-02-21 08:21:47','2026-02-21 08:21:47'),(1347,649,110,0.00,1076.40,'مخزون تام الصنع - فاتورة #SI-2026-000194','2026-02-21 08:21:47','2026-02-21 08:21:47'),(1348,650,28,0.00,2400.00,'إيراد مبيعات - فاتورة #SI-2026-000195','2026-02-21 08:25:57','2026-02-21 08:25:57'),(1349,650,47,2400.00,0.00,'مديونية عميل - فاتورة #SI-2026-000195','2026-02-21 08:25:57','2026-02-21 08:25:57'),(1350,651,15,537.00,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000195','2026-02-21 08:25:57','2026-02-21 08:25:57'),(1351,651,110,0.00,537.00,'مخزون تام الصنع - فاتورة #SI-2026-000195','2026-02-21 08:25:57','2026-02-21 08:25:57'),(1352,652,6,270.00,0.00,'Sales Return #11 - Revenue Reversal','2026-02-21 08:34:42','2026-02-21 08:34:42'),(1353,652,47,0.00,270.00,'Refund/Credit - Return #11','2026-02-21 08:34:42','2026-02-21 08:34:42'),(1354,653,110,39.70,0.00,'Cost Reversal (Return #11)','2026-02-21 08:34:42','2026-02-21 08:34:42'),(1355,653,15,0.00,39.70,'COGS Reversal - Return #11','2026-02-21 08:34:42','2026-02-21 08:34:42'),(1356,654,47,270.00,0.00,'تسوية استبدال بضاعة - سند رقم #IV-1771662959978','2026-02-21 08:38:11','2026-02-21 08:38:11'),(1357,654,116,0.00,270.00,'تسوية استبدال بضاعة - سند رقم #IV-1771662959978','2026-02-21 08:38:11','2026-02-21 08:38:11'),(1358,654,15,39.83,0.00,'تكلفة بضاعة بديلة - سند رقم #IV-1771662959978','2026-02-21 08:38:11','2026-02-21 08:38:11'),(1359,654,110,0.00,39.83,'مخزون تام الصنع - تكلفة بضاعة بديلة - سند رقم #IV-1771662959978','2026-02-21 08:38:11','2026-02-21 08:38:11'),(1360,655,28,0.00,816.00,'إيراد مبيعات - فاتورة #SI-2026-000201','2026-02-21 12:05:48','2026-02-21 12:05:48'),(1361,655,108,26.00,0.00,'خصم مسموح به - فاتورة #SI-2026-000201','2026-02-21 12:05:48','2026-02-21 12:05:48'),(1362,655,47,790.00,0.00,'مديونية عميل - فاتورة #SI-2026-000201','2026-02-21 12:05:48','2026-02-21 12:05:48'),(1363,656,15,90.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000201','2026-02-21 12:05:48','2026-02-21 12:05:48'),(1364,656,110,0.00,90.80,'مخزون تام الصنع - فاتورة #SI-2026-000201','2026-02-21 12:05:48','2026-02-21 12:05:48'),(1365,657,41,790.00,0.00,'تحصيل - cash','2026-02-21 12:06:31','2026-02-21 12:06:31'),(1366,657,47,0.00,790.00,'تخفيض مديونية العميل','2026-02-21 12:06:31','2026-02-21 12:06:31');
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
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
INSERT INTO `parties` VALUES (1,'ال عبد اللطيف الطرشوبى','customer','','','','',4,47,0.00,'2025-12-15 14:43:54',2),(2,'سالي','customer','','','','',4,47,0.00,'2025-12-15 14:50:27',2),(3,'مخزن د/ مصطفى نبيل الطرشوبي لتجارة الادوية بالجملة','customer','','','','',4,47,0.00,'2025-12-15 14:53:13',2),(4,'شركة هيلثي للصناعات الدوائية والطبية','customer','','','ن17 شارع شريف الراضي - توريل - المنصوره','',4,47,0.00,'2025-12-15 14:53:33',3),(5,'شركة فيوتشرللأدويه','customer','','','المنصورة - 24 شارع الهدى والنور - برج دروة الصادق','',4,47,0.00,'2025-12-15 14:53:52',3),(6,'الطيبى','customer','','','','',37,47,0.00,'2025-12-15 14:56:57',2),(7,'رمضان','customer','','','','',37,47,0.00,'2025-12-15 14:57:24',1),(8,'خالد محمد','customer','','','','',37,47,0.00,'2025-12-15 14:57:52',1),(9,'القبطان','customer','','','','',37,47,0.00,'2025-12-15 15:24:03',1),(10,'الشمس','customer','','','','',48,47,0.00,'2025-12-15 15:27:50',3),(11,'بيت المقدس','customer','','','','',55,47,0.00,'2025-12-15 15:28:13',3),(12,'بيت الادويه','customer','','','','',55,47,0.00,'2025-12-15 15:28:33',3),(13,'عامر','customer','','','','',55,47,0.00,'2025-12-15 15:29:27',1),(14,'وجيه','customer','','','','',5,47,0.00,'2025-12-15 15:35:10',1),(15,'هاجر وشروق','customer','','','','',13,47,0.00,'2025-12-15 15:35:32',3),(16,'رضا عطيه','customer','','','','',3,47,0.00,'2025-12-15 15:36:05',3),(17,'الاندلس','customer','','','','',13,47,0.00,'2025-12-15 15:36:24',3),(18,'هشام وفؤاد','customer','','','','',13,47,0.00,'2025-12-15 15:36:52',2),(19,'تهانى','customer','','','','',2,47,0.00,'2025-12-15 15:37:59',1),(23,'خليفه','customer','','','','',4,47,0.00,'2026-01-05 15:54:41',2),(24,'مارمرقس','customer','','','','',37,47,0.00,'2026-01-05 16:04:21',7),(25,'خليل','customer','','','','',37,47,0.00,'2026-01-05 16:07:47',3),(26,'وليد الطرشوبي','customer','','','المنصوره','',4,47,0.00,'2026-01-07 00:08:10',2),(27,'عبد الرازق','customer','','','','',62,47,0.00,'2026-01-07 00:20:01',1),(28,'مبيعات نقديه','customer','','','المنصوره','',4,47,0.00,'2026-01-07 00:47:57',6),(29,'مها الجيار','customer','','','','',4,47,0.00,'2026-01-07 00:56:16',9),(30,'مبيعات نقديه','customer','','','','',63,47,0.00,'2026-01-07 01:20:51',6),(31,'عمرو سمير','customer','','','','',6,47,0.00,'2026-01-09 19:48:49',1),(32,'مبيعات نقديه','customer','','','','',13,47,0.00,'2026-01-10 15:13:39',6),(33,'مبيعات نقديه','customer','','','','',20,47,0.00,'2026-01-10 15:53:11',6),(34,'مرعي','customer','','','','',64,47,0.00,'2026-01-10 16:01:55',1),(40,'الدوليه','customer','','','','',63,47,0.00,'2026-01-11 20:17:51',3),(41,'امل الطرشوبي','customer','','','','',4,47,0.00,'2026-01-12 20:29:47',1),(42,'بلبع','customer','','','','',37,47,0.00,'2026-01-12 20:48:07',1),(43,'ايناس الشابوري','customer','','','','',37,47,0.00,'2026-01-12 20:52:11',1),(44,'عابدين','customer','','','','',37,47,0.00,'2026-01-13 10:17:42',3),(45,'يارا عزام','customer','','','','',37,47,0.00,'2026-01-13 20:51:03',1),(46,'صبري عوض','customer','','','','',37,47,0.00,'2026-01-13 20:59:43',1),(47,'رأفت عزمي','customer','','','','',37,47,0.00,'2026-01-13 21:04:06',1),(48,'العماوي','customer','','','','',38,47,0.00,'2026-01-13 21:07:59',2),(50,'وائل سمير','customer','','','','',38,47,0.00,'2026-01-13 21:12:51',1),(51,'صحتك','customer','','','','',20,47,0.00,'2026-01-13 21:16:57',1),(52,'شيماء ابو المعاطي','customer','','','','',21,47,0.00,'2026-01-13 21:20:52',9),(53,'رشا الشواف','customer','','','','',4,47,0.00,'2026-01-13 21:28:02',9),(54,'صادق صفوت','customer','','','','',37,47,0.00,'2026-01-13 21:31:03',1),(55,'الجامعه','customer','','','','',37,47,0.00,'2026-01-13 21:35:02',1),(56,'براديس','customer','','','','',37,47,0.00,'2026-01-13 21:38:01',1),(57,'مستشفى السيده العذراء','customer','','','','',37,47,0.00,'2026-01-13 21:40:46',7),(58,'رضا الشيخ','customer','','','','',63,47,0.00,'2026-01-13 21:45:11',3),(59,'اسامه عثمان','customer','','','','',48,47,0.00,'2026-01-13 21:53:00',2),(60,'ايمان مصطفى','customer','','','','',37,47,0.00,'2026-01-13 21:56:44',1),(61,'شركة النيل','customer','','','منية النصر','',8,47,0.00,'2026-01-13 21:59:01',3),(62,'ساهر داود','customer','','','','',37,47,0.00,'2026-01-14 09:39:46',1),(63,'سامح وليام-اندرو مجدي','customer','','','','',37,47,0.00,'2026-01-14 10:04:24',1),(64,'سحر الديب','customer','','','','',37,47,0.00,'2026-01-17 08:52:37',1),(65,'عمرو عبد اللطيف','customer','','','','',37,47,0.00,'2026-01-17 08:56:09',1),(66,'الزغبي','customer','','','','',21,47,0.00,'2026-01-17 11:11:39',1),(67,'خالد عيسى','customer','','','','',56,47,0.00,'2026-01-18 14:42:15',1),(68,'ساره مزروع','customer','','','','',4,47,0.00,'2026-01-18 15:05:39',1),(69,'مبيعات نقديه','customer','','','','',55,47,0.00,'2026-01-18 15:11:54',6),(70,'مونت كارلو','customer','','','','',34,47,0.00,'2026-01-20 08:09:12',1),(71,'ماريوت','customer','','','','',37,47,0.00,'2026-01-20 11:20:37',1),(72,'مبيعات نقديه','customer','','','','',37,47,0.00,'2026-01-20 11:32:20',6),(73,'سامي عبد اللطيف','customer','','','','',20,47,0.00,'2026-01-20 11:46:49',1),(74,'مصنع ECC','supplier','','','','',53,62,0.00,'2026-01-20 21:04:15',5),(75,'الامانه','customer','','','','',13,47,0.00,'2026-01-25 11:44:38',1),(76,'ماجد ميشيل','customer','','','','',37,47,0.00,'2026-01-25 19:14:32',1),(77,'شرق المدينه','customer','','','','',37,47,0.00,'2026-01-25 19:20:59',1),(78,'كامل نبيه','customer','','','','',37,47,0.00,'2026-01-27 08:20:30',1),(79,'كريم','customer','','','','',44,47,0.00,'2026-02-03 08:15:45',1),(80,'مبيعات نقديه','customer','','','','',31,47,0.00,'2026-02-03 08:21:51',6),(81,'مبيعات نقديه','customer','','','','',65,47,0.00,'2026-02-04 15:03:54',6),(82,'محمد زين','customer','','','','',43,47,0.00,'2026-02-04 15:08:21',1),(83,'مبيعات نقديه','customer','','','','',66,47,0.00,'2026-02-07 08:44:29',6),(84,'مخزن الدرسات','customer','','','','',4,47,0.00,'2026-02-11 23:33:16',3),(85,'فارم سيتي','customer','','','','',37,47,0.00,'2026-02-12 10:04:33',1),(86,'فرحات','customer','','','','',37,47,0.00,'2026-02-15 09:05:22',1),(87,'منار البردان','customer','','','','',40,47,0.00,'2026-02-15 09:19:05',1),(88,'عادل مكي','customer','','','','',40,47,0.00,'2026-02-15 09:25:08',1),(89,'ابتسام محمد','customer','','','','',63,47,0.00,'2026-02-15 10:18:04',1),(90,'مخزن نيفين','customer','','','','',41,47,0.00,'2026-02-15 11:06:32',3),(91,'صيدلية الشريف','customer','','','','',40,47,0.00,'2026-02-16 09:27:22',1),(92,'صيدلية روشتة','customer','','','','',40,47,0.00,'2026-02-16 09:28:15',1),(93,'شركة ال هويدي فارما لتجارة وتوزيع الادوية','customer','','','الاسكندرية - قسم المنتزة- صيدليه الدواء مخازن محمد رجب بجوار جامعه فاروس اخر كوبري 14 مايو اول مخزن شركة ال هويدي سموحه','',37,47,0.00,'2026-02-17 22:34:37',3),(94,'بثينه','customer','','','','',37,47,0.00,'2026-02-18 09:23:54',1),(95,'صيدلية هادي','customer','','','','',41,47,0.00,'2026-02-19 15:04:11',1),(96,'صيدلية المدينه','customer','','','','',41,47,0.00,'2026-02-19 15:04:52',1),(97,'مبيعات نقديه','customer','','','','',3,47,0.00,'2026-02-21 08:56:31',6);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party_categories`
--

LOCK TABLES `party_categories` WRITE;
/*!40000 ALTER TABLE `party_categories` DISABLE KEYS */;
INSERT INTO `party_categories` VALUES (1,'صيدليه'),(2,'سلسله'),(3,'مخزن'),(4,'مورد'),(5,'مصنع'),(6,'عميل'),(7,'مستشفى'),(9,'عياده');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nurivina Argan Oil 100ml',1,330.00,1,'2025-12-13 15:00:23',0.00),(2,'Nurivina Argan Oil Hair Serum 100ml',1,430.00,1,'2025-12-13 15:01:00',0.00),(3,'Nurivina Omega Anti-Hair Loss Shampoo 220ml',1,250.00,1,'2025-12-13 15:01:39',0.00),(4,'Nurivina Argan oil Leave in Conditioner 220ml',1,270.00,1,'2025-12-13 15:02:34',0.00),(5,'Nurivina whitening Cream 50gm',1,240.00,1,'2025-12-13 15:03:07',0.00),(6,'Nurivina Anti-Hair Loss Spray 100ml',1,520.00,1,'2025-12-13 15:04:41',0.00),(10,'Nurivina Anti-Dandruff Shampoo 150ml',1,220.00,1,'2026-01-03 20:26:00',0.00),(11,'150ML PET Forsted Bottle Neck 24',2,0.00,2,'2026-01-20 15:52:31',0.00),(12,'Attractive Pump Neck 24 Black',2,0.00,1,'2026-01-20 15:53:29',0.00),(13,'Nurivina Face Glow Cleasing Gel 150ML Bottle',2,0.00,2,'2026-01-20 15:54:52',0.00),(14,'Nurivina Anti Dandruff Shampoo 150ML Bottle',2,0.00,2,'2026-01-20 15:56:06',0.00),(15,'Nurivina Face Glow Cleasing Gel 150ML',1,180.00,1,'2026-01-20 16:05:28',46.82),(16,'Nurivina Argan oil Leave in Conditioner 180ml',1,270.00,1,'2026-02-21 08:27:45',39.70);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoice_items`
--

LOCK TABLES `purchase_invoice_items` WRITE;
/*!40000 ALTER TABLE `purchase_invoice_items` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoice_payments`
--

LOCK TABLES `purchase_invoice_payments` WRITE;
/*!40000 ALTER TABLE `purchase_invoice_payments` DISABLE KEYS */;
INSERT INTO `purchase_invoice_payments` VALUES (1,1,'2026-01-31','bank_transfer',43,40020.00,NULL,NULL,'2026-02-15 14:43:12','2026-02-15 14:43:12',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoices`
--

LOCK TABLES `purchase_invoices` WRITE;
/*!40000 ALTER TABLE `purchase_invoices` DISABLE KEYS */;
INSERT INTO `purchase_invoices` VALUES (1,74,NULL,'PI-2026-000001','2026-01-01',NULL,'','opening','partially_paid',0.00,0.00,0.00,0.00,0.00,0.00,259115.00,'2026-01-21 10:10:37','2026-02-15 14:43:12');
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
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_types`
--

LOCK TABLES `reference_types` WRITE;
/*!40000 ALTER TABLE `reference_types` DISABLE KEYS */;
INSERT INTO `reference_types` VALUES (16,'sales_invoice','فاتورة مبيعات','قيود فواتير المبيعات','2026-01-01 07:10:00','2026-01-01 07:10:00'),(17,'sales_invoice_cost','تكلفة بضاعة مباعة','COGS Journal Entry for Sales Invoice','2026-01-01 07:12:00','2026-01-01 07:12:00'),(18,'sales_return','مرتجع مبيعات','قيود مرتجعات المبيعات','2026-01-01 07:14:00','2026-01-01 07:14:00'),(19,'credit_note','إشعار دائن','تسجيل إشعارات الدائنين أو العملاء','2026-01-01 07:16:00','2026-01-01 07:16:00'),(20,'debit_note','إشعار مدين','تسجيل إشعارات المدينين أو العملاء','2026-01-01 07:18:00','2026-01-01 07:18:00'),(21,'purchase_invoice','فاتورة مشتريات','قيود فواتير المشتريات','2026-01-01 07:20:00','2026-01-01 07:20:00'),(22,'purchase_return','مرتجع مشتريات','قيود مرتجعات المشتريات','2026-01-01 07:22:00','2026-01-01 07:22:00'),(23,'supplier_advance','دفعة مقدمة للمورد','تسجيل دفعات مقدمة للموردين','2026-01-01 07:24:00','2026-01-01 07:24:00'),(24,'inventory_purchase','شراء مخزون','تسجيل شراء المخزون للسلع','2026-01-01 07:26:00','2026-01-01 07:26:00'),(25,'inventory_sale','بيع مخزون','تسجيل بيع المخزون للسلع','2026-01-01 07:28:00','2026-01-01 07:28:00'),(26,'inventory_return','مرتجع مخزون','تسجيل المرتجعات من المخزون للعملاء أو الموردين','2026-01-01 07:30:00','2026-01-01 07:30:00'),(27,'inventory_adjustment','تسوية مخزنية','Inventory Adjustment Transaction','2026-01-01 07:32:00','2026-01-01 07:32:00'),(28,'inventory_transfer','نقل مخزون','تسجيل نقل المخزون بين المخازن','2026-01-01 07:34:00','2026-01-01 07:34:00'),(29,'inventory_count','جرد مخزون','تسجيل نتائج الجرد الدوري للمخزون','2026-01-01 07:36:00','2026-01-01 07:36:00'),(30,'write_off','شطب أصول','تسجيل شطب الأصول أو المخزون غير الصالح','2026-01-01 07:38:00','2026-01-01 07:38:00'),(31,'payment','دفعة مالية','تسجيل مدفوعات نقدية أو تحويلات','2026-01-01 07:40:00','2026-01-01 07:40:00'),(32,'receipt','إيصال استلام نقدية','تسجيل المقبوضات النقدية أو التحويلات','2026-01-01 07:42:00','2026-01-01 07:42:00'),(33,'bank_transfer','تحويل بنكي','تسجيل التحويلات البنكية بين الحسابات','2026-01-01 07:44:00','2026-01-01 07:44:00'),(34,'cash_withdrawal','سحب نقدي','تسجيل عمليات سحب النقدية من الحسابات','2026-01-01 07:46:00','2026-01-01 07:46:00'),(35,'cash_deposit','إيداع نقدي','تسجيل إيداعات نقدية في الحسابات','2026-01-01 07:48:00','2026-01-01 07:48:00'),(36,'bank_fee','رسوم بنكية','تسجيل الرسوم المصروفة على الحسابات البنكية','2026-01-01 07:50:00','2026-01-01 07:50:00'),(37,'expense_invoice','فاتورة مصاريف','قيود فواتير المصاريف التشغيلية','2026-01-01 07:52:00','2026-01-01 07:52:00'),(38,'petty_cash_expense','مصروف صندوق الصغير','تسجيل مصروفات صندوق الصغير','2026-01-01 07:54:00','2026-01-01 07:54:00'),(39,'utilities_payment','دفع خدمات','تسجيل المدفوعات لفواتير الخدمات مثل الكهرباء والماء','2026-01-01 07:56:00','2026-01-01 07:56:00'),(40,'utilities_expense','مصاريف خدمات','تسجيل المصروفات المستحقة لفواتير الخدمات','2026-01-01 07:58:00','2026-01-01 07:58:00'),(41,'misc_income','دخل متفرّق','تسجيل الدخل غير المصنف ضمن فئات أخرى','2026-01-01 08:00:00','2026-01-01 08:00:00'),(42,'misc_expense','مصروف متفرّق','تسجيل المصروفات غير المصنفة ضمن فئات أخرى','2026-01-01 08:02:00','2026-01-01 08:02:00'),(43,'prepaid_expense','مصروف مدفوع مسبقاً','تسجيل المصروفات المدفوعة مسبقًا','2026-01-01 08:04:00','2026-01-01 08:04:00'),(44,'accrued_expense','مصروف مستحق','تسجيل المصروفات المستحقة لم يتم دفعها بعد','2026-01-01 08:06:00','2026-01-01 08:06:00'),(45,'accrued_income','دخل مستحق','تسجيل الإيرادات المستحقة لم يتم تحصيلها بعد','2026-01-01 08:08:00','2026-01-01 08:08:00'),(46,'prepaid_income','دخل مدفوع مسبقاً','تسجيل الإيرادات المدفوعة مسبقًا','2026-01-01 08:10:00','2026-01-01 08:10:00'),(47,'fixed_asset_purchase','شراء أصل ثابت','تسجيل شراء الأصول الثابتة','2026-01-01 08:12:00','2026-01-01 08:12:00'),(48,'fixed_asset_depreciation','استهلاك أصل ثابت','تسجيل استهلاك الأصول الثابتة','2026-01-01 08:14:00','2026-01-01 08:14:00'),(49,'revaluation_gain','ربح إعادة تقييم','تسجيل أرباح إعادة تقييم الأصول','2026-01-01 08:16:00','2026-01-01 08:16:00'),(50,'revaluation_loss','خسارة إعادة تقييم','تسجيل خسائر إعادة تقييم الأصول','2026-01-01 08:18:00','2026-01-01 08:18:00'),(51,'interest_income','دخل فوائد','تسجيل الدخل الناتج عن الفوائد البنكية','2026-01-01 08:20:00','2026-01-01 08:20:00'),(52,'interest_expense','مصروف فوائد','تسجيل مصروفات الفوائد على القروض','2026-01-01 08:22:00','2026-01-01 08:22:00'),(53,'insurance_payment','دفع تأمين','تسجيل دفعات التأمينات المختلفة','2026-01-01 08:24:00','2026-01-01 08:24:00'),(54,'insurance_claim','مطالبة تأمين','تسجيل المطالبات المستلمة من شركات التأمين','2026-01-01 08:26:00','2026-01-01 08:26:00'),(55,'salary_payment','صرف رواتب','تسجيل صرف الرواتب الشهرية للموظفين','2026-01-01 08:28:00','2026-01-01 08:28:00'),(56,'bonus_payment','صرف مكافآت','تسجيل صرف المكافآت والمزايا للموظفين','2026-01-01 08:30:00','2026-01-01 08:30:00'),(57,'staff_advance','سلفة موظف','تسجيل السلف المقدمة للموظفين','2026-01-01 08:32:00','2026-01-01 08:32:00'),(58,'staff_advance_settlement','تسوية سلفة موظف','تسجيل تسوية السلف المستلمة من الموظفين','2026-01-01 08:34:00','2026-01-01 08:34:00'),(59,'expense_claim','مطالبة مصروف','تسجيل المطالبات بالمصاريف من الموظفين','2026-01-01 08:36:00','2026-01-01 08:36:00'),(60,'loan_payment','سداد قرض','تسجيل دفعات سداد القروض البنكية','2026-01-01 08:38:00','2026-01-01 08:38:00'),(61,'loan_receipt','استلام قرض','تسجيل استلام مبلغ قرض من البنك أو المقرض','2026-01-01 08:40:00','2026-01-01 08:40:00'),(62,'loan_interest_accrual','استحقاق فوائد قرض','تسجيل فوائد القروض المستحقة لم يتم دفعها بعد','2026-01-01 08:42:00','2026-01-01 08:42:00'),(63,'loan_principal_accrual','استحقاق أصل قرض','تسجيل أصل القروض المستحق لم يتم دفعه بعد','2026-01-01 08:44:00','2026-01-01 08:44:00'),(64,'bad_debt_writeoff','شطب ديون معدومة','تسجيل شطب الديون المستحقة غير القابلة للتحصيل','2026-01-01 08:46:00','2026-01-01 08:46:00'),(65,'capital_injection','إدخال رأس المال','تسجيل استثمار المالك في الشركة','2026-01-01 08:48:00','2026-01-01 08:48:00'),(66,'capital_withdrawal','سحب رأس المال','تسجيل سحب المالك لرأس المال','2026-01-01 08:50:00','2026-01-01 08:50:00'),(67,'dividend_payment','توزيع أرباح','تسجيل دفع الأرباح للمساهمين','2026-01-01 08:52:00','2026-01-01 08:52:00'),(68,'dividend_receipt','استلام أرباح','تسجيل استلام الأرباح من الاستثمارات','2026-01-01 08:54:00','2026-01-01 08:54:00'),(69,'profit_distribution','توزيع أرباح داخلي','تسجيل توزيع الأرباح بين الأقسام أو الشركاء','2026-01-01 08:56:00','2026-01-01 08:56:00'),(70,'foreign_exchange_gain','ربح صرف أجنبي','تسجيل أرباح فروق العملة الأجنبية','2026-01-01 08:58:00','2026-01-01 08:58:00'),(71,'foreign_exchange_loss','خسارة صرف أجنبي','تسجيل خسائر فروق العملة الأجنبية','2026-01-01 09:00:00','2026-01-01 09:00:00'),(72,'provision','مخصصات','تسجيل المخصصات للمصروفات المستقبلية','2026-01-01 09:02:00','2026-01-01 09:02:00'),(73,'opening_balance','رصيد افتتاحي','قيود الأرصدة الافتتاحية','2026-01-05 08:07:07','2026-01-05 08:07:07'),(74,'sales_payment','تحصيل مبيعات','Journal Entry for Sales Payment/Collection','2026-01-06 00:52:38','2026-01-06 00:52:38'),(75,'manual_entry','قيد يدوي','قيد يومية يدوي','2026-01-10 09:07:33','2026-01-10 09:07:33'),(76,'issue_voucher','سند صرف مخزني','Journal Entry for Issue Voucher','2026-01-11 21:45:15','2026-01-11 21:45:15'),(77,'sales_return_cost','تكلفة مرتجع مبيعات','Cost Reversal for Sales Returns','2026-01-17 08:09:40','2026-01-17 08:09:40'),(78,'sales_invoice_opening','فاتورة افتتاحية','قيود فواتير المبيعات الافتتاحية','2026-01-17 08:22:48','2026-01-17 08:22:48'),(79,'expense','مصروف','قيود المصروفات','2026-01-20 08:42:27','2026-01-20 08:42:27'),(80,'purchase_invoice_opening','فاتورة افتتاحية','قيود فواتير المشتريات الافتتاحية','2026-01-21 09:54:30','2026-01-21 09:54:30'),(81,'external_job_order_issue','أمر تشغيل خارجي - صرف','Journal Entry for External Job Order (Material Issue)','2026-02-01 12:31:46','2026-02-01 12:31:46'),(82,'service_invoice','فاتورة خدمة','Service Invoice for External Job Order','2026-02-05 19:20:41','2026-02-05 19:20:41'),(83,'purchase_payment','سداد مشتريات','Journal Entry for Purchase Payment','2026-02-15 14:43:12','2026-02-15 14:43:12'),(84,'external_job_order_receive','أمر تشغيل خارجي - استلام','Journal Entry for External Job Order (Finished Goods Receipt)','2026-02-16 09:09:07','2026-02-16 09:09:07');
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
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'VAT rate per item',
  `vat_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'VAT amount per item',
  PRIMARY KEY (`id`),
  KEY `sales_invoice_id` (`sales_invoice_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_si_items_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_si_items_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_invoice_items_ibfk_1` FOREIGN KEY (`sales_invoice_id`) REFERENCES `sales_invoices` (`id`),
  CONSTRAINT `sales_invoice_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
INSERT INTO `sales_invoice_items` VALUES (1,1,3,1,250.00,75.00,0.00,0.00,2,0,0.00,0.00),(2,2,2,1,430.00,129.00,0.00,0.00,2,0,0.00,0.00),(3,3,5,4,240.00,144.00,0.00,0.00,2,0,0.00,0.00),(4,4,2,50,430.00,8299.00,0.00,0.00,2,0,14.00,1848.14),(5,4,10,50,220.00,4246.00,0.00,0.00,2,0,14.00,945.56),(6,4,6,10,520.00,2007.20,0.00,0.00,2,0,14.00,446.99),(7,5,6,3,520.00,234.00,0.00,0.00,2,0,0.00,0.00),(8,6,1,2,330.00,165.00,0.00,0.00,2,0,0.00,0.00),(9,7,2,3,430.00,258.00,0.00,0.00,2,1,0.00,0.00),(10,7,4,3,270.00,162.00,0.00,0.00,2,0,0.00,0.00),(11,7,6,4,520.00,416.00,0.00,0.00,2,0,0.00,0.00),(12,8,3,20,250.00,2500.00,0.00,0.00,2,0,0.00,0.00),(13,8,4,20,270.00,2700.00,0.00,0.00,2,0,0.00,0.00),(14,8,10,20,220.00,2200.00,0.00,0.00,2,0,0.00,0.00),(15,9,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(16,9,2,10,430.00,1075.00,0.00,0.00,2,1,0.00,0.00),(17,10,10,30,220.00,1968.78,0.00,0.00,2,3,14.00,648.37),(18,11,6,20,520.00,4014.40,0.00,0.00,2,0,14.00,893.98),(19,11,1,20,330.00,2547.60,0.00,0.00,2,0,14.00,567.34),(20,11,2,10,430.00,1659.80,0.00,0.00,2,0,14.00,369.63),(21,11,3,20,250.00,1930.00,0.00,0.00,2,0,14.00,429.80),(22,11,5,35,240.00,3242.40,0.00,0.00,2,0,14.00,722.06),(23,12,1,20,330.00,990.00,0.00,0.00,2,1,0.00,0.00),(24,12,6,2,520.00,156.00,0.00,0.00,2,0,0.00,0.00),(25,12,10,2,220.00,66.00,0.00,0.00,2,0,0.00,0.00),(26,13,2,20,430.00,1892.00,0.00,0.00,2,2,0.00,0.00),(27,13,4,10,270.00,594.00,0.00,0.00,2,1,0.00,0.00),(28,13,10,10,220.00,484.00,0.00,0.00,2,1,0.00,0.00),(29,14,10,10,220.00,330.00,0.00,0.00,2,1,0.00,0.00),(30,14,2,10,430.00,645.00,0.00,0.00,2,1,0.00,0.00),(31,14,4,10,270.00,405.00,0.00,0.00,2,1,0.00,0.00),(32,14,3,10,250.00,375.00,0.00,0.00,2,1,0.00,0.00),(33,15,2,10,430.00,1204.00,0.00,0.00,2,0,0.00,0.00),(34,16,10,20,220.00,660.00,0.00,0.00,2,1,0.00,0.00),(35,17,2,1,430.00,107.50,0.00,0.00,2,0,0.00,0.00),(36,17,4,1,270.00,67.50,0.00,0.00,2,0,0.00,0.00),(37,18,3,4,250.00,300.00,0.00,0.00,2,0,0.00,0.00),(38,19,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(39,21,2,25,430.00,2150.00,0.00,0.00,3,0,0.00,0.00),(40,21,6,5,520.00,520.00,0.00,0.00,3,0,0.00,0.00),(41,22,1,30,330.00,2970.00,0.00,0.00,3,6,14.00,970.20),(42,23,3,30,250.00,2250.00,0.00,0.00,3,6,14.00,735.00),(43,24,2,10,430.00,860.00,0.00,0.00,2,0,0.00,0.00),(44,24,4,10,270.00,540.00,0.00,0.00,2,0,0.00,0.00),(45,24,6,10,520.00,1040.00,0.00,0.00,2,0,0.00,0.00),(46,24,10,10,220.00,440.00,0.00,0.00,2,0,0.00,0.00),(47,25,1,15,330.00,742.50,0.00,0.00,2,3,0.00,0.00),(48,25,6,5,400.00,300.00,0.00,0.00,2,0,0.00,0.00),(49,28,1,20,330.00,1518.00,0.00,0.00,2,1,0.00,0.00),(50,28,2,20,430.00,1978.00,0.00,0.00,2,1,0.00,0.00),(51,29,2,20,430.00,1720.00,0.00,0.00,2,0,0.00,0.00),(52,30,1,10,330.00,660.00,0.00,0.00,2,1,0.00,0.00),(53,30,2,10,430.00,860.00,0.00,0.00,2,1,0.00,0.00),(54,43,10,5,220.00,275.00,0.00,0.00,3,0,0.00,0.00),(55,72,10,20,220.00,880.00,0.00,0.00,3,0,0.00,0.00),(56,73,6,3,520.00,234.00,0.00,0.00,3,0,0.00,0.00),(57,74,10,20,220.00,1412.40,0.00,0.00,3,0,14.00,418.26),(58,75,1,10,330.00,660.00,0.00,0.00,3,0,0.00,0.00),(59,76,2,10,430.00,860.00,0.00,0.00,3,0,0.00,0.00),(60,77,5,10,240.00,480.00,0.00,0.00,3,0,0.00,0.00),(61,78,10,12,220.00,528.00,0.00,0.00,3,0,0.00,0.00),(62,79,6,3,520.00,429.94,0.00,0.00,3,0,0.00,0.00),(63,80,2,10,430.00,1075.00,0.00,0.00,3,0,0.00,0.00),(64,15,1,10,330.00,924.00,0.00,0.00,2,0,0.00,0.00),(65,15,3,5,250.00,350.00,0.00,0.00,2,0,0.00,0.00),(66,83,2,10,430.00,860.00,0.00,0.00,2,0,0.00,0.00),(67,83,3,6,250.00,300.00,0.00,0.00,2,0,0.00,0.00),(68,83,10,2,220.00,88.00,0.00,0.00,2,0,0.00,0.00),(69,83,6,2,520.00,208.00,0.00,0.00,2,0,0.00,0.00),(70,84,2,2,430.00,129.00,0.00,0.00,2,0,0.00,0.00),(71,84,6,3,520.00,234.00,0.00,0.00,2,0,0.00,0.00),(72,85,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(73,86,5,30,240.00,1800.00,0.00,0.00,2,3,0.00,0.00),(74,87,6,20,520.00,2600.00,0.00,0.00,2,2,0.00,0.00),(75,88,1,30,330.00,2475.00,0.00,0.00,2,3,0.00,0.00),(76,89,10,20,220.00,1100.00,0.00,0.00,2,2,0.00,0.00),(77,90,4,10,270.00,515.70,0.00,0.00,2,0,0.00,0.00),(78,91,6,10,520.00,780.00,0.00,0.00,2,1,0.00,0.00),(79,91,1,10,330.00,495.00,0.00,0.00,2,1,0.00,0.00),(80,91,5,10,240.00,360.00,0.00,0.00,2,1,0.00,0.00),(81,92,6,3,520.00,296.40,0.00,0.00,2,0,0.00,0.00),(82,92,4,3,270.00,153.90,0.00,0.00,2,0,0.00,0.00),(83,93,6,2,520.00,197.60,0.00,0.00,2,0,0.00,0.00),(84,93,10,2,220.00,83.60,0.00,0.00,2,0,0.00,0.00),(85,94,6,2,440.00,176.00,0.00,0.00,2,0,0.00,0.00),(86,95,5,1,240.00,96.00,0.00,0.00,2,0,0.00,0.00),(87,96,6,1,520.00,260.00,0.00,0.00,2,0,0.00,0.00),(88,97,10,1,220.00,66.00,0.00,0.00,2,0,0.00,0.00),(89,98,10,2,220.00,66.00,0.00,0.00,2,0,0.00,0.00),(90,101,2,20,430.00,1720.00,0.00,0.00,3,0,0.00,0.00),(91,101,3,5,250.00,250.00,0.00,0.00,3,0,0.00,0.00),(92,101,10,5,220.00,220.00,0.00,0.00,3,0,0.00,0.00),(93,102,5,20,240.00,720.00,0.00,0.00,3,0,0.00,0.00),(94,103,1,2,330.00,165.00,0.00,0.00,7,0,0.00,0.00),(95,104,2,2,430.00,129.00,0.00,0.00,2,0,0.00,0.00),(96,105,2,2,430.00,129.00,0.00,0.00,2,0,0.00,0.00),(97,106,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(98,107,1,40,330.00,3036.00,0.00,0.00,2,2,0.00,0.00),(99,108,5,2,240.00,120.00,0.00,0.00,2,0,0.00,0.00),(100,109,10,5,220.00,220.00,0.00,0.00,2,0,0.00,0.00),(101,110,6,5,400.00,300.00,0.00,0.00,2,0,0.00,0.00),(102,111,2,3,430.00,258.00,0.00,0.00,2,0,0.00,0.00),(103,112,6,20,520.00,4014.40,0.00,0.00,2,0,14.00,893.98),(104,113,2,1,430.00,64.50,0.00,0.00,3,0,0.00,0.00),(105,114,1,3,330.00,148.50,0.00,0.00,3,0,0.00,0.00),(106,115,2,20,430.00,2408.00,0.00,0.00,2,0,0.00,0.00),(107,115,5,10,240.00,672.00,0.00,0.00,2,0,0.00,0.00),(108,115,4,5,270.00,378.00,0.00,0.00,2,0,0.00,0.00),(109,115,3,10,250.00,700.00,0.00,0.00,2,0,0.00,0.00),(110,116,2,2,430.00,129.00,0.00,0.00,3,0,0.00,0.00),(111,117,4,5,270.00,270.00,0.00,0.00,2,1,0.00,0.00),(112,117,5,5,240.00,240.00,0.00,0.00,2,0,0.00,0.00),(113,117,2,20,430.00,1720.00,0.00,0.00,2,2,0.00,0.00),(114,118,2,20,430.00,1720.00,0.00,0.00,2,0,0.00,0.00),(115,119,6,10,520.00,1300.00,0.00,0.00,2,1,0.00,0.00),(116,120,5,20,240.00,960.00,0.00,0.00,1,4,0.00,0.00),(117,120,6,10,520.00,1040.00,0.00,0.00,1,2,0.00,0.00),(118,120,10,10,220.00,440.00,0.00,0.00,1,2,0.00,0.00),(119,121,2,12,430.00,1656.36,0.00,0.00,3,0,14.00,490.51),(120,121,5,12,240.00,924.48,0.00,0.00,3,0,14.00,273.77),(121,121,3,10,250.00,802.50,0.00,0.00,3,0,14.00,237.65),(122,121,4,6,270.00,520.02,0.00,0.00,3,0,14.00,154.00),(123,121,6,5,520.00,834.60,0.00,0.00,3,0,14.00,247.16),(124,122,10,3,220.00,162.82,0.00,0.00,2,0,0.00,0.00),(125,122,6,2,520.00,231.40,0.00,0.00,2,0,0.00,0.00),(126,122,2,3,430.00,318.24,0.00,0.00,2,0,0.00,0.00),(127,122,3,2,250.00,122.50,0.00,0.00,2,0,0.00,0.00),(128,123,6,4,520.00,312.00,0.00,0.00,2,0,0.00,0.00),(129,124,5,30,240.00,1440.00,0.00,0.00,1,6,0.00,0.00),(130,125,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(131,126,4,2,270.00,0.00,0.00,0.00,2,0,0.00,0.00),(132,127,6,32,520.00,3780.61,0.00,0.00,2,0,0.00,0.00),(133,128,4,10,270.00,540.00,0.00,0.00,2,1,0.00,0.00),(134,128,5,10,240.00,480.00,0.00,0.00,2,1,0.00,0.00),(135,128,6,6,520.00,624.00,0.00,0.00,2,1,0.00,0.00),(136,129,5,10,240.00,600.00,0.00,0.00,2,1,0.00,0.00),(137,129,4,10,270.00,675.00,0.00,0.00,2,1,0.00,0.00),(138,130,3,5,250.00,187.50,0.00,0.00,2,0,0.00,0.00),(139,131,1,5,330.00,247.50,0.00,0.00,2,0,0.00,0.00),(140,131,6,5,520.00,390.00,0.00,0.00,2,0,0.00,0.00),(141,131,10,5,220.00,165.00,0.00,0.00,2,0,0.00,0.00),(142,131,3,10,250.00,375.00,0.00,0.00,2,0,0.00,0.00),(143,131,2,10,430.00,645.00,0.00,0.00,2,0,0.00,0.00),(144,131,5,10,240.00,360.00,0.00,0.00,2,0,0.00,0.00),(145,132,4,2,270.00,0.00,0.00,0.00,2,0,0.00,0.00),(146,133,10,1,220.00,110.00,0.00,0.00,7,0,0.00,0.00),(147,134,5,10,240.00,480.00,0.00,0.00,2,1,0.00,0.00),(148,134,6,6,520.00,624.00,0.00,0.00,2,1,0.00,0.00),(149,134,4,10,270.00,540.00,0.00,0.00,2,1,0.00,0.00),(150,135,1,25,330.00,1650.00,0.00,0.00,3,0,0.00,0.00),(151,136,1,10,330.00,660.00,0.00,0.00,2,1,0.00,0.00),(152,137,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(153,138,2,1,430.00,64.50,0.00,0.00,2,0,0.00,0.00),(154,138,3,1,250.00,37.50,0.00,0.00,2,0,0.00,0.00),(155,138,5,2,240.00,72.00,0.00,0.00,2,0,0.00,0.00),(156,139,2,5,430.00,430.00,0.00,0.00,2,0,0.00,0.00),(157,140,4,3,270.00,202.50,0.00,0.00,6,0,0.00,0.00),(158,140,1,2,330.00,165.00,0.00,0.00,6,0,0.00,0.00),(159,140,6,5,520.00,650.00,0.00,0.00,6,0,0.00,0.00),(160,140,10,6,220.00,315.08,0.00,0.00,6,0,0.00,0.00),(161,141,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(162,142,3,1,250.00,0.00,0.00,0.00,2,0,0.00,0.00),(163,143,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(164,143,5,1,0.00,0.00,0.00,0.00,2,0,0.00,0.00),(165,144,4,5,270.00,270.00,0.00,0.00,2,0,0.00,0.00),(166,145,1,20,330.00,1518.00,0.00,0.00,2,1,0.00,0.00),(167,146,5,2,240.00,96.00,0.00,0.00,2,0,0.00,0.00),(168,146,3,15,250.00,750.00,0.00,0.00,2,0,0.00,0.00),(169,146,2,6,430.00,516.00,0.00,0.00,2,0,0.00,0.00),(170,147,1,20,330.00,1848.00,0.00,0.00,2,0,0.00,0.00),(171,147,6,10,520.00,1456.00,0.00,0.00,2,0,0.00,0.00),(172,147,3,10,250.00,700.00,0.00,0.00,2,0,0.00,0.00),(173,148,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(174,149,5,1,240.00,36.00,0.00,0.00,3,0,0.00,0.00),(175,150,3,4,250.00,150.00,0.00,0.00,3,0,0.00,0.00),(176,151,5,10,240.00,720.00,0.00,0.00,3,2,14.00,235.20),(177,152,5,10,240.00,720.00,0.00,0.00,3,2,14.00,235.20),(178,153,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(179,153,10,10,220.00,550.00,0.00,0.00,2,1,0.00,0.00),(180,153,6,20,520.00,2600.00,0.00,0.00,2,2,0.00,0.00),(181,154,1,20,330.00,1650.00,0.00,0.00,2,0,0.00,0.00),(182,155,3,10,250.00,500.00,0.00,0.00,2,1,0.00,0.00),(183,155,1,10,330.00,660.00,0.00,0.00,2,1,0.00,0.00),(184,155,2,20,430.00,1720.00,0.00,0.00,2,2,0.00,0.00),(185,156,1,1,330.00,132.00,0.00,0.00,6,0,0.00,0.00),(186,156,4,1,270.00,108.00,0.00,0.00,6,0,0.00,0.00),(187,157,4,1,270.00,81.00,0.00,0.00,6,0,0.00,0.00),(188,158,1,10,330.00,660.00,0.00,0.00,2,1,0.00,0.00),(189,158,2,10,430.00,860.00,0.00,0.00,2,1,0.00,0.00),(190,158,3,10,250.00,500.00,0.00,0.00,2,1,0.00,0.00),(191,158,4,10,270.00,540.00,0.00,0.00,2,1,0.00,0.00),(192,158,5,10,240.00,480.00,0.00,0.00,2,1,0.00,0.00),(193,158,6,10,520.00,1040.00,0.00,0.00,2,1,0.00,0.00),(194,158,10,10,220.00,440.00,0.00,0.00,2,1,0.00,0.00),(195,159,4,10,270.00,613.44,0.00,0.00,2,0,0.00,0.00),(196,159,6,10,520.00,1181.44,0.00,0.00,2,0,0.00,0.00),(197,160,5,3,240.00,144.00,0.00,0.00,2,0,0.00,0.00),(198,160,3,6,250.00,300.00,0.00,0.00,2,0,0.00,0.00),(199,160,2,4,430.00,344.00,0.00,0.00,2,0,0.00,0.00),(200,161,6,2,520.00,156.00,0.00,0.00,2,0,0.00,0.00),(201,161,4,2,270.00,81.00,0.00,0.00,2,0,0.00,0.00),(202,162,3,10,250.00,375.00,0.00,0.00,2,0,0.00,0.00),(203,163,10,2,220.00,44.00,0.00,0.00,3,0,0.00,0.00),(204,164,10,2,220.00,66.00,0.00,0.00,3,0,0.00,0.00),(205,165,2,25,430.00,2150.00,0.00,0.00,3,0,0.00,0.00),(206,166,6,5,520.00,520.00,0.00,0.00,2,0,0.00,0.00),(207,166,10,5,220.00,220.00,0.00,0.00,2,0,0.00,0.00),(208,167,3,3,250.00,249.98,0.00,0.00,2,0,0.00,0.00),(209,168,6,10,520.00,1144.00,0.00,0.00,2,1,0.00,0.00),(210,169,1,5,330.00,247.50,0.00,0.00,2,0,0.00,0.00),(211,169,2,5,430.00,322.50,0.00,0.00,2,0,0.00,0.00),(212,169,3,2,250.00,75.00,0.00,0.00,2,0,0.00,0.00),(213,169,10,2,220.00,66.00,0.00,0.00,2,0,0.00,0.00),(214,170,1,10,330.00,495.00,0.00,0.00,3,1,0.00,0.00),(215,171,1,1,330.00,49.50,0.00,0.00,3,0,0.00,0.00),(216,171,2,1,430.00,64.50,0.00,0.00,3,0,0.00,0.00),(217,171,5,1,240.00,36.00,0.00,0.00,3,0,0.00,0.00),(218,172,1,2,330.00,99.00,0.00,0.00,2,0,0.00,0.00),(219,172,2,2,430.00,129.00,0.00,0.00,2,0,0.00,0.00),(220,172,6,2,520.00,156.00,0.00,0.00,2,0,0.00,0.00),(221,173,6,3,520.00,234.00,0.00,0.00,2,0,0.00,0.00),(222,174,1,1,330.00,82.50,0.00,0.00,2,0,0.00,0.00),(223,174,2,1,430.00,107.50,0.00,0.00,2,0,0.00,0.00),(224,174,3,1,250.00,62.50,0.00,0.00,2,0,0.00,0.00),(225,174,4,1,270.00,67.50,0.00,0.00,2,0,0.00,0.00),(226,174,5,1,240.00,60.00,0.00,0.00,2,0,0.00,0.00),(227,174,6,1,520.00,130.00,0.00,0.00,2,0,0.00,0.00),(228,174,10,1,220.00,55.00,0.00,0.00,2,0,0.00,0.00),(229,176,6,10,520.00,780.00,0.00,0.00,2,0,0.00,0.00),(230,177,3,10,250.00,625.00,0.00,0.00,2,1,0.00,0.00),(231,177,4,10,270.00,675.00,0.00,0.00,2,1,0.00,0.00),(232,177,2,10,430.00,1075.00,0.00,0.00,2,1,0.00,0.00),(233,177,15,10,180.00,450.00,0.00,0.00,2,1,0.00,0.00),(234,178,6,2,520.00,156.00,0.00,0.00,2,0,0.00,0.00),(235,179,5,1,240.00,43.20,0.00,0.00,2,0,0.00,0.00),(236,179,1,1,330.00,59.40,0.00,0.00,2,0,0.00,0.00),(237,179,2,1,430.00,77.40,0.00,0.00,2,0,0.00,0.00),(238,179,4,1,270.00,48.60,0.00,0.00,2,0,0.00,0.00),(239,179,6,3,520.00,280.80,0.00,0.00,2,0,0.00,0.00),(240,180,3,8,250.00,560.00,0.00,0.00,2,0,0.00,0.00),(241,180,4,16,270.00,1209.60,0.00,0.00,2,0,0.00,0.00),(242,180,5,10,240.00,672.00,0.00,0.00,2,0,0.00,0.00),(243,180,15,5,180.00,252.00,0.00,0.00,2,0,0.00,0.00),(244,181,6,30,520.00,4653.48,0.00,0.00,2,3,14.00,1532.51),(245,181,5,20,240.00,1431.84,0.00,0.00,2,2,14.00,471.54),(246,181,2,20,430.00,2565.38,0.00,0.00,2,2,14.00,844.85),(247,181,10,10,220.00,656.26,0.00,0.00,2,1,14.00,216.12),(248,182,15,30,180.00,1610.82,0.00,0.00,2,3,14.00,530.49),(249,183,15,30,180.00,2084.40,0.00,0.00,2,0,14.00,464.18),(250,184,15,10,180.00,396.00,0.00,0.00,2,1,0.00,0.00),(251,185,6,3,520.00,234.00,0.00,0.00,3,0,0.00,0.00),(252,186,5,3,240.00,0.00,0.00,0.00,2,0,0.00,0.00),(253,187,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(254,188,15,10,180.00,360.00,0.00,0.00,2,1,0.00,0.00),(255,188,10,10,220.00,440.00,0.00,0.00,2,1,0.00,0.00),(256,189,1,6,330.00,495.00,0.00,0.00,3,0,0.00,0.00),(257,189,4,4,270.00,270.00,0.00,0.00,3,0,0.00,0.00),(258,189,2,8,430.00,860.00,0.00,0.00,3,0,0.00,0.00),(259,189,3,9,250.00,562.50,0.00,0.00,3,0,0.00,0.00),(260,189,6,6,520.00,780.00,0.00,0.00,3,0,0.00,0.00),(261,189,5,9,240.00,540.00,0.00,0.00,3,0,0.00,0.00),(262,190,1,1,330.00,49.50,0.00,0.00,3,0,0.00,0.00),(263,190,5,3,240.00,108.00,0.00,0.00,3,0,0.00,0.00),(264,190,6,2,520.00,156.00,0.00,0.00,3,0,0.00,0.00),(265,191,15,10,180.00,360.00,0.00,0.00,2,1,0.00,0.00),(266,192,10,2,220.00,88.00,0.00,0.00,6,0,0.00,0.00),(267,192,2,1,430.00,86.00,0.00,0.00,6,0,0.00,0.00),(268,192,4,1,270.00,54.00,0.00,0.00,6,0,0.00,0.00),(269,192,6,1,520.00,104.00,0.00,0.00,6,0,0.00,0.00),(270,193,2,12,430.00,1032.00,0.00,0.00,3,0,0.00,0.00),(271,194,6,12,520.00,1248.00,0.00,0.00,3,0,0.00,0.00),(272,195,3,12,250.00,600.00,0.00,0.00,3,0,0.00,0.00),(273,196,2,2,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(274,197,5,1,240.00,0.00,0.00,0.00,2,0,0.00,0.00),(275,198,2,1,430.00,0.00,0.00,0.00,2,0,0.00,0.00),(276,199,2,2,430.00,172.00,0.00,0.00,2,0,0.00,0.00),(277,199,4,2,270.00,108.00,0.00,0.00,2,0,0.00,0.00),(278,200,2,3,430.00,258.00,0.00,0.00,2,0,0.00,0.00),(279,201,5,4,240.00,144.00,0.00,0.00,3,0,0.00,0.00);
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
  `withholding_tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة خصم المنبع',
  `withholding_tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'قيمة خصم المنبع',
  PRIMARY KEY (`id`),
  KEY `idx_sales_invoice_id` (`sales_invoice_id`),
  KEY `idx_account_id` (`account_id`),
  KEY `fk_sip_employee` (`employee_id`),
  CONSTRAINT `fk_sip_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `chk_amount_positive` CHECK ((`amount` >= 0.01))
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_payments`
--

LOCK TABLES `sales_invoice_payments` WRITE;
/*!40000 ALTER TABLE `sales_invoice_payments` DISABLE KEYS */;
INSERT INTO `sales_invoice_payments` VALUES (1,1,'2026-01-03','cash',43,175.00,NULL,'','2026-01-14 08:43:44','2026-01-14 08:43:44',NULL,0.00,0.00),(2,2,'2026-01-04','cash',41,301.00,NULL,'','2026-01-14 08:44:33','2026-01-14 08:44:33',NULL,0.00,0.00),(3,3,'2026-01-07','cash',42,816.00,NULL,'','2026-01-14 08:45:44','2026-01-14 08:45:44',NULL,0.00,0.00),(4,5,'2026-01-06','cash',42,1326.00,NULL,'','2026-01-14 08:46:43','2026-01-14 08:46:43',NULL,0.00,0.00),(5,6,'2026-01-06','cash',42,560.00,NULL,'','2026-01-14 08:49:14','2026-01-14 08:49:14',NULL,0.00,0.00),(6,12,'2026-01-12','cash',42,6661.96,NULL,'','2026-01-14 08:52:27','2026-01-14 08:52:27',NULL,0.00,0.00),(7,17,'2026-01-12','cash',42,525.00,NULL,'','2026-01-14 09:15:15','2026-01-14 09:15:15',NULL,0.00,0.00),(8,18,'2026-01-12','cash',42,765.00,NULL,'','2026-01-14 09:16:28','2026-01-14 09:16:28',NULL,0.00,0.00),(9,19,'2026-01-13','cash',42,2475.00,NULL,'','2026-01-14 09:17:54','2026-01-14 09:17:54',NULL,0.00,0.00),(10,25,'2026-01-13','cash',42,5907.50,NULL,'','2026-01-15 17:09:58','2026-01-15 17:09:58',NULL,0.00,0.00),(11,30,'2026-01-13','cash',41,6080.00,NULL,'','2026-01-15 17:11:39','2026-01-15 17:11:39',4,0.00,0.00),(12,20,'2026-01-06','cash',41,1630.00,NULL,'','2026-01-17 08:28:48','2026-01-17 08:28:48',4,0.00,0.00),(13,66,'2026-01-14','cash',41,12000.00,NULL,'','2026-01-17 08:31:34','2026-01-17 08:31:34',4,0.00,0.00),(14,64,'2026-01-13','cash',41,12000.00,NULL,'','2026-01-17 08:38:37','2026-01-17 08:38:37',4,0.00,0.00),(15,26,'2026-01-06','cash',43,34411.43,NULL,'','2026-01-17 08:41:13','2026-01-17 08:41:13',4,0.00,0.00),(16,27,'2026-01-06','cash',43,4585.00,NULL,'','2026-01-17 08:43:29','2026-01-17 08:43:29',4,0.00,0.00),(17,31,'2026-01-12','cash',41,18000.00,NULL,'','2026-01-17 08:45:27','2026-01-17 08:45:27',4,0.00,0.00),(18,73,'2026-01-13','cash',41,1286.22,NULL,'','2026-01-17 10:52:08','2026-01-17 10:52:08',7,0.00,0.00),(19,79,'2026-01-15','cash',41,1130.06,NULL,'','2026-01-17 11:24:39','2026-01-17 11:24:39',7,0.00,0.00),(20,85,'2026-01-15','cash',42,505.00,NULL,'','2026-01-17 12:16:19','2026-01-17 12:16:19',NULL,0.00,0.00),(21,45,'2026-01-10','cash',41,8600.00,NULL,'','2026-01-17 14:14:18','2026-01-17 14:14:18',7,0.00,0.00),(22,45,'2026-01-10','cash',41,4360.00,NULL,'','2026-01-17 14:14:47','2026-01-17 14:14:47',7,0.00,0.00),(23,21,'2026-01-10','cash',41,10680.00,NULL,'','2026-01-17 14:16:09','2026-01-17 14:16:09',7,0.00,0.00),(24,71,'2026-01-06','cash',41,3465.00,NULL,'','2026-01-17 14:19:44','2026-01-17 14:19:44',7,0.00,0.00),(25,84,'2026-01-17','cash',42,1995.29,NULL,'','2026-01-17 15:12:18','2026-01-17 15:12:18',NULL,0.00,0.00),(26,48,'2026-01-17','cash',42,884.00,NULL,'','2026-01-17 15:14:12','2026-01-17 15:14:12',NULL,0.00,0.00),(27,94,'2026-01-18','cash',41,704.00,NULL,'','2026-01-18 15:07:16','2026-01-18 15:07:16',2,0.00,0.00),(28,97,'2026-01-18','cash',41,154.00,NULL,'','2026-01-18 15:24:45','2026-01-18 15:24:45',6,0.00,0.00),(29,62,'2026-01-19','cash',41,6075.00,NULL,'','2026-01-20 08:19:26','2026-01-20 08:19:26',4,0.00,0.00),(30,64,'2026-01-19','cash',41,5000.00,NULL,'','2026-01-20 08:23:01','2026-01-20 08:23:01',4,0.00,0.00),(31,67,'2026-01-19','cash',41,3000.00,NULL,'','2026-01-20 08:30:18','2026-01-20 08:30:18',4,0.00,0.00),(32,103,'2026-01-16','bank_transfer',43,495.00,NULL,'','2026-01-20 11:36:17','2026-01-20 11:36:17',3,0.00,0.00),(33,102,'2026-01-19','cash',41,3957.60,NULL,'','2026-01-20 11:40:55','2026-01-20 11:40:55',7,0.00,0.00),(34,108,'2026-01-21','cash',42,360.00,NULL,'','2026-01-24 08:29:36','2026-01-24 08:29:36',NULL,0.00,0.00),(35,105,'2026-01-21','cash',42,731.00,NULL,'','2026-01-24 08:36:20','2026-01-24 08:36:20',NULL,0.00,0.00),(36,104,'2026-01-21','cash',42,731.00,NULL,'','2026-01-24 08:37:21','2026-01-24 08:37:21',NULL,0.00,0.00),(37,54,'2026-01-21','cash',41,3720.00,NULL,'','2026-01-24 08:39:50','2026-01-24 08:39:50',4,0.00,0.00),(38,27,'2026-01-25','cheque',43,30380.00,NULL,'','2026-01-25 11:30:12','2026-01-25 11:30:12',4,0.00,0.00),(39,69,'2026-01-25','cash',41,1850.00,NULL,'','2026-01-25 12:49:35','2026-01-25 12:49:35',7,0.00,0.00),(41,113,'2026-01-21','cash',41,354.54,NULL,'','2026-01-25 19:18:11','2026-01-25 19:18:11',7,0.00,0.00),(42,114,'2026-01-24','cash',41,816.25,NULL,'','2026-01-25 19:24:07','2026-01-25 19:24:07',7,0.00,0.00),(43,111,'2026-01-26','cash',42,1032.00,NULL,'','2026-01-27 08:08:55','2026-01-27 08:08:55',NULL,0.00,0.00),(44,110,'2026-01-26','cash',42,1649.00,NULL,'','2026-01-27 08:09:44','2026-01-27 08:09:44',NULL,0.00,0.00),(45,66,'2026-01-26','cash',41,8500.00,NULL,'','2026-01-27 08:14:55','2026-01-27 08:14:55',4,0.00,0.00),(46,71,'2026-01-26','cash',41,3465.00,NULL,'','2026-01-27 08:44:08','2026-01-27 08:44:08',7,0.00,0.00),(47,53,'2026-01-26','cash',41,21840.00,NULL,'','2026-01-27 09:02:34','2026-01-27 09:02:34',1,0.00,0.00),(48,122,'2026-01-28','cash',41,2655.03,NULL,'','2026-01-29 22:57:16','2026-01-29 22:57:16',2,0.00,0.00),(49,123,'2026-01-29','cash',42,1714.96,NULL,'','2026-01-29 23:00:57','2026-01-29 23:00:57',NULL,0.00,0.00),(50,96,'2026-01-28','cash',41,260.00,NULL,'','2026-01-29 23:03:13','2026-01-29 23:03:13',2,0.00,0.00),(51,42,'2026-01-29','cash',41,8400.00,NULL,'','2026-01-31 09:15:58','2026-01-31 09:15:58',1,0.00,0.00),(52,46,'2026-01-25','cheque',43,26217.00,NULL,'','2026-02-01 14:14:29','2026-02-01 14:14:29',7,0.00,0.00),(53,125,'2026-02-02','cash',42,505.00,NULL,'','2026-02-03 08:08:52','2026-02-03 08:08:52',NULL,0.00,0.00),(54,126,'2026-02-01','cash',42,540.00,NULL,'','2026-02-03 08:09:52','2026-02-03 08:09:52',NULL,0.00,0.00),(55,133,'2026-01-21','cash',41,110.00,NULL,'','2026-02-03 11:40:40','2026-02-03 11:40:40',3,0.00,0.00),(56,130,'2026-02-03','cash',42,1009.37,NULL,'','2026-02-04 09:30:31','2026-02-04 09:30:31',NULL,0.00,0.00),(57,132,'2026-02-03','cash',42,615.00,NULL,'','2026-02-04 09:31:29','2026-02-04 09:31:29',NULL,0.00,0.00),(58,26,'2026-02-04','cheque',44,18947.93,NULL,'','2026-02-04 09:33:35','2026-02-04 09:33:35',4,0.00,0.00),(59,116,'2026-01-26','cash',41,709.07,NULL,'','2026-02-04 09:57:34','2026-02-04 09:57:34',7,0.00,0.00),(60,41,'2026-02-03','cash',41,7630.00,NULL,'','2026-02-04 10:11:24','2026-02-04 10:11:24',7,0.00,0.00),(61,117,'2026-01-31','cash',41,6000.00,NULL,'','2026-02-04 11:30:26','2026-02-04 11:30:26',4,0.00,0.00),(62,117,'2026-01-31','cash',41,2920.00,NULL,'','2026-02-04 14:43:36','2026-02-04 14:43:36',4,0.00,0.00),(63,140,'2026-02-04','cash',41,4057.00,NULL,'','2026-02-04 15:31:37','2026-02-04 15:31:37',6,0.00,0.00),(64,137,'2026-02-05','cash',42,505.00,NULL,'','2026-02-07 09:02:38','2026-02-07 09:02:38',NULL,0.00,0.00),(65,138,'2026-02-05','cash',42,986.00,NULL,'','2026-02-07 09:04:16','2026-02-07 09:04:16',NULL,0.00,0.00),(66,54,'2026-02-07','cash',41,5000.00,NULL,'','2026-02-08 09:09:07','2026-02-08 09:09:07',4,0.00,0.00),(67,143,'2026-02-08','cash',42,430.00,NULL,'','2026-02-09 09:12:39','2026-02-09 09:12:39',NULL,0.00,0.00),(68,66,'2026-02-08','cash',41,6982.00,NULL,'','2026-02-09 09:31:18','2026-02-09 09:31:18',4,0.00,0.00),(69,15,'2026-02-08','cash',41,3018.00,NULL,'','2026-02-09 09:32:33','2026-02-09 09:32:33',4,0.00,0.00),(70,34,'2026-02-09','cash',41,5000.00,NULL,'','2026-02-10 08:17:34','2026-02-10 08:17:34',4,0.00,0.00),(71,64,'2026-02-09','cash',41,3695.00,NULL,'','2026-02-10 08:19:51','2026-02-10 08:19:51',4,0.00,0.00),(72,14,'2026-02-09','cash',41,6305.00,NULL,'','2026-02-10 08:21:43','2026-02-10 08:21:43',4,0.00,0.00),(73,149,'2026-02-03','cash',41,197.88,NULL,'','2026-02-10 09:25:42','2026-02-10 09:25:42',7,0.00,0.00),(74,150,'2026-02-03','cash',41,824.50,NULL,'','2026-02-10 09:29:00','2026-02-10 09:29:00',7,0.00,0.00),(75,70,'2026-02-10','cash',41,5000.00,NULL,'','2026-02-11 08:10:58','2026-02-11 08:10:58',4,0.00,0.00),(76,58,'2026-02-10','cash',41,13660.00,NULL,'','2026-02-11 08:11:58','2026-02-11 08:11:58',4,0.00,0.00),(77,9,'2026-02-10','cash',41,5700.00,NULL,'','2026-02-11 08:13:10','2026-02-11 08:13:10',4,0.00,0.00),(78,106,'2026-02-10','cash',41,640.00,NULL,'','2026-02-11 08:14:15','2026-02-11 08:14:15',4,0.00,0.00),(79,156,'2026-02-10','bank_transfer',43,360.00,NULL,'','2026-02-11 23:26:54','2026-02-11 23:26:54',6,0.00,0.00),(80,157,'2026-02-11','bank_transfer',43,189.00,NULL,'','2026-02-11 23:29:28','2026-02-11 23:29:28',6,0.00,0.00),(81,161,'2026-02-10','cash',42,1302.71,NULL,'','2026-02-12 00:21:48','2026-02-12 00:21:48',NULL,0.00,0.00),(82,82,'2026-02-08','cash',41,2320.00,NULL,'','2026-02-12 10:00:39','2026-02-12 10:00:39',3,0.00,0.00),(83,164,'2026-02-11','cash',41,363.00,NULL,'','2026-02-12 10:17:20','2026-02-12 10:17:20',7,0.00,0.00),(84,31,'2026-02-11','cash',41,17387.00,NULL,'','2026-02-12 11:59:46','2026-02-12 11:59:46',4,0.00,0.00),(85,28,'2026-02-11','cash',41,2613.00,NULL,'','2026-02-12 12:01:06','2026-02-12 12:01:06',4,0.00,0.00),(86,54,'2026-02-11','cash',41,5000.00,NULL,'','2026-02-12 12:34:29','2026-02-12 12:34:29',4,0.00,0.00),(87,155,'2026-02-11','cash',41,11520.00,NULL,'','2026-02-14 08:27:58','2026-02-14 08:27:58',4,0.00,0.00),(88,167,'2026-02-14','cash',41,500.02,NULL,'','2026-02-15 08:40:21','2026-02-15 08:40:21',4,0.00,0.00),(89,171,'2026-02-14','cash',41,825.00,NULL,'','2026-02-15 09:09:30','2026-02-15 09:09:30',7,0.00,0.00),(90,131,'2026-02-14','cash',41,4300.00,NULL,'','2026-02-15 09:53:59','2026-02-15 09:53:59',NULL,0.00,0.00),(91,68,'2026-02-16','cash',41,1635.00,NULL,'','2026-02-17 08:54:27','2026-02-17 08:54:27',4,0.00,0.00),(92,15,'2026-02-16','cash',41,3354.00,NULL,'','2026-02-17 10:24:08','2026-02-17 12:29:24',4,0.00,0.00),(93,115,'2026-02-16','cash',41,3146.00,NULL,'','2026-02-17 10:24:58','2026-02-17 10:24:58',4,0.00,0.00),(94,169,'2026-02-12','cash',42,3827.55,NULL,'','2026-02-17 11:02:07','2026-02-17 11:02:07',NULL,0.00,0.00),(95,162,'2026-02-12','cash',42,2018.75,NULL,'','2026-02-17 11:03:22','2026-02-17 11:03:22',NULL,0.00,0.00),(96,148,'2026-02-10','cash',42,505.00,NULL,'','2026-02-17 11:03:47','2026-02-17 11:03:47',NULL,0.00,0.00),(97,142,'2026-02-10','cash',42,325.00,NULL,'','2026-02-17 11:04:51','2026-02-17 11:04:51',NULL,0.00,0.00),(98,101,'2026-02-15','cash',41,8760.00,NULL,'','2026-02-19 15:11:24','2026-02-19 15:11:24',7,0.00,0.00),(99,46,'2026-02-15','cheque',43,23314.00,NULL,'','2026-02-19 15:25:21','2026-02-19 15:25:21',7,0.00,0.00),(100,175,'2026-02-16','cash',41,1300.00,NULL,'','2026-02-19 15:45:38','2026-02-19 15:45:38',8,0.00,0.00),(101,38,'2026-02-18','cash',41,1904.60,NULL,'','2026-02-19 17:43:53','2026-02-19 17:43:53',7,0.00,0.00),(102,39,'2026-02-18','cash',41,3830.00,NULL,'','2026-02-19 17:45:41','2026-02-19 17:45:41',7,0.00,0.00),(103,63,'2026-02-18','cash',41,8500.00,NULL,'','2026-02-19 17:48:11','2026-02-19 17:48:11',8,0.00,0.00),(104,179,'2026-02-18','cash',41,2320.60,NULL,'','2026-02-19 17:49:17','2026-02-19 17:49:17',8,0.00,0.00),(105,174,'2026-02-18','cash',41,247.50,NULL,'','2026-02-19 17:50:01','2026-02-19 17:50:01',8,0.00,0.00),(106,190,'2026-02-15','cash',41,1776.50,NULL,'','2026-02-19 17:51:11','2026-02-19 17:51:11',7,0.00,0.00),(107,34,'2026-02-18','cash',41,2000.00,NULL,'','2026-02-19 18:27:34','2026-02-19 18:27:34',4,0.00,0.00),(108,201,'2026-02-18','cash',41,790.00,NULL,'','2026-02-21 12:06:31','2026-02-21 12:06:31',7,0.00,0.00);
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
  `invoice_status` enum('draft','approved','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `status` enum('unpaid','paid','partial') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `sales_order_id` int DEFAULT NULL,
  `party_id` int NOT NULL,
  `invoice_date` date NOT NULL DEFAULT (curdate()),
  `due_date` date DEFAULT NULL,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_by` enum('شركة شحن','مندوب') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'شركة شحن',
  `account_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `employee_id` int DEFAULT NULL,
  `distributor_employee_id` int DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `subtotal` decimal(18,2) NOT NULL DEFAULT '0.00',
  `additional_discount` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT 'خصم إضافي على مستوى الفاتورة',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة ضريبة القيمة المضافة',
  `vat_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'أي ضريبة أخرى',
  `tax_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `invoice_type` enum('normal','opening') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `sales_order_id` (`sales_order_id`),
  KEY `party_id` (`party_id`),
  KEY `account_id` (`account_id`),
  KEY `fk_employee_id` (`employee_id`),
  KEY `fk_sales_invoices_warehouse` (`warehouse_id`),
  KEY `fk_distributor_employee_id` (`distributor_employee_id`),
  CONSTRAINT `fk_distributor_employee_id` FOREIGN KEY (`distributor_employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_sales_invoices_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `sales_invoices_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`),
  CONSTRAINT `sales_invoices_ibfk_2` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `sales_invoices_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
INSERT INTO `sales_invoices` VALUES (1,'SI-2026-000001','approved','paid',NULL,28,'2026-01-03',NULL,0.00,'مندوب',NULL,'2026-01-10 14:26:57',5,NULL,2,175.00,0.00,0.00,0.00,0.00,0.00,175.00,'normal',''),(2,'SI-2026-000002','approved','paid',NULL,28,'2026-01-04',NULL,0.00,'مندوب',NULL,'2026-01-10 14:31:39',5,NULL,2,301.00,0.00,0.00,0.00,0.00,0.00,301.00,'normal',''),(3,'SI-2026-000003','approved','paid',NULL,8,'2026-01-04',NULL,0.00,'مندوب',NULL,'2026-01-10 14:33:45',3,NULL,2,816.00,0.00,0.00,0.00,0.00,0.00,816.00,'normal',''),(4,'SI-2026-000004','approved','unpaid',NULL,1,'2026-01-04',NULL,0.00,'مندوب',NULL,'2026-01-10 14:35:21',5,NULL,2,23147.80,0.00,0.00,3240.69,0.00,0.00,26388.49,'normal',''),(5,'SI-2026-000005','approved','paid',NULL,8,'2026-01-05',NULL,0.00,'مندوب',NULL,'2026-01-10 14:37:42',3,NULL,2,1326.00,0.00,0.00,0.00,0.00,0.00,1326.00,'normal',''),(6,'SI-2026-000006','approved','paid',NULL,30,'2026-01-05',NULL,65.00,'شركة شحن',NULL,'2026-01-10 14:39:22',3,NULL,2,495.00,0.00,0.00,0.00,0.00,0.00,560.00,'normal','كريم علي بلال'),(7,'SI-2026-000007','approved','unpaid',NULL,27,'2026-01-06',NULL,0.00,'مندوب',NULL,'2026-01-10 14:40:45',5,NULL,2,3344.00,0.00,0.00,0.00,0.00,0.00,3344.00,'normal',''),(8,'SI-2026-000008','approved','unpaid',NULL,29,'2026-01-06',NULL,0.00,'مندوب',NULL,'2026-01-10 14:42:13',5,NULL,2,7400.00,0.00,0.00,0.00,0.00,0.00,7400.00,'normal',''),(9,'SI-2026-000009','approved','paid',NULL,4,'2026-01-06',NULL,0.00,'مندوب',NULL,'2026-01-10 14:45:54',5,NULL,2,5700.00,0.00,0.00,0.00,0.00,0.00,5700.00,'normal',''),(10,'SI-2026-000010','approved','unpaid',NULL,26,'2026-01-06',NULL,0.00,'مندوب',NULL,'2026-01-10 14:48:09',5,NULL,2,4631.22,0.00,0.00,648.37,0.00,0.00,5279.59,'normal',''),(11,'SI-2026-000011','approved','unpaid',NULL,1,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-10 14:51:55',5,NULL,2,21305.80,0.00,0.00,2982.81,0.00,0.00,24288.61,'normal',''),(12,'SI-2026-000012','approved','paid',NULL,31,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-10 14:55:02',5,NULL,2,6868.00,206.04,0.00,0.00,0.00,0.00,6661.96,'normal',''),(13,'SI-2026-000013','approved','unpaid',NULL,2,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-10 14:58:39',5,NULL,2,10530.00,0.00,0.00,0.00,0.00,0.00,10530.00,'normal',''),(14,'SI-2026-000014','approved','partial',NULL,12,'2026-01-11',NULL,0.00,'مندوب',NULL,'2026-01-10 15:01:51',6,NULL,2,9945.00,0.00,0.00,0.00,0.00,0.00,9945.00,'normal',''),(15,'SI-2026-000015','approved','paid',NULL,10,'2026-01-14',NULL,0.00,'مندوب',NULL,'2026-01-10 15:03:27',2,NULL,2,6372.00,0.00,0.00,0.00,0.00,0.00,6372.00,'normal',''),(16,'SI-2026-000016','approved','unpaid',NULL,11,'2026-01-13',NULL,0.00,'مندوب',NULL,'2026-01-10 15:04:32',6,NULL,2,3740.00,0.00,0.00,0.00,0.00,0.00,3740.00,'normal',''),(17,'SI-2026-000017','approved','paid',NULL,32,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-10 15:16:56',1,NULL,2,525.00,0.00,0.00,0.00,0.00,0.00,525.00,'normal','مروة الطنطاوى'),(18,'SI-2026-000018','approved','paid',NULL,33,'2026-01-10',NULL,65.00,'شركة شحن',NULL,'2026-01-10 15:56:44',1,NULL,2,700.00,0.00,0.00,0.00,0.00,0.00,765.00,'normal','مي عادل'),(19,'SI-2026-000019','approved','paid',NULL,34,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-10 16:02:45',1,NULL,2,2475.00,0.00,0.00,0.00,0.00,0.00,2475.00,'normal',''),(20,'SI-2026-000020','approved','paid',NULL,27,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-10 16:19:21',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1630.00,'opening',''),(21,'SI-2026-000021','approved','paid',NULL,7,'2026-01-04',NULL,0.00,'مندوب',NULL,'2026-01-11 08:55:42',3,NULL,3,10680.00,0.00,0.00,0.00,0.00,0.00,10680.00,'normal',''),(22,'SI-2026-000022','approved','unpaid',NULL,24,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-11 08:57:36',3,NULL,3,6930.00,0.00,0.00,970.20,0.00,0.00,7900.20,'normal',''),(23,'SI-2026-000023','approved','unpaid',NULL,24,'2026-01-10',NULL,0.00,'مندوب',NULL,'2026-01-11 08:59:47',3,NULL,3,5250.00,0.00,0.00,735.00,0.00,0.00,5985.00,'normal',''),(24,'SI-2026-000024','approved','unpaid',NULL,40,'2026-01-11',NULL,0.00,'مندوب',NULL,'2026-01-11 20:21:29',3,NULL,2,11520.00,0.00,0.00,0.00,0.00,0.00,11520.00,'normal',''),(25,'SI-2026-000025','approved','paid',NULL,19,'2026-01-11',NULL,0.00,'مندوب',NULL,'2026-01-11 20:30:26',3,NULL,2,5907.50,0.00,0.00,0.00,0.00,0.00,5907.50,'normal',''),(26,'SI-2026-000026','approved','partial',NULL,1,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-11 20:54:04',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,54165.99,'opening',''),(27,'SI-2026-000027','approved','partial',NULL,2,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-11 20:56:54',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,34968.00,'opening',''),(28,'SI-2026-000028','approved','partial',NULL,16,'2026-01-12',NULL,0.00,'مندوب',NULL,'2026-01-12 08:09:59',1,NULL,2,11704.00,0.00,0.00,0.00,0.00,0.00,11704.00,'normal',''),(29,'SI-2026-000029','approved','unpaid',NULL,15,'2026-01-12',NULL,0.00,'مندوب',NULL,'2026-01-12 08:20:15',1,NULL,2,6880.00,0.00,0.00,0.00,0.00,0.00,6880.00,'normal',''),(30,'SI-2026-000030','approved','paid',NULL,17,'2026-01-12',NULL,0.00,'مندوب',NULL,'2026-01-12 08:21:53',1,NULL,2,6080.00,0.00,0.00,0.00,0.00,0.00,6080.00,'normal',''),(31,'SI-2026-000031','approved','paid',NULL,16,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 19:59:01',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,35387.00,'opening',''),(32,'SI-2026-000032','approved','unpaid',NULL,17,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:17:51',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,6230.00,'opening',''),(33,'SI-2026-000033','approved','unpaid',NULL,26,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:22:50',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,71674.43,'opening',''),(34,'SI-2026-000034','approved','partial',NULL,5,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:26:46',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,12623.00,'opening',''),(35,'SI-2026-000035','approved','unpaid',NULL,41,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:31:10',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,637.00,'opening',''),(36,'SI-2026-000036','approved','unpaid',NULL,14,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:34:49',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,4296.70,'opening',''),(37,'SI-2026-000037','approved','unpaid',NULL,23,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:35:48',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,3354.00,'opening',''),(38,'SI-2026-000038','approved','paid',NULL,24,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:39:55',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1904.60,'opening',''),(39,'SI-2026-000039','approved','partial',NULL,25,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:42:52',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,27497.20,'opening',''),(40,'SI-2026-000040','approved','unpaid',NULL,9,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:44:39',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,9234.09,'opening',''),(41,'SI-2026-000041','approved','partial',NULL,42,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:49:22',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,15296.00,'opening',''),(42,'SI-2026-000042','approved','paid',NULL,43,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-12 20:53:00',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,8400.00,'opening',''),(43,'SI-2026-000043','approved','unpaid',NULL,44,'2026-01-13',NULL,0.00,'مندوب',NULL,'2026-01-13 10:18:46',3,NULL,3,825.00,0.00,0.00,0.00,0.00,0.00,825.00,'normal',''),(44,'SI-2026-000044','approved','unpaid',NULL,45,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 20:51:49',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1419.90,'opening',''),(45,'SI-2026-000045','approved','paid',NULL,7,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 20:54:12',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,12960.00,'opening',''),(46,'SI-2026-000046','approved','partial',NULL,6,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 20:56:39',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,49750.53,'opening',''),(47,'SI-2026-000047','approved','unpaid',NULL,46,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:00:49',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1030.00,'opening',''),(48,'SI-2026-000048','approved','paid',NULL,8,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:01:44',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,884.00,'opening',''),(49,'SI-2026-000049','approved','unpaid',NULL,47,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:04:58',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,2316.00,'opening',''),(50,'SI-2026-000050','approved','unpaid',NULL,48,'2026-01-13',NULL,0.00,'مندوب',NULL,'2026-01-13 21:09:48',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,6867.00,'opening',''),(51,'SI-2026-000051','approved','unpaid',NULL,50,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:13:49',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,7166.00,'opening',''),(52,'SI-2026-000052','approved','unpaid',NULL,51,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:17:41',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1775.25,'opening',''),(53,'SI-2026-000053','approved','partial',NULL,52,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:22:05',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,21840.01,'opening',''),(54,'SI-2026-000054','approved','partial',NULL,15,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:25:44',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,26680.00,'opening',''),(55,'SI-2026-000055','approved','unpaid',NULL,18,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:26:25',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,7200.00,'opening',''),(56,'SI-2026-000056','approved','unpaid',NULL,53,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:29:05',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,3119.00,'opening',''),(57,'SI-2026-000057','approved','unpaid',NULL,54,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:31:39',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,4100.00,'opening',''),(58,'SI-2026-000058','approved','paid',NULL,4,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:32:43',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,13660.00,'opening',''),(59,'SI-2026-000059','approved','unpaid',NULL,55,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:35:53',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1600.00,'opening',''),(60,'SI-2026-000060','approved','unpaid',NULL,56,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:39:11',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,569.50,'opening',''),(61,'SI-2026-000061','approved','unpaid',NULL,57,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:41:42',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,536.00,'opening',''),(62,'SI-2026-000062','approved','partial',NULL,3,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:43:01',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,18975.00,'opening',''),(63,'SI-2026-000063','approved','partial',NULL,58,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:46:00',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,16650.00,'opening',''),(64,'SI-2026-000064','approved','paid',NULL,12,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:47:17',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,20695.00,'opening',''),(65,'SI-2026-000065','approved','unpaid',NULL,13,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:48:55',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,4590.00,'opening',''),(66,'SI-2026-000066','approved','paid',NULL,10,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:50:07',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,27482.00,'opening',''),(67,'SI-2026-000067','approved','partial',NULL,11,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:51:28',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,16230.00,'opening',''),(68,'SI-2026-000068','approved','partial',NULL,59,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:54:17',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,10125.00,'opening',''),(69,'SI-2026-000069','approved','partial',NULL,60,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 21:57:26',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,2640.00,'opening',''),(70,'SI-2026-000070','approved','partial',NULL,61,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 22:00:44',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,6975.00,'opening',''),(71,'SI-2026-000071','approved','partial',NULL,44,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-13 22:02:29',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,11115.00,'opening',''),(72,'SI-2026-000072','approved','unpaid',NULL,25,'2026-01-26',NULL,0.00,'مندوب',NULL,'2026-01-14 09:37:25',3,7,3,3520.00,176.00,0.00,0.00,0.00,0.00,3344.00,'normal',''),(73,'SI-2026-000073','approved','paid',NULL,62,'2026-01-13',NULL,0.00,'مندوب',NULL,'2026-01-14 09:41:03',3,NULL,3,1326.00,39.78,0.00,0.00,0.00,0.00,1286.22,'normal',''),(74,'SI-2026-000074','approved','unpaid',NULL,6,'2026-01-14',NULL,0.00,'مندوب',NULL,'2026-01-14 09:46:30',3,NULL,3,2987.60,0.00,0.00,418.26,0.00,0.00,3405.86,'normal',''),(75,'SI-2026-000075','approved','unpaid',NULL,42,'2026-01-14',NULL,0.00,'مندوب',NULL,'2026-01-14 09:51:36',3,NULL,3,2640.00,0.00,0.00,0.00,0.00,0.00,2640.00,'normal',''),(76,'SI-2026-000076','approved','unpaid',NULL,42,'2026-01-14',NULL,0.00,'مندوب',NULL,'2026-01-14 09:52:43',3,NULL,3,3440.00,0.00,0.00,0.00,0.00,0.00,3440.00,'normal',''),(77,'SI-2026-000077','approved','unpaid',NULL,42,'2026-01-14',NULL,0.00,'مندوب',NULL,'2026-01-14 09:54:30',3,NULL,3,1920.00,0.00,0.00,0.00,0.00,0.00,1920.00,'normal',''),(78,'SI-2026-000078','approved','unpaid',NULL,42,'2026-01-13',NULL,0.00,'مندوب',NULL,'2026-01-14 09:55:47',3,NULL,3,2112.00,0.00,0.00,0.00,0.00,0.00,2112.00,'normal',''),(79,'SI-2026-000079','approved','paid',NULL,63,'2026-01-15',NULL,0.00,'مندوب',NULL,'2026-01-14 10:06:23',3,NULL,3,1130.06,0.00,0.00,0.00,0.00,0.00,1130.06,'normal',''),(80,'SI-2026-000080','approved','unpaid',NULL,44,'2026-01-13',NULL,0.00,'مندوب',NULL,'2026-01-14 10:09:15',3,NULL,3,3225.00,0.00,0.00,0.00,0.00,0.00,3225.00,'normal',''),(81,'SI-2026-000081','approved','unpaid',NULL,64,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-17 08:53:23',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1258.00,'opening',''),(82,'SI-2026-000082','approved','paid',NULL,65,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-17 08:56:52',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,2320.00,'opening',''),(83,'SI-2026-000083','approved','unpaid',NULL,66,'2026-01-17',NULL,0.00,'مندوب',NULL,'2026-01-17 11:14:11',1,NULL,2,5824.00,291.20,0.00,0.00,0.00,0.00,5532.80,'normal',''),(84,'SI-2026-000084','approved','paid',NULL,8,'2026-01-15',NULL,0.00,'مندوب',NULL,'2026-01-17 12:08:34',3,NULL,2,2057.00,61.71,0.00,0.00,0.00,0.00,1995.29,'normal',''),(85,'SI-2026-000085','approved','paid',NULL,33,'2026-01-15',NULL,75.00,'شركة شحن',NULL,'2026-01-17 12:14:11',1,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,505.00,'normal','منتهى حاتم'),(86,'SI-2026-000086','approved','unpaid',NULL,3,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 11:39:06',5,NULL,2,5400.00,0.00,0.00,0.00,0.00,0.00,5400.00,'normal',''),(87,'SI-2026-000087','approved','unpaid',NULL,3,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 11:40:04',5,NULL,2,7800.00,0.00,0.00,0.00,0.00,0.00,7800.00,'normal',''),(88,'SI-2026-000088','approved','unpaid',NULL,3,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 11:40:49',5,NULL,2,7425.00,0.00,0.00,0.00,0.00,0.00,7425.00,'normal',''),(89,'SI-2026-000089','approved','unpaid',NULL,3,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 11:41:36',5,NULL,2,3300.00,0.00,0.00,0.00,0.00,0.00,3300.00,'normal',''),(90,'SI-2026-000090','approved','unpaid',NULL,11,'2026-01-19',NULL,0.00,'مندوب',NULL,'2026-01-18 12:45:45',6,NULL,2,2184.30,0.00,0.00,0.00,0.00,0.00,2184.30,'normal',''),(91,'SI-2026-000091','approved','unpaid',NULL,12,'2026-01-19',NULL,0.00,'مندوب',NULL,'2026-01-18 12:49:17',6,NULL,2,9265.00,0.00,0.00,0.00,0.00,0.00,9265.00,'normal',''),(92,'SI-2026-000092','approved','unpaid',NULL,67,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 14:43:12',6,NULL,2,1919.70,0.00,0.00,0.00,0.00,0.00,1919.70,'normal',''),(93,'SI-2026-000093','approved','unpaid',NULL,13,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 14:57:08',6,NULL,2,1198.80,0.00,0.00,0.00,0.00,0.00,1198.80,'normal',''),(94,'SI-2026-000094','approved','paid',NULL,68,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 15:06:25',5,NULL,2,704.00,0.00,0.00,0.00,0.00,0.00,704.00,'normal',''),(95,'SI-2026-000095','cancelled','unpaid',NULL,28,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 15:09:34',5,NULL,2,144.00,0.00,0.00,0.00,0.00,0.00,144.00,'normal',''),(96,'SI-2026-000096','approved','paid',NULL,28,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 15:10:48',5,2,2,260.00,0.00,0.00,0.00,0.00,0.00,260.00,'normal',''),(97,'SI-2026-000097','approved','paid',NULL,69,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 15:12:45',6,NULL,2,154.00,0.00,0.00,0.00,0.00,0.00,154.00,'normal',''),(98,'SI-2026-000098','approved','unpaid',NULL,8,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-18 16:17:40',3,NULL,2,374.00,0.00,0.00,0.00,0.00,0.00,374.00,'normal',''),(99,'SI-2026-000099','approved','unpaid',NULL,66,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-20 08:04:13',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,13732.00,'opening',''),(100,'SI-2026-000100','approved','unpaid',NULL,70,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-01-20 08:10:20',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,11761.00,'opening',''),(101,'SI-2026-000101','approved','paid',NULL,7,'2026-01-18',NULL,0.00,'مندوب',NULL,'2026-01-20 11:18:13',3,NULL,3,8760.00,0.00,0.00,0.00,0.00,0.00,8760.00,'normal',''),(102,'SI-2026-000102','approved','paid',NULL,71,'2026-01-19',NULL,0.00,'مندوب',NULL,'2026-01-20 11:22:25',3,NULL,3,4080.00,122.40,0.00,0.00,0.00,0.00,3957.60,'normal',''),(103,'SI-2026-000103','approved','paid',NULL,72,'2026-01-16',NULL,0.00,'مندوب',NULL,'2026-01-20 11:34:30',3,NULL,7,495.00,0.00,0.00,0.00,0.00,0.00,495.00,'normal',''),(104,'SI-2026-000104','approved','paid',NULL,33,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-01-20 11:44:01',1,NULL,2,731.00,0.00,0.00,0.00,0.00,0.00,731.00,'normal','اسامه كمال'),(105,'SI-2026-000105','approved','paid',NULL,73,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-01-20 11:47:33',1,NULL,2,731.00,0.00,0.00,0.00,0.00,0.00,731.00,'normal',''),(106,'SI-2026-000106','approved','partial',NULL,4,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-01-20 13:34:24',5,NULL,2,2475.00,0.00,0.00,0.00,0.00,0.00,2475.00,'normal',''),(107,'SI-2026-000107','approved','unpaid',NULL,16,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-01-20 13:44:32',1,NULL,2,10164.00,0.00,0.00,0.00,0.00,0.00,10164.00,'normal',''),(108,'SI-2026-000108','approved','paid',NULL,33,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-01-20 13:59:00',1,NULL,2,360.00,0.00,0.00,0.00,0.00,0.00,360.00,'normal','يارا محمد'),(109,'SI-2026-000109','approved','unpaid',NULL,17,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-01-20 14:01:08',1,NULL,2,880.00,0.00,0.00,0.00,0.00,0.00,880.00,'normal',''),(110,'SI-2026-000110','approved','paid',NULL,19,'2026-01-25',NULL,0.00,'مندوب',NULL,'2026-01-25 11:28:37',3,NULL,2,1700.00,51.00,0.00,0.00,0.00,0.00,1649.00,'normal',''),(111,'SI-2026-000111','approved','paid',NULL,75,'2026-01-25',NULL,0.00,'مندوب',NULL,'2026-01-25 11:45:37',1,NULL,2,1032.00,0.00,0.00,0.00,0.00,0.00,1032.00,'normal',''),(112,'SI-2026-000112','approved','unpaid',NULL,1,'2026-01-25',NULL,0.00,'مندوب',NULL,'2026-01-25 13:17:02',5,4,2,6385.60,0.00,0.00,893.98,0.00,0.00,7279.58,'normal',''),(113,'SI-2026-000113','approved','paid',NULL,76,'2026-01-21',NULL,0.00,'مندوب',NULL,'2026-01-25 19:17:00',3,7,3,365.50,10.96,0.00,0.00,0.00,0.00,354.54,'normal',''),(114,'SI-2026-000114','approved','paid',NULL,77,'2026-01-24',NULL,0.00,'مندوب',NULL,'2026-01-25 19:22:15',3,7,3,841.50,25.25,0.00,0.00,0.00,0.00,816.25,'normal',''),(115,'SI-2026-000115','approved','partial',NULL,10,'2026-01-26',NULL,0.00,'مندوب',NULL,'2026-01-27 08:11:27',2,4,2,10692.00,0.00,0.00,0.00,0.00,0.00,10692.00,'normal',''),(116,'SI-2026-000116','approved','paid',NULL,78,'2026-01-26',NULL,0.00,'مندوب',NULL,'2026-01-27 08:22:05',3,7,3,731.00,21.93,0.00,0.00,0.00,0.00,709.07,'normal',''),(117,'SI-2026-000117','approved','paid',NULL,17,'2026-01-28',NULL,0.00,'مندوب',NULL,'2026-01-27 11:48:17',1,4,2,8920.00,0.00,0.00,0.00,0.00,0.00,8920.00,'normal',''),(118,'SI-2026-000118','approved','unpaid',NULL,15,'2026-01-28',NULL,0.00,'مندوب',NULL,'2026-01-27 11:48:53',1,4,2,6880.00,0.00,0.00,0.00,0.00,0.00,6880.00,'normal',''),(119,'SI-2026-000119','approved','unpaid',NULL,4,'2026-01-28',NULL,0.00,'مندوب',NULL,'2026-01-27 11:50:38',5,4,2,3900.00,0.00,0.00,0.00,0.00,0.00,3900.00,'normal',''),(120,'SI-2026-000120','approved','unpaid',NULL,43,'2026-01-29',NULL,0.00,'مندوب',NULL,'2026-01-29 14:05:53',3,NULL,1,9760.00,0.00,0.00,0.00,0.00,0.00,9760.00,'normal',''),(121,'SI-2026-000121','approved','unpaid',NULL,6,'2026-01-29',NULL,0.00,'مندوب',NULL,'2026-01-29 14:12:39',3,7,3,10022.04,0.00,0.00,1403.09,0.00,0.00,11425.13,'normal',''),(122,'SI-2026-000122','approved','partial',NULL,28,'2026-01-24',NULL,0.00,'مندوب',NULL,'2026-01-29 22:50:13',5,2,2,2655.04,0.00,0.00,0.00,0.00,0.00,2655.04,'normal','يمنى ايمن هيلثي داي'),(123,'SI-2026-000123','approved','paid',NULL,8,'2026-01-28',NULL,0.00,'مندوب',NULL,'2026-01-29 22:58:14',3,NULL,2,1768.00,53.04,0.00,0.00,0.00,0.00,1714.96,'normal',''),(124,'SI-2026-000124','approved','unpaid',NULL,43,'2026-01-29',NULL,0.00,'مندوب',NULL,'2026-01-31 09:11:57',3,NULL,1,5760.00,0.00,0.00,0.00,0.00,0.00,5760.00,'normal',''),(125,'SI-2026-000125','approved','paid',NULL,33,'2026-01-31',NULL,75.00,'شركة شحن',NULL,'2026-01-31 09:21:46',1,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,505.00,'normal','Nancy Mohamed'),(126,'SI-2026-000126','approved','paid',NULL,28,'2026-01-31',NULL,0.00,'مندوب',NULL,'2026-01-31 09:27:26',5,NULL,2,540.00,0.00,0.00,0.00,0.00,0.00,540.00,'normal','حماس عماد'),(127,'SI-2026-000127','approved','unpaid',NULL,12,'2026-01-31',NULL,0.00,'مندوب',NULL,'2026-01-31 09:54:15',6,4,2,12859.39,0.00,0.00,0.00,0.00,0.00,12859.39,'normal',''),(128,'SI-2026-000128','cancelled','unpaid',NULL,5,'2026-01-31',NULL,0.00,'مندوب',NULL,'2026-01-31 10:21:50',5,4,2,6576.00,0.00,0.00,0.00,0.00,0.00,6576.00,'normal',''),(129,'SI-2026-000129','approved','unpaid',NULL,4,'2026-02-01',NULL,0.00,'مندوب',NULL,'2026-02-01 15:35:28',5,4,2,3825.00,0.00,0.00,0.00,0.00,0.00,3825.00,'normal',''),(130,'SI-2026-000130','approved','paid',NULL,51,'2026-02-02',NULL,0.00,'شركة شحن',NULL,'2026-02-03 08:14:37',1,NULL,2,1062.50,53.13,0.00,0.00,0.00,0.00,1009.37,'normal',''),(131,'SI-2026-000131','approved','partial',NULL,79,'2026-02-02',NULL,0.00,'شركة شحن',NULL,'2026-02-03 08:19:42',3,NULL,2,12367.50,0.00,0.00,0.00,0.00,0.00,12367.50,'normal',''),(132,'SI-2026-000132','approved','paid',NULL,80,'2026-02-02',NULL,75.00,'شركة شحن',NULL,'2026-02-03 08:23:18',1,NULL,2,540.00,0.00,0.00,0.00,0.00,0.00,615.00,'normal','Reem Alzamzami'),(133,'SI-2026-000133','approved','paid',NULL,72,'2026-01-20',NULL,0.00,'مندوب',NULL,'2026-02-03 11:39:41',3,3,7,110.00,0.00,0.00,0.00,0.00,0.00,110.00,'normal',''),(134,'SI-2026-000134','approved','unpaid',NULL,5,'2026-02-03',NULL,0.00,'مندوب',NULL,'2026-02-03 12:16:49',5,4,2,6576.00,0.00,0.00,0.00,0.00,0.00,6576.00,'normal',''),(135,'SI-2026-000135','approved','unpaid',NULL,7,'2026-02-03',NULL,0.00,'مندوب',NULL,'2026-02-04 10:13:26',3,7,3,6600.00,0.00,0.00,0.00,0.00,0.00,6600.00,'normal',''),(136,'SI-2026-000136','approved','unpaid',NULL,65,'2026-02-04',NULL,0.00,'شركة شحن',NULL,'2026-02-04 14:59:35',3,NULL,2,2640.00,0.00,0.00,0.00,0.00,0.00,2640.00,'normal',''),(137,'SI-2026-000137','approved','paid',NULL,81,'2026-02-04',NULL,75.00,'شركة شحن',NULL,'2026-02-04 15:05:15',1,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,505.00,'normal','نورا وحيد'),(138,'SI-2026-000138','approved','paid',NULL,82,'2026-02-04',NULL,0.00,'شركة شحن',NULL,'2026-02-04 15:11:44',3,NULL,2,986.00,0.00,0.00,0.00,0.00,0.00,986.00,'normal',''),(139,'SI-2026-000139','approved','unpaid',NULL,23,'2026-02-03',NULL,0.00,'مندوب',NULL,'2026-02-04 15:22:04',5,4,2,1720.00,0.00,0.00,0.00,0.00,0.00,1720.00,'normal',''),(140,'SI-2026-000140','approved','partial',NULL,69,'2026-02-02',NULL,0.00,'مندوب',NULL,'2026-02-04 15:29:56',6,6,6,4057.42,0.00,0.00,0.00,0.00,0.00,4057.42,'normal','ساره سيف الدين هيلثي داي كفر البطيخ'),(141,'SI-2026-000141','approved','unpaid',NULL,34,'2026-02-05',NULL,0.00,'شركة شحن',NULL,'2026-02-07 08:41:47',1,NULL,2,2475.00,0.00,0.00,0.00,0.00,0.00,2475.00,'normal',''),(142,'SI-2026-000142','approved','paid',NULL,83,'2026-02-05',NULL,75.00,'شركة شحن',NULL,'2026-02-07 08:45:54',1,NULL,2,250.00,0.00,0.00,0.00,0.00,0.00,325.00,'normal','عزه مجدى سلامه'),(143,'SI-2026-000143','approved','paid',NULL,33,'2026-02-05',NULL,0.00,'شركة شحن',NULL,'2026-02-07 08:59:02',1,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,430.00,'normal','علاء ابراهيم'),(144,'SI-2026-000144','approved','unpaid',NULL,15,'2026-02-07',NULL,0.00,'مندوب',NULL,'2026-02-07 10:40:43',1,4,2,1080.00,0.00,0.00,0.00,0.00,0.00,1080.00,'normal',''),(145,'SI-2026-000145','approved','unpaid',NULL,16,'2026-02-07',NULL,0.00,'مندوب',NULL,'2026-02-07 10:48:18',1,4,2,5082.00,0.00,0.00,0.00,0.00,0.00,5082.00,'normal',''),(146,'SI-2026-000146','approved','unpaid',NULL,66,'2026-02-08',NULL,0.00,'شركة شحن',NULL,'2026-02-08 09:03:39',1,NULL,2,5448.00,0.00,0.00,0.00,0.00,0.00,5448.00,'normal',''),(147,'SI-2026-000147','approved','unpaid',NULL,10,'2026-02-08',NULL,0.00,'مندوب',NULL,'2026-02-09 09:43:55',2,4,2,10296.00,0.00,0.00,0.00,0.00,0.00,10296.00,'normal',''),(148,'SI-2026-000148','approved','paid',NULL,80,'2026-02-09',NULL,75.00,'شركة شحن',NULL,'2026-02-10 09:18:49',1,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,505.00,'normal','شيماء عبد العزيز'),(149,'SI-2026-000149','approved','paid',NULL,76,'2026-02-03',NULL,0.00,'مندوب',NULL,'2026-02-10 09:24:32',3,7,3,204.00,6.12,0.00,0.00,0.00,0.00,197.88,'normal',''),(150,'SI-2026-000150','approved','paid',NULL,77,'2026-02-03',NULL,0.00,'مندوب',NULL,'2026-02-10 09:27:49',3,7,3,850.00,25.50,0.00,0.00,0.00,0.00,824.50,'normal',''),(151,'SI-2026-000151','approved','unpaid',NULL,24,'2026-02-07',NULL,0.00,'مندوب',NULL,'2026-02-10 09:34:52',3,7,3,1680.00,0.00,0.00,235.20,0.00,0.00,1915.20,'normal',''),(152,'SI-2026-000152','approved','unpaid',NULL,24,'2026-02-07',NULL,0.00,'مندوب',NULL,'2026-02-10 09:38:11',3,7,3,1680.00,0.00,0.00,235.20,0.00,0.00,1915.20,'normal',''),(153,'SI-2026-000153','approved','unpaid',NULL,4,'2026-02-10',NULL,0.00,'مندوب',NULL,'2026-02-10 10:18:57',5,4,2,11925.00,0.00,0.00,0.00,0.00,0.00,11925.00,'normal',''),(154,'SI-2026-000154','approved','unpaid',NULL,61,'2026-02-10',NULL,0.00,'مندوب',NULL,'2026-02-10 10:39:19',5,4,2,4950.00,0.00,0.00,0.00,0.00,0.00,4950.00,'normal',''),(155,'SI-2026-000155','approved','paid',NULL,17,'2026-02-11',NULL,0.00,'مندوب',NULL,'2026-02-11 08:18:34',1,4,2,11520.00,0.00,0.00,0.00,0.00,0.00,11520.00,'normal',''),(156,'SI-2026-000156','approved','paid',NULL,69,'2026-02-07',NULL,0.00,'مندوب',NULL,'2026-02-11 23:25:29',6,6,6,360.00,0.00,0.00,0.00,0.00,0.00,360.00,'normal','منه خالد المصري'),(157,'SI-2026-000157','approved','paid',NULL,69,'2026-02-10',NULL,0.00,'مندوب',NULL,'2026-02-11 23:28:40',6,6,6,189.00,0.00,0.00,0.00,0.00,0.00,189.00,'normal','منه خالد المصري'),(158,'SI-2026-000158','approved','unpaid',NULL,84,'2026-02-09',NULL,0.00,'مندوب',NULL,'2026-02-11 23:36:48',5,4,2,18080.00,0.00,0.00,0.00,0.00,0.00,18080.00,'normal',''),(159,'SI-2026-000159','approved','unpaid',NULL,12,'2026-02-09',NULL,0.00,'مندوب',NULL,'2026-02-11 23:41:34',6,4,2,6105.12,0.00,0.00,0.00,0.00,0.00,6105.12,'normal',''),(160,'SI-2026-000160','approved','unpaid',NULL,66,'2026-02-11',NULL,0.00,'شركة شحن',NULL,'2026-02-11 23:57:22',1,NULL,2,3152.00,0.00,0.00,0.00,0.00,0.00,3152.00,'normal',''),(161,'SI-2026-000161','approved','paid',NULL,31,'2026-02-09',NULL,0.00,'شركة شحن',NULL,'2026-02-12 00:20:43',5,NULL,2,1343.00,40.29,0.00,0.00,0.00,0.00,1302.71,'normal',''),(162,'SI-2026-000162','approved','paid',NULL,51,'2026-02-11',NULL,0.00,'شركة شحن',NULL,'2026-02-12 00:28:43',1,NULL,2,2125.00,106.25,0.00,0.00,0.00,0.00,2018.75,'normal',''),(163,'SI-2026-000163','approved','unpaid',NULL,47,'2026-02-08',NULL,0.00,'مندوب',NULL,'2026-02-12 09:57:14',3,7,3,396.00,60.00,0.00,0.00,0.00,0.00,336.00,'normal',''),(164,'SI-2026-000164','approved','paid',NULL,85,'2026-02-11',NULL,0.00,'مندوب',NULL,'2026-02-12 10:06:24',3,7,3,374.00,11.00,0.00,0.00,0.00,0.00,363.00,'normal',''),(165,'SI-2026-000165','approved','unpaid',NULL,7,'2026-02-04',NULL,0.00,'مندوب',NULL,'2026-02-12 17:36:46',3,7,3,8600.00,0.00,0.00,0.00,0.00,0.00,8600.00,'normal',''),(166,'SI-2026-000166','approved','unpaid',NULL,23,'2026-02-14',NULL,0.00,'مندوب',NULL,'2026-02-14 09:11:43',5,4,2,2960.00,0.00,0.00,0.00,0.00,0.00,2960.00,'normal',''),(167,'SI-2026-000167','approved','paid',NULL,28,'2026-02-14',NULL,0.00,'مندوب',NULL,'2026-02-14 09:24:03',5,4,2,500.02,0.00,0.00,0.00,0.00,0.00,500.02,'normal','استاذ محمد محاسب في صيدليات سالي'),(168,'SI-2026-000168','approved','unpaid',NULL,2,'2026-02-14',NULL,0.00,'مندوب',NULL,'2026-02-14 09:29:20',5,4,2,4056.00,0.00,0.00,0.00,0.00,0.00,4056.00,'normal',''),(169,'SI-2026-000169','approved','paid',NULL,14,'2026-02-14',NULL,0.00,'شركة شحن',NULL,'2026-02-14 11:04:07',5,NULL,2,4029.00,201.45,0.00,0.00,0.00,0.00,3827.55,'normal',''),(170,'SI-2026-000170','approved','unpaid',NULL,9,'2026-02-15',NULL,0.00,'مندوب',NULL,'2026-02-15 08:58:48',3,7,3,2805.00,84.15,0.00,0.00,0.00,0.00,2720.85,'normal',''),(171,'SI-2026-000171','approved','paid',NULL,86,'2026-02-14',NULL,0.00,'مندوب',NULL,'2026-02-15 09:08:26',3,7,3,850.00,25.00,0.00,0.00,0.00,0.00,825.00,'normal',''),(172,'SI-2026-000172','approved','unpaid',NULL,87,'2026-02-15',NULL,0.00,'شركة شحن',NULL,'2026-02-15 09:21:18',8,8,2,2176.00,0.00,0.00,0.00,0.00,0.00,2176.00,'normal',''),(173,'SI-2026-000173','approved','unpaid',NULL,88,'2026-02-15',NULL,0.00,'شركة شحن',NULL,'2026-02-15 09:26:42',8,8,2,1326.00,0.00,0.00,0.00,0.00,0.00,1326.00,'normal',''),(174,'SI-2026-000174','approved','partial',NULL,89,'2026-02-15',NULL,0.00,'شركة شحن',NULL,'2026-02-15 10:58:08',8,8,2,1695.00,0.00,0.00,0.00,0.00,0.00,1695.00,'normal',''),(175,'SI-2026-000175','approved','partial',NULL,90,'2026-01-01',NULL,0.00,'مندوب',NULL,'2026-02-15 11:07:18',NULL,NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,9502.30,'opening',''),(176,'SI-2026-000176','approved','unpaid',NULL,79,'2026-02-15',NULL,0.00,'شركة شحن',NULL,'2026-02-15 14:00:52',3,NULL,2,4420.00,0.00,0.00,0.00,0.00,0.00,4420.00,'normal',''),(177,'SI-2026-000177','approved','unpaid',NULL,4,'2026-02-16',NULL,0.00,'مندوب',NULL,'2026-02-15 14:26:04',5,4,2,8475.00,0.00,0.00,0.00,0.00,0.00,8475.00,'normal',''),(178,'SI-2026-000178','approved','unpaid',NULL,91,'2026-02-16',NULL,0.00,'مندوب',NULL,'2026-02-16 09:29:29',8,8,2,884.00,0.00,0.00,0.00,0.00,0.00,884.00,'normal',''),(179,'SI-2026-000179','approved','paid',NULL,92,'2026-02-16',NULL,0.00,'مندوب',NULL,'2026-02-16 09:31:41',8,8,2,2320.60,0.00,0.00,0.00,0.00,0.00,2320.60,'normal',''),(180,'SI-2026-000180','approved','unpaid',NULL,10,'2026-02-16',NULL,0.00,'مندوب',NULL,'2026-02-17 10:47:27',2,4,2,6926.40,0.00,0.00,0.00,0.00,0.00,6926.40,'normal',''),(181,'SI-2026-000181','approved','unpaid',NULL,26,'2026-02-17',NULL,0.00,'مندوب',NULL,'2026-02-17 10:56:05',5,4,2,21893.04,0.00,0.00,3065.03,0.00,0.00,24958.06,'normal',''),(182,'SI-2026-000182','approved','unpaid',NULL,26,'2026-02-17',NULL,0.00,'مندوب',NULL,'2026-02-17 10:57:46',5,4,2,3789.18,0.00,0.00,530.49,0.00,0.00,4319.67,'normal',''),(183,'SI-2026-000183','approved','unpaid',NULL,1,'2026-02-17',NULL,0.00,'مندوب',NULL,'2026-02-17 11:09:11',5,4,2,3315.60,0.00,0.00,464.18,0.00,0.00,3779.78,'normal',''),(184,'SI-2026-000184','approved','unpaid',NULL,2,'2026-02-17',NULL,0.00,'مندوب',NULL,'2026-02-17 11:10:51',5,4,2,1404.00,0.00,0.00,0.00,0.00,0.00,1404.00,'normal',''),(185,'SI-2026-000185','approved','unpaid',NULL,93,'2026-02-17',NULL,0.00,'مندوب',NULL,'2026-02-17 22:38:26',3,7,3,1326.00,39.78,0.00,0.00,0.00,0.00,1286.22,'normal',''),(186,'SI-2026-000186','approved','unpaid',NULL,28,'2026-02-16',NULL,0.00,'شركة شحن',NULL,'2026-02-18 09:42:01',5,NULL,2,720.00,0.00,0.00,0.00,0.00,0.00,720.00,'normal','Dr Rahma Abdelhakeem'),(187,'SI-2026-000187','approved','unpaid',NULL,30,'2026-02-16',NULL,0.00,'شركة شحن',NULL,'2026-02-18 09:44:43',8,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,430.00,'normal','ندا طلعت'),(188,'SI-2026-000188','approved','unpaid',NULL,5,'2026-02-18',NULL,0.00,'مندوب',NULL,'2026-02-18 10:52:32',5,4,2,3200.00,0.00,0.00,0.00,0.00,0.00,3200.00,'normal',''),(189,'SI-2026-000189','draft','unpaid',NULL,44,'2026-02-18',NULL,0.00,'مندوب',NULL,'2026-02-18 23:30:20',3,7,3,10522.50,0.00,0.00,0.00,0.00,0.00,10522.50,'normal',''),(190,'SI-2026-000190','approved','paid',NULL,94,'2026-02-15',NULL,0.00,'مندوب',NULL,'2026-02-19 15:01:55',3,7,3,1776.50,0.00,0.00,0.00,0.00,0.00,1776.50,'normal',''),(191,'SI-2026-000191','approved','unpaid',NULL,84,'2026-02-17',NULL,0.00,'مندوب',NULL,'2026-02-19 18:24:11',5,4,2,1440.00,0.00,0.00,0.00,0.00,0.00,1440.00,'normal',''),(192,'SI-2026-000192','draft','unpaid',NULL,69,'2026-02-01',NULL,0.00,'مندوب',NULL,'2026-02-20 12:27:28',6,6,6,1328.00,0.00,0.00,0.00,0.00,0.00,1328.00,'normal','منه خالد المصري'),(193,'SI-2026-000193','approved','unpaid',NULL,42,'2026-02-19',NULL,0.00,'مندوب',NULL,'2026-02-21 08:20:14',3,7,3,4128.00,0.00,0.00,0.00,0.00,0.00,4128.00,'normal',''),(194,'SI-2026-000194','approved','unpaid',NULL,42,'2026-02-19',NULL,0.00,'مندوب',NULL,'2026-02-21 08:21:36',3,7,3,4992.00,0.00,0.00,0.00,0.00,0.00,4992.00,'normal',''),(195,'SI-2026-000195','approved','unpaid',NULL,42,'2026-02-19',NULL,0.00,'مندوب',NULL,'2026-02-21 08:25:45',3,7,3,2400.00,0.00,0.00,0.00,0.00,0.00,2400.00,'normal',''),(196,'SI-2026-000196','draft','unpaid',NULL,33,'2026-02-21',NULL,0.00,'شركة شحن',NULL,'2026-02-21 08:53:15',1,NULL,2,860.00,0.00,0.00,0.00,0.00,0.00,860.00,'normal','مهند عادل'),(197,'SI-2026-000197','draft','unpaid',NULL,28,'2026-02-21',NULL,0.00,'شركة شحن',NULL,'2026-02-21 08:54:46',5,NULL,2,240.00,0.00,0.00,0.00,0.00,0.00,240.00,'normal','شروق أبوبيه'),(198,'SI-2026-000198','draft','unpaid',NULL,97,'2026-02-21',NULL,0.00,'شركة شحن',NULL,'2026-02-21 08:57:17',1,NULL,2,430.00,0.00,0.00,0.00,0.00,0.00,430.00,'normal','رمضان الهرش'),(199,'SI-2026-000199','draft','unpaid',NULL,80,'2026-02-21',NULL,0.00,'شركة شحن',NULL,'2026-02-21 09:01:12',1,NULL,2,1120.00,0.00,0.00,0.00,0.00,0.00,1120.00,'normal','اسراء احمد'),(200,'SI-2026-000200','draft','unpaid',NULL,32,'2026-02-21',NULL,0.00,'شركة شحن',NULL,'2026-02-21 09:04:43',1,NULL,2,1032.00,0.00,0.00,0.00,0.00,0.00,1032.00,'normal','Islam Mohamed'),(201,'SI-2026-000201','approved','paid',NULL,77,'2026-02-18',NULL,0.00,'مندوب',NULL,'2026-02-21 12:05:25',3,7,3,816.00,26.00,0.00,0.00,0.00,0.00,790.00,'normal','');
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
  `withholding_tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'نسبة خصم المنبع',
  `withholding_tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'قيمة خصم المنبع',
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
  `return_condition` enum('good','damaged','expired') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'good',
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batch_status` enum('known','unknown','unreadable') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  PRIMARY KEY (`id`),
  KEY `sales_return_id` (`sales_return_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_return_items_ibfk_1` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`),
  CONSTRAINT `sales_return_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_return_items`
--

LOCK TABLES `sales_return_items` WRITE;
/*!40000 ALTER TABLE `sales_return_items` DISABLE KEYS */;
INSERT INTO `sales_return_items` VALUES (1,1,3,2,180.00,'damaged','001','2027-12-01','known'),(2,1,4,2,185.00,'damaged','001','2028-01-01','unknown'),(3,2,4,2,270.00,'damaged','001','2028-01-18','unknown'),(4,3,1,2,395.00,'good','001','2026-08-01','known'),(5,4,1,2,246.50,'good','001','2028-08-01','known'),(6,4,4,2,204.00,'good','001','2028-01-01','known'),(7,4,5,2,178.50,'good','001','2027-07-01','known'),(8,5,4,1,209.00,'good','001','2028-01-01','unknown'),(9,6,5,7,124.65,'good','001','2026-05-01','unknown'),(10,7,1,25,264.00,'good','001','2028-08-01','known'),(11,8,1,10,217.50,'good','001','2027-07-01','known'),(12,8,5,10,157.50,'good','001','2027-07-01','known'),(13,8,3,8,165.00,'good','001','2027-12-01','known'),(14,8,2,8,292.50,'good','003','2028-06-01','known'),(15,8,4,6,180.00,'good','001','2028-01-01','known'),(16,9,3,1,200.00,'damaged','001','2028-10-01','known'),(17,10,1,1,232.00,'good','002','2026-05-18','known'),(18,11,16,1,270.00,'good','002','2026-11-01','unknown');
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
  `sales_invoice_id` int DEFAULT NULL,
  `party_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `warehouse_id` int NOT NULL,
  `return_date` date NOT NULL DEFAULT (curdate()),
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `return_type` enum('cash','credit','exchange') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `account_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `sales_invoice_id` (`sales_invoice_id`),
  KEY `fk_sales_returns_warehouse` (`warehouse_id`),
  KEY `fk_sales_returns_party` (`party_id`),
  KEY `fk_sales_returns_employee` (`employee_id`),
  CONSTRAINT `fk_sales_returns_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_sales_returns_party` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_sales_returns_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sales_returns_ibfk_1` FOREIGN KEY (`sales_invoice_id`) REFERENCES `sales_invoices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_returns`
--

LOCK TABLES `sales_returns` WRITE;
/*!40000 ALTER TABLE `sales_returns` DISABLE KEYS */;
INSERT INTO `sales_returns` VALUES (1,31,16,NULL,8,'2026-01-12','','2026-01-17 08:09:40','credit',NULL,730.00,0.00),(2,26,1,NULL,8,'2026-01-06','','2026-01-18 09:39:33','exchange',NULL,540.00,0.00),(3,69,60,3,3,'2026-01-25','','2026-01-25 13:59:12','credit',NULL,790.00,0.00),(4,81,64,3,3,'2026-01-27','','2026-01-27 08:53:52','credit',NULL,1258.00,0.00),(5,46,6,3,3,'2026-01-25','','2026-02-01 14:05:10','credit',NULL,209.00,0.00),(6,99,66,1,9,'2026-01-21','','2026-02-02 16:05:02','credit',NULL,872.55,0.00),(7,135,7,3,3,'2026-02-04','','2026-02-04 14:34:19','credit',NULL,6600.00,0.00),(8,68,59,2,2,'2026-02-16','','2026-02-17 08:53:02','credit',NULL,8490.00,0.00),(9,33,26,5,8,'2026-02-16','','2026-02-18 11:40:01','credit',NULL,200.00,0.00),(10,33,26,5,9,'2026-02-17','','2026-02-18 11:42:30','credit',NULL,232.00,0.00),(11,40,9,3,3,'2026-02-15','','2026-02-21 08:34:42','exchange',NULL,270.00,0.00);
/*!40000 ALTER TABLE `sales_returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_invoice_items`
--

DROP TABLE IF EXISTS `service_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_invoice_id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `account_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `tax_rate` decimal(5,2) DEFAULT '0.00',
  `tax_amount` decimal(15,2) DEFAULT '0.00',
  `note` text,
  PRIMARY KEY (`id`),
  KEY `service_invoice_id` (`service_invoice_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `service_invoice_items_ibfk_1` FOREIGN KEY (`service_invoice_id`) REFERENCES `service_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `service_invoice_items_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_invoice_items`
--

LOCK TABLES `service_invoice_items` WRITE;
/*!40000 ALTER TABLE `service_invoice_items` DISABLE KEYS */;
INSERT INTO `service_invoice_items` VALUES (1,1,'Test Expense Item',3,1000.00,10.00,100.00,NULL);
/*!40000 ALTER TABLE `service_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_invoices`
--

DROP TABLE IF EXISTS `service_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `party_id` int NOT NULL,
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `tax_amount` decimal(15,2) DEFAULT '0.00',
  `discount_amount` decimal(15,2) DEFAULT '0.00',
  `note` text,
  `status` enum('draft','approved','cancelled') DEFAULT 'draft',
  `payment_status` enum('unpaid','partial','paid') DEFAULT 'unpaid',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  CONSTRAINT `service_invoices_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_invoices`
--

LOCK TABLES `service_invoices` WRITE;
/*!40000 ALTER TABLE `service_invoices` DISABLE KEYS */;
INSERT INTO `service_invoices` VALUES (1,'TEST-INV-001',NULL,'2026-02-01',NULL,74,1100.00,100.00,0.00,NULL,'approved','unpaid','2026-02-01 08:16:02');
/*!40000 ALTER TABLE `service_invoices` ENABLE KEYS */;
UNLOCK TABLES;

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
  `credit_account_id` int NOT NULL,
  `external_service_id` int DEFAULT NULL,
  `external_job_order_id` int DEFAULT NULL,
  `note` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `employee_id` int DEFAULT NULL,
  `external_service_invoice_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `party_id` (`party_id`),
  KEY `account_id` (`account_id`),
  KEY `external_job_order_id` (`external_job_order_id`),
  KEY `fk_sp_employee` (`employee_id`),
  KEY `fk_sp_credit_account` (`credit_account_id`),
  KEY `fk_service_payments_invoice` (`external_service_invoice_id`),
  KEY `fk_service_payments_external_service` (`external_service_id`),
  CONSTRAINT `fk_service_payments_external_service` FOREIGN KEY (`external_service_id`) REFERENCES `external_job_order_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_service_payments_invoice` FOREIGN KEY (`external_service_invoice_id`) REFERENCES `external_service_invoices` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sp_credit_account` FOREIGN KEY (`credit_account_id`) REFERENCES `accounts` (`id`),
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
-- Table structure for table `service_types`
--

DROP TABLE IF EXISTS `service_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `account_id` int DEFAULT NULL,
  `affects_job_cost` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `service_types_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_types`
--

LOCK TABLES `service_types` WRITE;
/*!40000 ALTER TABLE `service_types` DISABLE KEYS */;
INSERT INTO `service_types` VALUES (1,'تشغيل',NULL,1,'2026-02-05 18:58:48','2026-02-05 18:58:48'),(2,'نقل',NULL,1,'2026-02-05 18:58:48','2026-02-05 18:58:48'),(3,'معالجة',NULL,1,'2026-02-05 18:58:48','2026-02-05 18:58:48'),(4,'أخرى',NULL,0,'2026-02-05 18:58:48','2026-02-05 18:58:48');
/*!40000 ALTER TABLE `service_types` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfer_items`
--

LOCK TABLES `warehouse_transfer_items` WRITE;
/*!40000 ALTER TABLE `warehouse_transfer_items` DISABLE KEYS */;
INSERT INTO `warehouse_transfer_items` VALUES (1,1,10,80,47.50),(2,1,3,41,44.75),(3,1,4,47,39.83),(4,1,2,112,98.89),(5,1,1,112,55.30),(6,2,6,112,89.70),(7,2,3,56,44.75),(8,2,10,80,47.50),(9,3,3,36,44.75),(10,3,5,20,22.70),(11,3,1,30,55.30),(12,3,2,40,98.89),(13,4,10,10,47.50),(14,5,3,56,44.75),(15,5,4,56,39.83),(16,5,5,88,22.70),(17,6,2,111,98.89),(18,6,10,72,47.50),(19,7,10,45,47.50),(20,7,3,20,44.75),(21,3,4,15,39.83),(26,8,10,72,47.50),(27,8,1,112,55.30),(28,9,2,70,98.89),(29,9,1,70,55.30),(30,9,5,40,22.70),(31,10,5,100,22.70),(32,10,6,112,89.70),(33,10,10,72,47.50),(34,10,1,112,55.30),(35,10,2,112,98.89),(36,11,12,2880,4.50),(37,11,13,2829,14.90),(38,12,1,5,55.30),(39,12,5,5,22.70),(40,13,1,6,55.30),(41,13,2,6,98.89),(42,13,3,6,44.75),(43,13,4,6,39.83),(44,13,5,6,22.70),(45,13,6,6,89.70),(46,13,10,6,47.50),(47,14,6,10,89.70),(48,14,10,10,47.50),(49,15,6,99,89.70),(50,15,3,56,44.75),(51,15,4,56,39.83),(52,15,5,22,22.70),(53,16,6,40,89.70),(54,16,5,30,22.70),(55,16,10,30,47.50),(56,17,5,1,22.70),(57,18,2,6,98.89),(58,19,2,104,98.89),(59,19,10,60,47.50),(60,19,6,112,89.70),(61,19,1,112,55.30),(62,20,3,56,44.75),(63,21,1,4,55.30),(64,21,2,4,98.89),(65,21,3,4,44.75),(66,21,4,4,39.83),(67,21,5,4,22.70),(68,21,6,4,89.70),(69,21,10,4,47.50),(70,22,15,2772,46.82),(71,23,15,36,46.82),(72,23,4,56,39.83),(73,24,15,71,46.82),(74,25,2,2,98.89),(75,26,15,30,46.82),(76,27,2,2,98.89),(77,27,1,4,55.30),(78,27,4,2,39.83),(79,27,10,2,47.50),(80,27,3,2,44.75),(81,27,5,2,22.70),(82,27,6,10,89.70),(83,28,15,5,46.82),(84,29,15,144,46.82),(85,29,1,112,55.30),(86,29,10,72,47.50),(87,30,5,100,22.70),(88,31,3,56,44.75),(89,32,10,2,47.50),(90,33,2,112,98.89),(91,33,6,112,89.70),(92,34,2,50,98.89),(93,34,5,30,22.70),(94,34,6,20,89.70),(95,35,10,20,47.50),(96,35,15,20,46.82);
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfers`
--

LOCK TABLES `warehouse_transfers` WRITE;
/*!40000 ALTER TABLE `warehouse_transfers` DISABLE KEYS */;
INSERT INTO `warehouse_transfers` VALUES (1,1,2,'2026-01-04 20:37:00',''),(2,1,2,'2026-01-05 20:42:00',''),(3,2,3,'2026-01-05 17:50:00',''),(4,3,7,'2026-01-05 20:47:00',''),(5,1,2,'2026-01-11 08:31:00',''),(6,1,2,'2026-01-12 10:06:00',''),(7,2,3,'2026-01-12 10:08:00',''),(8,1,2,'2026-01-17 12:31:00',''),(9,2,3,'2026-01-18 08:37:00',''),(10,1,2,'2026-01-20 13:09:00',''),(11,4,5,'2026-01-20 21:00:00',''),(12,3,7,'2026-01-21 19:39:00',''),(13,2,6,'2026-01-27 23:21:00',''),(14,3,7,'2026-01-25 12:17:00',''),(15,1,2,'2026-02-02 15:42:00',''),(16,2,3,'2026-02-02 15:44:00',''),(17,9,2,'2026-02-05 08:57:00',''),(18,1,2,'2026-02-09 09:15:00',''),(19,1,2,'2026-02-10 10:13:00',''),(20,1,2,'2026-02-11 08:27:00',''),(21,2,10,'2026-02-11 00:33:00',''),(22,5,1,'2026-02-16 09:16:00',''),(23,1,2,'2026-02-16 09:19:00',''),(24,1,2,'2026-02-16 09:45:00',''),(25,1,2,'2026-02-10 10:20:00',''),(26,2,3,'2026-02-16 11:14:00',''),(27,2,10,'2026-02-16 11:22:00',''),(28,2,10,'2026-02-16 11:24:00',''),(29,1,2,'2026-02-17 12:07:00',''),(30,1,2,'2026-02-18 10:49:00',''),(31,1,2,'2026-02-18 10:49:00',''),(32,2,6,'2026-02-01 18:31:00',''),(33,1,2,'2026-02-21 11:57:00',''),(34,2,3,'2026-02-21 12:55:00',''),(35,2,3,'2026-02-21 13:01:00','');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` VALUES (1,'المخزن الرئيسي','المنصوره - شارع الترعه',4,'2025-12-15 09:24:58'),(2,'مخزن التوريد الرئيسي','المنصوره - شارع اداب',4,'2025-12-15 09:25:42'),(3,'مخزن الاسكندريه الرئيسي','الاسكندريه',37,'2025-12-15 09:26:27'),(4,'مخزن مستلزمات الانتاج','المنصوره-شارع الترعه',4,'2025-12-15 09:27:03'),(5,'مخزن تحت التشغيل لدى الغير','المنصوره',4,'2025-12-15 09:29:30'),(6,'مخزن دمياط','دمياط',55,'2025-12-15 09:30:34'),(7,'مخزن الاسكندرية الفرعي','الاسكندريه',37,'2026-01-04 18:29:12'),(8,'مخزن الهالك','المنصورة',4,'2026-01-15 21:22:44'),(9,'مخزن near expire','',4,'2026-02-02 16:03:03'),(10,'مخزن البحيره','',63,'2026-02-12 00:33:05'),(11,'مخزن العينات','',4,'2026-02-18 11:37:34');
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

-- Dump completed on 2026-02-21 15:35:14
