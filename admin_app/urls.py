from django.urls import path
from . import views, api
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.home_admin, name='home_admin'),
    path('api/members_list', api.MemberListAPIView.as_view(), name='members_list_admin'),
    path('api/member', api.MemberManageAPIView.as_view(), name='member_manage_admin'),
] + static (settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)