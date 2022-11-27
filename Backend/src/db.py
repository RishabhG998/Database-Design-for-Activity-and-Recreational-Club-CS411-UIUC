import os, glob
import mysql.connector
from datetime import datetime

from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent.absolute()))
from database.scripts import main # required for DATE_SEPARATOR

DB_DIR = '../database'
db_files = list(glob.glob(f'{DB_DIR}/*.sql'))
DB = max(db_files, key=os.path.getctime)
DB_USER = 'root'
DB_PASS = 'root'
DATETIME_STRING_FORMAT = f'%Y{main.DATE_SEPARATOR}%m{main.DATE_SEPARATOR}%d'

def run_query(query, execute_many = False, get_status = False, return_data = False, get_columns = False):
    db_conn = None
    try:
        db_conn = mysql.connector.connect(host = 'localhost', user = DB_USER, password = DB_PASS, database = 'SRKC')
        cur = db_conn.cursor()
        if execute_many:
            cur.executemany(query)
        else:
            cur.execute(query)
        
        if return_data is False: db_conn.commit()
        if return_data:
            if get_columns:
                result = []
                data = cur.fetchall()
                columns = [i[0] for i in cur.description]
                for i in range(len(data)):
                    result.append(list(zip(columns, data[i])))
                return result, None
            return cur.fetchall(), None
        if get_status:
            return True, None

    except Exception as e:
        print(e)
        if return_data:
            return None, e
        if get_status:
            return False, e

def get_table_columns(table_name):
    result = []
    query = f'DESCRIBE {table_name}'
    res, error_msg = run_query(query, return_data = True)
    result = [r[0] for r in res]
    return result


def get_user_role(role_id):
    data, error_msg, ret_code = None, None, 400
    if str(role_id).strip() == '':
        return data, error_msg
    else:
        query = f'SELECT role_name FROM roles WHERE role_id = {role_id}'
        result, error_msg = run_query(query, return_data = True)
        if result != []:
            data = result[0][0]
            ret_code = 200
        else:
            data = None
            ret_code = 404
    return data, error_msg, ret_code



def get_all_users():
    data, error_msg, ret_code = None, None, 400
    query = f'SELECT * FROM Users'
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            _result = result
            result = []
            columns = get_table_columns('Users')
            for _r in _result:
                _r = list(_r)
                for i in range(len(columns)):
                    if columns[i] == 'date_of_birth':
                        _r[i] = _r[i].strftime(DATETIME_STRING_FORMAT)
                result.append(dict(zip(columns, _r)))
            ret_code = 200
        else:
            result = None
            ret_code = 404
    else:
        result = None
        error_msg = error
        ret_code = 500
    return result, error_msg, ret_code

def get_user_details(net_id):
    data, error_msg, ret_code = None, None, 400
    if net_id.strip() == '':
        return data, error_msg, ret_code
    else:
        query = f'SELECT * FROM Users NATURAL JOIN Roles WHERE net_id = "{net_id}"'
        result, error = run_query(query, return_data = True, get_columns=True)
        if not error:
            if result != []:
                _result = result[0]
                result = {}
                for i in range(len(_result)):
                    if _result[i][0] == 'date_of_birth':
                        result[_result[i][0]] = _result[i][1].strftime(DATETIME_STRING_FORMAT)
                        continue
                    result[_result[i][0]] = _result[i][1]
                ret_code = 200
            else:
                result = None
                ret_code = 404
        else:
            result = None
            error_msg = error
            ret_code = 500
    return result, error_msg, ret_code

def update_user_details(user_data):
    status, ret_code = None, 400
    if user_data is None:
        return None, 400
    query = f'UPDATE Users SET '
    for k, v in user_data.items():
        if k == 'net_id': # Primary Key will not change
            continue
        query += f'{k} = "{v}", '
    query = query[:-2]
    query += f' WHERE net_id = "{user_data["net_id"]}"'
    status, message = run_query(query, get_status = True)
    if status is True:
        status, ret_code = 'User details updated successfully', 200
    else:
        status, ret_code = f'Error: {message}', 500
    return status, ret_code

