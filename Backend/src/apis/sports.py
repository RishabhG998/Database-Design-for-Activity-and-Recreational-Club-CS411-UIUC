import db
from flask import request
from flask_restx import Namespace, Resource, inputs

ns = Namespace('sport', description='Sport')


get_sport_parser = ns.parser()
get_sport_parser.add_argument('sport_id', type=int, required=False, default=-1)
get_sport_parser.add_argument('sport_name', type=str, required=False, default='')
get_sport_parser.add_argument('regex_check', type=inputs.boolean, required=False, default=False)

post_sport_parser = ns.parser()
post_sport_parser.add_argument('sport_name', type=str, required=True)

@ns.route('/sport')
class GetsportDetails(Resource):
    @ns.expect(get_sport_parser)
    def get(self):
        sport_data = get_sport_parser.parse_args(strict=True)
        if sport_data.get('sport_id', -1) != -1:
            sport_data['regex_check'] = False
        if sport_data.get('sport_id', -1) == -1 and sport_data.get('sport_name', '').strip() == '':
            return {'message': 'Please provide either sport_id or sport_name'}, 400
        result, error_msg, ret_code = db.get_sport_info(sport_data['sport_id'], sport_data['sport_name'], sport_data['regex_check'])
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(post_sport_parser)
    def post(self):
        sport_data = post_sport_parser.parse_args(strict=True)
        result, error_msg, ret_code = db.add_sport_info(sport_data.get('sport_name', ''))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(post_sport_parser)
    def delete(self):
        sport_data = post_sport_parser.parse_args(strict=True)
        result, error_msg, ret_code = db.delete_sport_info(sport_data.get('sport_name', ''))
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code
