from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.absolute()))

from flask_restx import Api

api = Api(
    title='ARC Management API',
    version='1.0',
    description='The ARC Management API provides a central place for managing the ARC system.'
)

from .roles import ns as role
api.add_namespace(role, path = '/v1/roles')

from .users import ns as user
api.add_namespace(user, path = '/v1/users')

from .equipments import ns as equipment
api.add_namespace(equipment, path = '/v1/equipments')

from .sports import ns as sport
api.add_namespace(sport, path = '/v1/sports')

from .facilities import ns as facility
api.add_namespace(facility, path = '/v1/facilities')

from .eventbookings import ns as eventbookings
api.add_namespace(eventbookings, path = '/v1/eventbookings')

from .events import ns as events
api.add_namespace(events, path = '/v1/events')

from .slots import ns as slot
api.add_namespace(slot, path = '/v1/slots')

from .equipmentbookings import ns as equipmentbookings
api.add_namespace(equipmentbookings, path = '/v1/equipmentbookings')

from .adv_queries import ns as adv_query
api.add_namespace(adv_query, path = '/v1/adv_query')
