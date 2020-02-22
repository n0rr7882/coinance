# BiTrace backend

## Installation

```
$ poetry use env 3.8
$ poetry install
```

## Run (for development)

### HTTP server

```
# Create `.env` by referring to `.env.bak` in your backend project root directory.
$ poetry shell
$ python manage.py runserver
```

### Celery worker

```
# Redis must be running on `redis://localhost:6379//`
$ poetry shell
$ celery -A bitrace_backend worker -l info
```

### Celery beat

```
# Redis must be running on `redis://localhost:6379//`
# Celery worker must be running
$ poetry shell
$ celery -A bitrace_backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### Poloniex Websocket client

```
# Celery worker must be running
$ poetry shell
$ python manage.py poloniex_ws_client
```
