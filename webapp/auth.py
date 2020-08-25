from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User

class LoginWithEmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        try:
            user = User.objects.get(email=email)
            pwd_valid = user.check_password(password)
            if pwd_valid:
                return user
        except User.DoesNotExist:
            return None