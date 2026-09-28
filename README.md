<img width="11520" height="3456" alt="Copia de Banner notebooks" src="https://github.com/user-attachments/assets/1c187a02-2294-4f4b-ba84-63766c051a15" />

# 🚕 TaxiTech Solutions — Sistema de Taxímetro Digital

> **Proyecto:** `TTX-247` — Modernización del sistema de facturación en flota
> **Cliente:** TaxiTech Solutions S.L.
> **Tipo:** Prototipo funcional de taxímetro digital

---

## 📌 Descripción

**TaxiTech Solutions** es un prototipo funcional de taxímetro digital desarrollado durante el proyecto práctico de **Factoría F5**.

El objetivo del proyecto es trasladar la lógica de un taxímetro físico a una aplicación software capaz de gestionar carreras, calcular el importe en tiempo real y almacenar el historial de operaciones.

La aplicación combina un **backend desarrollado en Python**, una **API REST**, una **base de datos MySQL** y una **interfaz web interactiva con simulación 3D**.

El backend mantiene la lógica principal del taxímetro y actúa como fuente de verdad para el estado de la carrera, los tiempos, las tarifas y los importes.

---

## 🚕 Funcionamiento

El sistema utiliza dos tarifas dependiendo del estado del vehículo:

| Estado del vehículo          |           Tarifa |
| ---------------------------- | ---------------: |
| Parado o velocidad < 20 km/h | `0.02 €/segundo` |
| En movimiento                | `0.05 €/segundo` |

El importe se calcula en función del tiempo acumulado en cada estado.

El flujo principal de la aplicación es:

```text
LOGIN
  ↓
SIMULADOR 3D
  ↓
START
  ↓
PARADO ↔ MOVIMIENTO
  ↓
FINISH
  ↓
CARRERA FINALIZADA
  ↓
CARRERA GUARDADA
  ↓
HISTORIAL
```

---

# ✨ Funcionalidades

## 🔐 Autenticación

El acceso a la aplicación está protegido mediante autenticación.

Incluye:

* Login mediante usuario y contraseña.
* Gestión de sesión.
* Logout.
* Consulta del usuario autenticado.
* Roles de usuario.
* Contraseñas almacenadas mediante `bcrypt`.
* Protección del acceso al simulador.

### Credenciales de demo

```text
Usuario: admin
Contraseña: 12345
Rol: admin
```

> Estas credenciales están destinadas exclusivamente a la demostración del prototipo.

---

## 🚖 Simulador 3D

La interfaz principal incluye un simulador de taxi desarrollado con:

* React
* Next.js
* TypeScript
* Three.js
* React Three Fiber
* Drei

El usuario puede interactuar con el vehículo dentro de un entorno 3D y controlar el flujo de una carrera.

La interfaz incluye:

* Vehículo 3D.
* Entorno urbano.
* Cámara siguiendo al vehículo.
* Controles de conducción.
* Taxímetro visual.
* Estado actual de la carrera.
* Secuencia visual de finalización.
* Pantalla de carga durante la inicialización del entorno.
* Menú de usuario.
* Acceso al historial.

---

## 💰 Taxímetro en tiempo real

La lógica de cálculo se encuentra en el backend.

El sistema controla:

* Inicio de la carrera.
* Estado del vehículo.
* Tiempo detenido.
* Tiempo en movimiento.
* Tarifa aplicada.
* Importe acumulado.
* Importe final.
* Finalización de la carrera.

El frontend se encarga de la interacción y representación visual, mientras que el backend mantiene el estado y las reglas de negocio.

---

## 📋 Historial de carreras

Las carreras finalizadas se almacenan de forma persistente en MySQL.

El historial permite consultar:

* ID de carrera.
* Fecha y hora.
* Duración.
* Tiempo detenido.
* Tiempo en movimiento.
* Coste del tiempo detenido.
* Coste del tiempo en movimiento.
* Importe total.

La interfaz del historial incluye:

* Resumen de carreras.
* Importe acumulado.
* Tabla de registros.
* Ordenación de carreras.
* Estados de carga.
* Estado vacío.
* Gestión de errores.
* Detalle de cada carrera.

---

# 🏗️ Arquitectura

El proyecto está dividido principalmente en un frontend y un backend comunicados mediante una API REST.

```text
┌──────────────────────────────────────────────┐
│                  FRONTEND                    │
│                                              │
│     Next.js + React + TypeScript             │
│              Three.js                        │
│                                              │
│  Login                                       │
│  Simulador 3D                                │
│  Taxímetro                                   │
│  Historial                                   │
│  Menú de usuario                             │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / REST
                       ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                     │
│                                              │
│                 FastAPI                      │
│                                              │
│  Application                                 │
│  Domain                                      │
│  Infrastructure                              │
│  API                                         │
│  Authentication                              │
└──────────────────────┬───────────────────────┘
                       │
                       │ MySQL
                       ▼
┌──────────────────────────────────────────────┐
│                  DATABASE                    │
│                                              │
│  users                                       │
│  rides                                       │
└──────────────────────────────────────────────┘
```

---

# 🧩 Backend

El backend está desarrollado con **Python** y **FastAPI**.

La estructura separa las responsabilidades principales de la aplicación:

```text
backend/
├── application/
├── domain/
│   ├── ride/
│   ├── state/
│   ├── taxi/
│   └── taximeter/
├── infrastructure/
├── interfaces/
│   └── api/
└── tests/
```

Esta organización permite separar:

* Reglas de negocio.
* Entidades del dominio.
* Persistencia.
* API.
* Autenticación.
* Tests.

La lógica del taxímetro permanece desacoplada de la interfaz gráfica.

---

# 🌐 API REST

El backend expone una API REST utilizada por el frontend.

