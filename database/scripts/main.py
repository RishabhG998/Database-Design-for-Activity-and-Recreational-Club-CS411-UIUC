# Initial empty script as git does not add empty directories
import argparse, random, itertools
from datetime import datetime, date, timedelta
from time import strftime, gmtime
import mysql.connector

DATE_SEPARATOR = '-'
TERM_START_DATE =  date(2022, 8, 22) 
TERM_END_DATE = date(2022, 12, 31)

def random_date_generator(year_ranges = (2019, 2020), month_ranges = (1, 13)):        
    c_mm = random.sample(range(month_ranges[0], month_ranges[1]), 1)
    c_dd = None
    c_yyyy = random.sample(range(year_ranges[0], year_ranges[1]), 1)
    if c_mm in (1, 3, 5, 7, 8, 10, 12):
        c_dd = random.sample(range(1, 32), 1)
    else:
        if c_yyyy[0] % 4 == 0 and c_mm[0] == 2:
           c_dd = random.sample(range(1, 30), 1)
        elif c_yyyy[0] % 4 != 0 and c_mm[0] == 2:
            c_dd = random.sample(range(1, 29), 1)
        else:
            c_dd = random.sample(range(1, 31), 1)
    return str(c_yyyy[0]) + DATE_SEPARATOR + str("{:02d}".format(c_mm[0])) + DATE_SEPARATOR + str("{:02d}".format(c_dd[0]))

def connect_to_db(username, password):
	db_conn = None
	try:
		db_conn = mysql.connector.connect(host = 'localhost', user = username, password = password, database = 'SRKC')
		return db_conn
	except Exception as e:
		print(e)
	exit(1)

def sql_query(db_conn, query, _return = False):
	cur = db_conn.cursor()
	cur.execute(query)
	if not _return: cur.commit()
	if _return:
		return cur.fetchall()
	cur.close()

def populate_users(username, password, users_file):
	try:
		db_conn = connect_to_db(username, password)
		cnt = 0
		val = []
		with open(users_file, 'r') as f:
			while cnt < 1000:
				user = f.readline()
				if not user:
					break
				info = user.split(";")
				net_id = info[1][1:].lower()
				name = info[0]
				contact_number = random.randrange(2000000000, 9000000000)
				email_id = net_id + "@illinois.edu"
				dob = random_date_generator(year_ranges = (1990, 2006))
				role_id = 1
				row = (net_id, name, contact_number, email_id, dob, role_id)
				val.append(row)
				cnt += 1
		f.close()
		sql = "INSERT INTO Users (net_id, name, contact_number, email_id, date_of_birth, role_id) VALUES (%s, %s, %s, %s, %s, %s)"
		cur = db_conn.cursor()
		cur.executemany(sql, val)
		db_conn.commit()
		cur.close()
		db_conn.close()
	except Exception as e:
		print(e)

def populate_available_slots(username, password):
	try:
		get_slot_ids_sql = 'SELECT slot_id FROM Slots'
		db_conn = connect_to_db(username, password)
		raw_slot_ids = sql_query(db_conn, get_slot_ids_sql, _return=True)
		slot_ids = []
		for i in raw_slot_ids:
			slot_ids.append(i[0])

		all_dates = []
		start_date, end_date = TERM_START_DATE, TERM_END_DATE
		delta = end_date - start_date
		for i in range(delta.days + 1):
			day = start_date + timedelta(days=i)
			all_dates.append(day.strftime(f'%Y{DATE_SEPARATOR}%m{DATE_SEPARATOR}%d'))

		insert_sql = 'INSERT INTO AvailableSlots (slot_date, slot_id) VALUES (%s, %s)'
		val = []
		for _date in all_dates:
			for slot_id in slot_ids:
				val.append((_date, slot_id))
		cur = db_conn.cursor()
		cur.executemany(insert_sql, val)
		db_conn.commit()
		cur.close()
		db_conn.close()
	except Exception as e:
		print(e)

