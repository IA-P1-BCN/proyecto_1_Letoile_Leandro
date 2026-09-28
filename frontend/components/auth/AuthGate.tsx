"use client";

import { useEffect, useState } from "react";

import Scene from "@/components/3d/Scene";
import LoginForm from "./LoginForm";

type SessionUser = {
  authenticated: boolean;
  username: string | null;
  role: string | null;
};

type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

export default function AuthGate() {
  const [status, setStatus] =
    useState<AuthStatus>("loading");

  const [user, setUser] =
    useState<SessionUser | null>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          setStatus("unauthenticated");
          return;
        }

        const data: SessionUser =
          await response.json();

        if (data.authenticated) {
          setUser(data);
          setStatus("authenticated");
          return;
        }

        setStatus("unauthenticated");
      } catch {
        setStatus("unauthenticated");
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await fetch(
        "http://localhost:8000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } finally {
      window.location.reload();
    }
  };

  const handleOpenHistory = () => {
    setHistoryOpen(true);
    setUserMenuOpen(false);
  };

  if (status === "loading") {
    return (
      <main className="auth-loading">
        <p>Comprobando sesión...</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <LoginForm />;
  }

  return (
    <>
      <main className="app">
        <Scene
          historyOpen={historyOpen}
          onHistoryOpenChange={setHistoryOpen}
        />
      </main>

      <div className="user-menu-container">
        <button
          type="button"
          className="user-menu-button"
          onClick={() =>
            setUserMenuOpen(
              (current) => !current
            )
          }
          aria-label="Abrir menú de usuario"
          aria-expanded={userMenuOpen}
        >
          <span className="user-menu-icon">
            👤
          </span>

          <span className="user-menu-arrow">
            {userMenuOpen ? "▲" : "▼"}
          </span>
        </button>

        {userMenuOpen && (
          <div className="user-menu">
            <div className="user-menu-header">
              <span className="user-menu-user-icon">
                👤
              </span>

              <div>
                <div className="user-menu-username">
                  {user?.username}
                </div>

                <div className="user-menu-role">
                  Usuario
                </div>
              </div>
            </div>

            <button
              type="button"
              className="user-menu-item"
              onClick={handleOpenHistory}
            >
              <span>📋</span>
              <span>Historial</span>
            </button>

            <button
              type="button"
              className="user-menu-item logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <span>🚪</span>

              <span>
                {loggingOut
                  ? "Cerrando sesión..."
                  : "Cerrar sesión"}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}