from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from group.models import Member, Skill

class MemberModelTest(TestCase):
    def setUp(self):
        self.member = Member.objects.create(
            name='Test Member',
            dob='2000-01-01',
            avt=SimpleUploadedFile(name='test_image.jpg', content=b'test content', content_type='image/jpeg'),
            email='test@example.com',
            address='123 Test St',
            student_id='12345'
        )

    def test_member_creation(self):
        self.assertEqual(Member.objects.count(), 1)
        self.assertEqual(self.member.name, 'Test Member')
        self.assertEqual(self.member.student_id, '12345')

class SkillModelTest(TestCase):
    def setUp(self):
        self.member = Member.objects.create(
            name='Test Member',
            dob='2000-01-01',
            avt=SimpleUploadedFile(name='test_image.jpg', content=b'test content', content_type='image/jpeg'),
            email='test@example.com',
            address='123 Test St',
            student_id='12345'
        )
        self.skill = Skill.objects.create(
            member=self.member,
            name='Python',
            level='AD'
        )

    def test_skill_creation(self):
        self.assertEqual(Skill.objects.count(), 1)
        self.assertEqual(self.skill.name, 'Python')
        self.assertEqual(self.skill.level, 'AD')

    def tearDown(self):
        self.member.avt.delete()