DROP DATABASE IF EXISTS SRKC;

CREATE DATABASE IF NOT EXISTS SRKC;
USE SRKC;

CREATE TABLE IF NOT EXISTS Sports (
    sport_id INT PRIMARY KEY AUTO_INCREMENT,
    sport_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Facilities (
    facility_id INT PRIMARY KEY AUTO_INCREMENT,
    facility_name VARCHAR(50),
    sport_id INT,
    FOREIGN KEY (sport_id)
        REFERENCES Sports (sport_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(50),
    event_description VARCHAR(200),
    event_capacity INT NOT NULL,
    ticket_cost REAL,
    event_date DATE,
    event_start_time TIME,
    event_end_time TIME,
    facility_id INT,
    sport_id INT,
    FOREIGN KEY (facility_id)
        REFERENCES Facilities (facility_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sport_id)
        REFERENCES Sports (sport_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Equipments (
    equipment_id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_name VARCHAR(50),
    equipment_count INT NOT NULL,
    equipment_rent_per_hour REAL,
    sport_id INT,
    FOREIGN KEY (sport_id)
        REFERENCES Sports (sport_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50),
    role_description VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS Users (
    net_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    contact_number VARCHAR(10) NOT NULL,
    email_id VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    role_id INT,
    FOREIGN KEY (role_id)
        REFERENCES Roles (role_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Slots (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    start_time TIME,
    end_time TIME
);

CREATE TABLE IF NOT EXISTS AvailableSlots (
    available_slot_id INT PRIMARY KEY AUTO_INCREMENT,
    slot_date DATE,
    slot_id INT,
    FOREIGN KEY (slot_id)
        REFERENCES Slots (slot_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS SlotBookings (
    net_id VARCHAR(30),
    facility_id INT,
    slot_id INT,
    booking_date DATETIME,
    PRIMARY KEY (net_id , facility_id , booking_date, slot_id),
    FOREIGN KEY (net_id)
        REFERENCES Users (net_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (facility_id)
        REFERENCES Facilities (facility_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (slot_id)
        REFERENCES Slots (slot_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS EventBookings (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    net_id VARCHAR(30),
    event_id INT,
    booking_date DATETIME,
    ticket_count INT,
    FOREIGN KEY (net_id)
        REFERENCES Users (net_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES Events (event_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS EquipmentRentals (
    rent_id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_count INT,
    rent_date DATETIME,
    available_slot_id INT,
    net_id VARCHAR(30),
    equipment_id INT,
    FOREIGN KEY (available_slot_id)
        REFERENCES AvailableSlots (available_slot_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (net_id)
        REFERENCES Users (net_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (equipment_id)
        REFERENCES Equipments (equipment_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