def populate_slot_bookings(username, password):
	try:
		all_net_ids = []
		get_net_ids_sql = 'SELECT net_id FROM Users'
		db_conn = connect_to_db(username, password)
		raw_net_ids = sql_query(db_conn, get_net_ids_sql, _return=True)
		for i in raw_net_ids:
			all_net_ids.append(i[0])
		
		
		all_facility_ids = []
		get_facility_ids_sql = 'SELECT facility_id FROM Facilities'
		raw_facility_ids = sql_query(db_conn, get_facility_ids_sql, _return=True)
		for i in raw_facility_ids:
			all_facility_ids.append(i[0])
		

		all_slot_ids = []
		get_slot_ids_sql = 'SELECT slot_id FROM Slots'
		raw_slot_ids = sql_query(db_conn, get_slot_ids_sql, _return=True)
		for i in raw_slot_ids:
			all_slot_ids.append(i[0])
	
		all_dates = []
		start_date, end_date = TERM_START_DATE, TERM_END_DATE
		delta = end_date - start_date
		for i in range(delta.days + 1):
			day = start_date + timedelta(days=i)
			all_dates.append(day.strftime(f'%Y{DATE_SEPARATOR}%m{DATE_SEPARATOR}%d'))
		
		all_net_ids = random.sample(all_net_ids, min(200, len(all_net_ids)))
		all_facility_ids = random.sample(all_facility_ids, min(200, len(all_facility_ids)))
		all_slot_ids = random.sample(all_slot_ids, min(200, len(all_slot_ids)))
		all_dates = random.sample(all_dates, min(200, len(all_dates)))

		temp_list = [all_net_ids, all_facility_ids, all_slot_ids, all_dates]
		data = random.sample(list(itertools.product(*temp_list)), 20000)

		insert_sql = 'INSERT INTO SlotBookings (net_id, facility_id, slot_id, booking_date) VALUES (%s, %s, %s, %s)'
		cur = db_conn.cursor()
		cur.executemany(insert_sql, data)
		db_conn.commit()
		cur.close()
		db_conn.close()
	except Exception as e:
		print(e)

def populate_event_bookings(username, password):
	try:
		all_net_ids = []
		get_net_ids_sql = 'SELECT net_id FROM Users limit 100'
		db_conn = connect_to_db(username, password)
		raw_net_ids = sql_query(db_conn, get_net_ids_sql, _return=True)
		for i in raw_net_ids:
			all_net_ids.append(i[0])

		
		all_events_ids = []
		get_events_ids_sql = 'SELECT event_id FROM Events limit 100'
		raw_events_ids = sql_query(db_conn, get_events_ids_sql, _return=True)
		for i in raw_events_ids:
			all_events_ids.append(i[0])
		
		all_dates = []
		start_date, end_date = TERM_START_DATE, date.today()
		# start_date, end_date = TERM_START_DATE, TERM_END_DATE
		# start_date, end_date = date.today(), TERM_END_DATE
		delta = end_date - start_date
		for i in range(delta.days + 1):
			day = start_date + timedelta(days=i)
			all_dates.append(day.strftime(f'%Y{DATE_SEPARATOR}%m{DATE_SEPARATOR}%d'))
		
		all_ticket_no = []
		sample_ticket_no = random.sample(range(1, 15), 1)
		for i in range(len(all_net_ids)):
			all_ticket_no.append(random.sample(range(1, 15), 1)[0])

		data = []
		for net_id in all_net_ids:
			for event_id in all_events_ids:
				for ticket in all_ticket_no:
					for _date in all_dates:
						data.append((net_id, event_id, _date, ticket))

		if not data: return
		if len(data) > 500: data = random.sample(data, 1500)

		insert_sql = 'INSERT INTO EventBookings (net_id, event_id, booking_date, ticket_count) VALUES (%s, %s, %s, %s)'
		cur = db_conn.cursor()
		cur.executemany(insert_sql, data)
		db_conn.commit()
		cur.close()
		db_conn.close()
	except Exception as e:
		print(e)
	
