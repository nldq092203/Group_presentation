from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('USR', 'User'),
        ('ADM', 'Admin'),
    ]
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default='USR')

    def save(self, *args, **kwargs):
        self.is_staff = self.role == 'ADM'
        super().save(*args, **kwargs)
        
class Member(User):
    name = models.CharField(max_length=100, blank=True)
    dob = models.DateField()
    avt = models.ImageField(null=True, blank=True, upload_to="images/")
    address = models.CharField(max_length=255)
    student_id = models.CharField(max_length=255)
    is_member = models.BooleanField(default=False)
    is_requested = models.BooleanField(default=False)
    def __str__(self):
        return self.student_id
    class Meta:
        verbose_name_plural = "Members"
    
    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"{self.first_name} {self.last_name}"
        super().save(*args, **kwargs)


class Skill(models.Model):
    LEVEL_CHOICES = [
        ('BG', 'Beginner'),
        ('IN', 'Intermediate'),
        ('AD', 'Advanced'),
    ]
    member = models.ForeignKey(Member, related_name="skills", on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)

class Experience(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, null=True, related_name="experiences", blank=True)
    title = models.CharField(max_length=255)
    agency =  models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True,auto_now_add=True)
    description = models.TextField(null=True, blank=True)

class Education(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='educations', null='True', blank ='True')
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True,auto_now_add=True)

class Media(models.Model):
    MEDIA_CHOICES = [
        ('FB', 'Facebook'),
        ('IG', 'Instagram'),
        ('GH', 'Github'),
        ('LI', 'LinkedIn'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='medias')
    name = models.CharField(max_length=2, choices=MEDIA_CHOICES)
    url = models.URLField(max_length=255)
    





