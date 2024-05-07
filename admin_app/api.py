from django.contrib.auth.decorators import user_passes_test
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, DestroyAPIView
from user_app.models import Member
from user_app.serializers import MemberSerializer
from django.shortcuts import get_object_or_404
from user_app.api import BaseMemberDetailAPIView
from django.utils.decorators import method_decorator
from rest_framework import status

def admin_required(function=None, redirect_field_name=None, login_url='login'):
    """
    Decorator for views that checks that the user is an admin, redirecting
    to the log-in page if necessary.
    """
    actual_decorator = user_passes_test(
        lambda u: u.role == 'ADM',
        login_url=login_url,
        redirect_field_name=redirect_field_name
    )
    if function:
        return actual_decorator(function)
    return actual_decorator


class MemberListAPIView(ListAPIView):
    queryset = Member.objects.filter(is_member=True)
    serializer_class = MemberSerializer
    @method_decorator(admin_required(login_url='login'))
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'serializer': serializer.data})
    
   
class MemberManageAPIView(BaseMemberDetailAPIView, DestroyAPIView):
    @method_decorator(admin_required(login_url='login'))
    def delete(self, request, *args, **kwargs):
        self.destroy(request, *args, **kwargs)
        return Response({"status": "success"}, status=status.HTTP_204_NO_CONTENT)
    
    @method_decorator(admin_required(login_url='login'))
    def put(self, request, format=None):
        return super().put(request, format)
    
    @method_decorator(admin_required(login_url='login'))
    def post(self, request, format=None):
        return super().post(request, format)

class RequestListAPIView(ListAPIView):
    queryset = Member.objects.filter(is_requested = True, is_member = False)
    serializer_class = MemberSerializer

    @method_decorator(admin_required(login_url='login'))
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'serializer': serializer.data})


