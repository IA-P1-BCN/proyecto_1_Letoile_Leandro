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

  const username = user?.username ?? "Usuario";
  const role = user?.role ?? "operator";

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
          <span className="user-menu-avatar">
            {username.charAt(0).toUpperCase()}
          </span>

          <span className="user-menu-info">
            <span className="user-menu-name">
              {username}
            </span>

            <span className="user-menu-status">
              <span className="user-menu-status-dot" />
              SESSION ACTIVE
            </span>
          </span>

          <span className="user-menu-arrow">
            {userMenuOpen ? "▲" : "▼"}
          </span>
        </button>

        {userMenuOpen && (
          <div className="user-menu">
            <div className="user-menu-header">
              <div className="user-menu-avatar-large">
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="user-menu-profile">
                <div className="user-menu-username">
                  {username}
                </div>

                <div className="user-menu-role">
                  {role.toUpperCase()}
                </div>
              </div>

              <div className="user-menu-active">
                <span />
                ACTIVE
              </div>
            </div>

            <div className="user-menu-system">
              <div>
                <span>SYSTEM</span>
                <strong>TTX-247</strong>
              </div>

              <div>
                <span>ACCESS</span>
                <strong>{role.toUpperCase()}</strong>
              </div>
            </div>

            <button
              type="button"
              className="user-menu-item"
              onClick={handleOpenHistory}
            >
              <span className="user-menu-item-icon">
                ◫
              </span>

              <span>
                <strong>Historial</strong>
                <small>
                  Consultar carreras registradas
                </small>
              </span>

              <b>→</b>
            </button>

            <button
              type="button"
              className="user-menu-item user-menu-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <span className="user-menu-item-icon">
                ⇥
              </span>

              <span>
                <strong>
                  {loggingOut
                    ? "Cerrando sesión..."
                    : "Cerrar sesión"}
                </strong>

                <small>
                  Finalizar sesión actual
                </small>
              </span>
            </button>

            <div className="user-menu-footer">
              <span>TAXITECH SOLUTIONS</span>
              <span>SECURE SESSION</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}