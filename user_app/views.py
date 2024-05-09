
from django.shortcuts import render
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Member
# Create your views here.
def home(request):
    return render(request,"user/home.html")

def login_view(request):
    return render(request, "user/login.html")
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("home"))

def register_view(request):
    return render(request, "user/register.html")

def profile_view(request):
    username = request.GET.get("username")
    try:
        member = Member.objects.get(username = request.user.username)
        request.member = member
    except Member.DoesNotExist:
        pass
    return render(request, "user/profile.html", {
        "username": username
    })