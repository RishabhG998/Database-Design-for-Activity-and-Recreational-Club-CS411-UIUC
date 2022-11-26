USE SRKC;


DROP PROCEDURE IF EXISTS user_details;

delimiter //
CREATE PROCEDURE user_details (IN id VARCHAR(30))
BEGIN

	DECLARE net_idd VARCHAR(100);
    DECLARE namee VARCHAR(100);
    DECLARE contact_numberr VARCHAR(100);
    DECLARE email_idd VARCHAR(100);
    DECLARE date_of_birthh DATE;
    DECLARE role_idd INT;
    DECLARE role_namee VARCHAR(100);
    DECLARE role_descriptionn VARCHAR(100);
    DECLARE facilities_usedd INT;
    DECLARE slots_bookedd INT;
    DECLARE events_bookedd INT;
    DECLARE tickets_bookedd INT;
    DECLARE equipment_countt INT; 
    DECLARE total_equipment_rentt REAL;
    DECLARE total_tickets_costt REAL;
    DECLARE total_rent_paidd REAL;
    DECLARE net_id22 VARCHAR(100);
    DECLARE start_timee TIME;
    DECLARE end_timee TIME;
    DECLARE slot_idd INT;
    DECLARE booking_datee DATETIME;
    DECLARE facility_idd INT;
    DECLARE facility_namee VARCHAR(50);
    DECLARE slot_datee DATE;
    DECLARE exitloop BOOLEAN DEFAULT FALSE;
    
    DECLARE cur CURSOR FOR (SELECT tt.*, A.net_id AS net_id2 , A.start_time, A.end_time, A.slot_id,A.booking_date,  A.facility_id, A.facility_name, A.slot_date FROM (SELECT net_id, `name`, contact_number, email_id, date_of_birth, 
		   role_id, role_name,role_description,facilities_used,slots_booked,events_booked,tickets_booked,equipment_count, 
           total_rent AS total_equipment_rent,total_tickets_cost, (CASE WHEN total_rent>0 THEN total_rent ELSE 0 END) + (CASE WHEN total_tickets_cost>0 THEN total_tickets_cost ELSE 0 END) AS total_rent_paid FROM (
    
		SELECT * FROM (
		SELECT * FROM (
		SELECT * FROM 
		(SELECT Users.*, Roles.role_name, Roles.role_description FROM Users LEFT JOIN Roles ON Users.role_id = Roles.role_id) 
			AS User_Role LEFT JOIN 
				(SELECT net_id AS net_id_2, COUNT(DISTINCT(facility_id)) AS facilities_used, COUNT(slot_id) AS slots_booked
					FROM SlotBookings GROUP BY net_id) AS Grouped_Slot_Booking ON User_Role.net_id=Grouped_Slot_Booking.net_id_2) AS User_Role_Slot
					LEFT JOIN 
						(SELECT net_id AS net_id_3, COUNT(DISTINCT(event_id)) AS events_booked, SUM(ticket_count) AS tickets_booked
						FROM EventBookings
						GROUP BY net_id) AS Grouped_Event_Booking ON User_Role_Slot.net_id=Grouped_Event_Booking.net_id_3) AS User_Role_Slot_Event
                        
                        LEFT JOIN (SELECT net_id AS net_id_4,SUM(ER.equipment_count) AS equipment_count,SUM(ER.equipment_count*equipment_rent_per_hour) AS total_rent FROM EquipmentRentals ER LEFT JOIN Equipments E ON ER.equipment_id=E.equipment_id
								  
								  GROUP BY net_id) AS Equipment_Data ON User_Role_Slot_Event.net_id=Equipment_Data.net_id_4) AS base_table LEFT JOIN 
												(SELECT EB.net_id AS net_id_5 , COUNT(DISTINCT(E.event_id)) AS total_events, SUM(EB.ticket_count) AS total_tickets ,SUM( EB.ticket_count * E.ticket_cost)
                                                AS total_tickets_cost FROM Events E LEFT JOIN EventBookings EB ON E.event_id=EB.event_id GROUP BY EB.net_id) 
                                                AS Events_EB ON base_table.net_id = Events_EB.net_id_5) tt LEFT JOIN (
		SELECT D.net_id, D.start_time, D.end_time, D.slot_id, D.booking_date, D.facility_id, D.facility_name, A.slot_date FROM (
					(SELECT B.net_id, B.start_time, B.end_time, B.slot_id, B.booking_date, B.facility_id, F.facility_name FROM (
								SELECT sb.net_id, s.start_time, s.end_time, sb.slot_id, sb.booking_date, sb.facility_id FROM SlotBookings sb LEFT JOIN Slots s ON sb.slot_id = s.slot_id) B 
											LEFT JOIN Facilities F ON B.facility_id = F.facility_id) D
														LEFT JOIN AvailableSlots a ON a.available_slot_id = D.slot_id)) A ON tt.net_id = A.net_id
                                                        );
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET exitLoop = TRUE;
    
    
    
    DROP TABLE IF EXISTS temp_table_2;
    
    CREATE TABLE temp_table_2 (net_idd VARCHAR(100), 
    namee VARCHAR(100),
    contact_number VARCHAR(100),
    email_id VARCHAR(100), 
    date_of_birth DATE, 
    role_id INT,
    role_name VARCHAR(100),
    role_description VARCHAR(100),
    facilities_used INT,
    slots_booked INT,
    events_booked INT,
    tickets_booked INT,
    equipment_count INT, 
    total_equipment_rent REAL,
    total_tickets_cost REAL,
    total_rent_paid REAL,
    net_id2 VARCHAR(100),
    start_time TIME,
    end_time TIME,
    slot_id INT,
    booking_date DATETIME,
    facility_id INT,
    facility_name VARCHAR(50),
    slot_date DATE);
    
    SET @user_id = (SELECT net_id FROM users WHERE net_id=id);

    
    OPEN cur;
    CLOOP:LOOP
        FETCH cur INTO net_idd, namee ,contact_numberr ,email_idd ,date_of_birthh ,role_idd,role_namee ,role_descriptionn ,
        facilities_usedd ,slots_bookedd ,events_bookedd ,tickets_bookedd ,equipment_countt ,
		total_equipment_rentt ,total_tickets_costt ,total_rent_paidd,net_id22, start_timee ,end_timee ,slot_idd ,booking_datee ,facility_idd ,
		facility_namee ,slot_datee;
    
		IF (exitLoop) THEN
				LEAVE CLOOP;
		END IF;
		IF net_idd=@user_id THEN
        
		INSERT INTO temp_table_2 VALUES (net_idd, namee ,contact_numberr ,email_idd ,date_of_birthh ,role_idd,role_namee ,role_descriptionn ,
        facilities_usedd ,slots_bookedd ,events_bookedd ,tickets_bookedd ,equipment_countt ,
		total_equipment_rentt ,total_tickets_costt ,total_rent_paidd,net_id22, start_timee ,end_timee ,slot_idd ,booking_datee ,facility_idd ,
		facility_namee ,slot_datee);
		END IF;
		END LOOP CLOOP;
		CLOSE cur;
	
    SELECT * FROM temp_table_2;
	
END//

delimiter ;
CALL user_details('_donlbr');