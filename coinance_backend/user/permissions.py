from rest_framework import permissions


class IsSuperuserOrCreateAndUpdateOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        if request.user.is_authenticated and request.user.is_superuser:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.is_superuser:
            return True

        if request.user == obj:
            return True

        return False
