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
INSERT INTO `batch_inventory` VALUES (1,1,2576),(1,2,68),(1,3,0),(2,1,1440),(2,2,15),(2,3,40),(3,1,2464),(3,2,56),(3,3,18),(3,7,5),(4,1,3359),(4,2,84),(4,3,16),(4,7,7),(5,1,2240),(5,2,162),(5,3,27),(5,7,5),(6,1,2240),(6,2,82),(6,3,35),(6,7,10),(7,2,3),(7,3,38),(7,7,5),(8,1,1988),(8,2,54),(8,3,0);
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
INSERT INTO `batches` VALUES (1,2,'006','2028-12-01'),(2,10,'001','2028-01-01'),(3,4,'001','2028-01-04'),(4,3,'001','2028-10-01'),(5,1,'001','2028-08-01'),(6,6,'002','2028-11-01'),(7,2,'003','2028-06-01'),(8,5,'001','2027-01-01');
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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'برج العرب',3),(2,'مطوبس',11),(3,'كفر الشيخ',11),(4,'المنصوره',7),(5,'ميت غمر',7),(6,'السنبلاوين',7),(7,'طلخا',7),(8,'منيه النصر',7),(9,'المنزله',7),(10,'شربين',7),(11,'دكرنس',7),(12,'بلقاس',7),(13,'طنطا',9),(14,'كفر الزيات',9),(15,'المحله الكبرى',9),(16,'بسيون',9),(17,'قطور',9),(18,'زفتى',9),(19,'سمنود',9),(20,'القاهره',1),(21,'مدينه نصر',1),(22,'مصر الجديده',1),(23,'المعادى',1),(24,'حلوان',1),(25,'شبرا',1),(26,'الزيتون',1),(27,'المطريه',1),(28,'المرج',1),(29,'عين شمس',1),(30,'السلام',1),(31,'الجيزه',2),(32,'6 اكتوبر',2),(33,'الشيخ زايد',2),(34,'الهرم',2),(35,'العمرانيه',2),(36,'الدقى',2),(37,'الاسكندريه',3),(38,'بنها',4),(39,'شبرا الخيمه',4),(40,'دمنهور',5),(41,'كفر الدوار',5),(42,'رشيد',5),(43,'ادكو',5),(44,'مرسى مطروح',6),(45,'العلمين',6),(46,'الضبعه',6),(47,'سيوه',6),(48,'الزقازيق',8),(49,'العاشر من رمضان',8),(50,'منيا القمح',8),(51,'بلبيس',8),(52,'اجا',7),(53,'جمصه',7),(54,'دسوق',11),(55,'دمياط',12),(56,'دمياط الجديده',12),(57,'راس البر',12),(58,'كفر سعد',12),(59,'الزرقا',12),(60,'فارسكور',12),(61,'كفر البطيخ',12),(62,'تلبانه',7),(63,'البحيره',5);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_inventory`
--

LOCK TABLES `current_inventory` WRITE;
/*!40000 ALTER TABLE `current_inventory` DISABLE KEYS */;
INSERT INTO `current_inventory` VALUES (1,2,1,2576,'2026-01-05 13:29:10'),(2,10,1,1440,'2026-01-05 13:29:10'),(3,4,1,2464,'2026-01-05 13:29:10'),(4,3,1,3359,'2026-01-05 13:29:10'),(5,1,1,2240,'2026-01-05 13:29:10'),(6,6,1,2240,'2026-01-05 12:57:54'),(7,1,7,5,'2026-01-04 18:37:51'),(8,2,7,5,'2026-01-04 18:41:24'),(9,4,7,5,'2026-01-04 18:48:56'),(10,3,7,7,'2026-01-04 18:50:43'),(11,6,7,10,'2026-01-04 18:52:25'),(12,1,3,57,'2026-01-06 23:20:43'),(13,2,3,78,'2026-01-06 23:20:43'),(14,4,3,33,'2026-01-06 23:20:43'),(15,3,3,51,'2026-01-06 23:20:43'),(16,6,3,35,'2026-01-04 19:03:55'),(17,10,3,40,'2026-01-04 19:05:47'),(18,3,2,49,'2026-01-07 14:26:23'),(19,4,2,41,'2026-01-07 14:24:16'),(20,2,2,31,'2026-01-07 14:26:23'),(21,1,2,102,'2026-01-07 14:25:36'),(22,5,2,34,'2026-01-07 14:26:13'),(23,6,2,82,'2026-01-07 14:26:06'),(24,10,2,15,'2026-01-07 14:26:06'),(25,5,1,1988,'2026-01-05 13:01:46'),(26,5,3,20,'2026-01-06 23:20:43');
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
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction_batches`
--