def insert_user_details(user_data):
    result, error_msg, ret_code = None, None, 400
    if user_data is None:
        return None, 400
    required_keys = ['net_id', 'name', 'contact_number', 'email_id']
    for k in required_keys:
        if k not in user_data: return None, 400
    query = f'INSERT INTO Users (net_id, name, contact_number, email_id, date_of_birth, role_id) VALUES ('
    for k, v in user_data.items():
        if k == 'date_of_birth':
            query += f'"{v}", '
            continue
        query += f'"{v}", '
    query = query[:-2]
    query += ')'
    status, error_msg = run_query(query, get_status = True)
    if status is True:
        result, error_msg, ret_code = 'User details inserted successfully', None, 200
    else:
        result, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return result, error_msg, ret_code

def delete_user(net_id):
    result, error_msg, ret_code = None, None, 400
    if net_id.strip() == '': return result, error_msg, ret_code
    else:
        query = f'DELETE FROM Users WHERE net_id = "{net_id}"'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            result, error_msg, ret_code = 'User details deleted successfully', None, 200
        else:
            result, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return result, error_msg, ret_code

def get_user_kundali(net_id):
    data, error_msg, ret_code = None, None, 400
    net_id = net_id.strip().lower()
    if net_id == '': return data, error_msg, ret_code
    data, error_msg, ret_code = get_user_details(net_id)
    if ret_code != 200:
        return data, error_msg, ret_code
    query = f'DROP PROCEDURE IF EXISTS user_details'
    status, error_msg = run_query(query, get_status = True)
    if status is False: return data, error_msg, ret_code
    stored_procedure_query = f"""
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
                contact_numberr VARCHAR(100),
                email_idd VARCHAR(100), 
                date_of_birthh DATE, 
                role_idd INT,
                role_namee VARCHAR(100),
                role_descriptionn VARCHAR(100),
                facilities_usedd INT,
                slots_bookedd INT,
                events_bookedd INT,
                tickets_bookedd INT,
                equipment_countt INT, 
                total_equipment_rentt REAL,
                total_tickets_costt REAL,
                total_rent_paidd REAL,
                net_id22 VARCHAR(100),
                start_timee TIME,
                end_timee TIME,
                slot_idd INT,
                booking_datee DATETIME,
                facility_idd INT,
                facility_namee VARCHAR(50),
                slot_datee DATE);
                
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
            END
            """
    status, error_msg = run_query(stored_procedure_query, get_status = True)
    if status is False:
        return data, error_msg, ret_code
    query = f'CALL user_details("{net_id}")'
    result, error_msg = run_query(query, return_data = True, get_columns = True)
    if result is None: return data, error_msg, ret_code
    data = []
    for i in range(len(result)):
        d = {}
        for j in range(len(result[i])):
            d[result[i][j][0]] = str(result[i][j][1])
        data.append(d)
    ret_code = 200
    return data, error_msg, ret_code

def get_equipment_info(equipment_id = -1, equipment_name = None, sport_id = -1, regex_check = False):
    data, error_msg, ret_code = None, None, 400
    if (str(equipment_id).strip() == '-1') and (str(equipment_name).strip() == '') and (str(sport_id).strip() == '-1'):
        return data, error_msg, ret_code
    else:
        if regex_check:
            query = f'SELECT * FROM Equipments WHERE equipment_name LIKE "%{equipment_name}%"'
        else:
            if equipment_id != -1:
                query = f'SELECT * FROM Equipments WHERE equipment_id = {equipment_id}'
            elif sport_id != -1:
                query = f'SELECT * FROM Equipments WHERE sport_id = {sport_id}'
        result, error = run_query(query, return_data = True)
        if not error:
            if result != []:
                data = []
                columns = get_table_columns('Equipments')
                for i in range(len(result)):
                    _result = {}
                    for j in range(len(columns)):
                        if columns[j] == 'date_of_purchase':
                            _result[columns[j]] = result[i][j].strftime(DATETIME_STRING_FORMAT)
                            continue
                        _result[columns[j]] = result[i][j]
                    data.append(_result)
                ret_code = 200
            else:
                data = None
                ret_code = 404
        else:
            data = None
            error_msg = error
            ret_code = 500
    return data, error_msg, ret_code

