from .base import *  # pylint: disable=unused-wildcard-import

DRAMATIQ_BROKER = {
    'BROKER': 'dramatiq.brokers.stub.StubBroker',
    'OPTIONS': {},
    'MIDDLEWARE': [
        'dramatiq.middleware.AgeLimit',
        'dramatiq.middleware.TimeLimit',
        'dramatiq.middleware.Callbacks',
        'dramatiq.middleware.Pipelines',
        'dramatiq.middleware.Retries',
        'django_dramatiq.middleware.DbConnectionsMiddleware',
    ]
}