LOCK TABLES `inventory_transaction_batches` WRITE;
/*!40000 ALTER TABLE `inventory_transaction_batches` DISABLE KEYS */;
INSERT INTO `inventory_transaction_batches` VALUES (1,1,1,2688,98.89),(3,3,3,2511,39.83),(5,4,4,3456,44.75),(6,5,5,2352,55.30),(7,6,6,2352,89.70),(8,7,5,5,55.30),(9,8,7,5,109.70),(10,9,3,5,39.83),(11,10,4,7,44.75),(12,11,6,10,89.70),(13,12,5,27,55.30),(14,13,7,38,109.70),(15,14,3,18,39.83),(17,16,6,35,89.70),(18,17,2,40,47.50),(19,15,4,15,44.75),(20,2,2,1600,47.50),(21,18,4,10,44.75),(22,19,3,35,39.83),(23,20,1,98,98.89),(24,21,7,3,109.70),(25,22,5,59,55.30),(26,23,8,62,22.70),(27,24,6,4,89.70),(28,25,2,8,47.50),(29,26,2,80,47.50),(30,27,2,80,47.50),(31,28,4,56,44.75),(32,29,4,56,44.75),(33,30,6,112,89.70),(34,31,6,112,89.70),(35,32,8,1988,22.70),(46,43,5,112,55.30),(47,44,5,112,55.30),(48,45,1,112,98.89),(49,46,1,112,98.89),(50,47,3,47,39.83),(51,48,3,47,39.83),(52,49,4,41,44.75),(53,50,4,41,44.75),(54,51,2,80,47.50),(55,52,2,80,47.50),(56,53,8,4,22.70),(59,56,5,11,55.30),(60,57,1,11,98.89),(61,58,6,3,89.70),(62,59,NULL,35,44.75),(63,60,NULL,35,44.75),(64,61,NULL,15,39.83),(65,62,NULL,15,39.83),(66,63,NULL,40,98.89),(67,64,NULL,40,98.89),(68,65,NULL,30,55.30),(69,66,NULL,30,55.30),(70,67,NULL,20,22.70),(71,68,NULL,20,22.70),(72,69,4,1,44.75),(73,70,4,1,44.75),(74,71,2,50,47.50),(75,72,1,50,98.89),(76,73,6,10,89.70),(81,78,4,1,44.75),(86,83,5,2,55.30),(87,84,5,2,55.30),(88,85,1,4,98.89),(89,86,3,3,39.83),(90,87,6,4,89.70),(91,88,2,20,47.50),(92,89,4,20,44.75),(93,90,3,20,39.83),(94,91,1,4,98.89),(95,92,3,3,39.83),(96,93,6,4,89.70),(97,94,2,33,47.50),(98,95,5,11,55.30),(99,96,1,11,98.89),(100,97,5,11,55.30),(101,98,1,11,98.89),(102,99,5,2,55.30),(103,100,6,3,89.70),(104,101,1,1,98.89),(105,102,2,50,47.50),(106,103,1,50,98.89),(107,104,6,10,89.70),(108,105,8,4,22.70),(109,106,4,1,44.75);
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
  `source_type` enum('purchase','manufacturing','transfer','adjustment','sales_invoice','sales_return','purchase_return','external_job_order','issue_voucher') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'adjustment',
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,2,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(2,10,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(3,4,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(4,3,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(5,1,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(6,6,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(7,1,7,'in','2026-01-01 00:00:00','','adjustment',NULL),(8,2,7,'in','2026-01-01 00:00:00','','adjustment',NULL),(9,4,7,'in','2026-01-01 00:00:00','','adjustment',NULL),(10,3,7,'in','2026-01-01 00:00:00','','adjustment',NULL),(11,6,7,'in','2026-01-01 00:00:00','','adjustment',NULL),(12,1,3,'in','2026-01-01 00:00:00','','adjustment',NULL),(13,2,3,'in','2026-01-01 00:00:00','','adjustment',NULL),(14,4,3,'in','2026-01-01 00:00:00','','adjustment',NULL),(15,3,3,'in','2026-01-01 00:00:00','','adjustment',NULL),(16,6,3,'in','2026-01-01 00:00:00','','adjustment',NULL),(17,10,3,'in','2026-01-01 00:00:00','','adjustment',NULL),(18,3,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(19,4,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(20,2,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(21,2,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(22,1,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(23,5,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(24,6,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(25,10,2,'in','2026-01-01 00:00:00','','adjustment',NULL),(26,10,1,'out','2026-01-04 12:56:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(27,10,2,'in','2026-01-04 12:56:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(28,3,1,'out','2026-01-04 12:56:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(29,3,2,'in','2026-01-04 12:56:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(30,6,1,'out','2026-01-04 12:56:00','تحويل إلى مخزن التوريد الرئيسي','transfer',1),(31,6,2,'in','2026-01-04 12:56:00','تحويل من مخزن المخزن الرئيسي','transfer',1),(32,5,1,'in','2026-01-01 00:00:00','','adjustment',NULL),(43,1,1,'out','2026-01-05 13:21:00','تحويل إلى مخزن التوريد الرئيسي','transfer',3),(44,1,2,'in','2026-01-05 13:21:00','تحويل من مخزن المخزن الرئيسي','transfer',3),(45,2,1,'out','2026-01-05 13:21:00','تحويل إلى مخزن التوريد الرئيسي','transfer',3),(46,2,2,'in','2026-01-05 13:21:00','تحويل من مخزن المخزن الرئيسي','transfer',3),(47,4,1,'out','2026-01-05 13:21:00','تحويل إلى مخزن التوريد الرئيسي','transfer',3),(48,4,2,'in','2026-01-05 13:21:00','تحويل من مخزن المخزن الرئيسي','transfer',3),(49,3,1,'out','2026-01-05 13:21:00','تحويل إلى مخزن التوريد الرئيسي','transfer',3),(50,3,2,'in','2026-01-05 13:21:00','تحويل من مخزن المخزن الرئيسي','transfer',3),(51,10,1,'out','2026-01-05 13:21:00','تحويل إلى مخزن التوريد الرئيسي','transfer',3),(52,10,2,'in','2026-01-05 13:21:00','تحويل من مخزن المخزن الرئيسي','transfer',3),(53,5,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000002','sales_invoice',1),(56,1,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',4),(57,2,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',5),(58,6,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000003','sales_invoice',6),(59,3,2,'out','2026-01-04 16:20:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',2),(60,3,3,'in','2026-01-04 16:20:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',2),(61,4,2,'out','2026-01-04 16:20:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',2),(62,4,3,'in','2026-01-04 16:20:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',2),(63,2,2,'out','2026-01-04 16:20:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',2),(64,2,3,'in','2026-01-04 16:20:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',2),(65,1,2,'out','2026-01-04 16:20:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',2),(66,1,3,'in','2026-01-04 16:20:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',2),(67,5,2,'out','2026-01-04 16:20:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',2),(68,5,3,'in','2026-01-04 16:20:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',2),(69,3,2,'out','2026-01-04 16:20:00','تحويل إلى مخزن الاسكندريه الرئيسي','transfer',2),(70,3,3,'in','2026-01-04 16:20:00','تحويل من مخزن مخزن التوريد الرئيسي','transfer',2),(71,10,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',7),(72,2,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',8),(73,6,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',9),(78,3,2,'out','2026-01-03 00:00:00','Sales Invoice #SI-2026-000015','sales_invoice',14),(83,1,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000018','sales_invoice',19),(84,1,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000018','sales_invoice',20),(85,2,2,'out','2026-01-07 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',21),(86,4,2,'out','2026-01-07 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',22),(87,6,2,'out','2026-01-07 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',23),(88,10,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000017','sales_invoice',24),(89,3,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000017','sales_invoice',25),(90,4,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000017','sales_invoice',26),(91,2,2,'out','2026-01-07 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',27),(92,4,2,'out','2026-01-07 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',28),(93,6,2,'out','2026-01-07 00:00:00','Sales Invoice #SI-2026-000013','sales_invoice',29),(94,10,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000012','sales_invoice',30),(95,1,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',31),(96,2,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',32),(97,1,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',33),(98,2,2,'out','2026-01-06 00:00:00','Sales Invoice #SI-2026-000010','sales_invoice',34),(99,1,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000018','sales_invoice',35),(100,6,2,'out','2026-01-05 00:00:00','Sales Invoice #SI-2026-000003','sales_invoice',36),(101,2,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000016','sales_invoice',37),(102,10,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',38),(103,2,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',39),(104,6,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000011','sales_invoice',40),(105,5,2,'out','2026-01-04 00:00:00','Sales Invoice #SI-2026-000002','sales_invoice',41),(106,3,2,'out','2026-01-03 00:00:00','Sales Invoice #SI-2026-000015','sales_invoice',42);
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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
INSERT INTO `journal_entries` VALUES (1,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #1 - ',27,1,'2026-01-04 12:26:36','2026-01-04 12:26:36',44),(3,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #3 - ',27,3,'2026-01-04 12:33:57','2026-01-04 12:33:57',44),(4,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #4 - ',27,4,'2026-01-04 12:41:09','2026-01-04 12:41:09',44),(5,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #5 - ',27,5,'2026-01-04 12:44:38','2026-01-04 12:44:38',44),(6,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #6 - ',27,6,'2026-01-04 18:26:36','2026-01-04 18:26:36',44),(7,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #7 - ',27,7,'2026-01-04 18:37:51','2026-01-04 18:37:51',44),(8,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #8 - ',27,8,'2026-01-04 18:41:24','2026-01-04 18:41:24',44),(9,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #9 - ',27,9,'2026-01-04 18:48:56','2026-01-04 18:48:56',44),(10,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #10 - ',27,10,'2026-01-04 18:50:43','2026-01-04 18:50:43',44),(11,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #11 - ',27,11,'2026-01-04 18:52:25','2026-01-04 18:52:25',44),(12,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #12 - ',27,12,'2026-01-04 18:55:37','2026-01-04 18:55:37',44),(13,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #13 - ',27,13,'2026-01-04 18:57:58','2026-01-04 18:57:58',44),(14,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #14 - ',27,14,'2026-01-04 19:00:11','2026-01-04 19:00:11',44),(16,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #16 - ',27,16,'2026-01-04 19:03:55','2026-01-04 19:03:55',44),(17,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #17 - ',27,17,'2026-01-04 19:05:47','2026-01-04 19:05:47',44),(18,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #15 - ',27,15,'2026-01-04 19:07:43','2026-01-04 19:07:43',44),(19,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #2 - ',27,2,'2026-01-05 10:59:54','2026-01-05 10:59:54',44),(20,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #18 - ',27,18,'2026-01-05 11:39:18','2026-01-05 11:39:18',44),(21,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #19 - ',27,19,'2026-01-05 11:41:02','2026-01-05 11:41:02',44),(22,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #20 - ',27,20,'2026-01-05 11:42:34','2026-01-05 11:42:34',44),(23,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #21 - ',27,21,'2026-01-05 11:45:26','2026-01-05 11:45:26',44),(24,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #22 - ',27,22,'2026-01-05 11:49:11','2026-01-05 11:49:11',44),(25,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #23 - ',27,23,'2026-01-05 11:53:43','2026-01-05 11:53:43',44),(26,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #24 - ',27,24,'2026-01-05 12:09:07','2026-01-05 12:09:07',44),(27,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #25 - ',27,25,'2026-01-05 12:12:50','2026-01-05 12:12:50',44),(28,'2026-01-01','قيد جرد مخزون – تسوية فرق فعلي #32 - ',27,32,'2026-01-05 13:01:46','2026-01-05 13:01:46',44),(29,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000001',73,1,'2026-01-05 15:39:20','2026-01-05 15:39:20',1),(30,'2026-01-05','قيد إثبات مبيعات - فاتورة #SI-2026-000002',16,2,'2026-01-05 15:41:03','2026-01-05 15:41:03',2),(31,'2026-01-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000002',17,2,'2026-01-05 15:41:04','2026-01-05 15:41:04',2),(32,'2026-01-05','قيد إثبات مبيعات - فاتورة #SI-2026-000003',16,3,'2026-01-05 15:48:48','2026-01-05 15:48:48',2),(33,'2026-01-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000003',17,3,'2026-01-05 15:48:48','2026-01-05 15:48:48',2),(34,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000004',73,4,'2026-01-05 15:50:08','2026-01-05 15:59:53',1),(35,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000005',73,5,'2026-01-05 15:52:31','2026-01-05 15:59:53',1),(36,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000006',73,6,'2026-01-05 15:55:31','2026-01-05 15:59:53',1),(37,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000007',73,7,'2026-01-05 16:05:15','2026-01-05 16:05:15',1),(38,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000008',73,8,'2026-01-05 16:10:31','2026-01-05 16:10:31',1),(39,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000009',73,9,'2026-01-05 16:11:22','2026-01-05 16:12:28',1),(40,'2026-01-04','تحصيل فاتورة مبيعات #SI-2026-000002 - cash',74,1,'2026-01-06 00:52:38','2026-01-06 00:52:38',3),(41,'2026-01-05','تحصيل فاتورة مبيعات #SI-2026-000003 - cash',74,2,'2026-01-06 00:53:13','2026-01-06 00:53:13',3),(42,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000010',16,10,'2026-01-06 09:42:39','2026-01-06 09:42:39',2),(43,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000010',17,10,'2026-01-06 09:42:39','2026-01-06 09:42:39',2),(44,'2026-01-04','قيد إثبات مبيعات - فاتورة #SI-2026-000011',16,11,'2026-01-06 23:38:39','2026-01-06 23:38:39',2),(45,'2026-01-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000011',17,11,'2026-01-06 23:38:39','2026-01-06 23:38:39',2),(46,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000012',16,12,'2026-01-07 00:15:38','2026-01-07 00:15:38',2),(47,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000012',17,12,'2026-01-07 00:15:38','2026-01-07 00:15:38',2),(48,'2026-01-07','قيد إثبات مبيعات - فاتورة #SI-2026-000013',16,13,'2026-01-07 00:21:33','2026-01-07 00:21:33',2),(49,'2026-01-07','قيد تكلفة مبيعات - فاتورة #SI-2026-000013',17,13,'2026-01-07 00:21:33','2026-01-07 00:21:33',2),(50,'2026-01-01','رصيد أول المدة - فاتورة #SI-2026-000014',73,14,'2026-01-07 00:22:43','2026-01-07 00:24:24',1),(51,'2026-01-07','تحصيل فاتورة مبيعات #SI-2026-000014 - cash',74,3,'2026-01-07 00:25:11','2026-01-07 00:25:11',3),(52,'2026-01-03','قيد إثبات مبيعات - فاتورة #SI-2026-000015',16,15,'2026-01-07 00:51:20','2026-01-07 00:51:20',2),(53,'2026-01-03','قيد تكلفة مبيعات - فاتورة #SI-2026-000015',17,15,'2026-01-07 00:51:20','2026-01-07 00:51:20',2),(54,'2026-01-03','تحصيل فاتورة مبيعات #SI-2026-000015 - cash',74,4,'2026-01-07 00:52:02','2026-01-07 00:52:02',3),(55,'2026-01-04','قيد إثبات مبيعات - فاتورة #SI-2026-000016',16,16,'2026-01-07 00:53:21','2026-01-07 00:53:21',2),(56,'2026-01-04','قيد تكلفة مبيعات - فاتورة #SI-2026-000016',17,16,'2026-01-07 00:53:21','2026-01-07 00:53:21',2),(57,'2026-01-04','تحصيل فاتورة مبيعات #SI-2026-000016 - cash',74,5,'2026-01-07 00:53:53','2026-01-07 00:53:53',3),(58,'2026-01-06','قيد إثبات مبيعات - فاتورة #SI-2026-000017',16,17,'2026-01-07 00:58:03','2026-01-07 00:58:03',2),(59,'2026-01-06','قيد تكلفة مبيعات - فاتورة #SI-2026-000017',17,17,'2026-01-07 00:58:03','2026-01-07 00:58:03',2),(60,'2026-01-05','قيد إثبات مبيعات - فاتورة #SI-2026-000018',16,18,'2026-01-07 01:22:04','2026-01-07 01:22:04',2),(61,'2026-01-05','قيد تكلفة مبيعات - فاتورة #SI-2026-000018',17,18,'2026-01-07 01:22:04','2026-01-07 01:22:04',2),(62,'2026-01-05','تحصيل فاتورة مبيعات #SI-2026-000018 - cash',74,6,'2026-01-07 01:22:43','2026-01-07 01:22:43',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_lines`
--

LOCK TABLES `journal_entry_lines` WRITE;
/*!40000 ALTER TABLE `journal_entry_lines` DISABLE KEYS */;
INSERT INTO `journal_entry_lines` VALUES (1,1,110,265816.32,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 12:26:36','2026-01-04 12:26:36'),(2,1,114,0.00,265816.32,'مواجهة تسوية إضافة مخزون - ','2026-01-04 12:26:36','2026-01-04 12:26:36'),(5,3,110,100013.13,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 12:33:57','2026-01-04 12:33:57'),(6,3,114,0.00,100013.13,'مواجهة تسوية إضافة مخزون - ','2026-01-04 12:33:57','2026-01-04 12:33:57'),(7,4,110,154656.00,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 12:41:09','2026-01-04 12:41:09'),(8,4,114,0.00,154656.00,'مواجهة تسوية إضافة مخزون - ','2026-01-04 12:41:09','2026-01-04 12:41:09'),(9,5,110,130065.60,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 12:44:38','2026-01-04 12:44:38'),(10,5,114,0.00,130065.60,'مواجهة تسوية إضافة مخزون - ','2026-01-04 12:44:38','2026-01-04 12:44:38'),(11,6,110,210974.40,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:26:36','2026-01-04 18:26:36'),(12,6,114,0.00,210974.40,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:26:36','2026-01-04 18:26:36'),(13,7,110,276.50,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:37:51','2026-01-04 18:37:51'),(14,7,114,0.00,276.50,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:37:51','2026-01-04 18:37:51'),(15,8,110,548.50,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:41:24','2026-01-04 18:41:24'),(16,8,114,0.00,548.50,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:41:24','2026-01-04 18:41:24'),(17,9,110,199.15,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:48:56','2026-01-04 18:48:56'),(18,9,114,0.00,199.15,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:48:56','2026-01-04 18:48:56'),(19,10,110,313.25,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:50:43','2026-01-04 18:50:43'),(20,10,114,0.00,313.25,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:50:43','2026-01-04 18:50:43'),(21,11,110,897.00,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:52:25','2026-01-04 18:52:25'),(22,11,114,0.00,897.00,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:52:25','2026-01-04 18:52:25'),(23,12,110,1493.10,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:55:37','2026-01-04 18:55:37'),(24,12,114,0.00,1493.10,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:55:37','2026-01-04 18:55:37'),(25,13,110,4168.60,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 18:57:58','2026-01-04 18:57:58'),(26,13,114,0.00,4168.60,'مواجهة تسوية إضافة مخزون - ','2026-01-04 18:57:58','2026-01-04 18:57:58'),(27,14,110,716.94,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 19:00:11','2026-01-04 19:00:11'),(28,14,114,0.00,716.94,'مواجهة تسوية إضافة مخزون - ','2026-01-04 19:00:11','2026-01-04 19:00:11'),(31,16,110,3139.50,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 19:03:55','2026-01-04 19:03:55'),(32,16,114,0.00,3139.50,'مواجهة تسوية إضافة مخزون - ','2026-01-04 19:03:55','2026-01-04 19:03:55'),(33,17,110,1900.00,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 19:05:47','2026-01-04 19:05:47'),(34,17,114,0.00,1900.00,'مواجهة تسوية إضافة مخزون - ','2026-01-04 19:05:47','2026-01-04 19:05:47'),(35,18,110,671.25,0.00,'إضافة مخزون (تسوية) - ','2026-01-04 19:07:43','2026-01-04 19:07:43'),(36,18,114,0.00,671.25,'مواجهة تسوية إضافة مخزون - ','2026-01-04 19:07:43','2026-01-04 19:07:43'),(37,19,110,76000.00,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 10:59:54','2026-01-05 10:59:54'),(38,19,114,0.00,76000.00,'مواجهة تسوية إضافة مخزون - ','2026-01-05 10:59:54','2026-01-05 10:59:54'),(39,20,110,447.50,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 11:39:18','2026-01-05 11:39:18'),(40,20,114,0.00,447.50,'مواجهة تسوية إضافة مخزون - ','2026-01-05 11:39:18','2026-01-05 11:39:18'),(41,21,110,1394.05,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 11:41:02','2026-01-05 11:41:02'),(42,21,114,0.00,1394.05,'مواجهة تسوية إضافة مخزون - ','2026-01-05 11:41:02','2026-01-05 11:41:02'),(43,22,110,9691.22,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 11:42:34','2026-01-05 11:42:34'),(44,22,114,0.00,9691.22,'مواجهة تسوية إضافة مخزون - ','2026-01-05 11:42:34','2026-01-05 11:42:34'),(45,23,110,329.10,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 11:45:26','2026-01-05 11:45:26'),(46,23,114,0.00,329.10,'مواجهة تسوية إضافة مخزون - ','2026-01-05 11:45:26','2026-01-05 11:45:26'),(47,24,110,3262.70,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 11:49:11','2026-01-05 11:49:11'),(48,24,114,0.00,3262.70,'مواجهة تسوية إضافة مخزون - ','2026-01-05 11:49:11','2026-01-05 11:49:11'),(49,25,110,1407.40,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 11:53:43','2026-01-05 11:53:43'),(50,25,114,0.00,1407.40,'مواجهة تسوية إضافة مخزون - ','2026-01-05 11:53:43','2026-01-05 11:53:43'),(51,26,110,358.80,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 12:09:07','2026-01-05 12:09:07'),(52,26,114,0.00,358.80,'مواجهة تسوية إضافة مخزون - ','2026-01-05 12:09:07','2026-01-05 12:09:07'),(53,27,110,380.00,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 12:12:50','2026-01-05 12:12:50'),(54,27,114,0.00,380.00,'مواجهة تسوية إضافة مخزون - ','2026-01-05 12:12:50','2026-01-05 12:12:50'),(55,28,110,45127.60,0.00,'إضافة مخزون (تسوية) - ','2026-01-05 13:01:46','2026-01-05 13:01:46'),(56,28,114,0.00,45127.60,'مواجهة تسوية إضافة مخزون - ','2026-01-05 13:01:46','2026-01-05 13:01:46'),(57,29,47,884.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000001','2026-01-05 15:39:20','2026-01-05 15:39:20'),(58,29,14,0.00,884.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000001','2026-01-05 15:39:20','2026-01-05 15:39:20'),(59,30,28,0.00,816.00,'إيراد مبيعات - فاتورة #SI-2026-000002','2026-01-05 15:41:03','2026-01-05 15:41:03'),(60,30,47,816.00,0.00,'مديونية عميل - فاتورة #SI-2026-000002','2026-01-05 15:41:03','2026-01-05 15:41:03'),(61,31,15,90.80,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000002','2026-01-05 15:41:04','2026-01-05 15:41:04'),(62,31,110,0.00,90.80,'مخزون تام الصنع - فاتورة #SI-2026-000002','2026-01-05 15:41:04','2026-01-05 15:41:04'),(63,32,28,0.00,1326.00,'إيراد مبيعات - فاتورة #SI-2026-000003','2026-01-05 15:48:48','2026-01-05 15:48:48'),(64,32,47,1326.00,0.00,'مديونية عميل - فاتورة #SI-2026-000003','2026-01-05 15:48:48','2026-01-05 15:48:48'),(65,33,15,269.10,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000003','2026-01-05 15:48:48','2026-01-05 15:48:48'),(66,33,110,0.00,269.10,'مخزون تام الصنع - فاتورة #SI-2026-000003','2026-01-05 15:48:48','2026-01-05 15:48:48'),(67,34,47,12623.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000004','2026-01-05 15:50:08','2026-01-05 15:50:08'),(68,34,14,0.00,12623.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000004','2026-01-05 15:50:08','2026-01-05 15:50:08'),(69,35,47,4296.70,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000005','2026-01-05 15:52:31','2026-01-05 15:52:31'),(70,35,14,0.00,4296.70,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000005','2026-01-05 15:52:31','2026-01-05 15:52:31'),(71,36,47,3354.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000006','2026-01-05 15:55:31','2026-01-05 15:55:31'),(72,36,14,0.00,3354.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000006','2026-01-05 15:55:31','2026-01-05 15:55:31'),(73,37,47,1904.60,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000007','2026-01-05 16:05:15','2026-01-05 16:05:15'),(74,37,14,0.00,1904.60,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000007','2026-01-05 16:05:15','2026-01-05 16:05:15'),(75,38,47,27497.20,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000008','2026-01-05 16:10:31','2026-01-05 16:10:31'),(76,38,14,0.00,27497.20,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000008','2026-01-05 16:10:31','2026-01-05 16:10:31'),(77,39,47,9234.09,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000009','2026-01-05 16:11:22','2026-01-05 16:11:22'),(78,39,14,0.00,9234.09,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000009','2026-01-05 16:11:22','2026-01-05 16:11:22'),(79,40,42,816.00,0.00,'تحصيل - cash','2026-01-06 00:52:38','2026-01-06 00:52:38'),(80,40,47,0.00,816.00,'تخفيض مديونية العميل','2026-01-06 00:52:38','2026-01-06 00:52:38'),(81,41,42,1326.00,0.00,'تحصيل - cash','2026-01-06 00:53:13','2026-01-06 00:53:13'),(82,41,47,0.00,1326.00,'تخفيض مديونية العميل','2026-01-06 00:53:13','2026-01-06 00:53:13'),(83,42,28,0.00,5700.00,'إيراد مبيعات - فاتورة #SI-2026-000010','2026-01-06 09:42:39','2026-01-06 09:42:39'),(84,42,47,5700.00,0.00,'مديونية عميل - فاتورة #SI-2026-000010','2026-01-06 09:42:39','2026-01-06 09:42:39'),(85,43,15,1696.09,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000010','2026-01-06 09:42:39','2026-01-06 09:42:39'),(86,43,110,0.00,1696.09,'مخزون تام الصنع - فاتورة #SI-2026-000010','2026-01-06 09:42:39','2026-01-06 09:42:39'),(87,44,28,0.00,23147.80,'إيراد مبيعات - فاتورة #SI-2026-000011','2026-01-06 23:38:39','2026-01-06 23:38:39'),(88,44,65,0.00,3240.69,'ضريبة القيمة المضافة - فاتورة #SI-2026-000011','2026-01-06 23:38:39','2026-01-06 23:38:39'),(89,44,47,26388.49,0.00,'مديونية عميل - فاتورة #SI-2026-000011','2026-01-06 23:38:39','2026-01-06 23:38:39'),(90,45,15,8216.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000011','2026-01-06 23:38:39','2026-01-06 23:38:39'),(91,45,110,0.00,8216.50,'مخزون تام الصنع - فاتورة #SI-2026-000011','2026-01-06 23:38:39','2026-01-06 23:38:39'),(92,46,28,0.00,4631.22,'إيراد مبيعات - فاتورة #SI-2026-000012','2026-01-07 00:15:38','2026-01-07 00:15:38'),(93,46,65,0.00,648.37,'ضريبة القيمة المضافة - فاتورة #SI-2026-000012','2026-01-07 00:15:38','2026-01-07 00:15:38'),(94,46,47,5279.59,0.00,'مديونية عميل - فاتورة #SI-2026-000012','2026-01-07 00:15:38','2026-01-07 00:15:38'),(95,47,15,1567.50,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000012','2026-01-07 00:15:38','2026-01-07 00:15:38'),(96,47,110,0.00,1567.50,'مخزون تام الصنع - فاتورة #SI-2026-000012','2026-01-07 00:15:38','2026-01-07 00:15:38'),(97,48,28,0.00,3344.00,'إيراد مبيعات - فاتورة #SI-2026-000013','2026-01-07 00:21:33','2026-01-07 00:21:33'),(98,48,47,3344.00,0.00,'مديونية عميل - فاتورة #SI-2026-000013','2026-01-07 00:21:33','2026-01-07 00:21:33'),(99,49,15,873.85,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000013','2026-01-07 00:21:33','2026-01-07 00:21:33'),(100,49,110,0.00,873.85,'مخزون تام الصنع - فاتورة #SI-2026-000013','2026-01-07 00:21:33','2026-01-07 00:21:33'),(101,50,47,1630.00,0.00,'إثبات رصيد افتتاحى للعميل - فاتورة #SI-2026-000014','2026-01-07 00:22:43','2026-01-07 00:22:43'),(102,50,14,0.00,1630.00,'مقابل رصيد افتتاحى - فاتورة #SI-2026-000014','2026-01-07 00:22:43','2026-01-07 00:22:43'),(103,51,41,1630.00,0.00,'تحصيل - cash','2026-01-07 00:25:11','2026-01-07 00:25:11'),(104,51,47,0.00,1630.00,'تخفيض مديونية العميل','2026-01-07 00:25:11','2026-01-07 00:25:11'),(105,52,28,0.00,175.00,'إيراد مبيعات - فاتورة #SI-2026-000015','2026-01-07 00:51:20','2026-01-07 00:51:20'),(106,52,47,175.00,0.00,'مديونية عميل - فاتورة #SI-2026-000015','2026-01-07 00:51:20','2026-01-07 00:51:20'),(107,53,15,44.75,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000015','2026-01-07 00:51:20','2026-01-07 00:51:20'),(108,53,110,0.00,44.75,'مخزون تام الصنع - فاتورة #SI-2026-000015','2026-01-07 00:51:20','2026-01-07 00:51:20'),(109,54,41,175.00,0.00,'تحصيل - cash','2026-01-07 00:52:02','2026-01-07 00:52:02'),(110,54,47,0.00,175.00,'تخفيض مديونية العميل','2026-01-07 00:52:02','2026-01-07 00:52:02'),(111,55,28,0.00,301.00,'إيراد مبيعات - فاتورة #SI-2026-000016','2026-01-07 00:53:21','2026-01-07 00:53:21'),(112,55,47,301.00,0.00,'مديونية عميل - فاتورة #SI-2026-000016','2026-01-07 00:53:21','2026-01-07 00:53:21'),(113,56,15,98.89,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000016','2026-01-07 00:53:21','2026-01-07 00:53:21'),(114,56,110,0.00,98.89,'مخزون تام الصنع - فاتورة #SI-2026-000016','2026-01-07 00:53:21','2026-01-07 00:53:21'),(115,57,41,301.00,0.00,'تحصيل - cash','2026-01-07 00:53:53','2026-01-07 00:53:53'),(116,57,47,0.00,301.00,'تخفيض مديونية العميل','2026-01-07 00:53:53','2026-01-07 00:53:53'),(117,58,28,0.00,7400.00,'إيراد مبيعات - فاتورة #SI-2026-000017','2026-01-07 00:58:03','2026-01-07 00:58:03'),(118,58,47,7400.00,0.00,'مديونية عميل - فاتورة #SI-2026-000017','2026-01-07 00:58:03','2026-01-07 00:58:03'),(119,59,15,2641.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000017','2026-01-07 00:58:03','2026-01-07 00:58:03'),(120,59,110,0.00,2641.60,'مخزون تام الصنع - فاتورة #SI-2026-000017','2026-01-07 00:58:03','2026-01-07 00:58:03'),(121,60,28,0.00,561.00,'إيراد مبيعات - فاتورة #SI-2026-000018','2026-01-07 01:22:04','2026-01-07 01:22:04'),(122,60,47,561.00,0.00,'مديونية عميل - فاتورة #SI-2026-000018','2026-01-07 01:22:04','2026-01-07 01:22:04'),(123,61,15,110.60,0.00,'تكلفة البضاعة المباعة - فاتورة #SI-2026-000018','2026-01-07 01:22:04','2026-01-07 01:22:04'),(124,61,110,0.00,110.60,'مخزون تام الصنع - فاتورة #SI-2026-000018','2026-01-07 01:22:04','2026-01-07 01:22:04'),(125,62,42,561.00,0.00,'تحصيل - cash','2026-01-07 01:22:43','2026-01-07 01:22:43'),(126,62,47,0.00,561.00,'تخفيض مديونية العميل','2026-01-07 01:22:43','2026-01-07 01:22:43');
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
INSERT INTO `parties` VALUES (1,'ال عبد اللطيف الطرشوبى','customer','','','','',4,47,0.00,'2025-12-15 14:43:54',2),(2,'سالي','customer','','','','',4,47,0.00,'2025-12-15 14:50:27',2),(3,'نبيل الطرشوبى','customer','','','','',4,47,0.00,'2025-12-15 14:53:13',2),(4,'شركة هيلثي للصناعات الدوائية والطبية','customer','','','17 شارع شريف الراضي - توريل - المنصوره','',4,47,0.00,'2025-12-15 14:53:33',3),(5,'نيوكيان','customer','','','','',4,47,0.00,'2025-12-15 14:53:52',3),(6,'الطيبى','customer','','','','',37,47,0.00,'2025-12-15 14:56:57',2),(7,'رمضان','customer','','','','',37,47,0.00,'2025-12-15 14:57:24',1),(8,'خالد محمد','customer','','','','',37,47,0.00,'2025-12-15 14:57:52',1),(9,'القبطان','customer','','','','',37,47,0.00,'2025-12-15 15:24:03',1),(10,'الشمس','customer','','','','',48,47,0.00,'2025-12-15 15:27:50',3),(11,'بيت المقدس','customer','','','','',55,47,0.00,'2025-12-15 15:28:13',3),(12,'بيت الادويه','customer','','','','',55,47,0.00,'2025-12-15 15:28:33',3),(13,'عامر','customer','','','','',55,47,0.00,'2025-12-15 15:29:27',1),(14,'وجيه','customer','','','','',5,47,0.00,'2025-12-15 15:35:10',1),(15,'هاجر وشروق','customer','','','','',13,47,0.00,'2025-12-15 15:35:32',3),(16,'رضا عطيه','customer','','','','',3,47,0.00,'2025-12-15 15:36:05',3),(17,'الاندلس','customer','','','','',13,47,0.00,'2025-12-15 15:36:24',3),(18,'هشام وفؤاد','customer','','','','',13,47,0.00,'2025-12-15 15:36:52',2),(19,'تهانى','customer','','','','',2,47,0.00,'2025-12-15 15:37:59',1),(23,'خليفه','customer','','','','',4,47,0.00,'2026-01-05 15:54:41',2),(24,'مارمرقس','customer','','','','',37,47,0.00,'2026-01-05 16:04:21',7),(25,'خليل','customer','','','','',37,47,0.00,'2026-01-05 16:07:47',3),(26,'وليد الطرشوبي','customer','','','المنصوره','',4,47,0.00,'2026-01-07 00:08:10',2),(27,'عبد الرازق','customer','','','','',62,47,0.00,'2026-01-07 00:20:01',1),(28,'مبيعات نقديه','customer','','','المنصوره','',4,47,0.00,'2026-01-07 00:47:57',6),(29,'مها الجيار','customer','','','','',4,47,0.00,'2026-01-07 00:56:16',9),(30,'مبيعات نقديه','customer','','','','',63,47,0.00,'2026-01-07 01:20:51',6);
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
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_types`
--

LOCK TABLES `reference_types` WRITE;
/*!40000 ALTER TABLE `reference_types` DISABLE KEYS */;
INSERT INTO `reference_types` VALUES (16,'sales_invoice','فاتورة مبيعات','قيود فواتير المبيعات','2026-01-01 07:10:00','2026-01-01 07:10:00'),(17,'sales_invoice_cost','تكلفة بضاعة مباعة','COGS Journal Entry for Sales Invoice','2026-01-01 07:12:00','2026-01-01 07:12:00'),(18,'sales_return','مرتجع مبيعات','قيود مرتجعات المبيعات','2026-01-01 07:14:00','2026-01-01 07:14:00'),(19,'credit_note','إشعار دائن','تسجيل إشعارات الدائنين أو العملاء','2026-01-01 07:16:00','2026-01-01 07:16:00'),(20,'debit_note','إشعار مدين','تسجيل إشعارات المدينين أو العملاء','2026-01-01 07:18:00','2026-01-01 07:18:00'),(21,'purchase_invoice','فاتورة مشتريات','قيود فواتير المشتريات','2026-01-01 07:20:00','2026-01-01 07:20:00'),(22,'purchase_return','مرتجع مشتريات','قيود مرتجعات المشتريات','2026-01-01 07:22:00','2026-01-01 07:22:00'),(23,'supplier_advance','دفعة مقدمة للمورد','تسجيل دفعات مقدمة للموردين','2026-01-01 07:24:00','2026-01-01 07:24:00'),(24,'inventory_purchase','شراء مخزون','تسجيل شراء المخزون للسلع','2026-01-01 07:26:00','2026-01-01 07:26:00'),(25,'inventory_sale','بيع مخزون','تسجيل بيع المخزون للسلع','2026-01-01 07:28:00','2026-01-01 07:28:00'),(26,'inventory_return','مرتجع مخزون','تسجيل المرتجعات من المخزون للعملاء أو الموردين','2026-01-01 07:30:00','2026-01-01 07:30:00'),(27,'inventory_adjustment','تسوية مخزنية','Inventory Adjustment Transaction','2026-01-01 07:32:00','2026-01-01 07:32:00'),(28,'inventory_transfer','نقل مخزون','تسجيل نقل المخزون بين المخازن','2026-01-01 07:34:00','2026-01-01 07:34:00'),(29,'inventory_count','جرد مخزون','تسجيل نتائج الجرد الدوري للمخزون','2026-01-01 07:36:00','2026-01-01 07:36:00'),(30,'write_off','شطب أصول','تسجيل شطب الأصول أو المخزون غير الصالح','2026-01-01 07:38:00','2026-01-01 07:38:00'),(31,'payment','دفعة مالية','تسجيل مدفوعات نقدية أو تحويلات','2026-01-01 07:40:00','2026-01-01 07:40:00'),(32,'receipt','إيصال استلام نقدية','تسجيل المقبوضات النقدية أو التحويلات','2026-01-01 07:42:00','2026-01-01 07:42:00'),(33,'bank_transfer','تحويل بنكي','تسجيل التحويلات البنكية بين الحسابات','2026-01-01 07:44:00','2026-01-01 07:44:00'),(34,'cash_withdrawal','سحب نقدي','تسجيل عمليات سحب النقدية من الحسابات','2026-01-01 07:46:00','2026-01-01 07:46:00'),(35,'cash_deposit','إيداع نقدي','تسجيل إيداعات نقدية في الحسابات','2026-01-01 07:48:00','2026-01-01 07:48:00'),(36,'bank_fee','رسوم بنكية','تسجيل الرسوم المصروفة على الحسابات البنكية','2026-01-01 07:50:00','2026-01-01 07:50:00'),(37,'expense_invoice','فاتورة مصاريف','قيود فواتير المصاريف التشغيلية','2026-01-01 07:52:00','2026-01-01 07:52:00'),(38,'petty_cash_expense','مصروف صندوق الصغير','تسجيل مصروفات صندوق الصغير','2026-01-01 07:54:00','2026-01-01 07:54:00'),(39,'utilities_payment','دفع خدمات','تسجيل المدفوعات لفواتير الخدمات مثل الكهرباء والماء','2026-01-01 07:56:00','2026-01-01 07:56:00'),(40,'utilities_expense','مصاريف خدمات','تسجيل المصروفات المستحقة لفواتير الخدمات','2026-01-01 07:58:00','2026-01-01 07:58:00'),(41,'misc_income','دخل متفرّق','تسجيل الدخل غير المصنف ضمن فئات أخرى','2026-01-01 08:00:00','2026-01-01 08:00:00'),(42,'misc_expense','مصروف متفرّق','تسجيل المصروفات غير المصنفة ضمن فئات أخرى','2026-01-01 08:02:00','2026-01-01 08:02:00'),(43,'prepaid_expense','مصروف مدفوع مسبقاً','تسجيل المصروفات المدفوعة مسبقًا','2026-01-01 08:04:00','2026-01-01 08:04:00'),(44,'accrued_expense','مصروف مستحق','تسجيل المصروفات المستحقة لم يتم دفعها بعد','2026-01-01 08:06:00','2026-01-01 08:06:00'),(45,'accrued_income','دخل مستحق','تسجيل الإيرادات المستحقة لم يتم تحصيلها بعد','2026-01-01 08:08:00','2026-01-01 08:08:00'),(46,'prepaid_income','دخل مدفوع مسبقاً','تسجيل الإيرادات المدفوعة مسبقًا','2026-01-01 08:10:00','2026-01-01 08:10:00'),(47,'fixed_asset_purchase','شراء أصل ثابت','تسجيل شراء الأصول الثابتة','2026-01-01 08:12:00','2026-01-01 08:12:00'),(48,'fixed_asset_depreciation','استهلاك أصل ثابت','تسجيل استهلاك الأصول الثابتة','2026-01-01 08:14:00','2026-01-01 08:14:00'),(49,'revaluation_gain','ربح إعادة تقييم','تسجيل أرباح إعادة تقييم الأصول','2026-01-01 08:16:00','2026-01-01 08:16:00'),(50,'revaluation_loss','خسارة إعادة تقييم','تسجيل خسائر إعادة تقييم الأصول','2026-01-01 08:18:00','2026-01-01 08:18:00'),(51,'interest_income','دخل فوائد','تسجيل الدخل الناتج عن الفوائد البنكية','2026-01-01 08:20:00','2026-01-01 08:20:00'),(52,'interest_expense','مصروف فوائد','تسجيل مصروفات الفوائد على القروض','2026-01-01 08:22:00','2026-01-01 08:22:00'),(53,'insurance_payment','دفع تأمين','تسجيل دفعات التأمينات المختلفة','2026-01-01 08:24:00','2026-01-01 08:24:00'),(54,'insurance_claim','مطالبة تأمين','تسجيل المطالبات المستلمة من شركات التأمين','2026-01-01 08:26:00','2026-01-01 08:26:00'),(55,'salary_payment','صرف رواتب','تسجيل صرف الرواتب الشهرية للموظفين','2026-01-01 08:28:00','2026-01-01 08:28:00'),(56,'bonus_payment','صرف مكافآت','تسجيل صرف المكافآت والمزايا للموظفين','2026-01-01 08:30:00','2026-01-01 08:30:00'),(57,'staff_advance','سلفة موظف','تسجيل السلف المقدمة للموظفين','2026-01-01 08:32:00','2026-01-01 08:32:00'),(58,'staff_advance_settlement','تسوية سلفة موظف','تسجيل تسوية السلف المستلمة من الموظفين','2026-01-01 08:34:00','2026-01-01 08:34:00'),(59,'expense_claim','مطالبة مصروف','تسجيل المطالبات بالمصاريف من الموظفين','2026-01-01 08:36:00','2026-01-01 08:36:00'),(60,'loan_payment','سداد قرض','تسجيل دفعات سداد القروض البنكية','2026-01-01 08:38:00','2026-01-01 08:38:00'),(61,'loan_receipt','استلام قرض','تسجيل استلام مبلغ قرض من البنك أو المقرض','2026-01-01 08:40:00','2026-01-01 08:40:00'),(62,'loan_interest_accrual','استحقاق فوائد قرض','تسجيل فوائد القروض المستحقة لم يتم دفعها بعد','2026-01-01 08:42:00','2026-01-01 08:42:00'),(63,'loan_principal_accrual','استحقاق أصل قرض','تسجيل أصل القروض المستحق لم يتم دفعه بعد','2026-01-01 08:44:00','2026-01-01 08:44:00'),(64,'bad_debt_writeoff','شطب ديون معدومة','تسجيل شطب الديون المستحقة غير القابلة للتحصيل','2026-01-01 08:46:00','2026-01-01 08:46:00'),(65,'capital_injection','إدخال رأس المال','تسجيل استثمار المالك في الشركة','2026-01-01 08:48:00','2026-01-01 08:48:00'),(66,'capital_withdrawal','سحب رأس المال','تسجيل سحب المالك لرأس المال','2026-01-01 08:50:00','2026-01-01 08:50:00'),(67,'dividend_payment','توزيع أرباح','تسجيل دفع الأرباح للمساهمين','2026-01-01 08:52:00','2026-01-01 08:52:00'),(68,'dividend_receipt','استلام أرباح','تسجيل استلام الأرباح من الاستثمارات','2026-01-01 08:54:00','2026-01-01 08:54:00'),(69,'profit_distribution','توزيع أرباح داخلي','تسجيل توزيع الأرباح بين الأقسام أو الشركاء','2026-01-01 08:56:00','2026-01-01 08:56:00'),(70,'foreign_exchange_gain','ربح صرف أجنبي','تسجيل أرباح فروق العملة الأجنبية','2026-01-01 08:58:00','2026-01-01 08:58:00'),(71,'foreign_exchange_loss','خسارة صرف أجنبي','تسجيل خسائر فروق العملة الأجنبية','2026-01-01 09:00:00','2026-01-01 09:00:00'),(72,'provision','مخصصات','تسجيل المخصصات للمصروفات المستقبلية','2026-01-01 09:02:00','2026-01-01 09:02:00'),(73,'opening_balance','رصيد افتتاحي','قيود الأرصدة الافتتاحية','2026-01-05 08:07:07','2026-01-05 08:07:07'),(74,'sales_payment','تحصيل مبيعات','Journal Entry for Sales Payment/Collection','2026-01-06 00:52:38','2026-01-06 00:52:38');
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
INSERT INTO `sales_invoice_items` VALUES (24,17,10,20,220.00,2200.00,0.00,0.00,2,0),(25,17,3,20,250.00,2500.00,0.00,0.00,2,0),(26,17,4,20,270.00,2700.00,0.00,0.00,2,0),(27,13,2,3,430.00,258.00,0.00,0.00,2,1),(28,13,4,3,270.00,162.00,0.00,0.00,2,0),(29,13,6,4,520.00,416.00,0.00,0.00,2,0),(30,12,10,30,220.00,1968.78,0.00,0.00,2,3),(33,10,1,10,330.00,825.00,0.00,0.00,2,1),(34,10,2,10,430.00,1075.00,0.00,0.00,2,1),(35,18,1,2,330.00,99.00,0.00,0.00,2,0),(36,3,6,3,520.00,234.00,0.00,0.00,2,0),(37,16,2,1,430.00,129.00,0.00,0.00,2,0),(38,11,10,50,220.00,4246.00,0.00,0.00,2,0),(39,11,2,50,430.00,8299.00,0.00,0.00,2,0),(40,11,6,10,520.00,2007.20,0.00,0.00,2,0),(41,2,5,4,240.00,144.00,0.00,0.00,2,0),(42,15,3,1,250.00,75.00,0.00,0.00,2,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_payments`
--

LOCK TABLES `sales_invoice_payments` WRITE;
/*!40000 ALTER TABLE `sales_invoice_payments` DISABLE KEYS */;
INSERT INTO `sales_invoice_payments` VALUES (1,2,'2026-01-04','cash',42,816.00,NULL,'','2026-01-06 00:52:38','2026-01-06 00:52:38',NULL),(2,3,'2026-01-05','cash',42,1326.00,NULL,'','2026-01-06 00:53:13','2026-01-06 00:53:13',NULL),(3,14,'2026-01-07','cash',41,1630.00,NULL,'','2026-01-07 00:25:10','2026-01-07 00:25:10',4),(4,15,'2026-01-03','cash',41,175.00,NULL,'','2026-01-07 00:52:02','2026-01-07 00:52:02',2),(5,16,'2026-01-04','cash',41,301.00,NULL,'','2026-01-07 00:53:53','2026-01-07 00:53:53',2),(6,18,'2026-01-05','cash',42,561.00,NULL,'','2026-01-07 01:22:43','2026-01-07 01:22:43',1);
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
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
INSERT INTO `sales_invoices` VALUES (1,'SI-2026-000001','unpaid',NULL,8,'2026-01-01',NULL,0.00,NULL,'2026-01-05 15:39:20',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,884.00,'opening',NULL),(2,'SI-2026-000002','paid',NULL,8,'2026-01-04',NULL,0.00,NULL,'2026-01-05 15:41:03',3,2,816.00,0.00,0.00,0.00,0.00,0.00,816.00,'normal',''),(3,'SI-2026-000003','paid',NULL,8,'2026-01-05',NULL,0.00,NULL,'2026-01-05 15:48:47',3,2,1326.00,0.00,0.00,0.00,0.00,0.00,1326.00,'normal',''),(4,'SI-2026-000004','unpaid',NULL,5,'2026-01-01',NULL,0.00,NULL,'2026-01-05 15:50:08',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,12623.00,'opening',NULL),(5,'SI-2026-000005','unpaid',NULL,14,'2026-01-01',NULL,0.00,NULL,'2026-01-05 15:52:31',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,4296.70,'opening',NULL),(6,'SI-2026-000006','unpaid',NULL,23,'2026-01-01',NULL,0.00,NULL,'2026-01-05 15:55:31',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,3354.00,'opening',NULL),(7,'SI-2026-000007','unpaid',NULL,24,'2026-01-01',NULL,0.00,NULL,'2026-01-05 16:05:15',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1904.60,'opening',NULL),(8,'SI-2026-000008','unpaid',NULL,25,'2026-01-01',NULL,0.00,NULL,'2026-01-05 16:10:31',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,27497.20,'opening',NULL),(9,'SI-2026-000009','unpaid',NULL,9,'2026-01-01',NULL,0.00,NULL,'2026-01-05 16:11:22',NULL,NULL,0.00,0.00,0.00,0.00,0.00,0.00,9234.09,'opening',NULL),(10,'SI-2026-000010','unpaid',NULL,4,'2026-01-06',NULL,0.00,NULL,'2026-01-06 09:42:39',5,2,5700.00,0.00,0.00,0.00,0.00,0.00,5700.00,'normal',''),(11,'SI-2026-000011','unpaid',NULL,1,'2026-01-04',NULL,0.00,NULL,'2026-01-06 23:38:39',5,2,23147.80,0.00,14.00,3240.69,0.00,0.00,26388.49,'normal',''),(12,'SI-2026-000012','unpaid',NULL,26,'2026-01-06',NULL,0.00,NULL,'2026-01-07 00:15:38',5,2,4631.22,0.00,14.00,648.37,0.00,0.00,5279.59,'normal',''),(13,'SI-2026-000013','unpaid',NULL,27,'2026-01-07',NULL,0.00,NULL,'2026-01-07 00:21:33',5,2,3344.00,0.00,0.00,0.00,0.00,0.00,3344.00,'normal',''),(14,'SI-2026-000014','paid',NULL,27,'2026-01-01',NULL,0.00,NULL,'2026-01-07 00:22:43',5,NULL,0.00,0.00,0.00,0.00,0.00,0.00,1630.00,'opening',NULL),(15,'SI-2026-000015','paid',NULL,28,'2026-01-03',NULL,0.00,NULL,'2026-01-07 00:51:20',5,2,175.00,0.00,0.00,0.00,0.00,0.00,175.00,'normal',''),(16,'SI-2026-000016','paid',NULL,28,'2026-01-04',NULL,0.00,NULL,'2026-01-07 00:53:21',5,2,301.00,0.00,0.00,0.00,0.00,0.00,301.00,'normal',''),(17,'SI-2026-000017','unpaid',NULL,29,'2026-01-06',NULL,0.00,NULL,'2026-01-07 00:58:03',5,2,7400.00,0.00,0.00,0.00,0.00,0.00,7400.00,'normal',''),(18,'SI-2026-000018','paid',NULL,30,'2026-01-05',NULL,0.00,NULL,'2026-01-07 01:22:04',3,2,561.00,0.00,0.00,0.00,0.00,0.00,561.00,'normal','كريم على بلال');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfer_items`
--

LOCK TABLES `warehouse_transfer_items` WRITE;
/*!40000 ALTER TABLE `warehouse_transfer_items` DISABLE KEYS */;
INSERT INTO `warehouse_transfer_items` VALUES (1,1,10,80,47.50),(2,1,3,56,44.75),(3,1,6,112,89.70),(4,2,3,35,44.75),(5,2,4,15,39.83),(6,2,2,40,98.89),(7,2,1,30,55.30),(8,2,5,20,22.70),(9,3,1,112,55.30),(10,3,2,112,98.89),(11,3,4,47,39.83),(12,3,3,41,44.75),(13,3,10,80,47.50),(14,2,3,1,44.75);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_transfers`
--

LOCK TABLES `warehouse_transfers` WRITE;
/*!40000 ALTER TABLE `warehouse_transfers` DISABLE KEYS */;
INSERT INTO `warehouse_transfers` VALUES (1,1,2,'2026-01-04 12:56:00',''),(2,2,3,'2026-01-04 16:20:00',''),(3,1,2,'2026-01-05 13:21:00','');
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

-- Dump completed on 2026-01-07 22:34:38