def add_equipment_info(equipment_name, equipment_count, equipment_rent_per_hour, sport_id):
    result, error_msg, ret_code = None, None, 400
    if (str(equipment_name).strip() == '') or (str(equipment_count).strip() == '') or (str(equipment_rent_per_hour).strip() == '') or (str(sport_id).strip() == ''):
        error_msg = 'Please enter all of the required fields (Equipment Name, Equipment Count, Equipment Rent per Hour, Sport ID)'
    else:
        query = f'INSERT INTO Equipments (equipment_name, equipment_count, equipment_rent_per_hour, sport_id) VALUES ("{equipment_name}", {equipment_count}, {equipment_rent_per_hour}, {sport_id})'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            result, error_msg, ret_code = 'Equipment details inserted successfully', None, 200
        else:
            result, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return result, error_msg, ret_code

def update_equipment_info(equipment_id, equipment_name, equipment_count, equipment_rent_per_hour, sport_id):
    result, error_msg, ret_code = None, None, 400
    if str(equipment_id).strip() == '':
        error_msg = 'Please enter Equipment ID'
    else:
        update_list = []
        if str(equipment_name).strip() != '':
            update_list.append(f'equipment_name = "{equipment_name}"')
        if str(equipment_count).strip() != '-1':
            update_list.append(f'equipment_count = {equipment_count}')
        if str(equipment_rent_per_hour).strip() != '-1.0':
            update_list.append(f'equipment_rent_per_hour = {equipment_rent_per_hour}')
        if str(sport_id).strip() != '-1':
            update_list.append(f'sport_id = {sport_id}')
        if len(update_list) == 0:
            error_msg = 'Please enter at least one field to update'
        else:
            query = f'UPDATE Equipments SET '
            for i in update_list:
                query += f'{i}, '
            query = query[:-2]
            query += f' WHERE equipment_id = {equipment_id}'
            status, error_msg = run_query(query, get_status = True)
            if status is True:
                result, error_msg, ret_code = 'Equipment details updated successfully', None, 200
            else:
                result, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return result, error_msg, ret_code

def delete_equipment_info(equipment_id, equipment_name):
    result, error_msg, ret_code = None, None, 400
    if (str(equipment_id).strip() == '') and (str(equipment_name).strip() == ''):
        error_msg = 'Please enter Equipment ID or Equipment Name'
    else:
        if str(equipment_id).strip() != '':
            query = f'DELETE FROM Equipments WHERE equipment_id = {equipment_id}'
        else:
            query = f'DELETE FROM Equipments WHERE equipment_name = "{equipment_name}"'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            result, error_msg, ret_code = 'Equipment details deleted successfully', None, 200
        else:
            result, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return result, error_msg, ret_code