Las operaciones principales permiten:

* Iniciar una carrera.
* Cambiar el estado del vehículo.
* Finalizar una carrera.
* Consultar el estado actual.
* Consultar la carrera actual.
* Consultar el historial.
* Iniciar sesión.
* Consultar la sesión actual.
* Cerrar sesión.

La API permite que la lógica de negocio pueda ser utilizada posteriormente por otros clientes, como aplicaciones móviles o interfaces para tablets.

---

# 🗄️ Base de datos

La persistencia utiliza **MySQL 8.4**.

Las principales tablas son:

```text
users
rides
```

### `users`

Almacena:

* Usuario.
* Hash de contraseña.
* Rol.
* Fecha de creación.

### `rides`

Almacena:

* ID de carrera.
* Fecha y hora de inicio.
* Fecha y hora de finalización.
* Tiempo detenido.
* Tiempo en movimiento.
* Coste del tiempo detenido.
* Coste del tiempo en movimiento.
* Importe total.

La información se mantiene mediante un volumen persistente de Docker, por lo que los datos sobreviven al reinicio de los contenedores.

---

# 🔐 Seguridad

Las contraseñas no se almacenan en texto plano.

El sistema utiliza `bcrypt` para generar un hash antes de guardar las credenciales en la base de datos.

La configuración sensible de infraestructura se gestiona mediante variables de entorno y archivos que no forman parte del repositorio.

---

# 🐳 Docker

El proyecto incluye Docker Compose para ejecutar los principales servicios de la aplicación:

```text
Docker Compose
│
├── MySQL 8.4
│
├── FastAPI
│
└── Next.js
```

El objetivo es poder levantar el entorno completo sin tener que configurar manualmente cada servicio.

## 🚀 Ejecutar el proyecto

Requisitos:

* Docker Desktop
* Git

Crear un archivo `.env` en la raíz del proyecto:

```env
MYSQL_PASSWORD=tu_password
```

Iniciar la aplicación:

```bash
docker compose up --build
```

Una vez iniciados los servicios:

```text
Frontend: localhost:3000
Backend:  localhost:8000
API Docs: localhost:8000/docs
```

Para detener los servicios:

```bash
docker compose down
```

Los datos de MySQL se almacenan en un volumen Docker persistente.

---

# 🧪 Tests

El backend cuenta con una suite automatizada de tests utilizando `unittest`.

Para ejecutarlos:

```bash
python -m unittest discover -s backend/tests
```

Estado actual de la suite:

```text
Ran 74 tests
OK
```

Los tests cubren diferentes componentes de la aplicación, incluyendo:

* Lógica del taxímetro.
* Estados.
* Tarifas.
* Carreras.
* Persistencia.
* API.
* Autenticación.
* Casos de error.

---

# 📁 Estructura del proyecto

```text
project-py-taximetro/
│
├── backend/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── interfaces/
│   └── tests/
│
├── frontend/
│   ├── app/
│   ├── components/
│   │   ├── 3d/
│   │   ├── auth/
│   │   └── ...
│   ├── hooks/
│   ├── lib/
│   └── public/
│
├── docker/
│   └── mysql/
│       └── init.sql
│
├── scripts/
│   └── create_admin.py
│
├── docker-compose.yml
├── requirements.txt
├── .dockerignore
└── README.md
```

---

# 🛠️ Stack tecnológico

### Backend

* Python 3.13
* FastAPI
* Uvicorn
* MySQL Connector
* bcrypt
* python-dotenv
* unittest

### Frontend

* Next.js
* React
* TypeScript
* Three.js
* React Three Fiber
* Drei
* CSS

### Base de datos

* MySQL 8.4

### Infraestructura

* Docker
* Docker Compose

### Control de versiones

* Git
* GitHub

---

# 🔄 Flujo de una carrera

Una carrera típica sigue el siguiente proceso:

```text
1. El usuario inicia sesión
        ↓
2. Se carga el simulador 3D
        ↓
3. Se inicia la carrera
        ↓
4. El taxi permanece detenido o comienza a moverse
        ↓
5. El taxímetro calcula el importe según el estado
        ↓
6. El usuario finaliza la carrera
        ↓
7. El backend calcula y registra el resultado
        ↓
8. La carrera se almacena en MySQL
        ↓
9. Se muestra la secuencia de finalización
        ↓
10. El sistema queda preparado para una nueva carrera
```

---

# 🎯 Objetivo del proyecto

El proyecto demuestra cómo trasladar la lógica de un taxímetro tradicional a una aplicación software moderna manteniendo separadas la lógica de negocio, la persistencia y la interfaz de usuario.

La solución combina:

* Cálculo de tarifas.
* Gestión de estados.
* Persistencia relacional.
* API REST.
* Autenticación.
* Interfaz web.
* Simulación 3D.
* Testing automatizado.
* Containerización.

La arquitectura permite continuar evolucionando el sistema sin acoplar la lógica del taxímetro a un único cliente.

---

# 🚀 Posibles mejoras futuras

Algunas posibles líneas de evolución del prototipo son:

* Gestión avanzada de usuarios y permisos.
* Cambio de contraseña desde la interfaz.
* Gestión de múltiples vehículos.
* Panel avanzado para responsables de flota.
* Estadísticas y métricas de operación.
* Aplicación específica para dispositivos móviles o tablets.
* Gestión administrativa avanzada del historial.
* Despliegue en infraestructura cloud.

---

# 👨‍💻 Proyecto

**TaxiTech Solutions — TTX-247**

Proyecto práctico desarrollado durante el programa de formación de **Factoría F5**.

El desarrollo utiliza Git y GitHub para el control de versiones y una arquitectura orientada a separar la lógica de negocio, la API, la persistencia y la interfaz de usuario.
