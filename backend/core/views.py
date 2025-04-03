from rest_framework import viewsets, views
from .models import Bank
from .serializers import BankSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from django.http import JsonResponse
from django.conf import settings
from keycloak import KeycloakOpenID
from urllib.parse import urlencode
import json



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




@api_view(["GET"])
def authenticate(request):
    """
    Generate a Keycloak authorization URL for redirecting the user to login
    """
    redirect_uri = request.GET.get('redirect_uri', 'http://172.105.75.119:3001/callback')
    
    try:
        print(f"Keycloak Config: {settings.KEYCLOAK_CONFIG}")
        print(f"Redirect URI: {redirect_uri}")
        
        keycloak_openid = KeycloakOpenID(
            server_url=settings.KEYCLOAK_CONFIG["SERVER_URL"],
            client_id=settings.KEYCLOAK_CONFIG["CLIENT_ID"],
            realm_name=settings.KEYCLOAK_CONFIG["REALM"],
            client_secret_key=settings.KEYCLOAK_CONFIG["CLIENT_SECRET_KEY"],
            verify=False  
        )
        
        auth_url = keycloak_openid.auth_url(
            redirect_uri=redirect_uri,
            scope="openid email profile"
        )
        
        print(f"Generated auth URL: {auth_url}")
        return JsonResponse({"auth_url": auth_url})
    except Exception as e:
        import traceback
        print(f"Keycloak Auth Error: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)



@api_view(["GET", "POST"])
def callback(request):
    """
    Handle the callback from Keycloak after successful authentication
    """
    code = request.GET.get('code')
    redirect_uri = request.GET.get('redirect_uri', 'http://172.105.75.119:3001/callback')
    
    if not code:
        return JsonResponse({"error": "No authorization code provided"}, status=400)
    
    try:
        print(f"Processing callback with code: {code[:10]}... and redirect_uri: {redirect_uri}")
        
        keycloak_openid = KeycloakOpenID(
            server_url=settings.KEYCLOAK_CONFIG["SERVER_URL"],
            client_id=settings.KEYCLOAK_CONFIG["CLIENT_ID"],
            realm_name=settings.KEYCLOAK_CONFIG["REALM"],
            client_secret_key=settings.KEYCLOAK_CONFIG["CLIENT_SECRET_KEY"],
            verify=False  
        )
        
        print(f"Initialized KeycloakOpenID with server: {settings.KEYCLOAK_CONFIG['SERVER_URL']}")
        
        token_response = keycloak_openid.token(
            grant_type="authorization_code",
            code=code,
            redirect_uri=redirect_uri
        )
        
        user_info = keycloak_openid.userinfo(token_response['access_token'])
        
        response_data = {
            "token": token_response,
            "user_info": user_info
        }
        
        frontend_redirect_url = f"{redirect_uri.split('/callback')[0]}/auth-success?{urlencode({'token_data': json.dumps(response_data)})}"
        
        return JsonResponse({
            "success": True,
            "redirect_url": frontend_redirect_url
        })
        
    except Exception as e:
        # Enhanced error reporting
        import traceback
        print(f"Error in Keycloak callback: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=400)


@api_view(["GET"])
def test_keycloak_connection(request):
    """Test connection to Keycloak server"""
    import requests
    
    server_url = settings.KEYCLOAK_CONFIG["SERVER_URL"]
    try:
        import urllib3
        urllib3.disable_warnings()
        
        response = requests.get(
            f"{server_url}/realms/{settings.KEYCLOAK_CONFIG['REALM']}/.well-known/openid-configuration",
            verify=False,
            timeout=10
        )
        
        return JsonResponse({
            "status": response.status_code,
            "content": response.json() if response.status_code == 200 else None,
            "server_url": server_url
        })
    except Exception as e:
        import traceback
        return JsonResponse({
            "error": str(e),
            "traceback": traceback.format_exc(),
            "server_url": server_url
        }, status=500)