def book_equipment(equipment_count, rent_date, slot_id, net_id, equipment_id):
    data, error_msg, ret_code = None, None, 400
    if (str(equipment_count).strip() == '') or (str(rent_date).strip() == '') or (str(slot_id).strip() == '') or (str(net_id).strip() == '') or (str(equipment_id).strip() == ''):
        error_msg = 'Please enter all of the required fields (Equipment Count, Rent Date, Slot ID, Net ID, Equipment ID)'
    else:
        total_equipment_count_query = f'SELECT equipment_count FROM Equipments WHERE equipment_id = {equipment_id}'
        total_equipment_count, error = run_query(total_equipment_count_query, return_data = True)
        if not error:
            if total_equipment_count != []:
                already_booked_equipment_count_query = f'SELECT SUM(equipment_count) FROM EquipmentRentals WHERE equipment_id = {equipment_id} AND rent_date = (SELECT CONCAT(slot_date, \' \', start_time) FROM AvailableSlots NATURAL JOIN Slots WHERE available_slot_id = {slot_id})'
                already_booked_equipment_count, error = run_query(already_booked_equipment_count_query, return_data = True)
                if not error and already_booked_equipment_count != []:

                    if total_equipment_count[0][0] is None: total_equipment_count = 0
                    else: total_equipment_count = total_equipment_count[0][0]
                    if already_booked_equipment_count[0][0]is None: already_booked_equipment_count = 0
                    else: already_booked_equipment_count = already_booked_equipment_count[0][0]

                    if total_equipment_count - already_booked_equipment_count >= equipment_count:
                        query = f'INSERT INTO EquipmentRentals (equipment_count, rent_date, available_slot_id, net_id, equipment_id) VALUES ({equipment_count}, "{rent_date}", {slot_id}, "{net_id}", {equipment_id})'
                        status, error_msg = run_query(query, get_status = True)
                        if status is True:
                            data, error_msg, ret_code = 'Equipment booked successfully', None, 200
                        else:
                            data, error_msg, ret_code = None, f'Error: {error_msg}', 500
                    else:
                        data, error_msg, ret_code = None, 'Error: Not enough equipment available', 400
                else:
                    data, error_msg, ret_code = None, f'Error: {error}', 500
            else:
                data, error_msg, ret_code = None, 'Error: Equipment ID not found', 500
        else:
            data, error_msg, ret_code = None, f'Error: {error}', 500
    return data, error_msg, ret_code



def get_all_sport_info():
    data, error_msg, ret_code = None, None, 400
    query = f'SELECT * FROM Sports'
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            columns = get_table_columns('Sports')
            for i in range(len(result)):
                _result = {}
                for j in range(len(columns)):
                    _result[columns[j]] = result[i][j]
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_sport_info(sport_id = None, sport_name = None, regex_check = False):
    data, error_msg, ret_code = None, None, 400
    if (str(sport_id).strip() == '') and (str(sport_name).strip() == ''):
        return data, error_msg, ret_code
    else:
        if regex_check:
            query = f'SELECT * FROM Sports WHERE sport_name LIKE "%{sport_name}%"'
        else:
            query = f'SELECT * FROM Sports WHERE sport_id = {sport_id}'
        result, error = run_query(query, return_data = True)
        if not error:
            if result != []:
                data = []
                columns = get_table_columns('Sports')
                for i in range(len(result)):
                    _result = {}
                    for j in range(len(columns)):
                        _result[columns[j]] = result[i][j]
                    data.append(_result)
                ret_code = 200
            else:
                data = None
                ret_code = 404
        else:
            data = None
            error_msg = error
            ret_code = 500
    return data, error_msg, ret_code

def add_sport_info(sport_name):
    data, error_msg, ret_code = None, None, 400
    if sport_name.strip() == '':
        error_msg = 'Sport name cannot be empty'
    else:
        query = f'INSERT INTO Sports (sport_name) VALUES ("{sport_name}")'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            data, error_msg, ret_code = 'Sport added successfully', None, 200
        else:
            data, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return data, error_msg, ret_code

def delete_sport_info(sport_name):
    data, error_msg, ret_code = None, None, 400
    if sport_name.strip() == '':
        error_msg = 'Sport name cannot be empty'
    else:
        query = f'DELETE FROM Sports WHERE sport_name = "{sport_name}"'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            data, error_msg, ret_code = 'Sport deleted successfully', None, 200
        else:
            data, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return data, error_msg, ret_code



