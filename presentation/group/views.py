from typing import Any
from django.db.models.query import QuerySet
from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import Member

# Create your views here.
class MemberListView(ListView):
    model = Member
    template_name = 'group/home.html'
    context_object_name = 'members'

    def get_queryset(self) -> QuerySet[Any]:
        return Member.objects.only('name', 'avt','student_id')

class MemberDetailView(DetailView):
    model = Member
    template_name = 'group/member_detail.html'
    context_object_name = 'member'