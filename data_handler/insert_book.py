import pymysql
from nlp_server import settings
from data_handler.convert_books import *

DEFAULT_SETTINGS = settings.DATABASES['default']
db = pymysql.connect(
    host=DEFAULT_SETTINGS['HOST'],
    port=int(DEFAULT_SETTINGS['PORT']),
    user=DEFAULT_SETTINGS['USER'],
    passwd=DEFAULT_SETTINGS['PASSWORD'],
    db=DEFAULT_SETTINGS['NAME'],
    charset='utf8'
)

def insert_to_Book(titles, authors, contents):
    try:
        with db.cursor() as cursor:
            for title, author, content in zip(titles, authors, contents):
                sql = '''
                    INSERT INTO Book(title, author, content) \
                    VALUES ( %s, %s, %s); \
                '''
                cursor.execute(sql, (title, author, content))

            db.commit()
    finally:
        db.close()


if __name__=='__main__':
    titles1, authors1, contents1 = convert_book1()
    titles2, authors2, contents2 = convert_book2()

    insert_to_Book(titles1, authors1, contents1)
    insert_to_Book(titles2, authors2, contents2)
