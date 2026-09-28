import unittest

from fastapi.testclient import TestClient

import backend.interfaces.api.main as api_main

from backend.domain.user import User


class FakeAuthService:

    def __init__(self):
        self.user = User(
            user_id=1,
            username="test_user",
            password_hash="unused",
            role="operator",
        )

    def authenticate(
        self,
        username: str,
        password: str,
    ):
        if (
            username == "test_user"
            and password == "correct_password"
        ):
            return self.user

        return None


class TestAuthAPI(unittest.TestCase):

    def setUp(self):
        self.original_auth_service = (
            api_main.auth_service
        )

        api_main.auth_service = FakeAuthService()

        self.client = TestClient(
            api_main.app
        )

    def tearDown(self):
        api_main.auth_service = (
            self.original_auth_service
        )

    # =========================================================
    # LOGIN
    # =========================================================

    def test_login_success(self):
        response = self.client.post(
            "/api/auth/login",
            json={
                "username": "test_user",
                "password": "correct_password",
            },
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json(),
            {
                "success": True,
                "username": "test_user",
                "role": "operator",
            },
        )

    def test_login_invalid_credentials(self):
        response = self.client.post(
            "/api/auth/login",
            json={
                "username": "test_user",
                "password": "wrong_password",
            },
        )

        self.assertEqual(
            response.status_code,
            401,
        )

        self.assertEqual(
            response.json(),
            {
                "detail": "Usuario o contraseña incorrectos"
            },
        )

    # =========================================================
    # SESSION
    # =========================================================

    def test_session_is_authenticated_after_login(self):
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "username": "test_user",
                "password": "correct_password",
            },
        )

        self.assertEqual(
            login_response.status_code,
            200,
        )

        response = self.client.get(
            "/api/auth/me"
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json(),
            {
                "authenticated": True,
                "username": "test_user",
                "role": "operator",
            },
        )

    def test_session_is_unauthenticated_without_login(self):
        response = self.client.get(
            "/api/auth/me"
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json(),
            {
                "authenticated": False,
                "username": None,
                "role": None,
            },
        )

    # =========================================================
    # PROTECTED ENDPOINTS
    # =========================================================

    def test_protected_endpoint_requires_authentication(self):
        response = self.client.get(
            "/api/taximeter/state"
        )

        self.assertEqual(
            response.status_code,
            401,
        )

        self.assertEqual(
            response.json(),
            {
                "detail": "No autenticado"
            },
        )

    def test_protected_endpoint_allows_authenticated_user(
        self,
    ):
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "username": "test_user",
                "password": "correct_password",
            },
        )

        self.assertEqual(
            login_response.status_code,
            200,
        )

        response = self.client.get(
            "/api/taximeter/state"
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json(),
            {
                "state": "idle"
            },
        )

    # =========================================================
    # LOGOUT
    # =========================================================

    def test_logout(self):
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "username": "test_user",
                "password": "correct_password",
            },
        )

        self.assertEqual(
            login_response.status_code,
            200,
        )

        logout_response = self.client.post(
            "/api/auth/logout"
        )

        self.assertEqual(
            logout_response.status_code,
            200,
        )

        self.assertEqual(
            logout_response.json(),
            {
                "success": True,
                "message": "Sesión cerrada",
            },
        )

        session_response = self.client.get(
            "/api/auth/me"
        )

        self.assertEqual(
            session_response.status_code,
            200,
        )

        self.assertEqual(
            session_response.json(),
            {
                "authenticated": False,
                "username": None,
                "role": None,
            },
        )

    def test_logout_blocks_protected_endpoint(self):
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "username": "test_user",
                "password": "correct_password",
            },
        )

        self.assertEqual(
            login_response.status_code,
            200,
        )

        logout_response = self.client.post(
            "/api/auth/logout"
        )

        self.assertEqual(
            logout_response.status_code,
            200,
        )

        response = self.client.get(
            "/api/taximeter/state"
        )

        self.assertEqual(
            response.status_code,
            401,
        )

        self.assertEqual(
            response.json(),
            {
                "detail": "No autenticado"
            },
        )


if __name__ == "__main__":
    unittest.main()