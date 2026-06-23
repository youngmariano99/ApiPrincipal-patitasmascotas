# Patitas en Alerta - Portal de Mascotas (API Principal)

Este repositorio contiene la aplicación de gestión y reporte de mascotas. La API cuenta con autenticación basada en tokens JWT, control de acceso por roles (Vecino, Administrador de Zoonosis, Veterinario), y el ABM (CRUD) completo de mascotas, libretas sanitarias e historial médico.

## Estructura del proyecto

*   `/backend`: API hecha en Spring Boot (corre en el puerto `8080`).
*   `/frontend`: Interfaz web hecha con React + Vite + TypeScript (corre en el puerto `5173`).

---

## Requisitos previos

*   **Java 21** o superior.
*   **Node.js** (v18+) y npm.
*   **PostgreSQL** (con la extensión **PostGIS** instalada).

---

## Paso a paso para levantar el proyecto

### 1. Configurar la Base de Datos
1. Crear una base de datos en PostgreSQL con el nombre `patitas_en_alerta`.
2. Habilitar la extensión espacial **PostGIS** ejecutando el siguiente query:
   ```sql
   CREATE EXTENSION postgis;
   ```
3. Ejecutar el script SQL de creación de tablas e inserción de datos de prueba. Podés encontrar la estructura base en el archivo SQL del proyecto (o levantar directamente y dejar que las tablas se actualicen solas a través de Hibernate).
4. El backend lee las variables de entorno de la base de datos. Asegurate de configurar tu archivo `.env` en la raíz de `/backend` (podés basarte en `.env.example`) con tus credenciales locales:
   ```env
   DB_URL=jdbc:postgresql://localhost:5122/patitas_en_alerta
   DB_USER=postgres
   DB_PASS=tu_contraseña
   JWT_SECRET=tu_clave_secreta_para_firmar_tokens_jwt_de_al_menos_256_bits
   ```

### 2. Ejecutar el Backend (Spring Boot)
1. Abrir la terminal e ir a la carpeta de backend:
   ```bash
   cd backend
   ```
2. Ejecutar con el wrapper de Maven:
   *   En Windows (PowerShell/CMD):
       ```bash
       .\mvnw.cmd spring-boot:run
       ```
   *   En Linux/Mac:
       ```bash
       ./mvnw spring-boot:run
       ```
3. El backend va a quedar escuchando en: `http://localhost:8080`.
4. Podés ver y probar la API en la documentación de Swagger: `http://localhost:8080/swagger-ui.html`.

### 3. Ejecutar el Frontend (React)
1. Abrir otra terminal e ir a la carpeta de frontend:
   ```bash
   cd frontend
   ```
2. Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Iniciar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: `http://localhost:5173`.

---

## Cuentas de Prueba creadas por defecto (Contraseña: 123)

*   **Administrador de Zoonosis:** `admin@zoonosis.com`
*   **Vecino:** `vecino@gmail.com`
*   **Veterinario:** `vet@clinic.com`
