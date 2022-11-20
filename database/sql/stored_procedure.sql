use SRKC;


drop procedure if exists user_details;

delimiter //
create procedure user_details (IN id varchar(30))
begin
    select net_id, `name`, contact_number, email_id, date_of_birth, 
		   role_id, role_name,role_description,facilities_used,slots_booked,events_booked,tickets_booked,equipment_count, total_rent from (
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
								  group by net_id) as Equipment_Data on User_Role_Slot_Event.net_id=Equipment_Data.net_id_4;
end//

delimiter ;
call user_details('gmanews');

set @id = 'gmanews';
select Users.*, Roles.role_name, Roles.role_description from Users left join Roles on Users.role_id = Roles.role_id where Users.net_id=@id;

select net_id as net_id_2, count(distinct(facility_id)) as facilities_used, count(slot_id) as slots_booked
								from SlotBookings where net_id=@id group by net_id;
                                
select net_id as net_id_3, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
											from EventBookings where net_id=@id
											group by net_id;

select net_id as net_id_4,sum(ER.equipment_count) as equipment_count,sum(ER.equipment_count*equipment_rent_per_hour) as total_rent from EquipmentRentals ER left join Equipments E on ER.equipment_id=E.equipment_id
                                                where net_id=@id
												group by net_id;

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


select net_id,sum(ER.equipment_count*equipment_rent_per_hour) as total_rent from EquipmentRentals ER left join Equipments E on ER.equipment_id=E.equipment_id
where net_id='gmanews'
group by net_id;

select * from EquipmentRentals;

select net_id, "name", contact_number, email_id, date_of_birth, 
		   role_id, role_name,role_description,facilities_used,slots_booked,events_booked,tickets_booked,equipment_count, total_rent from (
	select * from (
		select * from 
		(select Users.*, Roles.role_name, Roles.role_description from Users left join Roles on Users.role_id = Roles.role_id where Users.net_id='gmanews') 
			as User_Role left join 
				(select net_id as net_id_2, count(distinct(facility_id)) as facilities_used, count(slot_id) as slots_booked
					from SlotBookings where net_id='gmanews' group by net_id) as Grouped_Slot_Booking on User_Role.net_id=Grouped_Slot_Booking.net_id_2) as User_Role_Slot
					left join 
						(select net_id as net_id_3, count(distinct(event_id)) as events_booked, sum(ticket_count) as tickets_booked
						from EventBookings where net_id='gmanews'
						group by net_id) as Grouped_Event_Booking on User_Role_Slot.net_id=Grouped_Event_Booking.net_id_3) as User_Role_Slot_Event
                        
                        left join (select net_id as net_id_4,sum(ER.equipment_count) as equipment_count,sum(ER.equipment_count*equipment_rent_per_hour) as total_rent from EquipmentRentals ER left join Equipments E on ER.equipment_id=E.equipment_id
								  where net_id='gmanews'
								  group by net_id) as Equipment_Data on User_Role_Slot_Event.net_id=Equipment_Data.net_id_4
