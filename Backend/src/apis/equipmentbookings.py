import db
from flask import request
from flask_restx import Namespace, Resource, inputs

ns = Namespace('equipmentbooking', description='equipmentbooking')

post_book_equipment_parser = ns.parser()
post_book_equipment_parser.add_argument('equipment_count', type=int, required=True, default=0)
post_book_equipment_parser.add_argument('rent_date', type=str, required=True, default='')
post_book_equipment_parser.add_argument('slot_id', type=str, required=True, default='')
post_book_equipment_parser.add_argument('net_id', type=str, required=True, default='')
post_book_equipment_parser.add_argument('equipment_id', type=int, required=True, default=-1)


@ns.route('/equipmentbooking')
class BookEquipments(Resource):
    @ns.expect(post_book_equipment_parser)
    def post(self):
        equipment_booking_data = post_book_equipment_parser.parse_args(strict=True)
        if equipment_booking_data.get('equipment_count', 0) == 0:
            return {'message': 'Please provide equipment_count'}, 400
        if equipment_booking_data.get('rent_date', '') == '':
            return {'message': 'Please provide rent_date'}, 400
        if equipment_booking_data.get('slot_id', '') == '':
            return {'message': 'Please provide slot_id'}, 400
        if equipment_booking_data.get('net_id', '') == '':
            return {'message': 'Please provide net_id'}, 400
        if equipment_booking_data.get('equipment_id', -1) == -1:
            return {'message': 'Please provide equipment_id'}, 400
        result, error_msg, ret_code = db.book_equipment(equipment_booking_data.get('equipment_count', 0), equipment_booking_data.get('rent_date'), equipment_booking_data.get('slot_id', ''), equipment_booking_data.get('net_id', ''), equipment_booking_data.get('equipment_id', -1))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code
