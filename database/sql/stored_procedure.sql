use SRKC;


drop procedure if exists user_details;

delimiter //
create procedure user_details (IN id varchar(30))
begin
    select net_id, "name", contact_number, email_id, date_of_birth, role_id, role_name,role_description,facilities_used,slots_booked,events_booked,tickets_booked from 
				(select Users.*, Roles.role_name, Roles.role_description from Users left join Roles on Users.role_id = Roles.role_id where Users.net_id=id) 
				   as User_Role left join 
							  (select * from (select net_id as net_id_2, count(distinct(facility_id)) as facilities_used, count(slot_id) as slots_booked
								from SlotBookings group by net_id) as Grouped_Slot_Booking 
											left join 
                                            (select net_id as net_id_3, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
											from EventBookings
											group by net_id) as Grouped_Event_Booking on Grouped_Slot_Booking.net_id_2 = Grouped_Event_Booking.net_id_3 where Grouped_Slot_Booking.net_id_2=id) as Grouped_Slot_Event on User_Role.net_id = Grouped_Slot_Event.net_id_2;
end//

delimiter ;
call user_details('_donlbr');





-- Rough Work 


select Users.*, Roles.role_name, Roles.role_description from Users left join Roles on Users.role_id = Roles.role_id where Users.net_id='_greenwings';

select net_id, count(distinct(facility_id)) as facilities_used, count(slot_id) as slots_booked
from SlotBookings where net_id='_donlbr'
group by net_id;

select net_id, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
from EventBookings where net_id='_donlbr'
group by net_id; 



select * from (select net_id, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
from EventBookings where net_id = '_donlbr'
group by net_id) as A natural join
(select Users.*, Roles.role_name, Roles.role_description from Users natural join Roles where Users.net_id = '_donlbr') 
as B;-- on A.net_id = B.net_id;



select * from (select net_id as net_id_2, count(distinct(facility_id)) as facilities_used, count(slot_id) as slots_booked
								from SlotBookings where net_id='_donlbr' group by net_id) as B 
											left join 
                                            (select net_id as net_id_3, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
											from EventBookings where net_id='_donlbr'
											group by net_id) as C on B.net_id_2 = C.net_id_3;



delimiter //

create procedure user_details_test (IN id varchar(30))
begin
	drop view myview;
	create view myview as (select Users.*, Roles.role_name, Roles.role_description from Users natural join Roles where Users.net_id=id);
    -- CREATE VIEW myview AS select Users.*, Roles.role_name, Roles.role_description from Users left join Roles on Users.role_id = Roles.role_id where Users.net_id=id;
	SELECT * FROM myview;
end//

delimiter ;
drop procedure user_details_test;


call user_details_test('_donlbr');
