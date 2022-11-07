-- Query 1: Total Time spent by users in specific for each sport in a given date range
SELECT sp.SPORT_NAME, s.NET_ID, COUNT(SLOT_ID) as TOTAL_HOURS_SPENT
FROM slotbookings s JOIN Facilities f USING(FACILITY_ID) JOIN sports sp USING(SPORT_ID)
WHERE s.BOOKING_DATE BETWEEN '2022-08-22' AND '2022-12-22' AND sp.sport_id=2
GROUP BY sp.SPORT_NAME, s.NET_ID;


-- Query 2: Events bringing max revenue
SELECT e.event_name, SUM(eb.ticket_count * e.ticket_cost) as total_val
FROM eventbookings eb JOIN events e USING(EVENT_ID)
GROUP BY e.EVENT_ID
ORDER BY total_val desc;

-- Query 3: Get booked slots from past for a sport (INCOMPLETE)
SELECT slot_date, COUNT(slot_id)
FROM availableslots
WHERE slot_id NOT IN (
	SELECT slot_id from slotbookings where facility_id IN (select facility_id from facilities where sport_id=2)
)
GROUP BY slot_date;




/*
Other advanced queries for reference. These could be used in
the project but are not in use in Stage - 3.
*/


-- Get occupied slots for a facility on a given date
SELECT count(*) from availableslots 
where slot_date like '2022-08-22%' and slot_id not in 
	(select slot_id from slotbookings 
	where booking_date like '2022-08-22%' and facility_id = '108'); 

-- Get count of occupied equipments for a specific sport at a given date and slot
SELECT COUNT(*) FROM EquipmentRentals
WHERE equipment_id IN 
	(SELECT equipment_id 
	FROM Equipments 
	WHERE SPORT_ID = 
			(SELECT SPORT_ID 
			FROM Equipments 
			WHERE equipment_id = 12))
 	AND rent_date LIKE '2022-12-08%';
