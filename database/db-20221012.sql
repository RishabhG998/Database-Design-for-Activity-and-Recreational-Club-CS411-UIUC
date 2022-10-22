-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (arm64)
--
-- Host: localhost    Database: SRKC
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Current Database: `SRKC`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `SRKC` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `SRKC`;

--
-- Table structure for table `AvailableSlots`
--

DROP TABLE IF EXISTS `AvailableSlots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AvailableSlots` (
  `available_slot_id` int NOT NULL AUTO_INCREMENT,
  `slot_date` datetime DEFAULT NULL,
  `slot_id` int DEFAULT NULL,
  PRIMARY KEY (`available_slot_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `availableslots_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `Slots` (`slot_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AvailableSlots`
--

LOCK TABLES `AvailableSlots` WRITE;
/*!40000 ALTER TABLE `AvailableSlots` DISABLE KEYS */;
/*!40000 ALTER TABLE `AvailableSlots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EquipmentRentals`
--

DROP TABLE IF EXISTS `EquipmentRentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EquipmentRentals` (
  `rent_id` int NOT NULL AUTO_INCREMENT,
  `equipment_count` int DEFAULT NULL,
  `rent_date` datetime DEFAULT NULL,
  `available_slot_id` int DEFAULT NULL,
  `net_id` varchar(30) DEFAULT NULL,
  `equipment_id` int DEFAULT NULL,
  PRIMARY KEY (`rent_id`),
  KEY `available_slot_id` (`available_slot_id`),
  KEY `net_id` (`net_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `equipmentrentals_ibfk_1` FOREIGN KEY (`available_slot_id`) REFERENCES `AvailableSlots` (`available_slot_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipmentrentals_ibfk_2` FOREIGN KEY (`net_id`) REFERENCES `Users` (`net_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipmentrentals_ibfk_3` FOREIGN KEY (`equipment_id`) REFERENCES `Equipments` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EquipmentRentals`
--

LOCK TABLES `EquipmentRentals` WRITE;
/*!40000 ALTER TABLE `EquipmentRentals` DISABLE KEYS */;
/*!40000 ALTER TABLE `EquipmentRentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Equipments`
--

DROP TABLE IF EXISTS `Equipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Equipments` (
  `equipment_id` int NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(50) DEFAULT NULL,
  `equipment_count` int NOT NULL,
  `equipment_rent_per_hour` double DEFAULT NULL,
  `sport_id` int DEFAULT NULL,
  PRIMARY KEY (`equipment_id`),
  KEY `sport_id` (`sport_id`),
  CONSTRAINT `equipments_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `Sports` (`sport_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Equipments`
--

LOCK TABLES `Equipments` WRITE;
/*!40000 ALTER TABLE `Equipments` DISABLE KEYS */;
/*!40000 ALTER TABLE `Equipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventBookings`
--

DROP TABLE IF EXISTS `EventBookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventBookings` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `net_id` varchar(30) DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `booking_date` datetime DEFAULT NULL,
  `ticket_count` int DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `net_id` (`net_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `eventbookings_ibfk_1` FOREIGN KEY (`net_id`) REFERENCES `Users` (`net_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `eventbookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventBookings`
--

LOCK TABLES `EventBookings` WRITE;
/*!40000 ALTER TABLE `EventBookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `EventBookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(50) DEFAULT NULL,
  `event_description` varchar(200) DEFAULT NULL,
  `event_capacity` int NOT NULL,
  `ticket_cost` double DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_start_time` time DEFAULT NULL,
  `event_end_time` time DEFAULT NULL,
  `facility_id` int DEFAULT NULL,
  `sport_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `facility_id` (`facility_id`),
  KEY `sport_id` (`sport_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`facility_id`) REFERENCES `Facilities` (`facility_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`sport_id`) REFERENCES `Sports` (`sport_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Facilities`
--

DROP TABLE IF EXISTS `Facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Facilities` (
  `facility_id` int NOT NULL AUTO_INCREMENT,
  `facility_name` varchar(50) DEFAULT NULL,
  `sport_id` int DEFAULT NULL,
  PRIMARY KEY (`facility_id`),
  KEY `sport_id` (`sport_id`),
  CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `Sports` (`sport_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Facilities`
--

LOCK TABLES `Facilities` WRITE;
/*!40000 ALTER TABLE `Facilities` DISABLE KEYS */;
/*!40000 ALTER TABLE `Facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) DEFAULT NULL,
  `role_description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SlotBookings`
--

DROP TABLE IF EXISTS `SlotBookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SlotBookings` (
  `net_id` varchar(30) NOT NULL,
  `facility_id` int NOT NULL,
  `slot_id` int NOT NULL,
  `booking_date` datetime DEFAULT NULL,
  PRIMARY KEY (`net_id`,`facility_id`,`slot_id`),
  KEY `facility_id` (`facility_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `slotbookings_ibfk_1` FOREIGN KEY (`net_id`) REFERENCES `Users` (`net_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `slotbookings_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `Facilities` (`facility_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `slotbookings_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `Slots` (`slot_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SlotBookings`
--

LOCK TABLES `SlotBookings` WRITE;
/*!40000 ALTER TABLE `SlotBookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `SlotBookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Slots`
--

DROP TABLE IF EXISTS `Slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Slots` (
  `slot_id` int NOT NULL AUTO_INCREMENT,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`slot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Slots`
--

LOCK TABLES `Slots` WRITE;
/*!40000 ALTER TABLE `Slots` DISABLE KEYS */;
/*!40000 ALTER TABLE `Slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sports`
--

DROP TABLE IF EXISTS `Sports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sports` (
  `sport_id` int NOT NULL AUTO_INCREMENT,
  `sport_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sports`
--

LOCK TABLES `Sports` WRITE;
/*!40000 ALTER TABLE `Sports` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `net_id` varchar(30) NOT NULL,
  `name` varchar(50) NOT NULL,
  `contact_number` varchar(10) NOT NULL,
  `email_id` varchar(50) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`net_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-12  1:18:33
