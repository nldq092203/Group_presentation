from django.test import TestCase
from django.urls import reverse
from group.models import Member

class MemberURLTests(TestCase):
    def setUp(self):
        self.member = Member.objects.create(
            name='Test Member',
            dob='2000-01-01',
            email='test@example.com',
            address='123 Test St',
            student_id='12345'
        )

    def test_member_list_url(self):
        url = reverse('presentation')
        self.assertEqual(url, '/members/')

    def test_member_detail_url(self):
        url = reverse('member_detail', args=[self.member.student_id])
        self.assertEqual(url, f'/members/{self.member.student_id}/')