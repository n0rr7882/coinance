from .base import *  # pylint: disable=unused-wildcard-import

DEBUG = False

DRAMATIQ_BROKER = {
    'BROKER': 'dramatiq.brokers.rabbitmq.RabbitmqBroker',
    'OPTIONS': {
        'url': get_env_variable('DRAMATIQ_BROKER_URL'),
    },
    'MIDDLEWARE': [
        'dramatiq.middleware.Prometheus',
        'dramatiq.middleware.AgeLimit',
        'dramatiq.middleware.TimeLimit',
        'dramatiq.middleware.Callbacks',
        'dramatiq.middleware.Retries',
        'django_dramatiq.middleware.AdminMiddleware',
        'django_dramatiq.middleware.DbConnectionsMiddleware',
    ]
}
