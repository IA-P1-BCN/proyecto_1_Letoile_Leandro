"use client";

import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      window.location.reload();
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-grid" />
      <div className="login-background-glow login-background-glow-one" />
      <div className="login-background-glow login-background-glow-two" />

      <section className="login-layout">
        <div className="login-intro">
          <div className="login-brand">
            <span className="login-brand-mark">TT</span>

            <div>
              <div className="login-brand-name">
                TaxiTech
              </div>

              <div className="login-brand-subtitle">
                Solutions
              </div>
            </div>
          </div>

          <div className="login-system-status">
            <span className="login-status-dot" />
            Sistema operativo
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">
              TTX-247 · SIMULACIÓN 3D
            </span>

            <h1>
              Bienvenido a la
              <span> simulación 3D</span>
            </h1>

            <p>
              Experimenta el funcionamiento de un
              taxímetro digital dentro de un entorno
              interactivo 3D.
            </p>

            <p className="login-description">
              Accede para explorar el entorno virtual,
              controlar el vehículo y experimentar el
              funcionamiento del taxímetro en tiempo real.
            </p>
          </div>

          <div className="login-features">
            <div className="login-feature">
              <span className="login-feature-icon">◈</span>

              <div>
                <strong>Entorno interactivo</strong>
                <span>Simulación 3D en tiempo real</span>
              </div>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">◉</span>

              <div>
                <strong>Taxímetro digital</strong>
                <span>Cálculo de tarifa en tiempo real</span>
              </div>
            </div>
          </div>
        </div>

        <section className="login-card">
          <div className="login-card-header">
            <span className="login-card-label">
              ACCESO AL SIMULADOR
            </span>

            <h2>Iniciar sesión</h2>

            <p>
              Introduce tus credenciales para acceder al
              entorno TaxiTech.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username">
                Usuario
              </label>

              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  ◉
                </span>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Introduce tu usuario"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">
                Contraseña
              </label>

              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  ◇
                </span>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Introduce tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "ACCEDIENDO..."
                  : "ACCEDER AL SIMULADOR"}
              </span>

              {!loading && (
                <span className="login-submit-arrow">
                  →
                </span>
              )}
            </button>
          </form>

          <div className="login-card-footer">
            <span className="login-footer-line" />

            <span>
              TTX-247 · Sistema de simulación
            </span>

            <span className="login-footer-line" />
          </div>
        </section>
      </section>
    </main>
  );
}