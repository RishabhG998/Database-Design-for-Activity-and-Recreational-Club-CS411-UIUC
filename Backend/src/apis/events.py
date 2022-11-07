import db
from flask import request
from flask_restx import Namespace, Resource

from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent.parent.absolute()))
from database.scripts import main # required for DATE_SEPARATOR


ns = Namespace('event', description='Event')

get_event_date_parser = ns.parser()
get_event_date_parser.add_argument('event_date', type=str, required=False, default='')
get_event_date_parser.add_argument('event_id', type=int, required=False, default=-1)

post_eventbooking_parser = ns.parser()
post_eventbooking_parser.add_argument('net_id', type=str, required=True, default='')
post_eventbooking_parser.add_argument('event_id', type=int, required=True, default=-1)
post_eventbooking_parser.add_argument('ticket_count', type=int, required=True, default=0)

put_eventbooking_parser = ns.parser()
put_eventbooking_parser.add_argument('ticket_id', type=str, required=True, default='')
put_eventbooking_parser.add_argument('net_id', type=str, required=True, default='')
put_eventbooking_parser.add_argument('event_id', type=int, required=True, default=-1)
put_eventbooking_parser.add_argument('ticket_count', type=int, required=True, default=0)

delete_eventbooking_parser = ns.parser()
delete_eventbooking_parser.add_argument('ticket_id', type=str, required=True, default='')

@ns.route('/event')
class GetEventDetails(Resource):
    @ns.expect(get_event_date_parser)
    def get(self):
        data = get_event_date_parser.parse_args(strict=True)
        event_date = data.get('event_date', None)
        event_id = data.get('event_id', -1)
        if event_id == -1 and str(event_date).strip() == '':
            return {'message': 'Please provide either event_id or event_date'}, 400

        if event_id == -1:
            if main.DATE_SEPARATOR not in event_date: return {'message': f'Please provide event_date in the format YYYY{main.DATE_SEPARATOR}MM{main.DATE_SEPARATOR}DD'}, 400
        result, error_msg, ret_code = db.get_event_info(event_date, event_id)
        if error_msg: return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(post_eventbooking_parser)
    def post(self):
        data = post_eventbooking_parser.parse_args(strict=True)
        net_id = data.get('net_id', None)
        event_id = data.get('event_id', -1)
        ticket_count = data.get('ticket_count', 1)
        if net_id is None: return {'message': 'Please provide net_id'}, 400
        if event_id == -1: return {'message': 'Please provide event_id'}, 400
        if ticket_count <= 0: return {'message': 'Please provide ticket_count > 0'}, 400
        result, error_msg, ret_code = db.book_event(net_id, event_id, ticket_count)
        if error_msg: return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(put_eventbooking_parser)
    def put(self):
        data = put_eventbooking_parser.parse_args(strict=True)
        if data.get('ticket_id', '') is '': return {'message': 'Please provide ticket_id'}, 400
        if data.get('net_id', '') is '': return {'message': 'Please provide net_id'}, 400
        if data.get('event_id', -1) == -1: return {'message': 'Please provide event_id'}, 400
        if data.get('ticket_count', 0) <= 0: return {'message': 'Please provide ticket_count > 0'}, 400

        result, error_msg, ret_code = db.update_event_booking(data.get('ticket_id', ''), data.get('net_id', ''), data.get('event_id', -1), data.get('ticket_count', 0))
        if error_msg: return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(delete_eventbooking_parser)
    def delete(self):
        data = delete_eventbooking_parser.parse_args(strict=True)
        if data.get('ticket_id', '') is '': return {'message': 'Please provide ticket_id'}, 400
        result, error_msg, ret_code = db.cancel_event_booking(data.get('ticket_id', ''))
        if error_msg: return {'message': error_msg}, ret_code
        return result, ret_code
