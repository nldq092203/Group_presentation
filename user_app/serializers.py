from rest_framework import serializers
from .models import User, Member, Skill, Experience, Education, Media

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'email']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name', 'level']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['title', 'agency', 'start_date', 'end_date', 'description']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['institution', 'degree', 'start_date', 'end_date']

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['name', 'url']

class MemberSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    medias = MediaSerializer(many=True, read_only=True)
    class Meta:
        model = Member
        fields = ['id', 'username', 'name', 'dob', 'avt', 'address', 'student_id', 'skills', 'experiences', 'educations', 'medias', 'email']

