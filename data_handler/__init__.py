import pymysql
from nlp_server import settings

DEFAULT_SETTINGS = settings.DATABASES['default']
db = pymysql.connect(
    host=DEFAULT_SETTINGS['HOST'],
    port=int(DEFAULT_SETTINGS['PORT']),
    user=DEFAULT_SETTINGS['USER'],
    passwd=DEFAULT_SETTINGS['PASSWORD'],
    db=DEFAULT_SETTINGS['NAME'],
    charset='utf8'
)
