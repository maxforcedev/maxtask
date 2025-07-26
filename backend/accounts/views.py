from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils import timezone
from . import serializers, utils, models
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = serializers.RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'success': 'Se o e-mail estiver correto, você receberá um link'}, status=status.HTTP_200_OK)

            token = utils.create_reset_token(user)
            utils.sendmail_reset_email(user, token)
            return Response({'success': 'Se o e-mail estiver correto, você receberá um link'}, status=status.HTTP_200_OK)
        return Response({'error': 'O campo email é obrigatorio.'}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = serializers.ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token_obj = serializer.validated_data["reset_token_obj"]
            new_password = serializer.validated_data["password"]

            user.set_password(new_password)
            user.save()

            token_obj.delete()
            return Response({"success": True, "message": "Senha redefinida com sucesso."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidateResetTokenView(APIView):
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "Token não informado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = models.PasswordResetToken.objects.get(token=token)
            if reset_token.expires_at < timezone.now():
                return Response({"detail": "Token expirado"}, status=status.HTTP_400_BAD_REQUEST)
        except models.PasswordResetToken.DoesNotExist:
            return Response({"detail": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"valid": True}, status=status.HTTP_200_OK)
