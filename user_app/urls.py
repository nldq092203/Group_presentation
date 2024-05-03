from django.urls import path
from . import views
from . import api
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.home, name='home'),
    path('login', views.login_view, name='login'),
    path('api/login', api.LoginAPIView.as_view(), name='api_login'),
    path('api/register', api.RegisterAPIView.as_view(), name='api_register'),
    path('api/members_list', api.MemberListAPIView.as_view(), name='api_members'),
    path('api/member', api.MemberDetailAPIView.as_view(), name='member-detail'),
    path('register', views.register_view, name='register'),
    path('logout', views.logout_view, name='logout'),
    path('member', views.profile_view, name='profile'),
] + static (settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)