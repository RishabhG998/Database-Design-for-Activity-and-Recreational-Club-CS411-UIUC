USE SRKC;

## total Revenue
select sum(E.equipment_rent_per_hour * ER.equipment_count)
from EquipmentRentals ER left join Equipments E on ER.equipment_id = E.equipment_id;

## Total bookings
select count(slot_id) from SlotBookings;


## Total Event bookings with total tickets sold (price?)
select count(event_id),sum(ticket_count) from EventBookings;


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

#Trial work

select * from Equipments; 

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

