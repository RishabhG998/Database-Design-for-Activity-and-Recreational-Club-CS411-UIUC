import db
from flask_restx import Namespace, Resource

ns = Namespace('role', description='Role')

@ns.route('/user_role/<string:role_id>')
class GetUserRole(Resource):
    def get(self, role_id = None):
        if role_id is None: return None
        data, error_msg, ret_code = db.get_user_role(role_id.lower())
        if error_msg:
            return {'error': error_msg}, ret_code
        return data, ret_code