def get_all_facility_info():
    data, error_msg, ret_code = None, None, 400
    query = f'SELECT * FROM Facilities'
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            columns = get_table_columns('Facilities')
            for i in range(len(result)):
                _result = {}
                for j in range(len(columns)):
                    _result[columns[j]] = result[i][j]
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_facility_info(facility_id = None, facility_name = None, sport_id = None, regex_check = False):
    data, error_msg, ret_code = None, None, 400
    if (str(facility_id).strip() == '') and (str(sport_id).strip() == '') and (str(facility_name).strip() == ''):
        return data, error_msg, ret_code
    else:
        if regex_check:
            query = f'SELECT * FROM Facilities WHERE facility_name LIKE "%{facility_name}%"'
        else:
            if facility_id != -1:
                query = f'SELECT * FROM Facilities WHERE facility_id = {facility_id}'
            else:
                query = f'SELECT * FROM Facilities WHERE sport_id = {sport_id}'
        result, error = run_query(query, return_data = True)
        if not error:
            if result != []:
                data = []
                columns = get_table_columns('Facilities')
                for i in range(len(result)):
                    _result = {}
                    for j in range(len(columns)):
                        _result[columns[j]] = result[i][j]
                    data.append(_result)
                ret_code = 200
            else:
                data = None
                ret_code = 404
        else:
            data = None
            error_msg = error
            ret_code = 500
    return data, error_msg, ret_code

def add_facility_info(facility_name, sport_id):
    data, error_msg, ret_code = None, None, 400
    if (facility_name.strip() == '') or (sport_id.strip() == '-1'):
        error_msg = 'Please enter all the fields (Facility Name, Sport ID)'
    else:
        query = f'INSERT INTO Facilities (facility_name, sport_id) VALUES ("{facility_name}", {sport_id})'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            data, error_msg, ret_code = 'Facility added successfully', None, 200
        else:
            data, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return data, error_msg, ret_code

def delete_facility_info(facility_id, facility_name):
    data, error_msg, ret_code = None, None, 400
    if (str(facility_id).strip() == '-1') and (str(facility_name).strip() == ''):
        error_msg = 'Please enter Facility ID or Facility Name'
    else:
        if str(facility_id).strip() != '':
            query = f'DELETE FROM Facilities WHERE facility_id = {facility_id}'
        else:
            query = f'DELETE FROM Facilities WHERE facility_name = "{facility_name}"'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            data, error_msg, ret_code = 'Facility details deleted successfully', None, 200
        else:
            data, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return data, error_msg, ret_code

def get_available_facility_slots(facility_id, date):
    data, error_msg, ret_code = None, None, 400
    if str(facility_id).strip() == '-1':
        return None, 'Facility ID cannot be empty', 400
    if date is None:
        return None, 'Date cannot be empty', 400
    date = datetime.strftime(date, '%Y-%m-%d')
    query = f'''SELECT * FROM AvailableSlots NATURAL JOIN Slots
                WHERE slot_date like "{date}%" AND slot_id NOT IN (
                    SELECT slot_id FROM SlotBookings WHERE booking_date like "{date}%" AND facility_id = "{facility_id}"
                )'''
    result, error = run_query(query, return_data = True)
    if error:
        error_msg = error
        ret_code = 500
    else:
        if result != []:
            data = []
            available_slot_columns = get_table_columns('AvailableSlots')
            slot_columns = get_table_columns('Slots')
            all_columns = list(set(available_slot_columns + slot_columns))
            all_columns = ['slot_id', 'available_slot_id', 'slot_date', 'start_time', 'end_time']
            for i in range(len(result)):
                _result = {}
                for j in range(len(all_columns)):
                    if 'date' in all_columns[j] or 'time' in all_columns[j]:
                        _result[all_columns[j]] = str(result[i][j])
                        continue
                    _result[all_columns[j]] = result[i][j]
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    return data, error_msg, ret_code



