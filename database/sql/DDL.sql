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
        REFERENCES AvailableSlots (slot_id)
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

delimiter //
Create Trigger Delete_User before delete on Users
for each row
begin

    declare bookingg varchar(100);
	set @deleted_net_id = OLD.net_id;
    
    insert into AvailableSlots (slot_date, slot_id) select booking_date, slot_id from slotbookings where net_id = @deleted_net_id;
    
end//
delimiter ;


drop procedure if exists user_details;

delimiter //
create procedure user_details (IN id varchar(30))
begin
    select net_id, "name", contact_number, email_id, date_of_birth, 
		   role_id, role_name,role_description,facilities_used,slots_booked,events_booked,tickets_booked,equipment_count, 
           total_rent as total_equipment_rent,total_tickets_cost, (case when total_rent>0 then total_rent else 0 end) + (case when total_tickets_cost>0 then total_tickets_cost else 0 end) as total_rent_paid from (
    
		select * from (
		select * from (
		select * from 
		(select Users.*, Roles.role_name, Roles.role_description from Users left join Roles on Users.role_id = Roles.role_id where Users.net_id=id) 
			as User_Role left join 
				(select net_id as net_id_2, count(distinct(facility_id)) as facilities_used, count(slot_id) as slots_booked
					from SlotBookings where net_id=id group by net_id) as Grouped_Slot_Booking on User_Role.net_id=Grouped_Slot_Booking.net_id_2) as User_Role_Slot
					left join 
						(select net_id as net_id_3, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
						from EventBookings where net_id=id
						group by net_id) as Grouped_Event_Booking on User_Role_Slot.net_id=Grouped_Event_Booking.net_id_3) as User_Role_Slot_Event
                        
                        left join (select net_id as net_id_4,sum(ER.equipment_count) as equipment_count,sum(ER.equipment_count*equipment_rent_per_hour) as total_rent from EquipmentRentals ER left join Equipments E on ER.equipment_id=E.equipment_id
								  where net_id=id
								  group by net_id) as Equipment_Data on User_Role_Slot_Event.net_id=Equipment_Data.net_id_4) as base_table left join 
												(select EB.net_id as net_id_5 , count(distinct(E.event_id)) as total_events, sum(EB.ticket_count) as total_tickets ,sum( EB.ticket_count * E.ticket_cost)
                                                as total_tickets_cost from Events E left join EventBookings EB on E.event_id=EB.event_id where EB.net_id=id group by EB.net_id) 
                                                as Events_EB on base_table.net_id = Events_EB.net_id_5;
end//

delimiter ;
