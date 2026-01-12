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
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'اصول','asset',NULL,0.00,'','debit'),(2,'خصوم','liability',NULL,0.00,'','credit'),(3,'مصروفات مباشره','expense',NULL,0.00,'','debit'),(4,'مصروفات غير مباشره','expense',NULL,0.00,'','debit'),(5,'ايرادات','revenue',NULL,0.00,'','credit'),(6,'مردودات المبيعات','revenue',NULL,0.00,'','credit'),(7,'صافي الدخل','equity',NULL,0.00,'','credit'),(8,'اصول ثابته','asset',1,0.00,'','debit'),(9,'اصول متداوله','asset',1,0.00,'','debit'),(10,'رأس المال','liability',2,0.00,'','credit'),(11,'قروض','liability',2,0.00,'','credit'),(12,'خصوم متادوله','liability',2,0.00,'','credit'),(13,'صافي الربح','liability',2,0.00,'','credit'),(14,'ارباح مرحلة','liability',2,0.00,'','credit'),(15,'تكلفة البضاعة المباعة','expense',3,0.00,'','debit'),(16,'مصروفات نقل بضاعة','expense',3,0.00,'','debit'),(17,'مرتبات المبيعات','expense',3,0.00,'','debit'),(18,'عمولات المبيعات','expense',3,0.00,'','debit'),(19,'خصم خاص','expense',3,0.00,'','debit'),(20,'دمغه','expense',3,0.00,'','debit'),(21,'مصروفات خطابات ضمان','expense',3,0.00,'','debit'),(22,'مصروفات تسويقيه','expense',3,0.00,'','debit'),(23,'جرد تالف تصنيع','expense',3,0.00,'','debit'),(24,'تكاليف تشغيل مباشره','expense',3,0.00,'','debit'),(25,'مصروفات عموميه','expense',4,0.00,'','debit'),(26,'اهلاكات','expense',4,0.00,'','debit'),(27,'مرتبات','expense',4,0.00,'','debit'),(28,'مبيعات','revenue',5,0.00,'','credit'),(29,'خدمات','revenue',5,0.00,'','credit'),(30,'خصم مكتسب','revenue',5,0.00,'','credit'),(31,'آلات','asset',8,0.00,'','debit'),(32,'آراضي','asset',8,0.00,'','debit'),(33,'مباني','asset',8,0.00,'','debit'),(34,'أدوات مكتبية','asset',8,0.00,'','debit'),(35,'سيارات','asset',8,0.00,'','debit'),(36,'أثاث','asset',8,0.00,'','debit'),(37,'ملفات','asset',8,0.00,'','debit'),(38,'برامج محاسبيه','asset',8,0.00,'','debit'),(39,'جهاز كمبيوتر','asset',8,0.00,'','debit'),(40,'صندوق وبنوك','asset',9,0.00,'','debit'),(41,'خزينه','asset',40,0.00,'','debit'),(42,'خزينة شركة الشحن','asset',40,0.00,'','debit'),(43,'البنك الأهلي الخاص','asset',40,0.00,'','debit'),(44,'البنك شركه','asset',40,0.00,'','debit'),(45,'فودافون كاش','asset',40,0.00,'','debit'),(46,'كارد فيزا','asset',40,0.00,'','debit'),(47,'العملاء','asset',9,0.00,'','debit'),(48,'اوراق قبض','asset',9,0.00,'','debit'),(49,'المخزون','asset',9,0.00,'','debit'),(50,'جاري الشركاء','asset',9,0.00,'','debit'),(51,'جاري هاني صلاح','asset',50,0.00,'','debit'),(52,'صافي الخسارة','asset',9,0.00,'','debit'),(53,'خسارة مرحلة','asset',9,0.00,'','debit'),(54,'تأمينات لدى الغير','asset',9,0.00,'','debit'),(55,'سلف العاملين','asset',9,0.00,'','debit'),(56,'خصم ضرائب','asset',9,0.00,'','debit'),(57,'خصم ضرائب مبيعات','asset',9,0.00,'','debit'),(58,'غطاء خطابات ضمان','asset',9,0.00,'','debit'),(59,'اعتمادات مستندية','asset',9,0.00,'','debit'),(60,'مدينون متنوعون','asset',9,0.00,'','debit'),(61,'عائلة ','asset',60,0.00,'','debit'),(62,'الموردين','liability',12,0.00,'','credit'),(63,'مخصصات','liability',12,0.00,'','credit'),(64,'اوراق دفع','liability',12,0.00,'','credit'),(65,'ضريبة القيمه المضافه','liability',12,0.00,'','credit'),(66,'مصلحة الضرائب','liability',12,0.00,'','credit'),(67,'مقاولين من الباطل','liability',12,0.00,'','credit'),(68,'خصم و اضافه ضرائب مشتريات','liability',12,0.00,'','credit'),(69,'دائنون متنوعون ','liability',12,0.00,'','credit'),(70,'دائن فيزا كارد','liability',69,0.00,'','credit'),(71,'ديون شخصيه','liability',12,0.00,'','credit'),(72,'الأولاد','liability',71,0.00,'','credit'),(73,'نيفين','liability',71,0.00,'','credit'),(74,'إيهاب','liability',71,0.00,'','credit'),(75,'مرتبات مستحقه','liability',12,0.00,'','credit'),(76,'نسبة تحصيل','expense',22,0.00,'','debit'),(77,'هدايا تسويقية','expense',22,0.00,'','debit'),(78,'تعويضات عروض تسويقيه','expense',22,0.00,'','debit'),(79,'مصاريف تصميمات','expense',22,0.00,'','debit'),(80,'عينات مجانية للدكاترة','expense',22,0.00,'','debit'),(81,'عينات للتصوير والتصميمات','expense',22,0.00,'','debit'),(82,'عينات للbloggers','expense',22,0.00,'','debit'),(83,'مشاركات مؤتمرات','expense',22,0.00,'','debit'),(84,'مشاركه فى معرض الجامعات','expense',22,0.00,'','debit'),(85,'مطبوعات تسويقيه','expense',22,0.00,'','debit'),(86,'sponsor health day','expense',22,0.00,'','debit'),(87,'social media ','expense',22,0.00,'','debit'),(88,'اجتماع للدكاتره','expense',22,0.00,'','debit'),(89,'مصروفات بلوجر blogger','expense',22,0.00,'','debit'),(90,'ايجارات','expense',25,0.00,'','debit'),(91,'ايجار مكتب','expense',90,0.00,'','debit'),(92,'ايجار سياره','expense',90,0.00,'','debit'),(93,'ايجار مخزن','expense',90,0.00,'','debit'),(94,'كهرباء','expense',25,0.00,'','debit'),(95,'بوفيه','expense',25,0.00,'','debit'),(96,'ضيافه','expense',25,0.00,'','debit'),(97,'مصاريف سيارة المدير','expense',25,0.00,'','debit'),(98,'زكاة','expense',25,0.00,'','debit'),(99,'مصاريف مكتب الإداره','expense',25,0.00,'','debit'),(100,'هدايا','expense',25,0.00,'','debit'),(101,'عمولات بنكيه','expense',25,0.00,'','debit'),(102,'مصاريف اجتماعات','expense',25,0.00,'','debit'),(103,'بدل سفر','expense',25,0.00,'','debit'),(104,'كروت بيزنيس b.c','expense',25,0.00,'','debit'),(105,'مصاريف وزارة الصحة','expense',25,0.00,'','debit'),(106,'اتعاب مكتب المحاسب القانونى','expense',25,0.00,'','debit'),(107,'فندق ','expense',25,0.00,'','debit'),(108,'خصم مسموح به','revenue',28,0.00,'','debit'),(109,'تحت التشغيل','asset',49,0.00,'','debit'),(110,'مخزون تام الصنع','asset',49,0.00,'','debit'),(111,'مخزون أولي','asset',49,0.00,NULL,'debit'),(112,'هالك مرتجعات مبيعات','expense',3,0.00,'مصروف هالك ناتج عن مرتجعات مبيعات تالفة','debit'),(113,'خسائر انتهاء صلاحية مرتجعات','expense',3,0.00,'مصروف خسائر ناتج عن مرتجعات منتهية الصلاحية','debit'),(114,'فروقات جرد مخزون','expense',3,0.00,NULL,'debit'),(115,'إيراد شحن','revenue',5,0.00,NULL,'debit');
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
INSERT INTO `batch_inventory` VALUES (1,1,1368),(1,2,185),(1,3,75),(1,7,10),(2,1,2240),(2,2,113),(2,3,35),(2,7,10),(3,1,2240),(3,2,130),(3,3,57),(3,6,6),(3,7,3),(4,1,2465),(4,2,270),(4,3,40),(5,1,3303),(5,2,97),(5,3,71),(5,6,3),(5,7,4),(6,1,2408),(6,2,138),(6,3,18),(6,6,6),(6,7,5),(7,1,1900),(7,2,130),(7,3,20),(7,6,1),(8,2,3),(8,3,38),(8,6,7),(8,7,4);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batches`
--

LOCK TABLES `batches` WRITE;
/*!40000 ALTER TABLE `batches` DISABLE KEYS */;
INSERT INTO `batches` VALUES (1,10,'001','2028-12-01'),(2,6,'002','2028-11-01'),(3,1,'001','2028-08-01'),(4,2,'006','2028-12-01'),(5,3,'001','2028-10-01'),(6,4,'001','2028-01-01'),(7,5,'001','2027-07-01'),(8,2,'003','2028-06-01');
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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'برج العرب',3),(2,'مطوبس',11),(3,'كفر الشيخ',11),(4,'المنصوره',7),(5,'ميت غمر',7),(6,'السنبلاوين',7),(7,'طلخا',7),(8,'منيه النصر',7),(9,'المنزله',7),(10,'شربين',7),(11,'دكرنس',7),(12,'بلقاس',7),(13,'طنطا',9),(14,'كفر الزيات',9),(15,'المحله الكبرى',9),(16,'بسيون',9),(17,'قطور',9),(18,'زفتى',9),(19,'سمنود',9),(20,'القاهره',1),(21,'مدينه نصر',1),(22,'مصر الجديده',1),(23,'المعادى',1),(24,'حلوان',1),(25,'شبرا',1),(26,'الزيتون',1),(27,'المطريه',1),(28,'المرج',1),(29,'عين شمس',1),(30,'السلام',1),(31,'الجيزه',2),(32,'6 اكتوبر',2),(33,'الشيخ زايد',2),(34,'الهرم',2),(35,'العمرانيه',2),(36,'الدقى',2),(37,'الاسكندريه',3),(38,'بنها',4),(39,'شبرا الخيمه',4),(40,'دمنهور',5),(41,'كفر الدوار',5),(42,'رشيد',5),(43,'ادكو',5),(44,'مرسى مطروح',6),(45,'العلمين',6),(46,'الضبعه',6),(47,'سيوه',6),(48,'الزقازيق',8),(49,'العاشر من رمضان',8),(50,'منيا القمح',8),(51,'بلبيس',8),(52,'اجا',7),(53,'جمصه',7),(54,'دسوق',11),(55,'دمياط',12),(56,'دمياط الجديده',12),(57,'راس البر',12),(58,'كفر سعد',12),(59,'الزرقا',12),(60,'فارسكور',12),(61,'كفر البطيخ',12),(62,'تلبانه',7),(63,'البحيره',5),(64,'بهتيم',4);
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
INSERT INTO `companies` VALUES (1,'نيوريفينا','Nurivina','126067','686642732','','تجارية','01554789988⁩','business.support@nurivina.com','https://nurivina.com/?srsltid=AfmBOopJeOYmRujkt49kV2ortcLMH_3l9TsVcfNK2VyJCcvVowmSAn3x','uploads/companies/logo-1767470648310-949472272.png',' المنصورة-المجزر الالى -التعاونيات عماره 12 \r\n',4,'2020-01-03',1,'2026-01-03 20:04:08','2026-01-06 09:50:33');
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_inventory`
--

