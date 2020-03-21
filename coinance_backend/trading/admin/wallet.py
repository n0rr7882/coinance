from django.contrib import admin

from trading.models import Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    pass