def book_slot(net_id, facility_id, slot_id, booking_date):
    data, error_msg, ret_code = None, None, 400
    if (net_id.strip() == '') or (str(facility_id).strip() == '-1') or (str(slot_id).strip() == '-1'):
        error_msg = 'Please enter all the fields (Net ID, Facility ID, Slot ID)'
    else:
        booking_date = datetime.strftime(booking_date, '%Y-%m-%d %H:%M:%S')
        query = f'INSERT INTO SlotBookings (net_id, facility_id, slot_id, booking_date) VALUES ("{net_id}", {facility_id}, {slot_id}, "{booking_date}")'
        status, error_msg = run_query(query, get_status = True)
        if status is True:
            data, error_msg, ret_code = 'Slot booked successfully', None, 200
        else:
            data, error_msg, ret_code = None, f'Error: {error_msg}', 500
    return data, error_msg, ret_code



def get_eventbooking_info(event_date, event_id):
    data, error_msg, ret_code = None, None, 400
    if (event_date.strip() == '' or event_date is None) and (event_id == -1):
        return data, error_msg, ret_code
    else:
        if event_id != -1:
            query = f'SELECT * FROM EventBookings WHERE event_id = {event_id}'
        else:
            query = f'SELECT * FROM EventBookings WHERE booking_date like "{event_date}%"'
        result, error = run_query(query, return_data = True)
        if not error:
            if result != []:
                data = []
                columns = get_table_columns('EventBookings')
                for i in range(len(result)):
                    _result = {}
                    for j in range(len(columns)):
                        if columns[j] == 'booking_date':
                            _result[columns[j]] = result[i][j].strftime(DATETIME_STRING_FORMAT)
                            continue
                        _result[columns[j]] = result[i][j]
                    data.append(_result)
                    if event_id != -1: data = data[0]
                ret_code = 200
            else:
                data = None
                ret_code = 404
        else:
            data = None
            error_msg = error
            ret_code = 500
    return data, error_msg, ret_code

def book_event(net_id, event_id, ticket_count):
    if str(event_id).strip() == '' or str(ticket_count).strip() == '' or str(net_id).strip() == '':
        return 'Invalid request', 400

    data, error_msg, _ = get_eventbooking_info(event_date = '', event_id = event_id)
    if data is None:
        return 'Event not found', 404

    _data, _error_msg, _ = get_user_details(net_id = net_id)
    if _data is None:
        return 'User not found', 404
    
    query = f'SELECT SUM(ticket_count) from EventBookings WHERE event_id = {event_id}'
    result, error = run_query(query, return_data = True)
    if not error:
        if result[0][0] is None:
            booked_tickets = 0
        else:
            booked_tickets = result[0][0]
        if int(booked_tickets) + int(ticket_count) > data.get('event_capacity', 0):
            return None, 'Not enough tickets available', 400
        else:
            today = datetime.now().strftime(DATETIME_STRING_FORMAT)
            query = f'INSERT INTO EventBookings (net_id, event_id, booking_date, ticket_count) VALUES ("{net_id}", {event_id}, {today}, {ticket_count})'
            result, error = run_query(query)
            if not error:
                return 'Booking successful', None, 200
            else:
                return None, error, 500
    return None, error, 500

def update_event_booking(ticket_id, net_id, event_id, ticket_count):
    if str(ticket_id).strip() == '' or str(event_id).strip() == '' or str(ticket_count).strip() == '' or str(net_id).strip() == '':
        return 'Invalid request', 400

    data, error_msg, _ = get_eventbooking_info(event_date = '', event_id = event_id)
    if data is None: return 'Event not found', 404

    _data, _error_msg, _ = get_user_details(net_id = net_id)
    if _data is None: return 'User not found', 404

    query = f'SELECT ticket_count from EventBookings WHERE ticket_id = {ticket_id}'
    result, error = run_query(query, return_data = True)
    if not error:
        if result[0][0] is None:
            booked_tickets = 0
        else:
            booked_tickets = result[0][0]

        if ticket_count > booked_tickets:
            if int(booked_tickets) + int(ticket_count) > data.get('event_capacity', 0):
                return None, 'Not enough tickets available', 400
            else:
                query = f'UPDATE EventBookings SET ticket_count = {ticket_count} WHERE ticket_id = {ticket_id}'
                result, error = run_query(query)
                if not error:
                    return 'Booking updated', None, 200
                else:
                    return None, error, 500
        else:
            query = f'UPDATE EventBookings SET ticket_count = {ticket_count} WHERE ticket_id = {ticket_id}'
            result, error = run_query(query)
            if not error:
                return 'Booking updated', None, 200
            else:
                return None, error, 500
    return None, 'Booking not found', 404

