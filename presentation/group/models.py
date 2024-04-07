from django.db import models

# Create your models here.


class Member(models.Model):
    name = models.CharField(max_length=255)
    dob = models.DateField()
    avt = models.ImageField(null=True, blank=True, upload_to="images/")
    email = models.EmailField()
    address = models.CharField(max_length=255)
    student_id = models.CharField(primary_key=True, max_length=255)
    def __str__(self):
        return self.student_id

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
    





