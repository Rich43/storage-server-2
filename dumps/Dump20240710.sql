CREATE DATABASE  IF NOT EXISTS `storage` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `storage`;
-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: storage
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `album`
--

DROP TABLE IF EXISTS `album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int unsigned NOT NULL,
  `created` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `album_userid_foreign` (`userId`),
  CONSTRAINT `album_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album`
--

LOCK TABLES `album` WRITE;
/*!40000 ALTER TABLE `album` DISABLE KEYS */;
/*!40000 ALTER TABLE `album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `album_media`
--

DROP TABLE IF EXISTS `album_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album_media` (
  `albumId` int unsigned NOT NULL,
  `mediaId` int unsigned NOT NULL,
  PRIMARY KEY (`albumId`,`mediaId`),
  UNIQUE KEY `album_media_albumid_mediaid_unique` (`albumId`,`mediaId`),
  KEY `album_media_mediaid_foreign` (`mediaId`),
  CONSTRAINT `album_media_albumid_foreign` FOREIGN KEY (`albumId`) REFERENCES `album` (`id`) ON DELETE CASCADE,
  CONSTRAINT `album_media_mediaid_foreign` FOREIGN KEY (`mediaId`) REFERENCES `media` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album_media`
--

LOCK TABLES `album_media` WRITE;
/*!40000 ALTER TABLE `album_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `album_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES (1,'20240604123052_create_tables.cjs',1,'2024-07-03 22:05:53'),(2,'20240604142241_move_admin_to_user.cjs',1,'2024-07-03 22:05:53'),(3,'20240604195140_rename_sessionId_to_id.cjs',1,'2024-07-03 22:05:53'),(4,'20240609164121_add_mimetype_table.cjs',1,'2024-07-03 22:05:53'),(5,'20240610183001_add_unique_constraint_to_album_media.cjs',1,'2024-07-03 22:05:53'),(6,'20240610184653_add_adminOnly_to_media.cjs',1,'2024-07-03 22:05:53'),(7,'20240611222020_add_mimetype_enum.cjs',1,'2024-07-03 22:05:53'),(8,'20240622110703_add_filename_to_media.cjs',1,'2024-07-03 22:05:53'),(9,'20240622111509_add_extension_to_mimetype.cjs',1,'2024-07-03 22:05:53'),(10,'20240622135348_add_preferred_extension_to_mimetype.cjs',1,'2024-07-03 22:05:53'),(11,'20240622144545_add_user_extension_to_media.cjs',1,'2024-07-03 22:05:53'),(12,'20240622145250_add_filesize_to_media.cjs',1,'2024-07-03 22:05:53'),(13,'20240622145652_add_uploaded_to_media.cjs',1,'2024-07-03 22:05:53'),(14,'20240622162408_add_created_to_media.cjs',1,'2024-07-03 22:05:53'),(15,'20240622162616_add_created_to_session.cjs',1,'2024-07-03 22:05:53'),(16,'20240622162707_add_created_to_album.cjs',1,'2024-07-03 22:05:53'),(17,'20240622163108_add_created_to_thumbnail.cjs',1,'2024-07-03 22:05:53'),(18,'20240622163205_add_created_to_user.cjs',1,'2024-07-03 22:05:53'),(19,'20240622163658_drop_thumbnail_table.cjs',1,'2024-07-03 22:05:53'),(20,'20240622164355_update_thumbnail_column.cjs',1,'2024-07-03 22:05:53'),(21,'20240622165702_update_thumbnail_column_two.cjs',1,'2024-07-03 22:05:53'),(22,'20240622173300_update_avatar_column.cjs',1,'2024-07-03 22:05:53'),(23,'20240622181446_create_activated_column.cjs',1,'2024-07-03 22:05:53'),(24,'20240622190310_create_activation_key_column.cjs',1,'2024-07-03 22:05:53'),(25,'20240622190842_create_banned_column.cjs',1,'2024-07-03 22:05:53'),(26,'20240622213324_add_updated_to_several_tables.cjs',1,'2024-07-03 22:05:54'),(27,'20240623120939_add_description_to_media.cjs',1,'2024-07-03 22:05:54'),(28,'20240703162935_create_media_comment_table.cjs',1,'2024-07-03 22:05:54'),(29,'20240703203850_change_timestamp_to_varchar.cjs',1,'2024-07-03 22:05:54'),(30,'20240709132821_add_view_count_to_media.cjs',2,'2024-07-10 06:46:43'),(31,'20240709132914_create_media_likes_dislikes_table.cjs',2,'2024-07-10 06:46:43');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int unsigned NOT NULL,
  `mimetypeId` int unsigned DEFAULT NULL,
  `adminOnly` tinyint(1) NOT NULL DEFAULT '0',
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_extension` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `filesize` bigint NOT NULL DEFAULT '-1',
  `uploaded` tinyint(1) NOT NULL DEFAULT '0',
  `created` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail` int unsigned DEFAULT NULL,
  `updated` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `view_count` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `media_mimetypeid_foreign` (`mimetypeId`),
  KEY `media_thumbnail_foreign` (`thumbnail`),
  KEY `media_userid_foreign` (`userId`),
  CONSTRAINT `media_mimetypeid_foreign` FOREIGN KEY (`mimetypeId`) REFERENCES `mimetype` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_thumbnail_foreign` FOREIGN KEY (`thumbnail`) REFERENCES `media` (`id`),
  CONSTRAINT `media_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `validate_filename` BEFORE INSERT ON `media` FOR EACH ROW BEGIN
            IF LENGTH(NEW.filename) < 1 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Filename must be at least 1 character long.';
            END IF;
        END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `media_likes_dislikes`
--

DROP TABLE IF EXISTS `media_likes_dislikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_likes_dislikes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mediaId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `action` enum('like','dislike') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_likes_dislikes_mediaid_userid_unique` (`mediaId`,`userId`),
  KEY `media_likes_dislikes_userid_foreign` (`userId`),
  CONSTRAINT `media_likes_dislikes_mediaid_foreign` FOREIGN KEY (`mediaId`) REFERENCES `media` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_likes_dislikes_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_likes_dislikes`
--

LOCK TABLES `media_likes_dislikes` WRITE;
/*!40000 ALTER TABLE `media_likes_dislikes` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_likes_dislikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mediacomment`
--

DROP TABLE IF EXISTS `mediacomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mediacomment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mediaId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mediacomment_mediaid_foreign` (`mediaId`),
  KEY `mediacomment_userid_foreign` (`userId`),
  CONSTRAINT `mediacomment_mediaid_foreign` FOREIGN KEY (`mediaId`) REFERENCES `media` (`id`),
  CONSTRAINT `mediacomment_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mediacomment`
--

LOCK TABLES `mediacomment` WRITE;
/*!40000 ALTER TABLE `mediacomment` DISABLE KEYS */;
/*!40000 ALTER TABLE `mediacomment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mimetype`
--

DROP TABLE IF EXISTS `mimetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mimetype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('IMAGE','VIDEO','AUDIO','DOCUMENT','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `preferred_extension` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=966 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mimetype`
--

LOCK TABLES `mimetype` WRITE;
/*!40000 ALTER TABLE `mimetype` DISABLE KEYS */;
INSERT INTO `mimetype` VALUES (1,'image/avif','IMAGE','avif','avif'),(2,'image/bmp','IMAGE','bmp','bmp'),(3,'image/cgm','IMAGE','cgm','cgm'),(4,'image/g3fax','IMAGE','g3','g3'),(5,'image/gif','IMAGE','gif','gif'),(6,'image/heic','IMAGE','heic,hif','heic'),(7,'image/heic-sequence','IMAGE','heics,hif','heics'),(8,'image/heif','IMAGE','heif,hif','heif'),(9,'image/heif-sequence','IMAGE','heifs,hif','heifs'),(10,'image/ief','IMAGE','ief','ief'),(11,'image/jp2','IMAGE','jp2,jpg2','jp2'),(12,'image/jpeg','IMAGE','jpeg,jpg,jpe,jfif','jpg'),(13,'image/jpm','IMAGE','jpm,jpgm','jpm'),(14,'image/jpx','IMAGE','jpx,jpf','jpx'),(15,'image/ktx','IMAGE','ktx','ktx'),(16,'image/png','IMAGE','png','png'),(17,'image/prs.btif','IMAGE','btif','btif'),(18,'image/sgi','IMAGE','sgi','sgi'),(19,'image/svg+xml','IMAGE','svg,svgz','svg'),(20,'image/targa','IMAGE','tga','tga'),(21,'image/tiff','IMAGE','tiff,tif','tiff'),(22,'image/vnd.adobe.photoshop','IMAGE','psd','psd'),(23,'image/vnd.dece.graphic','IMAGE','uvg,uvi,uvvg,uvvi','uvg'),(24,'image/vnd.dgn','IMAGE','dgn','dgn'),(25,'image/vnd.djvu','IMAGE','djvu,djv','djvu'),(26,'image/vnd.dvb.subtitle','IMAGE','sub','sub'),(27,'image/vnd.dwg','IMAGE','dwg','dwg'),(28,'image/vnd.dxf','IMAGE','dxf','dxf'),(29,'image/vnd.fastbidsheet','IMAGE','fbs','fbs'),(30,'image/vnd.fpx','IMAGE','fpx','fpx'),(31,'image/vnd.fst','IMAGE','fst','fst'),(32,'image/vnd.fujixerox.edmics-mmr','IMAGE','mmr','mmr'),(33,'image/vnd.fujixerox.edmics-rlc','IMAGE','rlc','rlc'),(34,'image/vnd.globalgraphics.pgb','IMAGE','pgb','pgb'),(35,'image/vnd.microsoft.icon','IMAGE','ico','ico'),(36,'image/vnd.ms-modi','IMAGE','mdi','mdi'),(37,'image/vnd.ms-photo','IMAGE','wdp','wdp'),(38,'image/vnd.net-fpx','IMAGE','npx','npx'),(39,'image/vnd.wap.wbmp','IMAGE','wbmp','wbmp'),(40,'image/vnd.xiff','IMAGE','xif','xif'),(41,'image/webp','IMAGE','webp','webp'),(42,'image/x-3ds','IMAGE','3ds','3ds'),(43,'image/x-adobe-dng','IMAGE','dng','dng'),(44,'image/x-bmp','IMAGE','bmp','bmp'),(45,'image/x-canon-cr2','IMAGE','cr2','cr2'),(46,'image/x-canon-crw','IMAGE','crw','crw'),(47,'image/x-cmu-raster','IMAGE','ras','ras'),(48,'image/x-cmx','IMAGE','cmx','cmx'),(49,'image/x-compressed-xcf','IMAGE','xcfbz2,xcfgz','xcfbz2'),(50,'image/x-epson-erf','IMAGE','erf','erf'),(51,'image/x-freehand','IMAGE','fh,fh4,fh5,fh7,fhc','fh'),(52,'image/x-fuji-raf','IMAGE','raf','raf'),(53,'image/x-hasselblad-3fr','IMAGE','3fr','3fr'),(54,'image/x-icon','IMAGE','ico','ico'),(55,'image/x-kodak-dcr','IMAGE','dcr','dcr'),(56,'image/x-kodak-k25','IMAGE','k25','k25'),(57,'image/x-kodak-kdc','IMAGE','kdc','kdc'),(58,'image/x-minolta-mrw','IMAGE','mrw','mrw'),(59,'image/x-mrsid-image','IMAGE','sid','sid'),(60,'image/x-ms-bmp','IMAGE','bmp','bmp'),(61,'image/x-nikon-nef','IMAGE','nef','nef'),(62,'image/x-olympus-orf','IMAGE','orf','orf'),(63,'image/x-paintshoppro','IMAGE','psp,pspimage','psp'),(64,'image/x-panasonic-raw','IMAGE','raw','raw'),(65,'image/x-pcx','IMAGE','pcx','pcx'),(66,'image/x-pentax-pef','IMAGE','pef','pef'),(67,'image/x-pict','IMAGE','pct,pic','pct'),(68,'image/x-portable-anymap','IMAGE','pnm','pnm'),(69,'image/x-portable-bitmap','IMAGE','pbm','pbm'),(70,'image/x-portable-graymap','IMAGE','pgm','pgm'),(71,'image/x-portable-pixmap','IMAGE','ppm','ppm'),(72,'image/x-rgb','IMAGE','rgb','rgb'),(73,'image/x-sigma-x3f','IMAGE','x3f','x3f'),(74,'image/x-sony-arw','IMAGE','arw','arw'),(75,'image/x-sony-sr2','IMAGE','sr2','sr2'),(76,'image/x-sony-srf','IMAGE','srf','srf'),(77,'image/x-targa','IMAGE','tga','tga'),(78,'image/x-tga','IMAGE','tga','tga'),(79,'image/x-vnd.dgn','IMAGE','dgn','dgn'),(80,'image/x-xbitmap','IMAGE','xbm','xbm'),(81,'image/x-xbm','IMAGE','xbm','xbm'),(82,'image/x-xcf','IMAGE','xcf','xcf'),(83,'image/x-xpixmap','IMAGE','xpm','xpm'),(84,'image/x-xwindowdump','IMAGE','xwd','xwd'),(85,'video/3gpp','VIDEO','3gp,3gpp','3gp'),(86,'video/3gpp2','VIDEO','3g2,3gpp2','3g2'),(87,'video/dl','VIDEO','dl','dl'),(88,'video/DV','VIDEO','dv','dv'),(89,'video/gl','VIDEO','gl','gl'),(90,'video/H261','VIDEO','h261','h261'),(91,'video/H263','VIDEO','h263','h263'),(92,'video/H264','VIDEO','h264','h264'),(93,'video/JPEG','VIDEO','jpgv','jpgv'),(94,'video/jpm','VIDEO','jpgm,jpm','jpgm'),(95,'video/MJ2','VIDEO','mj2,mjp2','mj2'),(96,'video/MP2T','VIDEO','ts,mts,m2ts,cpi,clpi,mpl,mpls,bdm,m2t','ts'),(97,'video/mp4','VIDEO','mp4,mpg4,f4v,f4p,mp4v','mp4'),(98,'video/mpeg','VIDEO','mp2,mp3g,mpe,mpeg,mpg,m1v,m2v','mp2'),(99,'video/ogg','VIDEO','ogg,ogv','ogg'),(100,'video/quicktime','VIDEO','qt,mov','mov'),(101,'video/vnd.dece.hd','VIDEO','uvh,uvvh','uvh'),(102,'video/vnd.dece.mobile','VIDEO','uvm,uvvm','uvm'),(103,'video/vnd.dece.pd','VIDEO','uvp,uvvp','uvp'),(104,'video/vnd.dece.sd','VIDEO','uvs,uvvs','uvs'),(105,'video/vnd.dece.video','VIDEO','uvv,uvvv','uvv'),(106,'video/vnd.dvb.file','VIDEO','dvb','dvb'),(107,'video/vnd.fvt','VIDEO','fvt','fvt'),(108,'video/vnd.mpegurl','VIDEO','mxu,m4u','mxu'),(109,'video/vnd.ms-playready.media.pyv','VIDEO','pyv','pyv'),(110,'video/vnd.nokia.interleaved-multimedia','VIDEO','nim','nim'),(111,'video/vnd.objectvideo','VIDEO','mp4,m4v','mp4'),(112,'video/vnd.sealed.mpeg1','VIDEO','s11','s11'),(113,'video/vnd.sealed.mpeg4','VIDEO','smpg,s14','smpg'),(114,'video/vnd.sealed.swf','VIDEO','sswf,ssw','sswf'),(115,'video/vnd.sealedmedia.softseal.mov','VIDEO','smov,smo,s1q','smov'),(116,'video/vnd.uvvu.mp4','VIDEO','uvu,uvvu','uvu'),(117,'video/vnd.vivo','VIDEO','viv,vivo','viv'),(118,'video/webm','VIDEO','webm','webm'),(119,'video/x-dl','VIDEO','dl','dl'),(120,'video/x-dv','VIDEO','dv','dv'),(121,'video/x-f4v','VIDEO','f4v','f4v'),(122,'video/x-fli','VIDEO','fli','fli'),(123,'video/x-flv','VIDEO','flv','flv'),(124,'video/x-gl','VIDEO','gl','gl'),(125,'video/x-ivf','VIDEO','ivf','ivf'),(126,'video/x-m4v','VIDEO','m4v','m4v'),(127,'video/x-matroska','VIDEO','mk3d,mks,mkv','mk3d'),(128,'video/x-mng','VIDEO','mng','mng'),(129,'video/x-motion-jpeg','VIDEO','mjpg,mjpeg','mjpg'),(130,'video/x-ms-asf','VIDEO','asf,asx','asf'),(131,'video/x-ms-vob','VIDEO','vob','vob'),(132,'video/x-ms-wm','VIDEO','wm','wm'),(133,'video/x-ms-wmv','VIDEO','wmv','wmv'),(134,'video/x-ms-wmx','VIDEO','wmx','wmx'),(135,'video/x-ms-wvx','VIDEO','wvx','wvx'),(136,'video/x-msvideo','VIDEO','avi','avi'),(137,'video/x-sgi-movie','VIDEO','movie','movie'),(138,'video/x-smv','VIDEO','smv','smv'),(139,'audio/adpcm','AUDIO','adp','adp'),(140,'audio/AMR','AUDIO','amr','amr'),(141,'audio/AMR-WB','AUDIO','awb','awb'),(142,'audio/basic','AUDIO','au,snd','au'),(143,'audio/EVRC','AUDIO','evc','evc'),(144,'audio/L16','AUDIO','l16','l16'),(145,'audio/midi','AUDIO','kar,mid,midi,rmi','kar'),(146,'audio/mp4','AUDIO','mp4,mpg4,f4a,f4b,mp4a,m4a','mp4'),(147,'audio/MP4A-LATM','AUDIO','m4a','m4a'),(148,'audio/mpeg','AUDIO','mpga,mp2,mp3,m2a,m3a,mp2a','mpga'),(149,'audio/ogg','AUDIO','oga,ogg,spx,opus','oga'),(150,'audio/s3m','AUDIO','s3m','s3m'),(151,'audio/silk','AUDIO','sil','sil'),(152,'audio/SMV','AUDIO','smv','smv'),(153,'audio/vnd.dece.audio','AUDIO','uva,uvva','uva'),(154,'audio/vnd.digital-winds','AUDIO','eol','eol'),(155,'audio/vnd.dra','AUDIO','dra','dra'),(156,'audio/vnd.dts','AUDIO','dts','dts'),(157,'audio/vnd.dts.hd','AUDIO','dtshd','dtshd'),(158,'audio/vnd.everad.plj','AUDIO','plj','plj'),(159,'audio/vnd.lucent.voice','AUDIO','lvp','lvp'),(160,'audio/vnd.ms-playready.media.pya','AUDIO','pya','pya'),(161,'audio/vnd.nokia.mobile-xmf','AUDIO','mxmf','mxmf'),(162,'audio/vnd.nortel.vbk','AUDIO','vbk','vbk'),(163,'audio/vnd.nuera.ecelp4800','AUDIO','ecelp4800','ecelp4800'),(164,'audio/vnd.nuera.ecelp7470','AUDIO','ecelp7470','ecelp7470'),(165,'audio/vnd.nuera.ecelp9600','AUDIO','ecelp9600','ecelp9600'),(166,'audio/vnd.qcelp','AUDIO','qcp','qcp'),(167,'audio/vnd.rip','AUDIO','rip','rip'),(168,'audio/vnd.sealedmedia.softseal.mpeg','AUDIO','smp3,smp,s1m','smp3'),(169,'audio/wav','AUDIO','wav','wav'),(170,'audio/webm','AUDIO','weba,webm','weba'),(171,'audio/x-aac','AUDIO','aac','aac'),(172,'audio/x-aiff','AUDIO','aif,aifc,aiff','aif'),(173,'audio/x-caf','AUDIO','caf','caf'),(174,'audio/x-flac','AUDIO','flac','flac'),(175,'audio/x-m4a','AUDIO','m4a','m4a'),(176,'audio/x-matroska','AUDIO','mka','mka'),(177,'audio/x-midi','AUDIO','mid,midi,kar','mid'),(178,'audio/x-mpegurl','AUDIO','m3u','m3u'),(179,'audio/x-ms-wax','AUDIO','wax','wax'),(180,'audio/x-ms-wma','AUDIO','wma','wma'),(181,'audio/x-ms-wmv','AUDIO','wmv','wmv'),(182,'audio/x-pn-realaudio','AUDIO','ra,ram','ra'),(183,'audio/x-pn-realaudio-plugin','AUDIO','rmp,rpm','rmp'),(184,'audio/x-realaudio','AUDIO','ra','ra'),(185,'audio/x-wav','AUDIO','wav','wav'),(186,'audio/xm','AUDIO','xm','xm'),(187,'text/cache-manifest','DOCUMENT','appcache,manifest','appcache'),(188,'text/calendar','DOCUMENT','ics,ifb','ics'),(189,'text/comma-separated-values','DOCUMENT','csv','csv'),(190,'text/css','DOCUMENT','css','css'),(191,'text/csv','DOCUMENT','csv','csv'),(192,'text/ecmascript','DOCUMENT','es,ecma','es'),(193,'text/html','DOCUMENT','html,htm,htmlx,shtml,htx','html'),(194,'text/javascript','DOCUMENT','js,mjs,cjs','js'),(195,'text/markdown','DOCUMENT','markdown,md,mkd','markdown'),(196,'text/n3','DOCUMENT','n3','n3'),(197,'text/plain','DOCUMENT','txt,asc,c,cc,h,hh,cpp,hpp,dat,hlp,conf,def,doc,in,list,log,rst,text,textile','txt'),(198,'text/prs.fallenstein.rst','DOCUMENT','rst','rst'),(199,'text/prs.lines.tag','DOCUMENT','dsc','dsc'),(200,'text/richtext','DOCUMENT','rtx','rtx'),(201,'text/rtf','DOCUMENT','rtf','rtf'),(202,'text/sgml','DOCUMENT','sgml,sgm','sgml'),(203,'text/tab-separated-values','DOCUMENT','tsv','tsv'),(204,'text/troff','DOCUMENT','t,tr,roff,troff,man,me,ms','t'),(205,'text/turtle','DOCUMENT','ttl','ttl'),(206,'text/uri-list','DOCUMENT','uri,uris,urls','uri'),(207,'text/vcard','DOCUMENT','vcard','vcard'),(208,'text/vnd.curl','DOCUMENT','curl','curl'),(209,'text/vnd.curl.dcurl','DOCUMENT','dcurl','dcurl'),(210,'text/vnd.curl.mcurl','DOCUMENT','mcurl','mcurl'),(211,'text/vnd.curl.scurl','DOCUMENT','scurl','scurl'),(212,'text/vnd.dvb.subtitle','DOCUMENT','sub','sub'),(213,'text/vnd.fly','DOCUMENT','fly','fly'),(214,'text/vnd.fmi.flexstor','DOCUMENT','flx','flx'),(215,'text/vnd.graphviz','DOCUMENT','gv','gv'),(216,'text/vnd.in3d.3dml','DOCUMENT','3dml','3dml'),(217,'text/vnd.in3d.spot','DOCUMENT','spot','spot'),(218,'text/vnd.net2phone.commcenter.command','DOCUMENT','ccc','ccc'),(219,'text/vnd.sun.j2me.app-descriptor','DOCUMENT','jad','jad'),(220,'text/vnd.wap.si','DOCUMENT','si','si'),(221,'text/vnd.wap.sl','DOCUMENT','sl','sl'),(222,'text/vnd.wap.wml','DOCUMENT','wml','wml'),(223,'text/vnd.wap.wmlscript','DOCUMENT','wmls','wmls'),(224,'text/vtt','DOCUMENT','vtt','vtt'),(225,'text/x-asm','DOCUMENT','asm,s','asm'),(226,'text/x-c','DOCUMENT','c,cc,cpp,cxx,dic,h,hh','c'),(227,'text/x-coffescript','DOCUMENT','coffee','coffee'),(228,'text/x-component','DOCUMENT','htc','htc'),(229,'text/x-fortran','DOCUMENT','f,f77,f90,for','f'),(230,'text/x-java-source','DOCUMENT','java','java'),(231,'text/x-nfo','DOCUMENT','nfo','nfo'),(232,'text/x-opml','DOCUMENT','opml','opml'),(233,'text/x-pascal','DOCUMENT','p,pas','p'),(234,'text/x-rtf','DOCUMENT','rtf','rtf'),(235,'text/x-setext','DOCUMENT','etx','etx'),(236,'text/x-sfv','DOCUMENT','sfv','sfv'),(237,'text/x-uuencode','DOCUMENT','uu','uu'),(238,'text/x-vcalendar','DOCUMENT','vcs','vcs'),(239,'text/x-vcard','DOCUMENT','vcf','vcf'),(240,'text/x-yaml','DOCUMENT','yaml,yml','yaml'),(241,'text/xml','DOCUMENT','xml,dtd,xsd','xml'),(242,'application/pdf','DOCUMENT','pdf,ai','pdf'),(243,'application/msword','DOCUMENT','doc,dot,wrd','doc'),(244,'application/vnd.openxmlformats-officedocument.wordprocessingml.document','DOCUMENT','docx','docx'),(245,'application/vnd.ms-word.document.macroEnabled.12','DOCUMENT','docm','docm'),(246,'application/vnd.ms-powerpoint','DOCUMENT','ppt,pps,pot','ppt'),(247,'application/vnd.openxmlformats-officedocument.presentationml.presentation','DOCUMENT','pptx','pptx'),(248,'application/vnd.ms-powerpoint.presentation.macroEnabled.12','DOCUMENT','pptm','pptm'),(249,'application/vnd.ms-excel','DOCUMENT','xls,xlt,xla,xlc,xlm,xlw','xls'),(250,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','DOCUMENT','xlsx','xlsx'),(251,'application/vnd.ms-excel.sheet.macroEnabled.12','DOCUMENT','xlsm','xlsm'),(252,'application/xml','DOCUMENT','xml,xsl','xml'),(253,'application/json','DOCUMENT','json','json'),(254,'application/rtf','DOCUMENT','rtf','rtf'),(255,'application/epub+zip','DOCUMENT','epub','epub'),(256,'application/postscript','DOCUMENT','eps,ps,ai','eps'),(257,'application/vnd.oasis.opendocument.text','DOCUMENT','odt','odt'),(258,'application/vnd.oasis.opendocument.spreadsheet','DOCUMENT','ods','ods'),(259,'application/vnd.oasis.opendocument.presentation','DOCUMENT','odp','odp'),(260,'application/vnd.oasis.opendocument.graphics','DOCUMENT','odg','odg'),(261,'application/vnd.oasis.opendocument.chart','DOCUMENT','odc','odc'),(262,'application/vnd.oasis.opendocument.formula','DOCUMENT','odf','odf'),(263,'application/vnd.oasis.opendocument.image','DOCUMENT','odi','odi'),(264,'application/vnd.oasis.opendocument.text-master','DOCUMENT','odm','odm'),(265,'application/vnd.oasis.opendocument.presentation-template','DOCUMENT','otp','otp'),(266,'application/vnd.oasis.opendocument.spreadsheet-template','DOCUMENT','ots','ots'),(267,'application/vnd.oasis.opendocument.text-web','DOCUMENT','oth','oth'),(268,'application/vnd.oasis.opendocument.chart-template','DOCUMENT','odc,otc','odc'),(269,'application/vnd.oasis.opendocument.formula-template','DOCUMENT','odf,odft','odf'),(270,'application/vnd.oasis.opendocument.image-template','DOCUMENT','odi,oti','odi'),(271,'application/access','OTHER','mdf,mda,mdb,mde','mdf'),(272,'application/andrew-inset','OTHER','ez','ez'),(273,'application/applixware','OTHER','aw','aw'),(274,'application/atom+xml','OTHER','atom','atom'),(275,'application/atomcat+xml','OTHER','atomcat','atomcat'),(276,'application/atomsvc+xml','OTHER','atomsvc','atomsvc'),(277,'application/bleeper','OTHER','bleep','bleep'),(278,'application/ccxml+xml','OTHER','ccxml','ccxml'),(279,'application/cdmi-capability','OTHER','cdmia','cdmia'),(280,'application/cdmi-container','OTHER','cdmic','cdmic'),(281,'application/cdmi-domain','OTHER','cdmid','cdmid'),(282,'application/cdmi-object','OTHER','cdmio','cdmio'),(283,'application/cdmi-queue','OTHER','cdmiq','cdmiq'),(284,'application/cu-seeme','OTHER','cu','cu'),(285,'application/davmount+xml','OTHER','davmount','davmount'),(286,'application/dicom','OTHER','dcm','dcm'),(287,'application/docbook+xml','OTHER','dbk','dbk'),(288,'application/dssc+der','OTHER','dssc','dssc'),(289,'application/dssc+xml','OTHER','xdssc','xdssc'),(290,'application/ecmascript','OTHER','ecma,es','ecma'),(291,'application/emma+xml','OTHER','emma','emma'),(292,'application/epub+zip','OTHER','epub','epub'),(293,'application/excel','OTHER','xls,xlt','xls'),(294,'application/exi','OTHER','exi','exi'),(295,'application/font-sfnt','OTHER','otf,ttf','otf'),(296,'application/font-tdpfr','OTHER','pfr','pfr'),(297,'application/font-woff','OTHER','woff,woff2','woff'),(298,'application/futuresplash','OTHER','spl','spl'),(299,'application/gml+xml','OTHER','gml','gml'),(300,'application/gpx+xml','OTHER','gpx','gpx'),(301,'application/gxf','OTHER','gxf','gxf'),(302,'application/gzip','OTHER','gz','gz'),(303,'application/hep','OTHER','hep','hep'),(304,'application/hyperstudio','OTHER','stk','stk'),(305,'application/imagemap','OTHER','imagemap,imap','imagemap'),(306,'application/inkml+xml','OTHER','ink,inkml','ink'),(307,'application/ipfix','OTHER','ipfix','ipfix'),(308,'application/java-archive','OTHER','jar','jar'),(309,'application/java-serialized-object','OTHER','ser','ser'),(310,'application/java-vm','OTHER','class','class'),(311,'application/javascript','OTHER','js,mjs,sj','js'),(312,'application/json','OTHER','json','json'),(313,'application/jsonml+json','OTHER','jsonml','jsonml'),(314,'application/lost+xml','OTHER','lostxml','lostxml'),(315,'application/lotus-123','OTHER','wks','wks'),(316,'application/mac-binhex40','OTHER','hqx','hqx'),(317,'application/mac-compactpro','OTHER','cpt','cpt'),(318,'application/mads+xml','OTHER','mads','mads'),(319,'application/manifest+json','OTHER','webmanifest','webmanifest'),(320,'application/marc','OTHER','mrc','mrc'),(321,'application/marcxml+xml','OTHER','mrcx','mrcx'),(322,'application/mathcad','OTHER','mcd','mcd'),(323,'application/mathematica','OTHER','ma,mb,nb','ma'),(324,'application/mathml+xml','OTHER','mathml','mathml'),(325,'application/mbox','OTHER','mbox','mbox'),(326,'application/mediaservercontrol+xml','OTHER','mscml','mscml'),(327,'application/metalink+xml','OTHER','metalink','metalink'),(328,'application/metalink4+xml','OTHER','meta4','meta4'),(329,'application/mets+xml','OTHER','mets','mets'),(330,'application/mods+xml','OTHER','mods','mods'),(331,'application/mp21','OTHER','m21,mp21','m21'),(332,'application/mp4','OTHER','mp4,mpg4,mp4s','mp4'),(333,'application/msword','OTHER','doc,dot,wrd','doc'),(334,'application/mxf','OTHER','mxf','mxf'),(335,'application/netcdf','OTHER','nc,cdf','nc'),(336,'application/octet-stream','OTHER','bin,dms,lha,lzh,class,ani,pgp,gpg,so,dll,dylib,bpk,deploy,dist,distz,dump,elc,lrf,mar,pkg,ipa','bin'),(337,'application/oda','OTHER','oda','oda'),(338,'application/oebps-package+xml','OTHER','opf','opf'),(339,'application/ogg','OTHER','ogx','ogx'),(340,'application/omdoc+xml','OTHER','omdoc','omdoc'),(341,'application/onenote','OTHER','onepkg,onetmp,onetoc,onetoc2','onepkg'),(342,'application/oxps','OTHER','oxps','oxps'),(343,'application/patch-ops-error+xml','OTHER','xer','xer'),(344,'application/pdf','OTHER','pdf,ai','pdf'),(345,'application/pgp-encrypted','OTHER','pgp,gpg','pgp'),(346,'application/pgp-signature','OTHER','asc,sig','asc'),(347,'application/pics-rules','OTHER','prf','prf'),(348,'application/pkcs10','OTHER','p10','p10'),(349,'application/pkcs7-mime','OTHER','p7m,p7c','p7m'),(350,'application/pkcs7-signature','OTHER','p7s','p7s'),(351,'application/pkcs8','OTHER','p8','p8'),(352,'application/pkix-attr-cert','OTHER','ac','ac'),(353,'application/pkix-cert','OTHER','cer','cer'),(354,'application/pkix-crl','OTHER','crl','crl'),(355,'application/pkix-pkipath','OTHER','pkipath','pkipath'),(356,'application/pkixcmp','OTHER','pki','pki'),(357,'application/pls+xml','OTHER','pls','pls'),(358,'application/postscript','OTHER','eps,ps,ai','eps'),(359,'application/powerpoint','OTHER','ppt,pps,pot','ppt'),(360,'application/prql','OTHER','prql','prql'),(361,'application/prs.cww','OTHER','cw,cww','cw'),(362,'application/prs.nprend','OTHER','rnd,rct','rnd'),(363,'application/pskc+xml','OTHER','pskcxml','pskcxml'),(364,'application/quicktimeplayer','OTHER','qtl','qtl'),(365,'application/rdf+xml','OTHER','rdf','rdf'),(366,'application/reginfo+xml','OTHER','rif','rif'),(367,'application/relax-ng-compact-syntax','OTHER','rnc','rnc'),(368,'application/resource-lists+xml','OTHER','rl','rl'),(369,'application/resource-lists-diff+xml','OTHER','rld','rld'),(370,'application/rls-services+xml','OTHER','rs','rs'),(371,'application/rpki-ghostbusters','OTHER','gbr','gbr'),(372,'application/rpki-manifest','OTHER','mft','mft'),(373,'application/rpki-roa','OTHER','roa','roa'),(374,'application/rsd+xml','OTHER','rsd','rsd'),(375,'application/rss+xml','OTHER','rss','rss'),(376,'application/rtf','OTHER','rtf','rtf'),(377,'application/sbml+xml','OTHER','sbml','sbml'),(378,'application/scvp-cv-request','OTHER','scq','scq'),(379,'application/scvp-cv-response','OTHER','scs','scs'),(380,'application/scvp-vp-request','OTHER','spq','spq'),(381,'application/scvp-vp-response','OTHER','spp','spp'),(382,'application/sdp','OTHER','sdp','sdp'),(383,'application/set-payment-initiation','OTHER','setpay','setpay'),(384,'application/set-registration-initiation','OTHER','setreg','setreg'),(385,'application/sgml','OTHER','sgml','sgml'),(386,'application/sgml-open-catalog','OTHER','soc','soc'),(387,'application/shf+xml','OTHER','shf','shf'),(388,'application/sieve','OTHER','siv','siv'),(389,'application/smil','OTHER','smi,smil','smi'),(390,'application/smil+xml','OTHER','smi,smil','smi'),(391,'application/sparql-query','OTHER','rq','rq'),(392,'application/sparql-results+xml','OTHER','srx','srx'),(393,'application/srgs','OTHER','gram','gram'),(394,'application/srgs+xml','OTHER','grxml','grxml'),(395,'application/sru+xml','OTHER','sru','sru'),(396,'application/ssdl+xml','OTHER','ssdl','ssdl'),(397,'application/ssml+xml','OTHER','ssml','ssml'),(398,'application/tei+xml','OTHER','tei,teicorpus','tei'),(399,'application/thraud+xml','OTHER','tfi','tfi'),(400,'application/timestamped-data','OTHER','tsd','tsd'),(401,'application/toolbook','OTHER','tbk','tbk'),(402,'application/VMSBACKUP','OTHER','bck','bck'),(403,'application/vnd.3gpp.pic-bw-large','OTHER','plb','plb'),(404,'application/vnd.3gpp.pic-bw-small','OTHER','psb','psb'),(405,'application/vnd.3gpp.pic-bw-var','OTHER','pvb','pvb'),(406,'application/vnd.3gpp.sms','OTHER','sms','sms'),(407,'application/vnd.3gpp2.tcap','OTHER','tcap','tcap'),(408,'application/vnd.3M.Post-it-Notes','OTHER','pwn','pwn'),(409,'application/vnd.accpac.simply.aso','OTHER','aso','aso'),(410,'application/vnd.accpac.simply.imp','OTHER','imp','imp'),(411,'application/vnd.acucobol','OTHER','acu','acu'),(412,'application/vnd.acucorp','OTHER','atc,acutc','atc'),(413,'application/vnd.adobe.air-application-installer-package+zip','OTHER','air','air'),(414,'application/vnd.adobe.formscentral.fcdt','OTHER','fcdt','fcdt'),(415,'application/vnd.adobe.fxp','OTHER','fxp,fxpl','fxp'),(416,'application/vnd.adobe.xdp+xml','OTHER','xdp','xdp'),(417,'application/vnd.adobe.xfdf','OTHER','xfdf','xfdf'),(418,'application/vnd.ahead.space','OTHER','ahead','ahead'),(419,'application/vnd.airzip.filesecure.azf','OTHER','azf','azf'),(420,'application/vnd.airzip.filesecure.azs','OTHER','azs','azs'),(421,'application/vnd.amazon.ebook','OTHER','azw','azw'),(422,'application/vnd.americandynamics.acc','OTHER','acc','acc'),(423,'application/vnd.amiga.ami','OTHER','ami','ami'),(424,'application/vnd.android.package-archive','OTHER','apk','apk'),(425,'application/vnd.anser-web-certificate-issue-initiation','OTHER','cii','cii'),(426,'application/vnd.anser-web-funds-transfer-initiation','OTHER','fti','fti'),(427,'application/vnd.antix.game-component','OTHER','atx','atx'),(428,'application/vnd.apple.installer+xml','OTHER','mpkg','mpkg'),(429,'application/vnd.apple.mpegurl','OTHER','m3u8','m3u8'),(430,'application/vnd.apple.pkpass','OTHER','pkpass','pkpass'),(431,'application/vnd.aristanetworks.swi','OTHER','swi','swi'),(432,'application/vnd.astraea-software.iota','OTHER','iota','iota'),(433,'application/vnd.audiograph','OTHER','aep','aep'),(434,'application/vnd.blueice.multipass','OTHER','mpm','mpm'),(435,'application/vnd.bmi','OTHER','bmi','bmi'),(436,'application/vnd.businessobjects','OTHER','rep','rep'),(437,'application/vnd.chemdraw+xml','OTHER','cdxml','cdxml'),(438,'application/vnd.chipnuts.karaoke-mmd','OTHER','mmd','mmd'),(439,'application/vnd.cinderella','OTHER','cdy','cdy'),(440,'application/vnd.claymore','OTHER','cla','cla'),(441,'application/vnd.cloanto.rp9','OTHER','rp9','rp9'),(442,'application/vnd.clonk.c4group','OTHER','c4d,c4f,c4g,c4p,c4u','c4d'),(443,'application/vnd.cluetrust.cartomobile-config','OTHER','c11amc','c11amc'),(444,'application/vnd.cluetrust.cartomobile-config-pkg','OTHER','c11amz','c11amz'),(445,'application/vnd.commonspace','OTHER','csp','csp'),(446,'application/vnd.contact.cmsg','OTHER','cdbcmsg','cdbcmsg'),(447,'application/vnd.cosmocaller','OTHER','cmc','cmc'),(448,'application/vnd.crick.clicker','OTHER','clkx','clkx'),(449,'application/vnd.crick.clicker.keyboard','OTHER','clkk','clkk'),(450,'application/vnd.crick.clicker.palette','OTHER','clkp','clkp'),(451,'application/vnd.crick.clicker.template','OTHER','clkt','clkt'),(452,'application/vnd.crick.clicker.wordbank','OTHER','clkw','clkw'),(453,'application/vnd.criticaltools.wbs+xml','OTHER','wbs','wbs'),(454,'application/vnd.ctc-posml','OTHER','pml','pml'),(455,'application/vnd.cups-ppd','OTHER','ppd','ppd'),(456,'application/vnd.curl','OTHER','curl','curl'),(457,'application/vnd.curl.car','OTHER','car','car'),(458,'application/vnd.curl.pcurl','OTHER','pcurl','pcurl'),(459,'application/vnd.dart','OTHER','dart','dart'),(460,'application/vnd.data-vision.rdz','OTHER','rdz','rdz'),(461,'application/vnd.dece.data','OTHER','uvd,uvf,uvvd,uvvf','uvd'),(462,'application/vnd.dece.ttml+xml','OTHER','uvt,uvvt','uvt'),(463,'application/vnd.dece.unspecified','OTHER','uvvx,uvx','uvvx'),(464,'application/vnd.dece.zip','OTHER','uvvz,uvz','uvvz'),(465,'application/vnd.denovo.fcselayout-link','OTHER','fe_launch','fe_launch'),(466,'application/vnd.dna','OTHER','dna','dna'),(467,'application/vnd.dolby.mlp','OTHER','mlp','mlp'),(468,'application/vnd.dpgraph','OTHER','dpg','dpg'),(469,'application/vnd.dreamfactory','OTHER','dfac','dfac'),(470,'application/vnd.ds-keypoint','OTHER','kpxx','kpxx'),(471,'application/vnd.dvb.ait','OTHER','ait','ait'),(472,'application/vnd.dvb.service','OTHER','svc','svc'),(473,'application/vnd.dynageo','OTHER','geo','geo'),(474,'application/vnd.ecowin.chart','OTHER','mag','mag'),(475,'application/vnd.enliven','OTHER','nml','nml'),(476,'application/vnd.epson.esf','OTHER','esf','esf'),(477,'application/vnd.epson.msf','OTHER','msf','msf'),(478,'application/vnd.epson.quickanime','OTHER','qam','qam'),(479,'application/vnd.epson.salt','OTHER','slt','slt'),(480,'application/vnd.epson.ssf','OTHER','ssf','ssf'),(481,'application/vnd.eszigno3+xml','OTHER','es3,et3','es3'),(482,'application/vnd.ezpix-album','OTHER','ez2','ez2'),(483,'application/vnd.ezpix-package','OTHER','ez3','ez3'),(484,'application/vnd.fdf','OTHER','fdf','fdf'),(485,'application/vnd.fdsn.mseed','OTHER','mseed','mseed'),(486,'application/vnd.fdsn.seed','OTHER','dataless,seed','dataless'),(487,'application/vnd.FloGraphIt','OTHER','gph','gph'),(488,'application/vnd.fluxtime.clip','OTHER','ftc','ftc'),(489,'application/vnd.framemaker','OTHER','frm,maker,frame,fm,fb,book,fbdoc','frm'),(490,'application/vnd.frogans.fnc','OTHER','fnc','fnc'),(491,'application/vnd.frogans.ltf','OTHER','ltf','ltf'),(492,'application/vnd.fsc.weblaunch','OTHER','fsc','fsc'),(493,'application/vnd.fujitsu.oasys','OTHER','oas','oas'),(494,'application/vnd.fujitsu.oasys2','OTHER','oa2','oa2'),(495,'application/vnd.fujitsu.oasys3','OTHER','oa3','oa3'),(496,'application/vnd.fujitsu.oasysgp','OTHER','fg5','fg5'),(497,'application/vnd.fujitsu.oasysprs','OTHER','bh2','bh2'),(498,'application/vnd.fujixerox.ddd','OTHER','ddd','ddd'),(499,'application/vnd.fujixerox.docuworks','OTHER','xdw','xdw'),(500,'application/vnd.fujixerox.docuworks.binder','OTHER','xbd','xbd'),(501,'application/vnd.fuzzysheet','OTHER','fzs','fzs'),(502,'application/vnd.genomatix.tuxedo','OTHER','txd','txd'),(503,'application/vnd.geogebra.file','OTHER','ggb','ggb'),(504,'application/vnd.geogebra.slides','OTHER','ggs','ggs'),(505,'application/vnd.geogebra.tool','OTHER','ggt','ggt'),(506,'application/vnd.geometry-explorer','OTHER','gex,gre','gex'),(507,'application/vnd.geonext','OTHER','gxt','gxt'),(508,'application/vnd.geoplan','OTHER','g2w','g2w'),(509,'application/vnd.geospace','OTHER','g3w','g3w'),(510,'application/vnd.gmx','OTHER','gmx','gmx'),(511,'application/vnd.google-earth.kml+xml','OTHER','kml','kml'),(512,'application/vnd.google-earth.kmz','OTHER','kmz','kmz'),(513,'application/vnd.grafeq','OTHER','gqf,gqs','gqf'),(514,'application/vnd.groove-account','OTHER','gac','gac'),(515,'application/vnd.groove-help','OTHER','ghf','ghf'),(516,'application/vnd.groove-identity-message','OTHER','gim','gim'),(517,'application/vnd.groove-injector','OTHER','grv','grv'),(518,'application/vnd.groove-tool-message','OTHER','gtm','gtm'),(519,'application/vnd.groove-tool-template','OTHER','tpl','tpl'),(520,'application/vnd.groove-vcard','OTHER','vcg','vcg'),(521,'application/vnd.hal+xml','OTHER','hal','hal'),(522,'application/vnd.HandHeld-Entertainment+xml','OTHER','zmm','zmm'),(523,'application/vnd.hbci','OTHER','hbci,hbc,kom,upa,pkd,bpd','hbci'),(524,'application/vnd.hhe.lesson-player','OTHER','les','les'),(525,'application/vnd.hp-HPGL','OTHER','plt,hpgl','plt'),(526,'application/vnd.hp-hpid','OTHER','hpid','hpid'),(527,'application/vnd.hp-hps','OTHER','hps','hps'),(528,'application/vnd.hp-jlyt','OTHER','jlt','jlt'),(529,'application/vnd.hp-PCL','OTHER','pcl','pcl'),(530,'application/vnd.hp-PCLXL','OTHER','pclxl','pclxl'),(531,'application/vnd.hydrostatix.sof-data','OTHER','sfd-hdstx','sfd-hdstx'),(532,'application/vnd.ibm.electronic-media','OTHER','emm','emm'),(533,'application/vnd.ibm.MiniPay','OTHER','mpy','mpy'),(534,'application/vnd.ibm.modcap','OTHER','afp,list3820,listafp','afp'),(535,'application/vnd.ibm.rights-management','OTHER','irm','irm'),(536,'application/vnd.ibm.secure-container','OTHER','sc','sc'),(537,'application/vnd.iccprofile','OTHER','icc,icm','icc'),(538,'application/vnd.igloader','OTHER','igl','igl'),(539,'application/vnd.immervision-ivp','OTHER','ivp','ivp'),(540,'application/vnd.immervision-ivu','OTHER','ivu','ivu'),(541,'application/vnd.insors.igm','OTHER','igm','igm'),(542,'application/vnd.intercon.formnet','OTHER','xpw,xpx','xpw'),(543,'application/vnd.intergeo','OTHER','i2g','i2g'),(544,'application/vnd.intu.qbo','OTHER','qbo','qbo'),(545,'application/vnd.intu.qfx','OTHER','qfx','qfx'),(546,'application/vnd.ipunplugged.rcprofile','OTHER','rcprofile','rcprofile'),(547,'application/vnd.irepository.package+xml','OTHER','irp','irp'),(548,'application/vnd.is-xpr','OTHER','xpr','xpr'),(549,'application/vnd.isac.fcs','OTHER','fcs','fcs'),(550,'application/vnd.jam','OTHER','jam','jam'),(551,'application/vnd.jcp.javame.midlet-rms','OTHER','rms','rms'),(552,'application/vnd.jisp','OTHER','jisp','jisp'),(553,'application/vnd.joost.joda-archive','OTHER','joda','joda'),(554,'application/vnd.kahootz','OTHER','ktr,ktz','ktr'),(555,'application/vnd.kde.karbon','OTHER','karbon','karbon'),(556,'application/vnd.kde.kchart','OTHER','chrt','chrt'),(557,'application/vnd.kde.kformula','OTHER','kfo','kfo'),(558,'application/vnd.kde.kivio','OTHER','flw','flw'),(559,'application/vnd.kde.kontour','OTHER','kon','kon'),(560,'application/vnd.kde.kpresenter','OTHER','kpr,kpt','kpr'),(561,'application/vnd.kde.kspread','OTHER','ksp','ksp'),(562,'application/vnd.kde.kword','OTHER','kwd,kwt','kwd'),(563,'application/vnd.kenameaapp','OTHER','htke','htke'),(564,'application/vnd.kidspiration','OTHER','kia','kia'),(565,'application/vnd.Kinar','OTHER','kne,knp,sdf','kne'),(566,'application/vnd.koan','OTHER','skd,skm,skp,skt','skd'),(567,'application/vnd.kodak-descriptor','OTHER','sse','sse'),(568,'application/vnd.las.las+xml','OTHER','lasxml','lasxml'),(569,'application/vnd.llamagraphics.life-balance.desktop','OTHER','lbd','lbd'),(570,'application/vnd.llamagraphics.life-balance.exchange+xml','OTHER','lbe','lbe'),(571,'application/vnd.lotus-1-2-3','OTHER','wks,123','wks'),(572,'application/vnd.lotus-approach','OTHER','apr','apr'),(573,'application/vnd.lotus-freelance','OTHER','pre','pre'),(574,'application/vnd.lotus-notes','OTHER','nsf','nsf'),(575,'application/vnd.lotus-organizer','OTHER','org','org'),(576,'application/vnd.lotus-screencam','OTHER','scm','scm'),(577,'application/vnd.lotus-wordpro','OTHER','lwp','lwp'),(578,'application/vnd.macports.portpkg','OTHER','portpkg','portpkg'),(579,'application/vnd.mcd','OTHER','mcd','mcd'),(580,'application/vnd.medcalcdata','OTHER','mc1','mc1'),(581,'application/vnd.mediastation.cdkey','OTHER','cdkey','cdkey'),(582,'application/vnd.MFER','OTHER','mwf','mwf'),(583,'application/vnd.mfmp','OTHER','mfm','mfm'),(584,'application/vnd.micrografx.flo','OTHER','flo','flo'),(585,'application/vnd.micrografx.igx','OTHER','igx','igx'),(586,'application/vnd.mif','OTHER','mif','mif'),(587,'application/vnd.Mobius.DAF','OTHER','daf','daf'),(588,'application/vnd.Mobius.DIS','OTHER','dis','dis'),(589,'application/vnd.Mobius.MBK','OTHER','mbk','mbk'),(590,'application/vnd.Mobius.MQY','OTHER','mqy','mqy'),(591,'application/vnd.Mobius.MSL','OTHER','msl','msl'),(592,'application/vnd.Mobius.PLC','OTHER','plc','plc'),(593,'application/vnd.Mobius.TXF','OTHER','txf','txf'),(594,'application/vnd.mophun.application','OTHER','mpn','mpn'),(595,'application/vnd.mophun.certificate','OTHER','mpc','mpc'),(596,'application/vnd.mozilla.xul+xml','OTHER','xul','xul'),(597,'application/vnd.ms-artgalry','OTHER','cil','cil'),(598,'application/vnd.ms-asf','OTHER','asf','asf'),(599,'application/vnd.ms-cab-compressed','OTHER','cab','cab'),(600,'application/vnd.ms-excel','OTHER','xls,xlt,xla,xlc,xlm,xlw','xls'),(601,'application/vnd.ms-excel.addin.macroEnabled.12','OTHER','xlam','xlam'),(602,'application/vnd.ms-excel.sheet.binary.macroEnabled.12','OTHER','xlsb','xlsb'),(603,'application/vnd.ms-excel.sheet.macroEnabled.12','OTHER','xlsm','xlsm'),(604,'application/vnd.ms-excel.template.macroEnabled.12','OTHER','xltm','xltm'),(605,'application/vnd.ms-fontobject','OTHER','eot','eot'),(606,'application/vnd.ms-htmlhelp','OTHER','chm','chm'),(607,'application/vnd.ms-ims','OTHER','ims','ims'),(608,'application/vnd.ms-lrm','OTHER','lrm','lrm'),(609,'application/vnd.ms-officetheme','OTHER','thmx','thmx'),(610,'application/vnd.ms-outlook','OTHER','msg','msg'),(611,'application/vnd.ms-pki.seccat','OTHER','cat','cat'),(612,'application/vnd.ms-pki.stl','OTHER','stl','stl'),(613,'application/vnd.ms-powerpoint','OTHER','ppt,pps,pot','ppt'),(614,'application/vnd.ms-powerpoint.addin.macroEnabled.12','OTHER','ppam','ppam'),(615,'application/vnd.ms-powerpoint.presentation.macroEnabled.12','OTHER','pptm','pptm'),(616,'application/vnd.ms-powerpoint.slide.macroEnabled.12','OTHER','sldm','sldm'),(617,'application/vnd.ms-powerpoint.slideshow.macroEnabled.12','OTHER','ppsm','ppsm'),(618,'application/vnd.ms-powerpoint.template.macroEnabled.12','OTHER','potm','potm'),(619,'application/vnd.ms-project','OTHER','mpp,mpt','mpp'),(620,'application/vnd.ms-word.document.macroEnabled.12','OTHER','docm','docm'),(621,'application/vnd.ms-word.template.macroEnabled.12','OTHER','dotm','dotm'),(622,'application/vnd.ms-works','OTHER','wcm,wdb,wks,wps','wcm'),(623,'application/vnd.ms-wpl','OTHER','wpl','wpl'),(624,'application/vnd.ms-xpsdocument','OTHER','xps','xps'),(625,'application/vnd.mseq','OTHER','mseq','mseq'),(626,'application/vnd.musician','OTHER','mus','mus'),(627,'application/vnd.muvee.style','OTHER','msty','msty'),(628,'application/vnd.mynfc','OTHER','taglet','taglet'),(629,'application/vnd.nervana','OTHER','ent,entity,req,request,bkm,kcm','ent'),(630,'application/vnd.neurolanguage.nlu','OTHER','nlu','nlu'),(631,'application/vnd.nitf','OTHER','nitf,ntf','nitf'),(632,'application/vnd.noblenet-directory','OTHER','nnd','nnd'),(633,'application/vnd.noblenet-sealer','OTHER','nns','nns'),(634,'application/vnd.noblenet-web','OTHER','nnw','nnw'),(635,'application/vnd.nokia.n-gage.data','OTHER','ngdat','ngdat'),(636,'application/vnd.nokia.n-gage.symbian.install','OTHER','n-gage','n-gage'),(637,'application/vnd.nokia.radio-preset','OTHER','rpst','rpst'),(638,'application/vnd.nokia.radio-presets','OTHER','rpss','rpss'),(639,'application/vnd.novadigm.EDM','OTHER','edm','edm'),(640,'application/vnd.novadigm.EDX','OTHER','edx','edx'),(641,'application/vnd.novadigm.EXT','OTHER','ext','ext'),(642,'application/vnd.oasis.opendocument.chart','OTHER','odc','odc'),(643,'application/vnd.oasis.opendocument.chart-template','OTHER','odc,otc','odc'),(644,'application/vnd.oasis.opendocument.database','OTHER','odb','odb'),(645,'application/vnd.oasis.opendocument.formula','OTHER','odf','odf'),(646,'application/vnd.oasis.opendocument.formula-template','OTHER','odf,odft','odf'),(647,'application/vnd.oasis.opendocument.graphics','OTHER','odg','odg'),(648,'application/vnd.oasis.opendocument.graphics-template','OTHER','otg','otg'),(649,'application/vnd.oasis.opendocument.image','OTHER','odi','odi'),(650,'application/vnd.oasis.opendocument.image-template','OTHER','odi,oti','odi'),(651,'application/vnd.oasis.opendocument.presentation','OTHER','odp','odp'),(652,'application/vnd.oasis.opendocument.presentation-template','OTHER','otp','otp'),(653,'application/vnd.oasis.opendocument.spreadsheet','OTHER','ods','ods'),(654,'application/vnd.oasis.opendocument.spreadsheet-template','OTHER','ots','ots'),(655,'application/vnd.oasis.opendocument.text','OTHER','odt','odt'),(656,'application/vnd.oasis.opendocument.text-master','OTHER','odm','odm'),(657,'application/vnd.oasis.opendocument.text-template','OTHER','ott','ott'),(658,'application/vnd.oasis.opendocument.text-web','OTHER','oth','oth'),(659,'application/vnd.olpc-sugar','OTHER','xo','xo'),(660,'application/vnd.oma.dd2+xml','OTHER','dd2','dd2'),(661,'application/vnd.openofficeorg.extension','OTHER','oxt','oxt'),(662,'application/vnd.openxmlformats-officedocument.presentationml.presentation','OTHER','pptx','pptx'),(663,'application/vnd.openxmlformats-officedocument.presentationml.slide','OTHER','sldx','sldx'),(664,'application/vnd.openxmlformats-officedocument.presentationml.slideshow','OTHER','ppsx','ppsx'),(665,'application/vnd.openxmlformats-officedocument.presentationml.template','OTHER','potx','potx'),(666,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','OTHER','xlsx','xlsx'),(667,'application/vnd.openxmlformats-officedocument.spreadsheetml.template','OTHER','xltx','xltx'),(668,'application/vnd.openxmlformats-officedocument.wordprocessingml.document','OTHER','docx','docx'),(669,'application/vnd.openxmlformats-officedocument.wordprocessingml.template','OTHER','dotx','dotx'),(670,'application/vnd.osgeo.mapguide.package','OTHER','mgp','mgp'),(671,'application/vnd.osgi.dp','OTHER','dp','dp'),(672,'application/vnd.osgi.subsystem','OTHER','esa','esa'),(673,'application/vnd.palm','OTHER','prc,pdb,pqa,oprc','prc'),(674,'application/vnd.pawaafile','OTHER','paw','paw'),(675,'application/vnd.pg.format','OTHER','str','str'),(676,'application/vnd.pg.osasli','OTHER','ei6','ei6'),(677,'application/vnd.picsel','OTHER','efif','efif'),(678,'application/vnd.pmi.widget','OTHER','wg','wg'),(679,'application/vnd.pocketlearn','OTHER','plf','plf'),(680,'application/vnd.powerbuilder6','OTHER','pbd','pbd'),(681,'application/vnd.previewsystems.box','OTHER','box','box'),(682,'application/vnd.proteus.magazine','OTHER','mgz','mgz'),(683,'application/vnd.publishare-delta-tree','OTHER','qps','qps'),(684,'application/vnd.pvi.ptid1','OTHER','pti,ptid','pti'),(685,'application/vnd.Quark.QuarkXPress','OTHER','qxd,qxt,qwd,qwt,qxl,qxb','qxd'),(686,'application/vnd.realvnc.bed','OTHER','bed','bed'),(687,'application/vnd.recordare.musicxml','OTHER','mxl','mxl'),(688,'application/vnd.recordare.musicxml+xml','OTHER','musicxml','musicxml'),(689,'application/vnd.rig.cryptonote','OTHER','cryptonote','cryptonote'),(690,'application/vnd.rim.cod','OTHER','cod','cod'),(691,'application/vnd.rn-realmedia','OTHER','rm','rm'),(692,'application/vnd.rn-realmedia-vbr','OTHER','rmvb','rmvb'),(693,'application/vnd.route66.link66+xml','OTHER','link66','link66'),(694,'application/vnd.sailingtracker.track','OTHER','st','st'),(695,'application/vnd.sealed.doc','OTHER','sdoc,sdo,s1w','sdoc'),(696,'application/vnd.sealed.eml','OTHER','seml,sem','seml'),(697,'application/vnd.sealed.mht','OTHER','smht,smh','smht'),(698,'application/vnd.sealed.ppt','OTHER','sppt,spp,s1p','sppt'),(699,'application/vnd.sealed.xls','OTHER','sxls,sxl,s1e','sxls'),(700,'application/vnd.sealedmedia.softseal.html','OTHER','stml,stm,s1h','stml'),(701,'application/vnd.sealedmedia.softseal.pdf','OTHER','spdf,spd,s1a','spdf'),(702,'application/vnd.seemail','OTHER','see','see'),(703,'application/vnd.sema','OTHER','sema','sema'),(704,'application/vnd.semd','OTHER','semd','semd'),(705,'application/vnd.semf','OTHER','semf','semf'),(706,'application/vnd.shana.informed.formdata','OTHER','ifm','ifm'),(707,'application/vnd.shana.informed.formtemplate','OTHER','itp','itp'),(708,'application/vnd.shana.informed.interchange','OTHER','iif','iif'),(709,'application/vnd.shana.informed.package','OTHER','ipk','ipk'),(710,'application/vnd.SimTech-MindMapper','OTHER','twd,twds','twd'),(711,'application/vnd.smaf','OTHER','mmf','mmf'),(712,'application/vnd.smart.teacher','OTHER','teacher','teacher'),(713,'application/vnd.solent.sdkm+xml','OTHER','sdkd,sdkm','sdkd'),(714,'application/vnd.spotfire.dxp','OTHER','dxp','dxp'),(715,'application/vnd.spotfire.sfs','OTHER','sfs','sfs'),(716,'application/vnd.stardivision.calc','OTHER','sdc','sdc'),(717,'application/vnd.stardivision.chart','OTHER','sds','sds'),(718,'application/vnd.stardivision.draw','OTHER','sda','sda'),(719,'application/vnd.stardivision.impress','OTHER','sdd','sdd'),(720,'application/vnd.stardivision.math','OTHER','sdf,smf','sdf'),(721,'application/vnd.stardivision.writer','OTHER','sdw,vor','sdw'),(722,'application/vnd.stardivision.writer-global','OTHER','sgl','sgl'),(723,'application/vnd.stepmania.package','OTHER','smzip','smzip'),(724,'application/vnd.stepmania.stepchart','OTHER','sm','sm'),(725,'application/vnd.sun.xml.calc','OTHER','sxc','sxc'),(726,'application/vnd.sun.xml.calc.template','OTHER','stc','stc'),(727,'application/vnd.sun.xml.draw','OTHER','sxd','sxd'),(728,'application/vnd.sun.xml.draw.template','OTHER','std','std'),(729,'application/vnd.sun.xml.impress','OTHER','sxi','sxi'),(730,'application/vnd.sun.xml.impress.template','OTHER','sti','sti'),(731,'application/vnd.sun.xml.math','OTHER','sxm','sxm'),(732,'application/vnd.sun.xml.writer','OTHER','sxw','sxw'),(733,'application/vnd.sun.xml.writer.global','OTHER','sxg','sxg'),(734,'application/vnd.sun.xml.writer.template','OTHER','stw','stw'),(735,'application/vnd.sus-calendar','OTHER','sus,susp','sus'),(736,'application/vnd.svd','OTHER','svd','svd'),(737,'application/vnd.symbian.install','OTHER','sis,sisx','sis'),(738,'application/vnd.syncml+xml','OTHER','xsm','xsm'),(739,'application/vnd.syncml.dm+wbxml','OTHER','bdm','bdm'),(740,'application/vnd.syncml.dm+xml','OTHER','xdm','xdm'),(741,'application/vnd.tao.intent-module-archive','OTHER','tao','tao'),(742,'application/vnd.tcpdump.pcap','OTHER','cap,dmp,pcap','cap'),(743,'application/vnd.tmobile-livetv','OTHER','tmo','tmo'),(744,'application/vnd.trid.tpt','OTHER','tpt','tpt'),(745,'application/vnd.triscape.mxs','OTHER','mxs','mxs'),(746,'application/vnd.trueapp','OTHER','tra','tra'),(747,'application/vnd.ufdl','OTHER','ufd,ufdl','ufd'),(748,'application/vnd.uiq.theme','OTHER','utz','utz'),(749,'application/vnd.umajin','OTHER','umj','umj'),(750,'application/vnd.unity','OTHER','unityweb','unityweb'),(751,'application/vnd.uoml+xml','OTHER','uoml','uoml'),(752,'application/vnd.vcx','OTHER','vcx','vcx'),(753,'application/vnd.vidsoft.vidconference','OTHER','vsc','vsc'),(754,'application/vnd.visio','OTHER','vsd,vst,vsw,vss','vsd'),(755,'application/vnd.visionary','OTHER','vis','vis'),(756,'application/vnd.vsf','OTHER','vsf','vsf'),(757,'application/vnd.wap.sic','OTHER','sic','sic'),(758,'application/vnd.wap.slc','OTHER','slc','slc'),(759,'application/vnd.wap.wbxml','OTHER','wbxml','wbxml'),(760,'application/vnd.wap.wmlc','OTHER','wmlc','wmlc'),(761,'application/vnd.wap.wmlscriptc','OTHER','wmlsc','wmlsc'),(762,'application/vnd.webturbo','OTHER','wtb','wtb'),(763,'application/vnd.wolfram.player','OTHER','nbp','nbp'),(764,'application/vnd.wordperfect','OTHER','wpd','wpd'),(765,'application/vnd.wqd','OTHER','wqd','wqd'),(766,'application/vnd.wt.stf','OTHER','stf','stf'),(767,'application/vnd.wv.csp+wbxml','OTHER','wv','wv'),(768,'application/vnd.xara','OTHER','xar','xar'),(769,'application/vnd.xfdl','OTHER','xfdl','xfdl'),(770,'application/vnd.yamaha.hv-dic','OTHER','hvd','hvd'),(771,'application/vnd.yamaha.hv-script','OTHER','hvs','hvs'),(772,'application/vnd.yamaha.hv-voice','OTHER','hvp','hvp'),(773,'application/vnd.yamaha.openscoreformat','OTHER','osf','osf'),(774,'application/vnd.yamaha.openscoreformat.osfpvg+xml','OTHER','osfpvg','osfpvg'),(775,'application/vnd.yamaha.smaf-audio','OTHER','saf','saf'),(776,'application/vnd.yamaha.smaf-phrase','OTHER','spf','spf'),(777,'application/vnd.yellowriver-custom-menu','OTHER','cmp','cmp'),(778,'application/vnd.zul','OTHER','zir,zirz','zir'),(779,'application/vnd.zzazz.deck+xml','OTHER','zaz','zaz'),(780,'application/voicexml+xml','OTHER','vxml','vxml'),(781,'application/wasm','OTHER','wasm','wasm'),(782,'application/watcherinfo+xml','OTHER','wif','wif'),(783,'application/widget','OTHER','wgt','wgt'),(784,'application/winhlp','OTHER','hlp','hlp'),(785,'application/word','OTHER','doc,dot','doc'),(786,'application/wordperfect','OTHER','wp','wp'),(787,'application/wordperfect5.1','OTHER','wp5,wp','wp5'),(788,'application/wordperfect6.1','OTHER','wp6','wp6'),(789,'application/wordperfectd','OTHER','wpd','wpd'),(790,'application/wsdl+xml','OTHER','wsdl','wsdl'),(791,'application/wspolicy+xml','OTHER','wspolicy','wspolicy'),(792,'application/x-123','OTHER','wk','wk'),(793,'application/x-7z-compressed','OTHER','7z','7z'),(794,'application/x-abiword','OTHER','abw','abw'),(795,'application/x-access','OTHER','mdf,mda,mdb,mde','mdf'),(796,'application/x-ace-compressed','OTHER','ace','ace'),(797,'application/x-apple-diskimage','OTHER','dmg','dmg'),(798,'application/x-authorware-bin','OTHER','aab,u32,vox,x32','aab'),(799,'application/x-authorware-map','OTHER','aam','aam'),(800,'application/x-authorware-seg','OTHER','aas','aas'),(801,'application/x-bcpio','OTHER','bcpio','bcpio'),(802,'application/x-bittorrent','OTHER','torrent','torrent'),(803,'application/x-bleeper','OTHER','bleep','bleep'),(804,'application/x-blorb','OTHER','blb,blorb','blb'),(805,'application/x-bzip','OTHER','bz','bz'),(806,'application/x-bzip2','OTHER','boz,bz2','boz'),(807,'application/x-cbr','OTHER','cb7,cba,cbr,cbt,cbz','cb7'),(808,'application/x-cdlink','OTHER','vcd','vcd'),(809,'application/x-cfs-compressed','OTHER','cfs','cfs'),(810,'application/x-chat','OTHER','chat','chat'),(811,'application/x-chess-pgn','OTHER','pgn','pgn'),(812,'application/x-chrome-extension','OTHER','crx','crx'),(813,'application/x-compress','OTHER','z,Z','z'),(814,'application/x-compressed','OTHER','z,Z','z'),(815,'application/x-conference','OTHER','nsc','nsc'),(816,'application/x-cpio','OTHER','cpio','cpio'),(817,'application/x-csh','OTHER','csh','csh'),(818,'application/x-cu-seeme','OTHER','csm,cu','csm'),(819,'application/x-debian-package','OTHER','deb,udeb','deb'),(820,'application/x-dgc-compressed','OTHER','dgc','dgc'),(821,'application/x-director','OTHER','dcr,@dir,@dxr,cct,cst,cxt,dir,dxr,fgd,swa,w3d','dcr'),(822,'application/x-doom','OTHER','wad','wad'),(823,'application/x-dtbncx+xml','OTHER','ncx','ncx'),(824,'application/x-dtbook+xml','OTHER','dtb','dtb'),(825,'application/x-dtbresource+xml','OTHER','res','res'),(826,'application/x-dvi','OTHER','dvi','dvi'),(827,'application/x-envoy','OTHER','evy','evy'),(828,'application/x-eva','OTHER','eva','eva'),(829,'application/x-font-bdf','OTHER','bdf','bdf'),(830,'application/x-font-ghostscript','OTHER','gsf','gsf'),(831,'application/x-font-linux-psf','OTHER','psf','psf'),(832,'application/x-font-opentype','OTHER','otf','otf'),(833,'application/x-font-otf','OTHER','otf','otf'),(834,'application/x-font-pcf','OTHER','pcf','pcf'),(835,'application/x-font-snf','OTHER','snf','snf'),(836,'application/x-font-truetype','OTHER','ttf','ttf'),(837,'application/x-font-ttf','OTHER','ttc,ttf','ttc'),(838,'application/x-font-type1','OTHER','afm,pfa,pfb,pfm','afm'),(839,'application/x-freearc','OTHER','arc','arc'),(840,'application/x-futuresplash','OTHER','spl','spl'),(841,'application/x-gca-compressed','OTHER','gca','gca'),(842,'application/x-glulx','OTHER','ulx','ulx'),(843,'application/x-gnumeric','OTHER','gnumeric','gnumeric'),(844,'application/x-gramps-xml','OTHER','gramps','gramps'),(845,'application/x-gtar','OTHER','gtar,tgz,tbz2,tbz','gtar'),(846,'application/x-gzip','OTHER','gz','gz'),(847,'application/x-hdf','OTHER','hdf','hdf'),(848,'application/x-hep','OTHER','hep','hep'),(849,'application/x-html+ruby','OTHER','rhtml','rhtml'),(850,'application/x-httpd-php','OTHER','phtml,pht,php','phtml'),(851,'application/x-ibooks+zip','OTHER','ibooks','ibooks'),(852,'application/x-ica','OTHER','ica','ica'),(853,'application/x-imagemap','OTHER','imagemap,imap','imagemap'),(854,'application/x-install-instructions','OTHER','install','install'),(855,'application/x-iso9660-image','OTHER','iso','iso'),(856,'application/x-iwork-keynote-sffkey','OTHER','key','key'),(857,'application/x-iwork-numbers-sffnumbers','OTHER','numbers','numbers'),(858,'application/x-iwork-pages-sffpages','OTHER','pages','pages'),(859,'application/x-java-archive','OTHER','jar','jar'),(860,'application/x-java-jnlp-file','OTHER','jnlp','jnlp'),(861,'application/x-java-serialized-object','OTHER','ser','ser'),(862,'application/x-java-vm','OTHER','class','class'),(863,'application/x-javascript','OTHER','js,mjs','js'),(864,'application/x-koan','OTHER','skp,skd,skt,skm','skp'),(865,'application/x-latex','OTHER','ltx,latex','ltx'),(866,'application/x-lotus-123','OTHER','wks','wks'),(867,'application/x-lzh-compressed','OTHER','lha,lzh','lha'),(868,'application/x-mac','OTHER','bin','bin'),(869,'application/x-mac-compactpro','OTHER','cpt','cpt'),(870,'application/x-macbase64','OTHER','bin','bin'),(871,'application/x-maker','OTHER','frm,maker,frame,fm,fb,book,fbdoc','frm'),(872,'application/x-mathcad','OTHER','mcd','mcd'),(873,'application/x-mie','OTHER','mie','mie'),(874,'application/x-mif','OTHER','mif','mif'),(875,'application/x-mobipocket-ebook','OTHER','mobi,prc','mobi'),(876,'application/x-ms-application','OTHER','application','application'),(877,'application/x-ms-dos-executable','OTHER','exe','exe'),(878,'application/x-ms-shortcut','OTHER','lnk','lnk'),(879,'application/x-ms-wmd','OTHER','wmd','wmd'),(880,'application/x-ms-wmz','OTHER','wmz','wmz'),(881,'application/x-ms-xbap','OTHER','xbap','xbap'),(882,'application/x-msaccess','OTHER','mda,mdb,mde,mdf','mda'),(883,'application/x-msbinder','OTHER','obd','obd'),(884,'application/x-mscardfile','OTHER','crd','crd'),(885,'application/x-msclip','OTHER','clp','clp'),(886,'application/x-msdos-program','OTHER','cmd,bat,com,exe,reg,ps1,vbs','cmd'),(887,'application/x-msdownload','OTHER','exe,com,cmd,bat,dll,msi,reg,ps1,vbs','exe'),(888,'application/x-msmediaview','OTHER','m13,m14,mvb','m13'),(889,'application/x-msmetafile','OTHER','emf,emz,wmf,wmz','emf'),(890,'application/x-msmoney','OTHER','mny','mny'),(891,'application/x-mspublisher','OTHER','pub','pub'),(892,'application/x-msschedule','OTHER','scd','scd'),(893,'application/x-msterminal','OTHER','trm','trm'),(894,'application/x-msword','OTHER','doc,dot,wrd','doc'),(895,'application/x-mswrite','OTHER','wri','wri'),(896,'application/x-netcdf','OTHER','nc,cdf','nc'),(897,'application/x-ns-proxy-autoconfig','OTHER','pac','pac'),(898,'application/x-nzb','OTHER','nzb','nzb'),(899,'application/x-opera-extension','OTHER','oex','oex'),(900,'application/x-pagemaker','OTHER','pm,pm5,pt5','pm'),(901,'application/x-perl','OTHER','pl,pm','pl'),(902,'application/x-pkcs12','OTHER','p12,pfx','p12'),(903,'application/x-pkcs7-certificates','OTHER','p7b,spc','p7b'),(904,'application/x-pkcs7-certreqresp','OTHER','p7r','p7r'),(905,'application/x-python','OTHER','py','py'),(906,'application/x-quicktimeplayer','OTHER','qtl','qtl'),(907,'application/x-rar-compressed','OTHER','rar','rar'),(908,'application/x-research-info-systems','OTHER','ris','ris'),(909,'application/x-rtf','OTHER','rtf','rtf'),(910,'application/x-ruby','OTHER','rb,rbw','rb'),(911,'application/x-sh','OTHER','sh','sh'),(912,'application/x-shar','OTHER','shar','shar'),(913,'application/x-shockwave-flash','OTHER','swf','swf'),(914,'application/x-silverlight-app','OTHER','xap','xap'),(915,'application/x-smarttech-notebook','OTHER','notebook','notebook'),(916,'application/x-spss','OTHER','sav,sbs,sps,spo,spp','sav'),(917,'application/x-sql','OTHER','sql','sql'),(918,'application/x-stuffit','OTHER','sit','sit'),(919,'application/x-stuffitx','OTHER','sitx','sitx'),(920,'application/x-subrip','OTHER','srt','srt'),(921,'application/x-sv4cpio','OTHER','sv4cpio','sv4cpio'),(922,'application/x-sv4crc','OTHER','sv4crc','sv4crc'),(923,'application/x-t3vm-image','OTHER','t3','t3'),(924,'application/x-tads','OTHER','gam','gam'),(925,'application/x-tar','OTHER','tar','tar'),(926,'application/x-tcl','OTHER','tcl','tcl'),(927,'application/x-tex','OTHER','tex','tex'),(928,'application/x-tex-tfm','OTHER','tfm','tfm'),(929,'application/x-texinfo','OTHER','texinfo,texi','texinfo'),(930,'application/x-tgif','OTHER','obj','obj'),(931,'application/x-toolbook','OTHER','tbk','tbk'),(932,'application/x-troff','OTHER','t,tr,roff','t'),(933,'application/x-troff-man','OTHER','man','man'),(934,'application/x-troff-me','OTHER','me','me'),(935,'application/x-troff-ms','OTHER','ms','ms'),(936,'application/x-ustar','OTHER','ustar','ustar'),(937,'application/x-VMSBACKUP','OTHER','bck','bck'),(938,'application/x-wais-source','OTHER','src','src'),(939,'application/x-web-app-manifest+json','OTHER','webapp','webapp'),(940,'application/x-Wingz','OTHER','wz,wkz','wz'),(941,'application/x-word','OTHER','doc,dot','doc'),(942,'application/x-wordperfect','OTHER','wp','wp'),(943,'application/x-wordperfect6.1','OTHER','wp6','wp6'),(944,'application/x-wordperfectd','OTHER','wpd','wpd'),(945,'application/x-x509-ca-cert','OTHER','crt,der','crt'),(946,'application/x-xfig','OTHER','fig','fig'),(947,'application/x-xliff+xml','OTHER','xlf','xlf'),(948,'application/x-xpinstall','OTHER','xpi','xpi'),(949,'application/x-xz','OTHER','xz','xz'),(950,'application/x-zip-compressed','OTHER','zip','zip'),(951,'application/x-zmachine','OTHER','z1,z2,z3,z4,z5,z6,z7,z8','z1'),(952,'application/xaml+xml','OTHER','xaml','xaml'),(953,'application/xcap-diff+xml','OTHER','xdf','xdf'),(954,'application/xenc+xml','OTHER','xenc','xenc'),(955,'application/xhtml+xml','OTHER','xht,xhtml','xht'),(956,'application/xml','OTHER','xml,xsl','xml'),(957,'application/xml-dtd','OTHER','dtd','dtd'),(958,'application/xop+xml','OTHER','xop','xop'),(959,'application/xproc+xml','OTHER','xpl','xpl'),(960,'application/xslt+xml','OTHER','xslt','xslt'),(961,'application/xspf+xml','OTHER','xspf','xspf'),(962,'application/xv+xml','OTHER','mxml,xhvml,xvm,xvml','mxml'),(963,'application/yang','OTHER','yang','yang'),(964,'application/yin+xml','OTHER','yin','yin'),(965,'application/zip','OTHER','zip','zip');
/*!40000 ALTER TABLE `mimetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `sessionToken` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionExpireDateTime` timestamp NOT NULL,
  `created` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_userid_foreign` (`userId`),
  CONSTRAINT `session_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `created` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` int unsigned DEFAULT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT '0',
  `activation_key` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banned` tinyint(1) NOT NULL DEFAULT '0',
  `updated` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_username_unique` (`username`),
  KEY `user_avatar_foreign` (`avatar`),
  CONSTRAINT `user_avatar_foreign` FOREIGN KEY (`avatar`) REFERENCES `media` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'storage'
--

--
-- Dumping routines for database 'storage'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-10  7:08:06
