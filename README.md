# Training App

Aplicación móvil para entrenadores y sus clientes.

- **Instructor:** crea rutinas, las asigna con calendario y da seguimiento a la asistencia, el progreso físico y las carreras de cada cliente.
- **Cliente:** ve su rutina, marca ejercicios, registra su asistencia, corre con mapa y mide su avance.

Proyecto final de la materia **Aplicaciones Móviles** (7.º semestre).

El repositorio tiene dos proyectos:

| Carpeta | Qué es | Tecnologías |
|---|---|---|
| [`training-app-backend`](./training-app-backend) | API REST | NestJS, Prisma, PostgreSQL, JWT |
| [`training-app-mobile`](./training-app-mobile) | App móvil | Expo SDK 58, Expo Router, React Native Paper, TypeScript |

## Funcionalidades

**Instructor**
- Registro e inicio de sesión con correo y contraseña.
- Crear clientes (la app genera un código de 6 caracteres) y activarlos o desactivarlos.
- Crear, editar y eliminar plantillas de rutina.
- Asignar plantillas a uno o varios clientes con fecha. Los ejercicios se pueden ajustar para toda la asignación o por cliente.
- Editar o eliminar rutinas ya asignadas.
- Configurar el gimnasio (ubicación con radio y código QR de la entrada) y consultar el historial de asistencia.
- Ver el progreso físico de cada cliente y sus calificaciones de sesión, con el nombre de la rutina calificada.
- Panel de estadísticas por periodo.
- Publicar avisos con notificación push.

**Cliente**
- Inicio de sesión con su código de 6 caracteres.
- Ver sus rutinas (las de hoy y próximas primero), marcar ejercicios y calificar la sesión una vez por rutina.
- Asistencia automática al abrir la app dentro del gimnasio, con respaldo manual por ubicación o por QR.
- Running con mapa en tiempo real, distancia, ritmo e historial.
- Mediciones corporales con gráfica de evolución.
- Avisos del instructor y notificaciones push.
- Modo sin conexión: puede marcar ejercicios sin red y se sincronizan al volver la conexión.

## Arquitectura

```
AM_TrainingApp/
├── training-app-backend/
│   ├── prisma/schema.prisma      Modelos de la base de datos
│   └── src/
│       ├── auth/                 JWT, guards y roles
│       ├── clients/              Clientes del instructor
│       ├── routines/             Rutinas, plantillas y ejercicios
│       ├── attendance/           Asistencia por ubicación y QR
│       ├── running/              Sesiones de carrera y puntos GPS
│       ├── tracking/             Mediciones y calificaciones de sesión
│       ├── announcements/        Avisos del instructor
│       ├── push/                 Notificaciones push
│       ├── stats/                Estadísticas del instructor
│       ├── prisma/               Servicio de Prisma
│       └── common/               Límites de longitud y rango de los datos
└── training-app-mobile/
    └── src/
        ├── app/                  Pantallas (Expo Router: (auth), (instructor), (client))
        ├── features/             Hooks con la lógica de cada área
        ├── components/           Componentes de interfaz
        ├── api/                  Cliente HTTP y funciones tipadas por módulo
        ├── auth/                 Contexto de sesión
        ├── offline/              Cola de sincronización
        ├── theme/                Tema de React Native Paper
        └── utils/                Utilidades de formato y geografía
```

## Requisitos previos

- Node.js (versión LTS reciente) y npm
- PostgreSQL, o Docker para levantarlo en un contenedor
- La app **Expo Go** (versión compatible con SDK 58) en tu teléfono, o un emulador

## Puesta en marcha

### 1. Base de datos

Con Docker:

```bash
docker run --name training_db -e POSTGRES_PASSWORD=tu_contraseña -e POSTGRES_DB=training_app -p 5432:5432 -d postgres:17
```

### 2. Backend

```bash
cd training-app-backend
npm install
```

Crea el archivo `.env` (no se sube a Git):

```env
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/training_app"
JWT_SECRET="un-texto-largo-y-aleatorio"
JWT_EXPIRES_IN="7d"
PORT=3000
```

`JWT_SECRET` es obligatorio. `JWT_EXPIRES_IN` vale `7d` y `PORT` vale `3000` si no los defines.

Genera el cliente de Prisma, crea las tablas e inicia el servidor:

```bash
npx prisma generate
npx prisma db push
npm run start:dev
```

La API queda en `http://localhost:3000`. El proyecto usa `prisma db push` y no tiene carpeta de migraciones.

### 3. App móvil

```bash
cd training-app-mobile
npm install
npx expo start
```

Escanea el QR con Expo Go.

- En desarrollo, la app detecta la IP de tu computadora y se conecta al puerto 3000 del backend. Por eso el teléfono y la computadora deben estar en la misma red.
- Si no conecta, revisa que el firewall permita el puerto 3000.

Para apuntar a otro backend, crea `training-app-mobile/.env`:

```env
EXPO_PUBLIC_API_URL=https://tu-backend.example.com
```

- Esa variable se usa en una actualización publicada, en un build propio y en desarrollo con `npx expo start --tunnel`.
- Debe incluir `https://`. Un valor como `localhost:3000` no funciona en el teléfono.

