import graphene
from exchange.schemas import ExchangeQuery


class Query(
    ExchangeQuery,
    graphene.ObjectType
):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass


schema = graphene.Schema(query=Query)
