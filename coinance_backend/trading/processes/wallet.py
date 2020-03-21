from currency.models import Currency
from trading.models import Wallet
from user.models import UserSetting


def initialize_user_wallets(user_setting: UserSetting):
    # Reset user histories
    Wallet.objects.filter(user=user_setting.user).delete()

    for currency in Currency.objects.all():
        wallet = Wallet(user=user_setting.user, currency=currency)

        if user_setting.start_currency == currency:
            wallet.amount = user_setting.start_amount

        wallet.save()

    return
