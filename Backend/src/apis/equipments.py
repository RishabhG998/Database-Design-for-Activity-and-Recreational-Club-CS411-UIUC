import db
from flask import request
from flask_restx import Namespace, Resource, inputs

ns = Namespace('equipment', description='Equipment')


get_equipment_parser = ns.parser()
get_equipment_parser.add_argument('equipment_id', type=int, required=False, default=-1)
get_equipment_parser.add_argument('equipment_name', type=str, required=False, default='')
get_equipment_parser.add_argument('sport_id', type=int, required=False, default=-1)
get_equipment_parser.add_argument('regex_check', type=inputs.boolean, required=False, default=False)

post_equipment_parser = ns.parser()
post_equipment_parser.add_argument('equipment_name', type=str, required=True)
post_equipment_parser.add_argument('equipment_count', type=int, required=True)
post_equipment_parser.add_argument('equipment_rent_per_hour', type=float, required=True)
post_equipment_parser.add_argument('sport_id', type=int, required=True)

put_equipment_parser = ns.parser()
put_equipment_parser.add_argument('equipment_id', type=int, required=True)
put_equipment_parser.add_argument('equipment_name', type=str, required=False, default='')
put_equipment_parser.add_argument('equipment_count', type=int, required=False, default=-1)
put_equipment_parser.add_argument('equipment_rent_per_hour', type=float, required=False, default=-1.0)
put_equipment_parser.add_argument('sport_id', type=int, required=False, default=-1)

delete_equipment_parser = ns.parser()
delete_equipment_parser.add_argument('equipment_id', type=int, required=True)
delete_equipment_parser.add_argument('equipment_name', type=str, required=False, default='')


@ns.route('/equipment')
class GetEquipmentDetails(Resource):
    @ns.expect(get_equipment_parser)
    def get(self):
        equipment_data = get_equipment_parser.parse_args(strict=True)
        if equipment_data.get('equipment_id', -1) != -1:
            equipment_data['regex_check'] = False
        if equipment_data.get('equipment_id', -1) == -1 and equipment_data.get('equipment_name', '').strip() == '' and equipment_data.get('sport_id', -1) == -1:
            return {'message': 'Please provide either equipment_id or equipment_name or sport_id'}, 400
        if equipment_data.get('equipment_name', '').strip() != '':
            equipment_data['regex_check'] = True
        result, error_msg, ret_code = db.get_equipment_info(equipment_data.get('equipment_id', -1), equipment_data.get('equipment_name', ''), equipment_data.get('sport_id', -1), equipment_data.get('regex_check', False))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(post_equipment_parser)
    def post(self):
        equipment_data = post_equipment_parser.parse_args(strict=True)
        result, error_msg, ret_code = db.add_equipment_info(equipment_data.get('equipment_name', ''), equipment_data.get('equipment_count', -1), equipment_data.get('equipment_rent_per_hour', -1.0), equipment_data.get('sport_id', -1))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(put_equipment_parser)
    def put(self):
        equipment_data = put_equipment_parser.parse_args(strict=True)
        result, error_msg, ret_code = db.update_equipment_info(equipment_data.get('equipment_id', -1), equipment_data.get('equipment_name', ''), equipment_data.get('equipment_count', -1), equipment_data.get('equipment_rent_per_hour', -1.0), equipment_data.get('sport_id', -1))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(delete_equipment_parser)
    def delete(self):
        equipment_data = delete_equipment_parser.parse_args(strict=True)
        result, error_msg, ret_code = db.delete_equipment_info(equipment_data.get('equipment_id', -1), equipment_data.get('equipment_name', ''))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code
