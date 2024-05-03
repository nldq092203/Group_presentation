from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Member, Skill, Experience, Education, Media, User

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

class MemberAdmin(admin.ModelAdmin):
    inlines = [SkillInline, ExperienceInline, EducationInline, MediaInline]

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    fields = ('username', 'email', 'role', 'password')

admin.site.register(Member, MemberAdmin)
admin.site.register(User, UserAdmin)
