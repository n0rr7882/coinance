from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import currency.routing
import trading.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            []
            + currency.routing.websocket_urlpatterns
            + trading.routing.websocket_urlpatterns
        ),
    ),
})
