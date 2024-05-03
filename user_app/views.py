
from django.shortcuts import render
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.urls import reverse
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
    return render(request, "user/profile.html")