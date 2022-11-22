USE SRKC;

## total Revenue
select sum(E.equipment_rent_per_hour * ER.equipment_count)
from EquipmentRentals ER left join Equipments E on ER.equipment_id = E.equipment_id;

## Total bookings
select count(slot_id) from SlotBookings;


## Total Event bookings with total tickets sold
SELECT COUNT(DISTINCT(e.event_name)) AS total_events, SUM(eb.ticket_count) AS total_tickets_sold FROM Events e NATURAL JOIN EventBookings eb;


## Get ticket sold per event
SELECT event_name, SUM(ticket_count) FROM EventBookings natural join events group by event_name


## Bookings by Week day
select  
		case when WEEKDAY(booking_date)=0 then 'Monday'
        when WEEKDAY(booking_date)=1 then 'Tuesday'
        when WEEKDAY(booking_date)=2 then 'Wednesday'
        when WEEKDAY(booking_date)=3 then 'Thursday'
        when WEEKDAY(booking_date)=4 then 'Friday'
        when WEEKDAY(booking_date)=5 then 'Saturday'
        when WEEKDAY(booking_date)=6 then 'Sunday'
        else 'Other'
        end as week_day,
	   count(slot_id) from SlotBookings
group by week_day;



## Stored Procedure

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
call user_details('barbroe');


