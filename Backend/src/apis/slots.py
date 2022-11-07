import db
from flask import request
from flask_restx import Namespace, Resource, inputs

ns = Namespace('slot', description='slot')


get_facility_parser = ns.parser()
get_facility_parser.add_argument('facility_id', type=int, required=True, default=-1)
get_facility_parser.add_argument('date', type=inputs.date, required=True, default=None)

post_book_slot_parser = ns.parser()
post_book_slot_parser.add_argument('net_id', type=str, required=True, default='')
post_book_slot_parser.add_argument('facility_id', type=int, required=True, default=-1)
post_book_slot_parser.add_argument('slot_id', type=int, required=True, default=-1)
post_book_slot_parser.add_argument('booking_date', type=inputs.date, required=True, default=None)


@ns.route('/facility')
class GetAvailableFacilitySlots(Resource):
    @ns.expect(get_facility_parser)
    def get(self):
        facility_data = get_facility_parser.parse_args(strict=True)
        if facility_data.get('facility_id', -1) == -1:
            return {'message': 'Please provide facility_id'}, 400
        if facility_data.get('date') is None:
            return {'message': 'Please provide date'}, 400
        result, error_msg, ret_code = db.get_available_facility_slots(facility_data.get('facility_id', -1), facility_data.get('date'))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

@ns.route('/book_slot')
class BookSlot(Resource):
    @ns.expect(post_book_slot_parser)
    def post(self):
        slot_booking_data = post_book_slot_parser.parse_args(strict=True)
        if slot_booking_data.get('net_id', '') == '':
            return {'message': 'Please provide net_id'}, 400
        if slot_booking_data.get('facility_id', -1) == -1:
            return {'message': 'Please provide facility_id'}, 400
        if slot_booking_data.get('slot_id', -1) == -1:
            return {'message': 'Please provide slot_id'}, 400
        if slot_booking_data.get('booking_date') is None:
            return {'message': 'Please provide booking_date'}, 400
        result, error_msg, ret_code = db.book_slot(slot_booking_data.get('net_id', ''), slot_booking_data.get('facility_id', -1), slot_booking_data.get('slot_id', -1), slot_booking_data.get('booking_date'))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

