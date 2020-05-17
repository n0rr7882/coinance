from django.contrib import admin

from user.models import UserSetting


@admin.register(UserSetting)
class UserSettingAdmin(admin.ModelAdmin):
    pass
