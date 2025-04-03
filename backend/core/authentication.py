from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from keycloak import KeycloakOpenID
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class KeycloakAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return None 
        
        token = auth_header.split(" ")[1]
        keycloak_openid = KeycloakOpenID(
            server_url=settings.KEYCLOAK_CONFIG["SERVER_URL"],
            client_id=settings.KEYCLOAK_CONFIG["CLIENT_ID"],
            realm_name=settings.KEYCLOAK_CONFIG["REALM"],
            client_secret_key=settings.KEYCLOAK_CONFIG["CLIENT_SECRET_KEY"],
            verify=settings.KEYCLOAK_CONFIG["VERIFY_SSL"],
        )
        try:
            user_info = keycloak_openid.introspect(token)

            if not user_info.get("active"):
                raise AuthenticationFailed("Token is inactive or expired.")
            
        except Exception:
            raise AuthenticationFailed("Invalid token or authentication failed.")
        
        try:
            user = User.objects.get(username=user_info.get("preferred_username"))
            user.email = user_info.get("email", "")
            user.first_name = user_info.get("given_name", "")
            user.last_name = user_info.get("family_name", "")
            user.save()
        except User.DoesNotExist:
            user = User.objects.create(
                username=user_info.get("preferred_username"),
                email=user_info.get("email", ""),
                first_name=user_info.get("given_name", ""),
                last_name=user_info.get("family_name", "")
            )

        return user, {"payload": user_info} 
