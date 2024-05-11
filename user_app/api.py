from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from .models import Member, User, Skill, Experience, Education, Media
from .serializers import UserSerializer, MemberSerializer
import json
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.utils.decorators import method_decorator


def user_matches(view_func):
    def _wrapped_view(view, request, *args, **kwargs):
        data = request.data
        member_username = data.get("username")
        if member_username and request.user.username != member_username:
                return Response({"status": "error", "message": "You do not have permission to modify this data."}, status=status.HTTP_403_FORBIDDEN)
        return view_func(view, request, *args, **kwargs)
    return _wrapped_view

class LoginAPIView(APIView):
    def post(self, request, format=None):
        data = request.data
        if 'username' in data and 'password' in data:
            username = data["username"]
            password = data["password"]

            if not username or not password:
                return Response({"status": "failure", "message": "Username and password fields cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                if user.role == "ADM":
                    return Response({"status": "success", "user_role":"ADM"})
                
                return Response({"status": "success", "user_role": "USR"})
            else:
                return Response({"status": "failure", "message": "Invalid username and/or password."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"status": "failure", "message": "Username and password fields are required."}, status=status.HTTP_400_BAD_REQUEST)

class RegisterAPIView(APIView):
    def post(self, request, format=None):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirmation = data.get("confirmation")

        if not username or not email or not password or not confirmation:
            return Response({"status": "failure", "message": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirmation:
            return Response({"status": "failure", "message": "Passwords must match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            return Response({"status": "success"})
        except IntegrityError:
            return Response({"status": "failure", "message": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
class MemberListAPIView(ListAPIView):
    queryset = Member.objects.filter(is_member=True)
    serializer_class = MemberSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'serializer': serializer.data})


class BaseMemberDetailAPIView(RetrieveUpdateAPIView, CreateAPIView):
    serializer_class = MemberSerializer

    def get_object(self):
        username = self.request.query_params.get('username', None)
        if username is not None:
            return get_object_or_404(Member, username=username)
        return None
    
    def put(self, request, format=None):
        data = request.data
        
        username = request.GET.get("username", request.user.username)

        member = Member.objects.get(username=username)
        
        name = data.get("name", member.name)
        dob = data.get("dob", member.dob)
        email = data.get("email", member.email)
        student_id = data.get("id", member.student_id)
        address = data.get("address", member.address)
        avt = data.get("avt", member.avt)
        is_member = data.get("is_member", member.is_member)
        is_requested = data.get("is_requested", member.is_requested)
        skills_data = data.get("skills", [])
        experiences_data = data.get("experiences", [])
        educations_data = data.get("educations", [])
        medias_data = data.get("medias", [])

        # if not name or not dob or not email or not student_id or not address:
        #     return Response({"status": "failure", "message": "Name, dob, email, student_id, and address fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if isinstance(dob, str):
                dob = datetime.strptime(dob, "%Y-%m-%d").date()
        except ValueError:
            return Response({"status": "failure", "message": "dob must be in YYYY-MM-DD format."}, status=status.HTTP_400_BAD_REQUEST)
        
        member.name = name
        member.dob = dob
        member.email = email
        member.student_id = student_id
        member.avt = avt
        member.is_requested = is_requested
        member.address = address
        member.is_member = is_member

        member.save()

        # Update the Skill instances for the given data and set the relationship
        skills = []
        for skill_data in skills_data:
            skill, created = Skill.objects.get_or_create(member=member, **skill_data)
            skills.append(skill)
        member.skills.set(skills)

        # Update the Experience instances for the given data and set the relationship
        experiences = []
        for experience_data in experiences_data:
            experience, created = Experience.objects.get_or_create(member=member, **experience_data)
            experiences.append(experience)
        member.experiences.set(experiences)

        # Update the Education instances for the given data and set the relationship
        date_fields = ['start_date', 'end_date']  # The names of the date fields in the Education model
        educations = []
        for education_data in educations_data:
            if education_data is None:
                continue
            for key, value in education_data.items():
                if key in date_fields and isinstance(value, str):
                    try:
                        value = datetime.strptime(value, "%Y-%m-%d").date()
                    except ValueError:
                        value = None
                    education_data[key] = value
            if None not in education_data.values():
                education, created = Education.objects.get_or_create(member=member, **education_data)
                educations.append(education)
        member.educations.set(educations)

        # Update the Media instances for the given data and set the relationship
        medias = []
        if isinstance(medias_data, str):
            try:
                medias_data = json.loads(medias_data)
            except json.JSONDecodeError:
                pass
        for media_data in medias_data:
            media, created = Media.objects.get_or_create(member=member, **media_data)
            medias.append(media)
        member.medias.set(medias)

        return Response({"status": "success", "member": self.get_serializer(member).data})
    
    def post(self, request, format=None):
        data = request.data
        name = data.get("name")
        dob = data.get("dob")
        email = data.get("email")
        student_id = data.get("id")
        address = data.get("address")
        avt = request.FILES.get("avt")
        skills_data = data.get("skills")
        experiences_data = data.get("experiences")
        educations_data = data.get("educations")
        medias_data = data.get("medias")

        if not name or not dob or not email or not student_id or not address:
            return Response({"status": "failure", "message": "Name, dob, email, student_id, and address fields are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the current user
        username = data.get("username", request.user.username)
        user = User.objects.get(username=username)

        # Create a new Member object that points to the same user
        member = Member(user_ptr=user)
        member.__dict__.update(user.__dict__)

        # Parse the dob string into a date object
        try:
            dob = datetime.strptime(dob, "%Y-%m-%d").date()
        except ValueError:
            return Response({"status": "failure", "message": "dob must be in YYYY-MM-DD format."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the member's fields
        member.name = name
        member.dob = dob
        member.email = email
        member.student_id = student_id
        member.avt = avt
        member.address = address
        member.is_requested = True

        member.save()

        # Fetch or create the Skill instances for the given data and set the relationship
        skills = []
        if skills_data is not None:
            for skill_data in skills_data:
                skill, created = Skill.objects.get_or_create(member = member, **skill_data)
                skills.append(skill)
            member.skills.set(skills)

        # Fetch or create the Experience instances for the given data and set the relationship
        experiences = []
        if experiences_data is not None:
            for experience_data in experiences_data:
                experience, created = Experience.objects.get_or_create(member=member, **experience_data)
                experiences.append(experience)
            member.experiences.set(experiences)

        # Fetch or create the Education instances for the given data and set the relationship
        date_fields = ['start_date', 'end_date']  # The names of the date fields in the Education model

        educations = []
        if educations_data is not None:
            for education_data in educations_data:
                if education_data is None:
                    continue
                # Parse the date strings in education_data into date objects
                for key, value in education_data.items():
                    if key in date_fields and isinstance(value, str):
                        try:
                            # Parse the date string into a date object
                            value = datetime.strptime(value, "%Y-%m-%d").date()
                        except ValueError:
                            value = None
                        education_data[key] = value

                if None not in education_data.values():
                    education, created = Education.objects.get_or_create(member=member, **education_data)
                    educations.append(education)
            member.educations.set(educations)

        # Fetch or create the Media instances for the given data and set the relationship
        medias = []
        if medias_data is not None:
            medias_data = json.loads(medias_data)
            for media_data in medias_data:
                if isinstance(media_data, str) and media_data.strip():
                    try:
                        media_data = json.loads(media_data)
                    except json.JSONDecodeError:
                        print(f"Invalid JSON: {media_data}")
                        continue
                media, created = Media.objects.get_or_create(member = member, **media_data)
                medias.append(media)
            member.medias.set(medias)

        

        return Response({"status": "success"})
        
class MemberDetailAPIView(BaseMemberDetailAPIView):
    # @method_decorator(user_matches)
    def put(self, request, format=None):
        return super().put(request, format)
    
    # @method_decorator(user_matches)
    def post(self, request, format=None):
        return super().post(request, format)
