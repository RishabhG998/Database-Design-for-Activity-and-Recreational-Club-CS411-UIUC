import db
from flask import request
from flask_restx import Namespace, Resource

from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent.parent.absolute()))
from database.scripts import main # required for DATE_SEPARATOR

ns = Namespace('user', description='User')

@ns.route('/user/<string:net_id>')
class GetUserDetails(Resource):
    def get(self, net_id = None):
        if net_id is None: return None, 400
        data, error_msg, ret_code = db.get_user_details(net_id.lower())
        if error_msg:
            return {'error': error_msg}, ret_code
        return data, ret_code

    def delete(self, net_id = None):
        if net_id is None: return None, 400
        data, error_msg, ret_code = db.delete_user(net_id.lower())
        if error_msg:
            return {'error': error_msg}, ret_code
        return data, ret_code



user_cols = db.get_table_columns('Users')
d = {k: {'type': 'string'} for k in user_cols}
user_post_details_request_schema = { 'type': 'object', 'properties': d}
user_post_details_request_model = ns.schema_model('user_post_details_request', user_post_details_request_schema)

@ns.route('/user')
class PostUserDetails(Resource):
    def get(self):
        result, error_msg, ret_code = db.get_all_users()
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code

    @ns.expect(user_post_details_request_model, validate=True)
    def put(self):
        user_data = request.get_json()
        parsed_user_data = {}
        for key in user_data:
            if (user_data[key] is None) or (user_data[key].lower() == "string"):
                continue
            if key == 'date_of_birth':
                if main.DATE_SEPARATOR in user_data[key]:
                    parsed_user_data[key] = str(user_data[key])
                    continue
            parsed_user_data[key] = user_data[key]
        return db.update_user_details(parsed_user_data)

    @ns.expect(user_post_details_request_model, validate=True)
    def post(self):
        user_data = request.get_json()
        parsed_user_data = {}
        for key in user_data:
            if (user_data[key] is None) or (user_data[key].lower() == "string"):
                continue
            if key == 'date_of_birth':
                if main.DATE_SEPARATOR in user_data[key]:
                    parsed_user_data[key] = str(user_data[key])
                    continue
            parsed_user_data[key] = user_data[key]
        result, error_msg, ret_code = db.insert_user_details(parsed_user_data)
        if error_msg is not None:
            return {'message': error_msg}, ret_code
        return result, ret_code
