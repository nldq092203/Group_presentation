from django.shortcuts import render

# Create your views here.
def home_admin(request):
    return render(request, "admin/home.html")