def cancel_event_booking(ticket_id):
    if str(ticket_id).strip() == '':
        return 'Invalid request', 400
    query = f'DELETE FROM EventBookings WHERE ticket_id = {ticket_id}'
    result, error = run_query(query)
    if not error:
        return 'Booking cancelled', None, 200
    return None, error, 500



def get_all_events():
    data, error_msg, ret_code = None, None, 400
    query = f'SELECT * FROM Events'
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            columns = get_table_columns('Events')
            for i in range(len(result)):
                _result = {}
                for j in range(len(columns)):
                    if columns[j] == 'event_date':
                        _result[columns[j]] = result[i][j].strftime(DATETIME_STRING_FORMAT)
                        continue
                    if columns[j] == 'event_start_time' or columns[j] == 'event_end_time':
                        _result[columns[j]] = str(result[i][j])
                        continue
                    _result[columns[j]] = result[i][j]
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def create_event(event_name, event_description, event_capacity, ticket_cost, event_date, event_start_time, event_end_time, facility_id, sport_id):
    data, error_msg, ret_code = None, None, 400
    if str(event_name).strip() == '' or str(event_description).strip() == '' or str(event_capacity).strip() == '' or str(ticket_cost).strip() == '' or str(event_date).strip() == '' or str(event_start_time).strip() == '' or str(event_end_time).strip() == '' or str(facility_id).strip() == '' or str(sport_id).strip() == '':
        return 'Invalid request', 400
    query = f'SELECT * FROM Events WHERE event_name = "{event_name}"'
    result, error = run_query(query, return_data = True)
    if not error:
        if result == []:
            query = f'INSERT INTO Events (event_name, event_description, event_capacity, ticket_cost, event_date, event_start_time, event_end_time, facility_id, sport_id) VALUES ("{event_name}", "{event_description}", {event_capacity}, {ticket_cost}, "{event_date}", "{event_start_time}", "{event_end_time}", {facility_id}, {sport_id})'
            result, error = run_query(query, get_status=True)
            if not error:
                data = 'Event created'
                ret_code = 200
            else:
                data = None
                error_msg = error
                ret_code = 500
        else:
            data = None
            error_msg = 'Event already exists'
            ret_code = 409
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code



