from django.shortcuts import render
from user_app.models import Member

# Create your views here.
def home_admin(request):
    count_requests = Member.objects.filter(is_requested=True, is_member=False).count()
    count_members = Member.objects.filter(is_member=True).count()
    return render(request, "admin/home.html", {'count_requests': count_requests, 'count_members': count_members})

def manage_member(request):
    count_members = Member.objects.filter(is_member=True).count()
    return render(request, "admin/manage_member.html", {'count_members': count_members})

def manage_request(request):
    count_requests = Member.objects.filter(is_requested=True, is_member=False).count()
    return render(request, "admin/manage_request.html", {'count_requests': count_requests})

    