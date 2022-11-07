from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.absolute()))

from flask_restx import Api

api = Api(
    title='ARC Management API',
    version='1.0',
    description='The ARC Management API provides a central place for managing the ARC system.',
    contact= {'name': 'saketsj2@illinois.edu'},
)

from .roles import ns as role
api.add_namespace(role, path = '/vi/roles')

from .users import ns as user
api.add_namespace(user, path = '/vi/users')

from .equipments import ns as equipment
api.add_namespace(equipment, path = '/vi/equipments')

from .sports import ns as sport
api.add_namespace(sport, path = '/vi/sports')

from .facilities import ns as facility
api.add_namespace(facility, path = '/vi/facilities')

from .events import ns as event
api.add_namespace(event, path = '/vi/events')

from .slots import ns as slot
api.add_namespace(slot, path = '/vi/slots')