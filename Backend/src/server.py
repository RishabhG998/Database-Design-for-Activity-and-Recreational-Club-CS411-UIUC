import logging.handlers, os

from flask import Flask

from flask_compress import Compress
from flask_restx import Resource

from .apis import api

log = logging.getLogger()
logging.basicConfig(level=logging.INFO)

APP_PATH = os.path.dirname(os.path.abspath(__file__))

app = Flask('arc-management-api')
Compress(app)
api.init_app(app)

@api.route('/healthz', doc=False)
class Health(Resource):
    def get(self):
        return "OK"

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
