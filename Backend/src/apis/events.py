import db
from flask import request
from flask_restx import Namespace, Resource

from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent.parent.absolute()))
from database.scripts import main # required for DATE_SEPARATOR


ns = Namespace('events', description='Events')

post_event_parser = ns.parser()
post_event_parser.add_argument('event_name', type=str, required=True, default='')
post_event_parser.add_argument('event_description', type=str, required=False, default='')
post_event_parser.add_argument('event_capacity', type=int, required=True, default=0)
post_event_parser.add_argument('ticket_cost', type=float, required=True, default=0.0)
post_event_parser.add_argument('event_date', type=str, required=True, default='')
post_event_parser.add_argument('event_start_time', type=str, required=True, default='')
post_event_parser.add_argument('event_end_time', type=str, required=True, default='')
post_event_parser.add_argument('facility_id', type=int, required=True, default=0)
post_event_parser.add_argument('sport_id', type=int, required=True, default=0)

@ns.route('/events')
class GetEventDetails(Resource):
    def get(self):
        result, error_msg, ret_code = db.get_all_events()
        if error_msg: return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(post_event_parser)
    def post(self):
        args = post_event_parser.parse_args()
        event_name = args.get('event_name', '')
        event_description = args.get('event_description', '')
        event_capacity = args.get('event_capacity', 0)
        ticket_cost = args.get('ticket_cost', 0.0)
        event_date = args.get('event_date', '')
        event_start_time = args.get('event_start_time', '')
        event_end_time = args.get('event_end_time', '')
        facility_id = args.get('facility_id', 0)
        sport_id = args.get('sport_id', 0)

        if event_name.strip() == '' or event_capacity <= 0 or ticket_cost <= 0.0 or event_date.strip() == '' or event_start_time.strip() == '' or event_end_time.strip() == '' or facility_id <= 0 or sport_id <= 0:
            return {'message': 'Invalid event details (event_name, event_capacity, ticket_cost, event_date, event_start_time, event_end_time, facility_id, sport_id)'}, 400

        result, error_msg, ret_code = db.create_event(event_name, event_description, event_capacity, ticket_cost, event_date, event_start_time, event_end_time, facility_id, sport_id)
        if error_msg: return {'message': error_msg}, ret_code
        return result, ret_code