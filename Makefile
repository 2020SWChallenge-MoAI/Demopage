.PHONY: install clean migrate run


install:
	pip install -r requirements.txt

clean:
	find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
	find . -path "*/migrations/*.pyc"  -delete

migrate:
	python manage.py makemigrations
	python manage.py migrate

run:
	python manage.py runserver 0.0.0.0:9000
