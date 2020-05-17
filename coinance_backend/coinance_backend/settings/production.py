from .base import *  # pylint: disable=unused-wildcard-import

DEBUG = False

ALLOWED_HOSTS = ['*']

CORS_ORIGIN_WHITELIST = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://api.coinance.norrz.io",
    "http://api.coinance.norrz.io",
    "https://coinance.norrz.io",
    "http://coinance.norrz.io",
]
