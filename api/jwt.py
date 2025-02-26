
import jwt
from lavacoco.settings import SECRET_KEY
from django.utils import timezone
import datetime
import time

def root_url(request):
    domain = request.get_host()  # example.com
    protocol = "https" if request.is_secure() else "http"
    return f"{protocol}://{domain}"

#Encoders
def invite_user_admin(request,user):
    encode_user = jwt.encode({"user":user.id,"type":"admin_invite","exp":timezone.now()+datetime.timedelta(hours=12)},key=SECRET_KEY,algorithm="HS256")
    return root_url(request) + "/invitacion-admin/" + encode_user

def recover_password_admin(request,user):
    encode_user = jwt.encode({"user":user.id,"type":"recover_password","exp":timezone.now()+datetime.timedelta(hours=12)},key=SECRET_KEY,algorithm="HS256")
    return root_url(request) + "/recuperar-contrasena/" + encode_user

def invite_user_friend(request,user):
    encode_user = jwt.encode({"user":user.id,"type":"friend_invite"},key=SECRET_KEY,algorithm="HS256")
    return root_url(request) + "/crear-cuenta/" + encode_user

#Decoders
def invite_user_friend_decode(code):
    try:
        decode = jwt.decode(code,SECRET_KEY,algorithms=["HS256"])
        if decode['type'] == "friend_invite":
            return {"user": decode['user']}
    except Exception as e:
        return {"error":str(e)}

def invite_user_admin_decode(code):
    try:
        decode = jwt.decode(code,SECRET_KEY,algorithms=["HS256"])
        if decode['type'] == "admin_invite":
            return {"expired": decode["exp"] < time.time(), "user": decode['user']}
    except jwt.exceptions.ExpiredSignatureError:
        return {"expired":True}
    return False

def recover_password_decode(code):
    try:
        decode = jwt.decode(code,SECRET_KEY,algorithms=["HS256"])
        if decode['type'] == "recover_password":
            return {"expired": decode["exp"] < time.time(), "user": decode['user']}
    except jwt.exceptions.ExpiredSignatureError:
        return {"expired":True}
    return False

