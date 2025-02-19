
import jwt
from lavacoco.settings import SECRET_KEY
from django.utils import timezone
import datetime
import time

def root_url(request):
    domain = request.get_host()  # example.com
    protocol = "https" if request.is_secure() else "http"
    return f"{protocol}://{domain}"

def invite_user_admin(request,user):
    encode_user = jwt.encode({"user":user.id,"type":"admin_invite","exp":timezone.now()+datetime.timedelta(hours=3)},key=SECRET_KEY,algorithm="HS256")
    return root_url(request) + "/invitacion-admin/" + encode_user

def invite_user_admin_decode(code):
    try:
        decode = jwt.decode(code,SECRET_KEY,algorithms=["HS256"])
        if decode['type'] == "admin_invite":
            return {"expired": decode["exp"] < time.time(), "user": decode['user']}
    except jwt.exceptions.ExpiredSignatureError:
        return {"expired":True}
    return False

