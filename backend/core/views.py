from rest_framework import viewsets, views
from .models import Bank
from .serializers import BankSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission


class HasKeycloakRole(BasePermission):
    """
    Permission class to check if user has specific Keycloak roles
    """
    def __init__(self, required_roles):
        self.required_roles = required_roles

    def has_permission(self, request, view):
        if not request.auth or 'payload' not in request.auth:
            return False
        
        user_roles = request.auth["payload"].get("realm_access", {}).get("roles", [])
        return any(role in user_roles for role in self.required_roles)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_roles = request.auth["payload"].get("realm_access", {}).get("roles", [])
        return Response({
            "message": f"Hello, {request.user.username}! You are authenticated with Keycloak.",
            "roles": user_roles
        })


@api_view(["POST"])
@permission_classes([IsAuthenticated]) 
def create_bank(request):
    """
    Creates a new Bank entry, restricted to users with 'admin' role.
    """
    keycloak_roles = request.auth["payload"].get("realm_access", {}).get("roles", [])
    print(f"User roles: {keycloak_roles}")
    
    if "admin" not in keycloak_roles:
        admin_like_roles = ["admin", "realm-admin", "default-roles-kloack"]
        has_admin_access = any(role in keycloak_roles for role in admin_like_roles)
        if not has_admin_access:
            return Response({"error": "Access denied. Admin role required.", "roles": keycloak_roles}, status=403)
    
    serializer = BankSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Bank created successfully!", "data": serializer.data}, status=201)
    return Response(serializer.errors, status=400)

