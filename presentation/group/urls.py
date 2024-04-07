from django.urls import path
from .views import MemberListView, MemberDetailView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', MemberListView.as_view(), name='presentation'),
    path('members/<str:pk>/', MemberDetailView.as_view(), name='member_detail')
] + static (settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)