LOCK TABLES `current_inventory` WRITE;
/*!40000 ALTER TABLE `current_inventory` DISABLE KEYS */;
INSERT INTO `current_inventory` VALUES (1,10,1,1368,'2026-01-12 10:07:34'),(2,6,1,2240,'2026-01-11 20:43:07'),(3,1,1,2240,'2026-01-11 20:39:29'),(4,2,1,2465,'2026-01-12 10:07:34'),(5,3,1,3303,'2026-01-12 08:32:08'),(6,4,1,2408,'2026-01-12 08:32:08'),(7,5,1,1900,'2026-01-12 08:32:08'),(8,6,7,10,'2026-01-11 19:04:12'),(9,1,7,3,'2026-01-11 19:05:45'),(10,2,7,4,'2026-01-11 19:06:50'),(11,4,7,5,'2026-01-11 19:08:17'),(12,3,7,4,'2026-01-11 19:09:14'),(13,10,3,75,'2026-01-12 10:08:52'),(14,6,3,35,'2026-01-11 19:12:54'),(15,1,3,57,'2026-01-11 20:47:06'),(16,2,3,78,'2026-01-11 20:47:06'),(17,4,3,18,'2026-01-11 19:17:03'),(18,3,3,71,'2026-01-12 10:08:52'),(19,10,2,185,'2026-01-12 10:08:52'),(20,6,2,113,'2026-01-11 22:11:11'),(21,1,2,130,'2026-01-12 20:08:53'),(22,2,2,273,'2026-01-12 20:08:53'),(23,4,2,138,'2026-01-12 08:32:08'),(24,3,2,97,'2026-01-12 10:08:52'),(25,5,2,130,'2026-01-12 08:32:08'),(26,1,6,6,'2026-01-11 19:31:44'),(27,2,6,7,'2026-01-11 19:32:52'),(28,4,6,6,'2026-01-11 19:34:25'),(29,3,6,3,'2026-01-11 19:35:45'),(30,5,6,1,'2026-01-11 19:36:45'),(31,5,3,20,'2026-01-11 20:47:06'),(32,10,7,10,'2026-01-11 20:48:24');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'هاني احمد صلاح',1,4,'01555522404⁩','business.support@nurivina.com','2020-01-03','ACTIVE',NULL),(2,'ساره محمود عبد الحفيظ صالح',2,1,'01006882671⁩','sarah.mahmoud.ze@gmail.com','2022-07-06','ACTIVE',1),(3,'بيتر وجدي',2,1,'01270353334⁩','','2022-01-01','ACTIVE',1),(4,'عبدالله محمود عبد الحفيظ صالح',7,1,'01065819852','abdallah.mahmoud.te@gmail.com','2025-03-11','ACTIVE',1),(5,'يمنى ايمن',3,1,'01022027104','','2025-09-01','ACTIVE',2),(6,'منه خالد المصري',3,1,'01067072078⁩','','2025-08-03','ACTIVE',2),(7,'احمد فريد',7,1,'01280227610','','2025-11-01','ACTIVE',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction_batches`
--

LOCK TABLES `inventory_transaction_batches` WRITE;
/*!40000 ALTER TABLE `inventory_transaction_batches` DISABLE KEYS */;
INSERT INTO `inventory_transaction_batches` VALUES (1,1,1,1600,47.50),(2,2,2,2352,89.70),(3,3,3,2352,55.30),(4,4,4,2688,98.89),(5,5,5,3456,44.75),(6,6,6,2511,39.83),(7,7,7,1988,22.70),(8,8,2,10,89.70),(9,9,3,3,55.30),(10,10,8,4,109.70),(11,11,6,5,39.83),(12,12,5,4,44.75),(13,13,1,40,47.50),(14,14,2,35,89.70),(15,15,3,27,55.30),(16,16,8,38,109.70),(17,17,6,18,39.83),(18,18,5,15,44.75),(19,19,1,8,47.50),(20,20,2,4,89.70),(21,21,3,59,55.30),(22,22,8,3,109.70),(23,23,4,98,98.98),(24,24,6,35,39.83),(25,25,5,10,44.75),(26,26,7,62,22.70),(27,27,3,6,55.30),(28,28,8,7,109.70),(29,29,6,6,39.83),(30,30,5,3,44.75),(31,31,7,1,22.70),(32,32,1,80,47.50),(33,33,1,80,47.50),(34,34,5,41,44.75),(35,35,5,41,44.75),(36,36,6,47,39.83),(37,37,6,47,39.83),(38,38,4,112,98.89),(39,39,4,112,98.89),(40,40,3,112,55.30),(41,41,3,112,55.30),(42,42,2,112,89.70),(43,43,2,112,89.70),(44,44,5,56,44.75),(45,45,5,56,44.75),(46,46,1,80,47.50),(47,47,1,80,47.50),(48,48,5,36,44.75),(49,49,5,36,44.75),(50,50,7,20,22.70),(51,51,7,20,22.70),(52,52,3,30,55.30),(53,53,3,30,55.30),(54,54,4,40,98.89),(55,55,4,40,98.89),(56,56,1,10,47.50),(57,57,1,10,47.50),(58,58,5,10,44.75),(59,59,1,10,47.50),(60,60,2,3,89.70),(61,61,5,56,44.75),(62,62,5,56,44.75),(63,63,6,56,39.83),(64,64,6,56,39.83),(65,65,7,88,22.70),(66,66,7,88,22.70),(67,67,4,111,98.89),(68,68,4,111,98.89),(69,69,1,72,47.50),(70,70,1,72,47.50),(71,71,1,45,47.50),(72,72,1,45,47.50),(73,73,5,20,44.75),(74,74,5,20,44.75),(75,75,3,11,55.30),(76,76,4,11,98.89);
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
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,10,1,'in','2026-01-01 00:00:00','','opening',NULL),(2,6,1,'in','2026-01-01 00:00:00','','opening',NULL),(3,1,1,'in','2026-01-01 00:00:00','','opening',NULL),(4,2,1,'in','2026-01-01 00:00:00','','opening',NULL),(5,3,1,'in','2026-01-01 00:00:00','','opening',NULL),(6,4,1,'in','2026-01-01 00:00:00','','opening',NULL),(7,5,1,'in','2026-01-01 00:00:00','','opening',NULL),(8,6,7,'in','2026-01-01 00:00:00','','opening',NULL),(9,1,7,'in','2026-01-01 00:00:00','','opening',NULL),(10,2,7,'in','2026-01-01 00:00:00','','opening',NULL),(11,4,7,'in','2026-01-01 00:00:00','','opening',NULL),(12,3,7,'in','2026-01-01 00:00:00','','opening',NULL),(13,10,3,'in','2026-01-01 00:00:00','','opening',NULL),(14,6,3,'in','2026-01-01 00:00:00','','opening',NULL),(15,1,3,'in','2026-01-01 00:00:00','','opening',NULL),(16,2,3,'in','2026-01-01 00:00:00','','opening',NULL),(17,4,3,'in','2026-01-01 00:00:00','','opening',NULL),(18,3,3,'in','2026-01-01 00:00:00','','opening',NULL),(19,10,2,'in','2026-01-01 00:00:00','','opening',NULL),(20,6,2,'in','2026-01-01 00:00:00','','opening',NULL),(21,1,2,'in','2026-01-01 00:00:00','','opening',NULL),(22,2,2,'in','2026-01-01 00:00:00','','opening',NULL),(23,2,2,'in','2026-01-01 00:00:00','','opening',NULL),(24,4,2,'in','2026-01-01 00:00:00','','opening',NULL),(25,3,2,'in','2026-01-01 00:00:00','','opening',NULL),(26,5,2,'in','2026-01-01 00:00:00','','opening',NULL),(27,1,6,'in','2026-01-01 00:00:00','','opening',NULL),(28,2,6,'in','2026-01-01 00:00:00','','opening',NULL),(29,4,6,'in','2026-01-01 00:00:00','','opening',NULL),(30,3,6,'in','2026-01-01 00:00:00','','opening',NULL),(31,5,6,'in','2026-01-01 00:00:00','','opening',NULL),(32,10,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(33,10,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(34,3,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(35,3,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(36,4,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(37,4,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(38,2,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(39,2,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(40,1,1,'out','2026-01-04 20:37:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(41,1,2,'in','2026-01-04 20:37:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(42,6,1,'out','2026-01-05 20:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',2),(43,6,2,'in','2026-01-05 20:42:00','تحويل من مخزن المخزن الرئيسي','transfer',2),(44,3,1,'out','2026-01-05 20:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',2),(45,3,2,'in','2026-01-05 20:42:00','تحويل من مخزن المخزن الرئيسي','transfer',2),(46,10,1,'out','2026-01-05 20:42:00','تحويل إلى مخزن التوريد الرئيسي','transfer',2),(47,10,2,'in','2026-01-05 20:42:00','تحويل من مخزن المخزن الرئيسي','transfer',2),(48,3,2,'out','2026-01-05 20:45:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(49,3,3,'in','2026-01-05 20:45:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(50,5,2,'out','2026-01-05 20:45:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(51,5,3,'in','2026-01-05 20:45:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(52,1,2,'out','2026-01-05 20:45:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(53,1,3,'in','2026-01-05 20:45:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(54,2,2,'out','2026-01-05 20:45:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',3),(55,2,3,'in','2026-01-05 20:45:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',3),(56,10,3,'out','2026-01-05 20:47:00','تحويل إلى مخزن الاسكندرية الفرعي','transfer',4),(57,10,7,'in','2026-01-05 20:47:00','تحويل من مخزن مخزن الاسكندريه الرئيسي','transfer',4),(58,3,2,'out','2026-01-06 00:00:00','Issue Voucher #IV-1768167823264','issue_voucher',1),(59,10,2,'out','2026-01-10 00:00:00','Issue Voucher #IV-1768169384468','issue_voucher',2),(60,6,2,'out','2026-01-10 00:00:00','Issue Voucher #IV-1768169384468','issue_voucher',3),(61,3,1,'out','2026-01-11 08:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',5),(62,3,2,'in','2026-01-11 08:31:00','تحويل من مخزن المخزن الرئيسي','transfer',5),(63,4,1,'out','2026-01-11 08:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',5),(64,4,2,'in','2026-01-11 08:31:00','تحويل من مخزن المخزن الرئيسي','transfer',5),(65,5,1,'out','2026-01-11 08:31:00','تحويل إلى مخزن التوريد الرئيسي','transfer',5),(66,5,2,'in','2026-01-11 08:31:00','تحويل من مخزن المخزن الرئيسي','transfer',5),(67,2,1,'out','2026-01-12 10:06:00','تحويل إلى مخزن التوريد الرئيسي','transfer',6),(68,2,2,'in','2026-01-12 10:06:00','تحويل من مخزن المخزن الرئيسي','transfer',6),(69,10,1,'out','2026-01-12 10:06:00','تحويل إلى مخزن التوريد الرئيسي','transfer',6),(70,10,2,'in','2026-01-12 10:06:00','تحويل من مخزن المخزن الرئيسي','transfer',6),(71,10,2,'out','2026-01-12 10:08:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',7),(72,10,3,'in','2026-01-12 10:08:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',7),(73,3,2,'out','2026-01-12 10:08:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',7),(74,3,3,'in','2026-01-12 10:08:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',7),(75,1,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000030','sales_invoice',52),(76,2,2,'out','2026-01-12 00:00:00','Sales Invoice #SI-2026-000030','sales_invoice',53);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_voucher_items`
--

LOCK TABLES `issue_voucher_items` WRITE;
/*!40000 ALTER TABLE `issue_voucher_items` DISABLE KEYS */;
INSERT INTO `issue_voucher_items` VALUES (1,1,3,'001','2028-10-01',10.000,44.75,'','2026-01-11 21:45:15','2026-01-11 21:45:15'),(2,2,10,'001','2028-12-01',10.000,47.50,'','2026-01-11 22:11:11','2026-01-11 22:11:11'),(3,2,6,'002','2028-11-01',3.000,89.70,'','2026-01-11 22:11:11','2026-01-11 22:11:11');
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
  KEY `fk_iv_party` (`party_id`),
  KEY `fk_iv_warehouse` (`warehouse_id`),
  KEY `fk_iv_employee` (`employee_id`),
  KEY `fk_issueVoucher_doctor` (`doctor_id`),
  CONSTRAINT `fk_issueVoucher_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  CONSTRAINT `fk_iv_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_iv_party` FOREIGN KEY (`party_id`) REFERENCES `parties` (`id`),
  CONSTRAINT `fk_iv_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_vouchers`
--

LOCK TABLES `issue_vouchers` WRITE;
/*!40000 ALTER TABLE `issue_vouchers` DISABLE KEYS */;
INSERT INTO `issue_vouchers` VALUES (1,'IV-1768167823264',1,NULL,2,NULL,NULL,'draft','2026-01-06','تهويضات عروض 1+50% عن شهر 12','2026-01-11 21:45:15','2026-01-11 21:45:15',78,NULL),(2,'IV-1768169384468',NULL,2,2,NULL,NULL,'draft','2026-01-10','','2026-01-11 22:11:11','2026-01-11 22:11:11',80,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
INSERT INTO `journal_entries` VALUES (1,'2026-01-11','قيد افتتاحي للمخزون - ',73,1,'2026-01-11 18:52:23','2026-01-11 18:52:23',1),(2,'2026-01-11','قيد افتتاحي للمخزون - ',73,2,'2026-01-11 18:53:43','2026-01-11 18:53:43',1),(3,'2026-01-11','قيد افتتاحي للمخزون - ',73,3,'2026-01-11 18:54:57','2026-01-11 18:54:57',1),(4,'2026-01-11','قيد افتتاحي للمخزون - ',73,4,'2026-01-11 18:57:01','2026-01-11 18:57:01',1),(5,'2026-01-11','قيد افتتاحي للمخزون - ',73,5,'2026-01-11 18:58:56','2026-01-11 18:58:56',1),(6,'2026-01-11','قيد افتتاحي للمخزون - ',73,6,'2026-01-11 19:01:24','2026-01-11 19:01:24',1),(7,'2026-01-11','قيد افتتاحي للمخزون - ',73,7,'2026-01-11 19:02:29','2026-01-11 19:02:29',1),(8,'2026-01-11','قيد افتتاحي للمخزون - ',73,8,'2026-01-11 19:04:12','2026-01-11 19:04:12',1),(9,'2026-01-11','قيد افتتاحي للمخزون - ',73,9,'2026-01-11 19:05:45','2026-01-11 19:05:45',1),(10,'2026-01-11','قيد افتتاحي للمخزون - ',73,10,'2026-01-11 19:06:50','2026-01-11 19:06:50',1),(11,'2026-01-11','قيد افتتاحي للمخزون - ',73,11,'2026-01-11 19:08:17','2026-01-11 19:08:17',1),(12,'2026-01-11','قيد افتتاحي للمخزون - ',73,12,'2026-01-11 19:09:14','2026-01-11 19:09:14',1),(13,'2026-01-11','قيد افتتاحي للمخزون - ',73,13,'2026-01-11 19:11:38','2026-01-11 19:11:38',1),(14,'2026-01-11','قيد افتتاحي للمخزون - ',73,14,'2026-01-11 19:12:54','2026-01-11 19:12:54',1),(15,'2026-01-11','قيد افتتاحي للمخزون - ',73,15,'2026-01-11 19:14:30','2026-01-11 19:14:30',1),(16,'2026-01-11','قيد افتتاحي للمخزون - ',73,16,'2026-01-11 19:16:05','2026-01-11 19:16:05',1),(17,'2026-01-11','قيد افتتاحي للمخزون - ',73,17,'2026-01-11 19:17:03','2026-01-11 19:17:03',1),(18,'2026-01-11','قيد افتتاحي للمخزون - ',73,18,'2026-01-11 19:19:24','2026-01-11 19:19:24',1),(19,'2026-01-11','قيد افتتاحي للمخزون - ',73,19,'2026-01-11 19:20:44','2026-01-11 19:20:44',1),(21,'2026-01-11','قيد افتتاحي للمخزون - ',73,21,'2026-01-11 19:23:30','2026-01-11 19:23:30',1),(22,'2026-01-11','قيد افتتاحي للمخزون - ',73,22,'2026-01-11 19:25:05','2026-01-11 19:25:05',1),(23,'2026-01-11','قيد افتتاحي للمخزون - ',73,23,'2026-01-11 19:26:10','2026-01-11 19:26:10',1),(24,'2026-01-11','قيد افتتاحي للمخزون - ',73,24,'2026-01-11 19:27:30','2026-01-11 19:27:30',1),(25,'2026-01-11','قيد افتتاحي للمخزون - ',73,25,'2026-01-11 19:29:30','2026-01-11 19:29:30',1),(28,'2026-01-11','قيد افتتاحي للمخزون - ',73,28,'2026-01-11 19:32:52','2026-01-11 19:32:52',1),(29,'2026-01-11','قيد افتتاحي للمخزون - ',73,29,'2026-01-11 19:34:25','2026-01-11 19:34:25',1),(32,'2026-01-01','قيد افتتاحي – مستحقات لدى شركة الشحن',75,NULL,'2026-01-11 21:04:12','2026-01-11 21:04:12',1),(33,'2026-01-06','قيد سند صرف مخزني رقم #IV-1768167823264 - تهويضات عروض 1+50% عن شهر 12',76,1,'2026-01-11 21:45:15','2026-01-11 21:45:15',82),(34,'2026-01-10','قيد سند صرف مخزني رقم #IV-1768169384468 - ',76,2,'2026-01-11 22:11:11','2026-01-11 22:11:11',82),(35,'2026-01-08','التحويل الاسبوعي من خزينة شركة الشحن',75,NULL,'2026-01-11 22:18:40','2026-01-11 22:18:40',63),(36,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000026',73,26,'2026-01-12 19:38:03','2026-01-12 19:38:03',1),(37,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000026 - cash',74,1,'2026-01-12 19:41:17','2026-01-12 19:41:17',3),(38,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000027',73,27,'2026-01-12 19:50:52','2026-01-12 19:50:52',1),(39,'2026-01-10','تحصيل فاتورة مبيعات #SI-2026-000027 - cash',74,2,'2026-01-12 19:52:37','2026-01-12 19:52:37',3),(40,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000020',73,20,'2026-01-12 19:54:38','2026-01-12 19:54:38',1),(41,'2026-01-06','تحصيل فاتورة مبيعات #SI-2026-000020 - cash',74,3,'2026-01-12 19:55:17','2026-01-12 19:55:17',3),(42,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000031',73,31,'2026-01-12 20:00:37','2026-01-12 20:00:37',1),(43,'2026-01-12','تحصيل فاتورة مبيعات #SI-2026-000031 - cash',74,4,'2026-01-12 20:02:13','2026-01-12 20:02:13',3),(44,'2026-01-12','قيد إثبات مبيعات - فاتورة #SI-2026-000030',16,30,'2026-01-12 20:08:53','2026-01-12 20:08:53',2),(45,'2026-01-12','قيد تكلفة مبيعات - فاتورة #SI-2026-000030',17,30,'2026-01-12 20:08:53','2026-01-12 20:08:53',2),(46,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000032',73,32,'2026-01-12 20:18:36','2026-01-12 20:18:36',1),(47,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000033',73,33,'2026-01-12 20:23:40','2026-01-12 20:23:40',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_lines`
--

LOCK TABLES `journal_entry_lines` WRITE;
/*!40000 ALTER TABLE `journal_entry_lines` DISABLE KEYS */;
INSERT INTO `journal_entry_lines` VALUES (1,1,110,76000.00,0.00,'مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml - ','2026-01-11 18:52:23','2026-01-11 18:52:23'),(2,1,14,0.00,76000.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml','2026-01-11 18:52:23','2026-01-11 18:52:23'),(3,2,110,210974.40,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 18:53:43','2026-01-11 18:53:43'),(4,2,14,0.00,210974.40,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 18:53:43','2026-01-11 18:53:43'),(5,3,110,130065.60,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 18:54:57','2026-01-11 18:54:57'),(6,3,14,0.00,130065.60,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 18:54:57','2026-01-11 18:54:57'),(7,4,110,265816.32,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 18:57:01','2026-01-11 18:57:01'),(8,4,14,0.00,265816.32,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 18:57:01','2026-01-11 18:57:01'),(9,5,110,154656.00,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 18:58:56','2026-01-11 18:58:56'),(10,5,14,0.00,154656.00,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 18:58:56','2026-01-11 18:58:56'),(11,6,110,100013.13,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:01:24','2026-01-11 19:01:24'),(12,6,14,0.00,100013.13,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:01:24','2026-01-11 19:01:24'),(13,7,110,45127.60,0.00,'مخزون افتتاحي - Nurivina whitening Cream 50gm - ','2026-01-11 19:02:29','2026-01-11 19:02:29'),(14,7,14,0.00,45127.60,'رأس المال - مخزون افتتاحي - Nurivina whitening Cream 50gm','2026-01-11 19:02:29','2026-01-11 19:02:29'),(15,8,110,897.00,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 19:04:12','2026-01-11 19:04:12'),(16,8,14,0.00,897.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 19:04:12','2026-01-11 19:04:12'),(17,9,110,165.90,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:05:45','2026-01-11 19:05:45'),(18,9,14,0.00,165.90,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:05:45','2026-01-11 19:05:45'),(19,10,110,438.80,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:06:50','2026-01-11 19:06:50'),(20,10,14,0.00,438.80,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:06:50','2026-01-11 19:06:50'),(21,11,110,199.15,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:08:17','2026-01-11 19:08:17'),(22,11,14,0.00,199.15,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:08:17','2026-01-11 19:08:17'),(23,12,110,179.00,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:09:14','2026-01-11 19:09:14'),(24,12,14,0.00,179.00,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:09:14','2026-01-11 19:09:14'),(25,13,110,1900.00,0.00,'مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml - ','2026-01-11 19:11:38','2026-01-11 19:11:38'),(26,13,14,0.00,1900.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml','2026-01-11 19:11:38','2026-01-11 19:11:38'),(27,14,110,3139.50,0.00,'مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml - ','2026-01-11 19:12:54','2026-01-11 19:12:54'),(28,14,14,0.00,3139.50,'رأس المال - مخزون افتتاحي - Nurivina Anti-Hair Loss Spray 100ml','2026-01-11 19:12:54','2026-01-11 19:12:54'),(29,15,110,1493.10,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:14:30','2026-01-11 19:14:30'),(30,15,14,0.00,1493.10,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:14:30','2026-01-11 19:14:30'),(31,16,110,4168.60,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:16:05','2026-01-11 19:16:05'),(32,16,14,0.00,4168.60,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:16:05','2026-01-11 19:16:05'),(33,17,110,716.94,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:17:03','2026-01-11 19:17:03'),(34,17,14,0.00,716.94,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:17:03','2026-01-11 19:17:03'),(35,18,110,671.25,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:19:24','2026-01-11 19:19:24'),(36,18,14,0.00,671.25,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:19:24','2026-01-11 19:19:24'),(37,19,110,380.00,0.00,'مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml - ','2026-01-11 19:20:44','2026-01-11 19:20:44'),(38,19,14,0.00,380.00,'رأس المال - مخزون افتتاحي - Nurivina Anti-Dandruff Shampoo 150ml','2026-01-11 19:20:44','2026-01-11 19:20:44'),(41,21,110,3262.70,0.00,'مخزون افتتاحي - Nurivina Argan Oil 100ml - ','2026-01-11 19:23:30','2026-01-11 19:23:30'),(42,21,14,0.00,3262.70,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil 100ml','2026-01-11 19:23:30','2026-01-11 19:23:30'),(43,22,110,329.10,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:25:05','2026-01-11 19:25:05'),(44,22,14,0.00,329.10,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:25:05','2026-01-11 19:25:05'),(45,23,110,9700.04,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:26:10','2026-01-11 19:26:10'),(46,23,14,0.00,9700.04,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:26:10','2026-01-11 19:26:10'),(47,24,110,1394.05,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:27:30','2026-01-11 19:27:30'),(48,24,14,0.00,1394.05,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:27:30','2026-01-11 19:27:30'),(49,25,110,447.50,0.00,'مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml - ','2026-01-11 19:29:30','2026-01-11 19:29:30'),(50,25,14,0.00,447.50,'رأس المال - مخزون افتتاحي - Nurivina Omega Anti-Hair Loss Shampoo 220ml','2026-01-11 19:29:30','2026-01-11 19:29:30'),(55,28,110,767.90,0.00,'مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml - ','2026-01-11 19:32:52','2026-01-11 19:32:52'),(56,28,14,0.00,767.90,'رأس المال - مخزون افتتاحي - Nurivina Argan Oil Hair Serum 100ml','2026-01-11 19:32:52','2026-01-11 19:32:52'),(57,29,110,238.98,0.00,'مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml - ','2026-01-11 19:34:25','2026-01-11 19:34:25'),(58,29,14,0.00,238.98,'رأس المال - مخزون افتتاحي - Nurivina Argan oil Leave in Conditioner 220ml','2026-01-11 19:34:25','2026-01-11 19:34:25'),(63,32,42,8211.98,0.00,'رصيد افتتاحي','2026-01-11 21:04:12','2026-01-11 21:04:12'),(64,32,14,0.00,8211.98,'رصيد افتتاحي','2026-01-11 21:04:12','2026-01-11 21:04:12'),(65,33,78,447.50,0.00,'سند صرف مخزني رقم #IV-1768167823264','2026-01-11 21:45:15','2026-01-11 21:45:15'),(66,33,110,0.00,447.50,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768167823264','2026-01-11 21:45:15','2026-01-11 21:45:15'),(67,34,80,744.10,0.00,'سند صرف مخزني رقم #IV-1768169384468','2026-01-11 22:11:11','2026-01-11 22:11:11'),(68,34,110,0.00,744.10,'مخزون تام الصنع - سند صرف مخزني رقم #IV-1768169384468','2026-01-11 22:11:11','2026-01-11 22:11:11'),(69,35,43,8186.98,0.00,'ايداع المستحقات إلى حساب البنك الأهلي','2026-01-11 22:18:40','2026-01-11 22:18:40'),(70,35,42,0.00,8186.98,'سحب المستحقات من حساب خزينة شركة الشحن','2026-01-11 22:18:40','2026-01-11 22:18:40'),(71,36,47,54165.99,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000026','2026-01-12 19:38:03','2026-01-12 19:38:03'),(72,36,14,0.00,54165.99,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000026','2026-01-12 19:38:03','2026-01-12 19:38:03'),(73,37,43,34411.43,0.00,'تحصيل - cash','2026-01-12 19:41:17','2026-01-12 19:41:17'),(74,37,47,0.00,34411.43,'تخفيض مديونية العميل','2026-01-12 19:41:17','2026-01-12 19:41:17'),(75,38,47,34968.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000027','2026-01-12 19:50:52','2026-01-12 19:50:52'),(76,38,14,0.00,34968.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000027','2026-01-12 19:50:52','2026-01-12 19:50:52'),(77,39,43,4585.00,0.00,'تحصيل - cash','2026-01-12 19:52:37','2026-01-12 19:52:37'),(78,39,47,0.00,4585.00,'تخفيض مديونية العميل','2026-01-12 19:52:37','2026-01-12 19:52:37'),(79,40,47,1630.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000020','2026-01-12 19:54:38','2026-01-12 19:54:38'),(80,40,14,0.00,1630.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000020','2026-01-12 19:54:38','2026-01-12 19:54:38'),(81,41,41,1630.00,0.00,'تحصيل - cash','2026-01-12 19:55:17','2026-01-12 19:55:17'),(82,41,47,0.00,1630.00,'تخفيض مديونية العميل','2026-01-12 19:55:17','2026-01-12 19:55:17'),(83,42,47,35387.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000031','2026-01-12 20:00:37','2026-01-12 20:00:37'),(84,42,14,0.00,35387.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000031','2026-01-12 20:00:37','2026-01-12 20:00:37'),(85,43,41,18000.00,0.00,'تحصيل - cash','2026-01-12 20:02:13','2026-01-12 20:02:13'),(86,43,47,0.00,18000.00,'تخفيض مديونية العميل','2026-01-12 20:02:13','2026-01-12 20:02:13'),(87,44,28,0.00,6080.00,'إيراد مبيعات - فاتورة #SI-2026-000030','2026-01-12 20:08:53','2026-01-12 20:08:53'),(88,44,47,6080.00,0.00,'مديونية عميل - فاتورة #SI-2026-000030','2026-01-12 20:08:53','2026-01-12 20:08:53'),(89,45,15,1696.09,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000030','2026-01-12 20:08:53','2026-01-12 20:08:53'),(90,45,110,0.00,1696.09,'مخزون تام الصنع - فاتورة #SI-2026-000030','2026-01-12 20:08:53','2026-01-12 20:08:53'),(91,46,47,6230.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000032','2026-01-12 20:18:36','2026-01-12 20:18:36'),(92,46,14,0.00,6230.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000032','2026-01-12 20:18:36','2026-01-12 20:18:36'),(93,47,47,71674.43,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000033','2026-01-12 20:23:40','2026-01-12 20:23:40'),(94,47,14,0.00,71674.43,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000033','2026-01-12 20:23:40','2026-01-12 20:23:40');
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
INSERT INTO `parties` VALUES (1,'ال عبد اللطيف الطرشوبى','customer','','','','',4,47,0.00,'2025-12-15 14:43:54',2),(2,'سالي','customer','','','','',4,47,0.00,'2025-12-15 14:50:27',2),(3,'مخزن د/ مصطفى نبيل الطرشوبي لتجارة الادوية بالجملة','customer','','','','',4,47,0.00,'2025-12-15 14:53:13',2),(4,'شركة هيلثي للصناعات الدوائية والطبية','customer','','','17 شارع شريف الراضي - توريل - المنصوره','',4,47,0.00,'2025-12-15 14:53:33',3),(5,'نيوكيان','customer','','','','',4,47,0.00,'2025-12-15 14:53:52',3),(6,'الطيبى','customer','','','','',37,47,0.00,'2025-12-15 14:56:57',2),(7,'رمضان','customer','','','','',37,47,0.00,'2025-12-15 14:57:24',1),(8,'خالد محمد','customer','','','','',37,47,0.00,'2025-12-15 14:57:52',1),(9,'القبطان','customer','','','','',37,47,0.00,'2025-12-15 15:24:03',1),(10,'الشمس','customer','','','','',48,47,0.00,'2025-12-15 15:27:50',3),(11,'بيت المقدس','customer','','','','',55,47,0.00,'2025-12-15 15:28:13',3),(12,'بيت الادويه','customer','','','','',55,47,0.00,'2025-12-15 15:28:33',3),(13,'عامر','customer','','','','',55,47,0.00,'2025-12-15 15:29:27',1),(14,'وجيه','customer','','','','',5,47,0.00,'2025-12-15 15:35:10',1),(15,'هاجر وشروق','customer','','','','',13,47,0.00,'2025-12-15 15:35:32',3),(16,'رضا عطيه','customer','','','','',3,47,0.00,'2025-12-15 15:36:05',3),(17,'الاندلس','customer','','','','',13,47,0.00,'2025-12-15 15:36:24',3),(18,'هشام وفؤاد','customer','','','','',13,47,0.00,'2025-12-15 15:36:52',2),(19,'تهانى','customer','','','','',2,47,0.00,'2025-12-15 15:37:59',1),(23,'خليفه','customer','','','','',4,47,0.00,'2026-01-05 15:54:41',2),(24,'مارمرقس','customer','','','','',37,47,0.00,'2026-01-05 16:04:21',7),(25,'خليل','customer','','','','',37,47,0.00,'2026-01-05 16:07:47',3),(26,'وليد الطرشوبي','customer','','','المنصوره','',4,47,0.00,'2026-01-07 00:08:10',2),(27,'عبد الرازق','customer','','','','',62,47,0.00,'2026-01-07 00:20:01',1),(28,'مبيعات نقديه','customer','','','المنصوره','',4,47,0.00,'2026-01-07 00:47:57',6),(29,'مها الجيار','customer','','','','',4,47,0.00,'2026-01-07 00:56:16',9),(30,'مبيعات نقديه','customer','','','','',63,47,0.00,'2026-01-07 01:20:51',6),(31,'عمرو سمير','customer','','','','',6,47,0.00,'2026-01-09 19:48:49',1),(32,'مبيعات نقديه','customer','','','','',13,47,0.00,'2026-01-10 15:13:39',6),(33,'مبيعات نقديه','customer','','','','',20,47,0.00,'2026-01-10 15:53:11',6),(34,'مرعي','customer','','','','',64,47,0.00,'2026-01-10 16:01:55',1),(40,'الدوليه','customer','','','','',63,47,0.00,'2026-01-11 20:17:51',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nurivina Argan Oil 100ml',1,330.00,1,'2025-12-13 15:00:23',0.00),(2,'Nurivina Argan Oil Hair Serum 100ml',1,430.00,1,'2025-12-13 15:01:00',0.00),(3,'Nurivina Omega Anti-Hair Loss Shampoo 220ml',1,250.00,1,'2025-12-13 15:01:39',0.00),(4,'Nurivina Argan oil Leave in Conditioner 220ml',1,270.00,1,'2025-12-13 15:02:34',0.00),(5,'Nurivina whitening Cream 50gm',1,240.00,1,'2025-12-13 15:03:07',0.00),(6,'Nurivina Anti-Hair Loss Spray 100ml',1,520.00,1,'2025-12-13 15:04:41',0.00),(10,'Nurivina Anti-Dandruff Shampoo 150ml',1,220.00,1,'2026-01-03 20:26:00',0.00);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_invoices`
--

LOCK TABLES `purchase_invoices` WRITE;
/*!40000 ALTER TABLE `purchase_invoices` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_types`
--

LOCK TABLES `reference_types` WRITE;
/*!40000 ALTER TABLE `reference_types` DISABLE KEYS */;
INSERT INTO `reference_types` VALUES (16,'sales_invoice','فاتورة مبيعات','قيود فواتير المبيعات','2026-01-01 07:10:00','2026-01-01 07:10:00'),(17,'sales_invoice_cost','تكلفة بضاعة مباعة','COGS Journal Entry for Sales Invoice','2026-01-01 07:12:00','2026-01-01 07:12:00'),(18,'sales_return','مرتجع مبيعات','قيود مرتجعات المبيعات','2026-01-01 07:14:00','2026-01-01 07:14:00'),(19,'credit_note','إشعار دائن','تسجيل إشعارات الدائنين أو العملاء','2026-01-01 07:16:00','2026-01-01 07:16:00'),(20,'debit_note','إشعار مدين','تسجيل إشعارات المدينين أو العملاء','2026-01-01 07:18:00','2026-01-01 07:18:00'),(21,'purchase_invoice','فاتورة مشتريات','قيود فواتير المشتريات','2026-01-01 07:20:00','2026-01-01 07:20:00'),(22,'purchase_return','مرتجع مشتريات','قيود مرتجعات المشتريات','2026-01-01 07:22:00','2026-01-01 07:22:00'),(23,'supplier_advance','دفعة مقدمة للمورد','تسجيل دفعات مقدمة للموردين','2026-01-01 07:24:00','2026-01-01 07:24:00'),(24,'inventory_purchase','شراء مخزون','تسجيل شراء المخزون للسلع','2026-01-01 07:26:00','2026-01-01 07:26:00'),(25,'inventory_sale','بيع مخزون','تسجيل بيع المخزون للسلع','2026-01-01 07:28:00','2026-01-01 07:28:00'),(26,'inventory_return','مرتجع مخزون','تسجيل المرتجعات من المخزون للعملاء أو الموردين','2026-01-01 07:30:00','2026-01-01 07:30:00'),(27,'inventory_adjustment','تسوية مخزنية','Inventory Adjustment Transaction','2026-01-01 07:32:00','2026-01-01 07:32:00'),(28,'inventory_transfer','نقل مخزون','تسجيل نقل المخزون بين المخازن','2026-01-01 07:34:00','2026-01-01 07:34:00'),(29,'inventory_count','جرد مخزون','تسجيل نتائج الجرد الدوري للمخزون','2026-01-01 07:36:00','2026-01-01 07:36:00'),(30,'write_off','شطب أصول','تسجيل شطب الأصول أو المخزون غير الصالح','2026-01-01 07:38:00','2026-01-01 07:38:00'),(31,'payment','دفعة مالية','تسجيل مدفوعات نقدية أو تحويلات','2026-01-01 07:40:00','2026-01-01 07:40:00'),(32,'receipt','إيصال استلام نقدية','تسجيل المقبوضات النقدية أو التحويلات','2026-01-01 07:42:00','2026-01-01 07:42:00'),(33,'bank_transfer','تحويل بنكي','تسجيل التحويلات البنكية بين الحسابات','2026-01-01 07:44:00','2026-01-01 07:44:00'),(34,'cash_withdrawal','سحب نقدي','تسجيل عمليات سحب النقدية من الحسابات','2026-01-01 07:46:00','2026-01-01 07:46:00'),(35,'cash_deposit','إيداع نقدي','تسجيل إيداعات نقدية في الحسابات','2026-01-01 07:48:00','2026-01-01 07:48:00'),(36,'bank_fee','رسوم بنكية','تسجيل الرسوم المصروفة على الحسابات البنكية','2026-01-01 07:50:00','2026-01-01 07:50:00'),(37,'expense_invoice','فاتورة مصاريف','قيود فواتير المصاريف التشغيلية','2026-01-01 07:52:00','2026-01-01 07:52:00'),(38,'petty_cash_expense','مصروف صندوق الصغير','تسجيل مصروفات صندوق الصغير','2026-01-01 07:54:00','2026-01-01 07:54:00'),(39,'utilities_payment','دفع خدمات','تسجيل المدفوعات لفواتير الخدمات مثل الكهرباء والماء','2026-01-01 07:56:00','2026-01-01 07:56:00'),(40,'utilities_expense','مصاريف خدمات','تسجيل المصروفات المستحقة لفواتير الخدمات','2026-01-01 07:58:00','2026-01-01 07:58:00'),(41,'misc_income','دخل متفرّق','تسجيل الدخل غير المصنف ضمن فئات أخرى','2026-01-01 08:00:00','2026-01-01 08:00:00'),(42,'misc_expense','مصروف متفرّق','تسجيل المصروفات غير المصنفة ضمن فئات أخرى','2026-01-01 08:02:00','2026-01-01 08:02:00'),(43,'prepaid_expense','مصروف مدفوع مسبقاً','تسجيل المصروفات المدفوعة مسبقًا','2026-01-01 08:04:00','2026-01-01 08:04:00'),(44,'accrued_expense','مصروف مستحق','تسجيل المصروفات المستحقة لم يتم دفعها بعد','2026-01-01 08:06:00','2026-01-01 08:06:00'),(45,'accrued_income','دخل مستحق','تسجيل الإيرادات المستحقة لم يتم تحصيلها بعد','2026-01-01 08:08:00','2026-01-01 08:08:00'),(46,'prepaid_income','دخل مدفوع مسبقاً','تسجيل الإيرادات المدفوعة مسبقًا','2026-01-01 08:10:00','2026-01-01 08:10:00'),(47,'fixed_asset_purchase','شراء أصل ثابت','تسجيل شراء الأصول الثابتة','2026-01-01 08:12:00','2026-01-01 08:12:00'),(48,'fixed_asset_depreciation','استهلاك أصل ثابت','تسجيل استهلاك الأصول الثابتة','2026-01-01 08:14:00','2026-01-01 08:14:00'),(49,'revaluation_gain','ربح إعادة تقييم','تسجيل أرباح إعادة تقييم الأصول','2026-01-01 08:16:00','2026-01-01 08:16:00'),(50,'revaluation_loss','خسارة إعادة تقييم','تسجيل خسائر إعادة تقييم الأصول','2026-01-01 08:18:00','2026-01-01 08:18:00'),(51,'interest_income','دخل فوائد','تسجيل الدخل الناتج عن الفوائد البنكية','2026-01-01 08:20:00','2026-01-01 08:20:00'),(52,'interest_expense','مصروف فوائد','تسجيل مصروفات الفوائد على القروض','2026-01-01 08:22:00','2026-01-01 08:22:00'),(53,'insurance_payment','دفع تأمين','تسجيل دفعات التأمينات المختلفة','2026-01-01 08:24:00','2026-01-01 08:24:00'),(54,'insurance_claim','مطالبة تأمين','تسجيل المطالبات المستلمة من شركات التأمين','2026-01-01 08:26:00','2026-01-01 08:26:00'),(55,'salary_payment','صرف رواتب','تسجيل صرف الرواتب الشهرية للموظفين','2026-01-01 08:28:00','2026-01-01 08:28:00'),(56,'bonus_payment','صرف مكافآت','تسجيل صرف المكافآت والمزايا للموظفين','2026-01-01 08:30:00','2026-01-01 08:30:00'),(57,'staff_advance','سلفة موظف','تسجيل السلف المقدمة للموظفين','2026-01-01 08:32:00','2026-01-01 08:32:00'),(58,'staff_advance_settlement','تسوية سلفة موظف','تسجيل تسوية السلف المستلمة من الموظفين','2026-01-01 08:34:00','2026-01-01 08:34:00'),(59,'expense_claim','مطالبة مصروف','تسجيل المطالبات بالمصاريف من الموظفين','2026-01-01 08:36:00','2026-01-01 08:36:00'),(60,'loan_payment','سداد قرض','تسجيل دفعات سداد القروض البنكية','2026-01-01 08:38:00','2026-01-01 08:38:00'),(61,'loan_receipt','استلام قرض','تسجيل استلام مبلغ قرض من البنك أو المقرض','2026-01-01 08:40:00','2026-01-01 08:40:00'),(62,'loan_interest_accrual','استحقاق فوائد قرض','تسجيل فوائد القروض المستحقة لم يتم دفعها بعد','2026-01-01 08:42:00','2026-01-01 08:42:00'),(63,'loan_principal_accrual','استحقاق أصل قرض','تسجيل أصل القروض المستحق لم يتم دفعه بعد','2026-01-01 08:44:00','2026-01-01 08:44:00'),(64,'bad_debt_writeoff','شطب ديون معدومة','تسجيل شطب الديون المستحقة غير القابلة للتحصيل','2026-01-01 08:46:00','2026-01-01 08:46:00'),(65,'capital_injection','إدخال رأس المال','تسجيل استثمار المالك في الشركة','2026-01-01 08:48:00','2026-01-01 08:48:00'),(66,'capital_withdrawal','سحب رأس المال','تسجيل سحب المالك لرأس المال','2026-01-01 08:50:00','2026-01-01 08:50:00'),(67,'dividend_payment','توزيع أرباح','تسجيل دفع الأرباح للمساهمين','2026-01-01 08:52:00','2026-01-01 08:52:00'),(68,'dividend_receipt','استلام أرباح','تسجيل استلام الأرباح من الاستثمارات','2026-01-01 08:54:00','2026-01-01 08:54:00'),(69,'profit_distribution','توزيع أرباح داخلي','تسجيل توزيع الأرباح بين الأقسام أو الشركاء','2026-01-01 08:56:00','2026-01-01 08:56:00'),(70,'foreign_exchange_gain','ربح صرف أجنبي','تسجيل أرباح فروق العملة الأجنبية','2026-01-01 08:58:00','2026-01-01 08:58:00'),(71,'foreign_exchange_loss','خسارة صرف أجنبي','تسجيل خسائر فروق العملة الأجنبية','2026-01-01 09:00:00','2026-01-01 09:00:00'),(72,'provision','مخصصات','تسجيل المخصصات للمصروفات المستقبلية','2026-01-01 09:02:00','2026-01-01 09:02:00'),(73,'opening_balance','رصيد افتتاحي','قيود الأرصدة الافتتاحية','2026-01-05 08:07:07','2026-01-05 08:07:07'),(74,'sales_payment','تحصيل مبيعات','Journal Entry for Sales Payment/Collection','2026-01-06 00:52:38','2026-01-06 00:52:38'),(75,'manual_entry','قيد يدوي','قيد يومية يدوي','2026-01-10 09:07:33','2026-01-10 09:07:33'),(76,'issue_voucher','سند صرف مخزني','Journal Entry for Issue Voucher','2026-01-11 21:45:15','2026-01-11 21:45:15');
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
INSERT INTO `sales_invoice_items` VALUES (1,1,3,1,250.00,75.00,0.00,0.00,2,0,0.00,0.00),(2,2,2,1,430.00,129.00,0.00,0.00,2,0,0.00,0.00),(3,3,5,4,240.00,144.00,0.00,0.00,2,0,0.00,0.00),(4,4,2,50,430.00,8299.00,0.00,0.00,2,0,14.00,1848.14),(5,4,10,50,220.00,4246.00,0.00,0.00,2,0,14.00,945.56),(6,4,6,10,520.00,2007.20,0.00,0.00,2,0,14.00,446.99),(7,5,6,3,520.00,234.00,0.00,0.00,2,0,0.00,0.00),(8,6,1,2,330.00,165.00,0.00,0.00,2,0,0.00,0.00),(9,7,2,3,430.00,258.00,0.00,0.00,2,1,0.00,0.00),(10,7,4,3,270.00,162.00,0.00,0.00,2,0,0.00,0.00),(11,7,6,4,520.00,416.00,0.00,0.00,2,0,0.00,0.00),(12,8,3,20,250.00,2500.00,0.00,0.00,2,0,0.00,0.00),(13,8,4,20,270.00,2700.00,0.00,0.00,2,0,0.00,0.00),(14,8,10,20,220.00,2200.00,0.00,0.00,2,0,0.00,0.00),(15,9,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(16,9,2,10,430.00,1075.00,0.00,0.00,2,1,0.00,0.00),(17,10,10,30,220.00,1968.78,0.00,0.00,2,3,14.00,648.37),(18,11,6,20,520.00,4014.40,0.00,0.00,2,0,14.00,893.98),(19,11,1,20,330.00,2547.60,0.00,0.00,2,0,14.00,567.34),(20,11,2,10,430.00,1659.80,0.00,0.00,2,0,14.00,369.63),(21,11,3,20,250.00,1930.00,0.00,0.00,2,0,14.00,429.80),(22,11,5,35,240.00,3242.40,0.00,0.00,2,0,14.00,722.06),(23,12,1,20,330.00,990.00,0.00,0.00,2,1,0.00,0.00),(24,12,6,2,520.00,156.00,0.00,0.00,2,0,0.00,0.00),(25,12,10,2,220.00,66.00,0.00,0.00,2,0,0.00,0.00),(26,13,2,20,430.00,1892.00,0.00,0.00,2,2,0.00,0.00),(27,13,4,10,270.00,594.00,0.00,0.00,2,1,0.00,0.00),(28,13,10,10,220.00,484.00,0.00,0.00,2,1,0.00,0.00),(29,14,10,10,220.00,330.00,0.00,0.00,2,1,0.00,0.00),(30,14,2,10,430.00,645.00,0.00,0.00,2,1,0.00,0.00),(31,14,4,10,270.00,405.00,0.00,0.00,2,1,0.00,0.00),(32,14,3,10,250.00,375.00,0.00,0.00,2,1,0.00,0.00),(33,15,2,10,430.00,1204.00,0.00,0.00,2,0,0.00,0.00),(34,16,10,10,220.00,330.00,0.00,0.00,2,1,0.00,0.00),(35,17,2,1,430.00,107.50,0.00,0.00,2,0,0.00,0.00),(36,17,4,1,270.00,67.50,0.00,0.00,2,0,0.00,0.00),(37,18,3,4,250.00,300.00,0.00,0.00,2,0,0.00,0.00),(38,19,1,10,330.00,825.00,0.00,0.00,2,1,0.00,0.00),(39,21,2,25,430.00,2150.00,0.00,0.00,3,0,0.00,0.00),(40,21,6,5,520.00,520.00,0.00,0.00,3,0,0.00,0.00),(41,22,1,30,330.00,2970.00,0.00,0.00,3,6,14.00,970.20),(42,23,3,30,250.00,2250.00,0.00,0.00,3,6,14.00,735.00),(43,24,2,10,430.00,860.00,0.00,0.00,2,0,0.00,0.00),(44,24,4,10,270.00,540.00,0.00,0.00,2,0,0.00,0.00),(45,24,6,10,520.00,1040.00,0.00,0.00,2,0,0.00,0.00),(46,24,10,10,220.00,440.00,0.00,0.00,2,0,0.00,0.00),(47,25,1,15,330.00,742.50,0.00,0.00,2,3,0.00,0.00),(48,25,6,5,400.00,300.00,0.00,0.00,2,0,0.00,0.00),(49,28,1,20,330.00,1518.00,0.00,0.00,2,1,0.00,0.00),(50,28,2,20,430.00,1978.00,0.00,0.00,2,1,0.00,0.00),(51,29,2,20,430.00,1720.00,0.00,0.00,2,0,0.00,0.00),(52,30,1,10,330.00,660.00,0.00,0.00,2,1,0.00,0.00),(53,30,2,10,430.00,860.00,0.00,0.00,2,1,0.00,0.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_payments`
--

LOCK TABLES `sales_invoice_payments` WRITE;
/*!40000 ALTER TABLE `sales_invoice_payments` DISABLE KEYS */;
INSERT INTO `sales_invoice_payments` VALUES (1,26,'2026-01-06','cash',43,34411.43,NULL,'','2026-01-12 19:41:17','2026-01-12 19:41:17',4),(2,27,'2026-01-10','cash',43,4585.00,NULL,'','2026-01-12 19:52:37','2026-01-12 19:52:37',4),(3,20,'2026-01-06','cash',41,1630.00,NULL,'','2026-01-12 19:55:17','2026-01-12 19:55:17',4),(4,31,'2026-01-12','cash',41,18000.00,NULL,'','2026-01-12 20:02:13','2026-01-12 20:02:13',4);
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
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
INSERT INTO `sales_invoices` VALUES (1,'SI-2026-000001','draft','paid',NULL,28,'2026-01-03',NULL,0.00,NULL,'2026-01-10 14:26:57',5,2,175.00,0.00,0.00,0.00,0.00,0.00,175.00,'normal',''),(2,'SI-2026-000002','draft','paid',NULL,28,'2026-01-04',NULL,0.00,NULL,'2026-01-10 14:31:39',5,2,301.00,0.00,0.00,0.00,0.00,0.00,301.00,'normal',''),(3,'SI-2026-000003','draft','paid',NULL,8,'2026-01-04',NULL,0.00,NULL,'2026-01-10 14:33:45',3,2,816.00,0.00,0.00,0.00,0.00,0.00,816.00,'normal',''),(4,'SI-2026-000004','draft','unpaid',NULL,1,'2026-01-04',NULL,0.00,NULL,'2026-01-10 14:35:21',5,2,23147.80,0.00,0.00,3240.69,0.00,0.00,26388.49,'normal',''),(5,'SI-2026-000005','draft','paid',NULL,8,'2026-01-05',NULL,0.00,NULL,'2026-01-10 14:37:42',3,2,1326.00,0.00,0.00,0.00,0.00,0.00,1326.00,'normal',''),(6,'SI-2026-000006','draft','paid',NULL,30,'2026-01-05',NULL,65.00,NULL,'2026-01-10 14:39:22',3,2,495.00,0.00,0.00,0.00,0.00,0.00,560.00,'normal','كريم علي بلال'),(7,'SI-2026-000007','draft','unpaid',NULL,27,'2026-01-06',NULL,0.00,NULL,'2026-01-10 14:40:45',5,2,3344.00,0.00,0.00,0.00,0.00,0.00,3344.00,'normal',''),(8,'SI-2026-000008','draft','unpaid',NULL,29,'2026-01-06',NULL,0.00,NULL,'2026-01-10 14:42:13',5,2,7400.00,0.00,0.00,0.00,0.00,0.00,7400.00,'normal',''),(9,'SI-2026-000009','draft','unpaid',NULL,4,'2026-01-06',NULL,0.00,NULL,'2026-01-10 14:45:54',5,2,5700.00,0.00,0.00,0.00,0.00,0.00,5700.00,'normal',''),(10,'SI-2026-000010','draft','unpaid',NULL,26,'2026-01-06',NULL,0.00,NULL,'2026-01-10 14:48:09',5,2,4631.22,0.00,0.00,648.37,0.00,0.00,5279.59,'normal',''),(11,'SI-2026-000011','draft','unpaid',NULL,1,'2026-01-10',NULL,0.00,NULL,'2026-01-10 14:51:55',5,2,21305.80,0.00,0.00,2982.81,0.00,0.00,24288.61,'normal',''),(12,'SI-2026-000012','draft','unpaid',NULL,31,'2026-01-10',NULL,0.00,NULL,'2026-01-10 14:55:02',5,2,6868.00,206.04,0.00,0.00,0.00,0.00,6661.96,'normal',''),(13,'SI-2026-000013','draft','unpaid',NULL,2,'2026-01-10',NULL,0.00,NULL,'2026-01-10 14:58:39',5,2,10530.00,0.00,0.00,0.00,0.00,0.00,10530.00,'normal',''),(14,'SI-2026-000014','draft','unpaid',NULL,12,'2026-01-11',NULL,0.00,NULL,'2026-01-10 15:01:51',6,2,9945.00,0.00,0.00,0.00,0.00,0.00,9945.00,'normal',''),(15,'SI-2026-000015','draft','unpaid',NULL,10,'2026-01-11',NULL,0.00,NULL,'2026-01-10 15:03:27',2,2,3096.00,0.00,0.00,0.00,0.00,0.00,3096.00,'normal',''),(16,'SI-2026-000016','draft','unpaid',NULL,11,'2026-01-11',NULL,0.00,NULL,'2026-01-10 15:04:32',6,2,1870.00,0.00,0.00,0.00,0.00,0.00,1870.00,'normal',''),(17,'SI-2026-000017','draft','unpaid',NULL,32,'2026-01-10',NULL,0.00,NULL,'2026-01-10 15:16:56',1,2,525.00,0.00,0.00,0.00,0.00,0.00,525.00,'normal','مروة الطنطاوى'),(18,'SI-2026-000018','draft','unpaid',NULL,33,'2026-01-10',NULL,65.00,NULL,'2026-01-10 15:56:44',1,2,700.00,0.00,0.00,0.00,0.00,0.00,765.00,'normal','مي عادل'),(19,'SI-2026-000019','draft','unpaid',NULL,34,'2026-01-10',NULL,0.00,NULL,'2026-01-10 16:02:45',1,2,2475.00,0.00,0.00,0.00,0.00,0.00,2475.00,'normal',''),(20,'SI-2026-000020','approved','paid',NULL,27,'2026-01-01',NULL,0.00,NULL,'2026-01-10 16:19:21',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1630.00,'opening',''),(21,'SI-2026-000021','draft','unpaid',NULL,7,'2026-01-04',NULL,0.00,NULL,'2026-01-11 08:55:42',3,3,10680.00,0.00,0.00,0.00,0.00,0.00,10680.00,'normal',''),(22,'SI-2026-000022','draft','unpaid',NULL,24,'2026-01-10',NULL,0.00,NULL,'2026-01-11 08:57:36',3,3,6930.00,0.00,0.00,970.20,0.00,0.00,7900.20,'normal',''),(23,'SI-2026-000023','draft','unpaid',NULL,24,'2026-01-10',NULL,0.00,NULL,'2026-01-11 08:59:47',3,3,5250.00,0.00,0.00,735.00,0.00,0.00,5985.00,'normal',''),(24,'SI-2026-000024','draft','unpaid',NULL,40,'2026-01-11',NULL,0.00,NULL,'2026-01-11 20:21:29',3,2,11520.00,0.00,0.00,0.00,0.00,0.00,11520.00,'normal',''),(25,'SI-2026-000025','draft','unpaid',NULL,19,'2026-01-11',NULL,0.00,NULL,'2026-01-11 20:30:26',3,2,5907.50,0.00,0.00,0.00,0.00,0.00,5907.50,'normal',''),(26,'SI-2026-000026','approved','partial',NULL,1,'2026-01-01',NULL,0.00,NULL,'2026-01-11 20:54:04',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,54165.99,'opening',''),(27,'SI-2026-000027','approved','partial',NULL,2,'2026-01-01',NULL,0.00,NULL,'2026-01-11 20:56:54',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,34968.00,'opening',''),(28,'SI-2026-000028','draft','unpaid',NULL,16,'2026-01-12',NULL,0.00,NULL,'2026-01-12 08:09:59',1,2,11704.00,0.00,0.00,0.00,0.00,0.00,11704.00,'normal',''),(29,'SI-2026-000029','draft','unpaid',NULL,15,'2026-01-12',NULL,0.00,NULL,'2026-01-12 08:20:15',1,2,6880.00,0.00,0.00,0.00,0.00,0.00,6880.00,'normal',''),(30,'SI-2026-000030','approved','unpaid',NULL,17,'2026-01-12',NULL,0.00,NULL,'2026-01-12 08:21:53',1,2,6080.00,0.00,0.00,0.00,0.00,0.00,6080.00,'normal',''),(31,'SI-2026-000031','approved','partial',NULL,16,'2026-01-01',NULL,0.00,NULL,'2026-01-12 19:59:01',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,35387.00,'opening',''),(32,'SI-2026-000032','approved','unpaid',NULL,17,'2026-01-01',NULL,0.00,NULL,'2026-01-12 20:17:51',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,6230.00,'opening',''),(33,'SI-2026-000033','approved','unpaid',NULL,26,'2026-01-01',NULL,0.00,NULL,'2026-01-12 20:22:50',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,71674.43,'opening','');
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
  `return_condition` enum('good','damaged','expired') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'good',
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfer_items`
--

LOCK TABLES `warehouse_transfer_items` WRITE;
/*!40000 ALTER TABLE `warehouse_transfer_items` DISABLE KEYS */;
INSERT INTO `warehouse_transfer_items` VALUES (1,1,10,80,47.50),(2,1,3,41,44.75),(3,1,4,47,39.83),(4,1,2,112,98.89),(5,1,1,112,55.30),(6,2,6,112,89.70),(7,2,3,56,44.75),(8,2,10,80,47.50),(9,3,3,36,44.75),(10,3,5,20,22.70),(11,3,1,30,55.30),(12,3,2,40,98.89),(13,4,10,10,47.50),(14,5,3,56,44.75),(15,5,4,56,39.83),(16,5,5,88,22.70),(17,6,2,111,98.89),(18,6,10,72,47.50),(19,7,10,45,47.50),(20,7,3,20,44.75);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfers`
--

LOCK TABLES `warehouse_transfers` WRITE;
/*!40000 ALTER TABLE `warehouse_transfers` DISABLE KEYS */;
INSERT INTO `warehouse_transfers` VALUES (1,1,2,'2026-01-04 20:37:00',''),(2,1,2,'2026-01-05 20:42:00',''),(3,2,3,'2026-01-05 20:45:00',''),(4,3,7,'2026-01-05 20:47:00',''),(5,1,2,'2026-01-11 08:31:00',''),(6,1,2,'2026-01-12 10:06:00',''),(7,2,3,'2026-01-12 10:08:00','');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` VALUES (1,'المخزن الرئيسي','المنصوره - شارع الترعه',4,'2025-12-15 09:24:58'),(2,'مخزن التوريد الرئيسي','المنصوره - شارع اداب',4,'2025-12-15 09:25:42'),(3,'مخزن الاسكندريه الرئيسي','الاسكندريه',37,'2025-12-15 09:26:27'),(4,'مخزن مستلزمات الانتاج','المنصوره-شارع الترعه',4,'2025-12-15 09:27:03'),(5,'مخزن تحت التشغيل لدى الغير','المنصوره',4,'2025-12-15 09:29:30'),(6,'مخزن دمياط','دمياط',55,'2025-12-15 09:30:34'),(7,'مخزن الاسكندرية الفرعي','الاسكندريه',37,'2026-01-04 18:29:12');
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

-- Dump completed on 2026-01-12 22:24:23
