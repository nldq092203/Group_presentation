from django.test import TestCase, Client
from django.urls import reverse
from group.models import Member
from django.core.files.uploadedfile import SimpleUploadedFile

class MemberViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.member = Member.objects.create(
            name='Test Member',
            dob='2000-01-01',
            email='test@example.com',
            address='123 Test St',
            student_id='12345',
            avt=SimpleUploadedFile(name='test_image.jpg', content=b'test content', content_type='image/jpeg'),
        )

    def test_member_list_view(self):
        response = self.client.get(reverse('presentation'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'group/home.html')

    def test_member_detail_view(self):
        response = self.client.get(reverse('member_detail', args=[self.member.student_id]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'group/member_detail.html')
    
    def tearDown(self):
        self.member.avt.delete()