def populate_equipmental_rentals(username, password):
	try:
		all_equipment_ids = {}
		get_equipment_ids_sql = 'SELECT equipment_id, equipment_count FROM Equipments'
		db_conn = connect_to_db(username, password)
		raw_equipment_ids = sql_query(db_conn, get_equipment_ids_sql, _return=True)
		for i in raw_equipment_ids:
			all_equipment_ids[i[0]] = i[1]
		
		all_available_slot_ids = {} # {available_slot_id: (slot_date, slot_id)}
		get_slot_ids_sql = 'SELECT available_slot_id, slot_date, slot_id FROM AvailableSlots'
		raw_slot_ids = sql_query(db_conn, get_slot_ids_sql, _return=True)
		for i in raw_slot_ids:
			all_available_slot_ids[i[0]] = (i[1], i[2])
		
		all_net_ids = []
		get_net_ids_sql = 'SELECT net_id FROM Users'
		raw_net_ids = sql_query(db_conn, get_net_ids_sql, _return=True)
		for i in raw_net_ids:
			all_net_ids.append(i[0])

		slot_timings = {}
		get_slot_timings_sql = 'SELECT slot_id, start_time FROM Slots'
		raw_slot_timings = sql_query(db_conn, get_slot_timings_sql, _return=True)
		for i in raw_slot_timings:
			slot_timings[i[0]] = str(i[1])

		all_dates = []
		start_date, end_date = TERM_START_DATE, date.today()
		delta = end_date - start_date
		for i in range(delta.days + 1):
			day = start_date + timedelta(days=i)
			all_dates.append(day.strftime(f'%Y{DATE_SEPARATOR}%m{DATE_SEPARATOR}%d'))

		available_date_and_equipment_counts = {}
		for i in all_available_slot_ids:
			if not available_date_and_equipment_counts.get(all_available_slot_ids[i][0]):
				available_date_and_equipment_counts[all_available_slot_ids[i][0]] = {}
		
		for i in all_equipment_ids:
			for j in available_date_and_equipment_counts:
				available_date_and_equipment_counts[j][i] = all_equipment_ids[i]
		
		all_net_ids = random.sample(all_net_ids, min(200, len(all_net_ids)))
		all_available_slot_ids_keys = random.sample(sorted(all_available_slot_ids), min(200, len(all_available_slot_ids)))
		all_available_slot_ids = {k: all_available_slot_ids[k] for k in all_available_slot_ids_keys}
		all_equipment_ids = random.sample(list(all_equipment_ids.keys()), min(200, len(all_equipment_ids)))

		temp_list = [all_net_ids, all_available_slot_ids, all_equipment_ids]
		temp_data = random.sample(list(itertools.product(*temp_list)), 5000)
		data = []
		for i in range(len(temp_data)):
			(netid, available_slot_id, equipment_id) = list(temp_data[i])
			slot_date = all_available_slot_ids[available_slot_id][0]
			data.append((netid, (available_slot_id, slot_date), equipment_id))
		data = random.sample(data, 1500)

		insert_sql = 'INSERT INTO EquipmentRentals (equipment_count, rent_date, available_slot_id, net_id, equipment_id) VALUES (%s, %s, %s, %s, %s)'
		insert_data = []
		for i in range(len(data)):
			netid, (available_slot_id, slot_date), equipment_id = data[i]
			available_equipment_count = random.randint(0, available_date_and_equipment_counts[slot_date][equipment_id])
			if available_equipment_count <= 0: continue
			available_date_and_equipment_counts[slot_date][equipment_id] -= available_equipment_count
			rent_date = None
			slot_start_time = slot_timings[all_available_slot_ids[available_slot_id][1]]
			slot_start_time = datetime.strptime(slot_start_time, '%H:%M:%S').time()
			rent_date = datetime.combine(slot_date, slot_start_time)
			insert_data.append((available_equipment_count, rent_date, available_slot_id, netid, equipment_id))
		cur = db_conn.cursor()
		cur.executemany(insert_sql, insert_data)
		db_conn.commit()
		cur.close()
		db_conn.close()
	except Exception as e:
		print(e)

if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('--username', type=str, help='username', default='')
	parser.add_argument('--password', type=str, help='password', default='')
	parser.add_argument('--users_file', type=str, help='user\'s filepath', default='./database/scripts/users.txt', required = False)
	args = parser.parse_args()
	username, password, users_file = args.username.strip(), args.password.strip(), args.users_file.strip()

	if username == '' and password == '':
		exit(1)
	
	print('Populating Users ...'); populate_users(username, password, users_file)
	print('Populating AvailableSlots ...'); populate_available_slots(username, password)
	print('Populating EventBookings ...'); populate_event_bookings(username, password)
	print('Populating EquipmentRentals ...'); populate_equipmental_rentals(username, password)
	print('Populating SlotsBookings ...'); populate_slot_bookings(username, password)