### 4. Primer uso

1. En la app, entra a **Instructor** y usa el enlace de registro para crear tu cuenta.
2. Crea un cliente: la app muestra su código de 6 caracteres.
3. Cierra sesión, entra a la pestaña **Cliente** y escribe ese código.

## Despliegue

### Backend

El backend se puede publicar en cualquier servicio que ejecute Node, con una base PostgreSQL en la nube.

- **Variables de entorno:** `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
- **Build:** `npm install && npx prisma generate && npm run build`
- **Inicio:** `npm run start:prod`
- Crea las tablas una vez con `npx prisma db push`, apuntando a la base de producción. Solo hay que repetirlo cuando cambia `schema.prisma`.

### App

1. Pon la URL pública del backend en `EXPO_PUBLIC_API_URL`, dentro de `training-app-mobile/.env`.
2. Publica la actualización en el canal del build instalado:

   ```bash
   npx eas-cli@latest update --channel preview --message "Descripción del cambio"
   ```

   - Usa `--channel production` si el build es de producción.
   - No uses `--auto`: publica en una rama con el nombre de la rama de Git (`main`), y los builds escuchan los canales `preview` y `production`.

`eas update` solo actualiza el código JavaScript. Si agregas una librería con código nativo o cambias de SDK, necesitas un build nuevo. Por ejemplo, para generar un APK de Android:

```bash
npx eas-cli@latest build -p android --profile preview
```

## API

Todas las rutas, salvo el registro y el inicio de sesión, requieren `Authorization: Bearer <token>`.

| Módulo | Rutas |
|---|---|
| Auth | `POST /auth/instructor/register`, `POST /auth/instructor/login`, `POST /auth/client/login` |
| Clientes | `POST /clients`, `GET /clients`, `PATCH /clients/:id/activate`, `PATCH /clients/:id/deactivate` |
| Rutinas | `POST /routines`, `GET /routines`, `GET /routines/me`, `PATCH /routines/:id`, `DELETE /routines/:id`, `POST /routines/:id/assign`, `PATCH /routines/exercises/:exerciseId/completed` |
| Asistencia | `GET /attendance/gym`, `POST /attendance/gym-location`, `POST /attendance/gym-qr`, `POST /attendance/checkin/geo`, `POST /attendance/checkin/qr`, `GET /attendance/calendar` |
| Running | `POST /running/start`, `POST /running/:id/points`, `POST /running/:id/finish`, `GET /running`, `GET /running/:id` |
| Progreso | `POST /measurements`, `GET /measurements/me`, `GET /clients/:clientId/measurements` |
| Calificaciones | `POST /session-ratings`, `GET /session-ratings/me`, `GET /clients/:clientId/session-ratings` |
| Avisos y push | `POST /push-token`, `POST /announcements`, `GET /announcements`, `GET /announcements/me` |
| Estadísticas | `GET /stats/dashboard` |

### Límites de los datos

Los máximos están en [`src/common/limits.ts`](./training-app-backend/src/common/limits.ts). La app tiene una copia en [`src/features/forms/limits.ts`](./training-app-mobile/src/features/forms/limits.ts) para limitar los inputs. Si cambias un valor, cámbialo en ambos.

| Dato | Máximo |
|---|---|
| Nombre de instructor o cliente | 60 caracteres |
| Correo | 254 caracteres |
| Contraseña | 72 bytes (límite de bcrypt) |
| Título de rutina | 60 caracteres |
| Nombre de ejercicio | 50 caracteres |
| Ejercicios por rutina | 30 |
| Series / repeticiones | 20 / 100 |
| Título / mensaje de aviso | 80 / 1000 caracteres |
| Nota de calificación | 500 caracteres |
| Peso / medidas corporales | 400 kg / 300 cm |
| Radio del gimnasio | de 10 a 1000 m |
| Puntos de carrera por petición | 1000 (la app los envía en partes) |

## Decisiones de diseño

- **Roles y acceso:** el instructor entra con correo y contraseña. El cliente entra solo con un código de 6 caracteres. La estrategia JWT consulta la base en cada petición, así que un cliente desactivado pierde el acceso de inmediato.
- **Asistencia:** una por día. Por ubicación se valida que el cliente esté dentro del radio configurado. Por QR se compara con el código del gimnasio.
- **Primer plano:** el running y la asistencia automática funcionan con la app abierta. El segundo plano exigiría un build propio y el permiso de ubicación "Siempre".
- **Modo sin conexión (cliente):** la cola guarda el último estado de cada ejercicio marcado. Sincroniza al recuperar la red, al volver a la app y cada 15 segundos. Si se marcan ejercicios mientras hay un envío en curso, se envían en cuanto termina.
- **Sin conexión (instructor):** las pantallas muestran "Sin conexión con el servidor" con un botón **Reintentar**, en lugar de una lista vacía.
- **Gráficas:** se dibujan con `react-native-svg`, sin una librería de gráficas.
- **Estilos:** `StyleSheet.create` con colores tomados del tema de React Native Paper.
