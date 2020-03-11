class PoloniexException(Exception):
    pass


class PoloniexWebSocketException(PoloniexException):
    pass


class PoloniexAPIException(PoloniexException):
    pass
