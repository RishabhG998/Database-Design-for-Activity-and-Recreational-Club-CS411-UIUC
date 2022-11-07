import db
from flask import request
from flask_restx import Namespace, Resource, inputs

ns = Namespace('facility', description='facility')


get_facility_parser = ns.parser()
get_facility_parser.add_argument('facility_id', type=int, required=False, default=-1)
get_facility_parser.add_argument('facility_name', type=str, required=False, default='')
get_facility_parser.add_argument('sport_id', type=int, required=False, default=-1)
get_facility_parser.add_argument('regex_check', type=inputs.boolean, required=False, default=False)

post_facility_parser = ns.parser()
post_facility_parser.add_argument('facility_name', type=str, required=True)
post_facility_parser.add_argument('sport_id', type=int, required=True, default=-1)

delete_facility_parser = ns.parser()
delete_facility_parser.add_argument('facility_id', type=int, required=False, default=-1)
delete_facility_parser.add_argument('facility_name', type=str, required=False, default='')

@ns.route('/facility')
class GetfacilityDetails(Resource):
    @ns.expect(get_facility_parser)
    def get(self):
        facility_data = get_facility_parser.parse_args(strict=True)
        if (facility_data['facility_id'] != -1) or (facility_data['sport_id'] != -1):
            facility_data['regex_check'] = False
        if facility_data['facility_id'] == -1 and facility_data['facility_name'].strip() == '' and facility_data['sport_id'] == -1:
            return {'message': 'Please provide either facility_id or facility_name or sport_id'}, 400
        result, error_msg, ret_code = db.get_facility_info(facility_data['facility_id'], facility_data['facility_name'], facility_data['sport_id'], facility_data['regex_check'])
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(post_facility_parser)
    def post(self):
        facility_data = post_facility_parser.parse_args(strict=True)
        if facility_data['facility_name'].strip() == '':
            return {'message': 'Please provide facility_name'}, 400
        if facility_data['sport_id'] == -1:
            return {'message': 'Please provide sport_id'}, 400
        result, error_msg, ret_code = db.add_facility_info(facility_data['facility_name'], facility_data['sport_id'])
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(delete_facility_parser)
    def delete(self):
        facility_data = delete_facility_parser.parse_args(strict=True)
        if (facility_data['facility_id'] == -1) and (facility_data['facility_name'].strip() == ''):
            return {'message': 'Please provide either facility_id or facility_name'}, 400
        result, error_msg, ret_code = db.delete_facility_info(facility_data['facility_id'], facility_data['facility_name'])
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code
        