from rest_framework import permissions


class IsSuperuserOrOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            if request.method == 'POST' or request.user.is_superuser:
                return True

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.is_superuser:
            return True

        if request.user == obj.user:
            return True

        return False
