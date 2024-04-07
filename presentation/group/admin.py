from django.contrib import admin
from .models import Member, Skill, Experience, Education, Media

class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1

class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1

class EducationInline(admin.TabularInline):
    model = Education
    extra = 1

class MediaInline(admin.TabularInline):
    model = Media
    extra = 1

class MemberAdmin(admin.ModelAdmin):
    inlines = [SkillInline, ExperienceInline, EducationInline, MediaInline]

admin.site.register(Member, MemberAdmin)