def get_available_slots(date):
    data, error_msg, ret_code = None, None, 400
    query = f'SELECT * FROM AvailableSlots NATURAL JOIN Slots WHERE slot_date = "{date}"'
    result, error = run_query(query, return_data = True, get_columns=True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if result[i][j][0] == 'slot_date':
                        _result[result[i][j][0]] = result[i][j][1].strftime(DATETIME_STRING_FORMAT)
                        continue
                    if result[i][j][0] == 'start_time' or result[i][j][0] == 'end_time':
                        if ',' in str(result[i][j][1]):
                            _result[result[i][j][0]] = str(result[i][j][1]).split(',')[1]
                        else:
                            _result[result[i][j][0]] = str(result[i][j][1])
                        continue
                    _result[result[i][j][0]] = result[i][j][1]
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code



def get_sport_statistics(sport_id, start_date, end_date):
    data, error_msg, ret_code = None, None, 400
    query = f'''SELECT sp.SPORT_NAME, s.NET_ID, COUNT(SLOT_ID) as TOTAL_HOURS_SPENT
                FROM slotbookings s JOIN Facilities f USING(FACILITY_ID) JOIN sports sp USING(SPORT_ID)
                WHERE s.BOOKING_DATE BETWEEN '{start_date}' AND '{end_date}' AND sp.sport_id = {sport_id}
                GROUP BY sp.SPORT_NAME, s.NET_ID
                ORDER BY TOTAL_HOURS_SPENT DESC LIMIT 5;'''
    result, error = run_query(query, return_data = True, get_columns=True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if result[i][j][0] == 'total_hours_spent':
                        _result[result[i][j][0]] = str(result[i][j][1])
                        continue
                    _result[result[i][j][0]] = result[i][j][1]
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_profitable_events_by_revenue():
    data, error_msg, ret_code = None, None, 400
    query = f'''SELECT e.event_name, e.facility_id, SUM(eb.ticket_count * e.ticket_cost) as total_val
                FROM eventbookings eb JOIN events e USING(EVENT_ID)
                GROUP BY e.EVENT_ID
                HAVING total_val > 0
                ORDER BY total_val desc
                LIMIT 10;'''
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if j == 0:
                        _result['event_name'] = result[i][j]
                        continue
                    if j == 1:
                        _result['facility_id'] = result[i][j]
                        continue
                    if j == 2:
                        _result['total_val'] = result[i][j]
                        continue
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_total_revenue():
    data, error_msg, ret_code = None, None, 400
    query = "SELECT SUM(E.equipment_rent_per_hour * ER.equipment_count) FROM EquipmentRentals ER LEFT JOIN Equipments E ON ER.equipment_id = E.equipment_id"
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if j == 0:
                        _result['total_revenue'] = result[i][j]
                        continue
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_total_bookings():
    data, error_msg, ret_code = None, None, 400
    query = "SELECt COUNT(slot_id) FROM SlotBookings;"
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if j == 0:
                        _result['total_bookings'] = result[i][j]
                        continue
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_bookings_by_weekday():
    data, error_msg, ret_code = None, None, 400
    query = f'''SELECT  
		CASE WHEN WEEKDAY(booking_date)=0 THEN 'Monday'
        WHEN WEEKDAY(booking_date)=1 THEN 'Tuesday'
        WHEN WEEKDAY(booking_date)=2 THEN 'Wednesday'
        WHEN WEEKDAY(booking_date)=3 THEN 'Thursday'
        WHEN WEEKDAY(booking_date)=4 THEN 'Friday'
        WHEN WEEKDAY(booking_date)=5 THEN 'Saturday'
        WHEN WEEKDAY(booking_date)=6 THEN 'Sunday'
        ELSE 'Other'
        end AS week_day,
	    COUNT(slot_id) FROM SlotBookings GROUP BY week_day;
    '''
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if j == 0:
                        _result['week_day'] = result[i][j]
                        continue
                    if j == 1:
                        _result['total_bookings'] = result[i][j]
                        continue
                data.append(_result)
            weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            data = sorted(data, key=lambda d: weekdays.index(d["week_day"]))
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_total_events_and_tickets_sold():
    data, error_msg, ret_code = None, None, 400
    query = "SELECT COUNT(DISTINCT(e.event_name)) AS total_events, SUM(eb.ticket_count) AS total_tickets_sold FROM Events e NATURAL JOIN EventBookings eb"
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if j == 0:
                        _result['total_events'] = str(result[i][j])
                        continue
                    if j == 1:
                        _result['total_tickets_sold'] = str(result[i][j])
                        continue
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code

def get_tickets_sold_per_event():
    data, error_msg, ret_code = None, None, 400
    query = "SELECT event_name, SUM(ticket_count) FROM EventBookings natural join events group by event_name"
    result, error = run_query(query, return_data = True)
    if not error:
        if result != []:
            data = []
            for i in range(len(result)):
                _result = {}
                for j in range(len(result[i])):
                    if j == 0:
                        _result['event_name'] = str(result[i][j])
                        continue
                    if j == 1:
                        _result['total_tickets_sold'] = str(result[i][j])
                        continue
                data.append(_result)
            ret_code = 200
        else:
            data = None
            ret_code = 404
    else:
        data = None
        error_msg = error
        ret_code = 500
    return data, error_msg, ret_code
