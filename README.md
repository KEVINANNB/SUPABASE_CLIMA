# Backend histórico para variables de clima (Supabase)

Aplicación React + Vite que consume datos históricos de una estación
meteorológica IoT (temperatura, presión y humedad) almacenados en una
tabla de **Supabase** (`datos_sensor`), y los muestra en un dashboard
con la lectura más reciente y el historial de lecturas.

<img width="1307" height="628" alt="image" src="https://github.com/user-attachments/assets/4ddd72d5-ee26-409e-8ba1-9a1ff55d8d2c" />


## Arquitectura

```
Dispositivo IoT (ESP32 simulado en Wokwi)
        │  HTTP POST (API REST de Supabase)
        ▼
Tabla "datos_sensor" en Supabase (PostgreSQL en la nube)
        │  HTTP GET (API REST de Supabase)
        ▼
Dashboard React (este repositorio) → visualización actual + histórica
```

## Estructura del proyecto

```
├── db/
│   └── datos_sensor_supabase_100_registros.sql   # script de creación + datos de ejemplo
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── supabase.js        # petición REST a Supabase (fetch)
│   ├── components/
│   │   └── WeatherCards.jsx   # tarjetas con la lectura más reciente
│   ├── pages/
│   │   └── Dashboard.jsx      # página principal (estado + tabla histórica)
│   ├── App.jsx                # enrutamiento con react-router-dom
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## 1. Base de datos en Supabase

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** → **New query** y pega el contenido de
   [`db/datos_sensor_supabase_100_registros.sql`](./db/datos_sensor_supabase_100_registros.sql).
   Esto crea la tabla `datos_sensor`, las políticas de RLS y carga 100
   lecturas de ejemplo.
3. Ejecuta el script (▶ Run).

La tabla queda así:

| columna     | tipo         | descripción                       |
|-------------|--------------|------------------------------------|
| id          | bigint       | identificador autoincremental      |
| created_at  | timestamptz  | fecha/hora de la lectura           |
| temp        | numeric(5,2) | temperatura en °C                  |
| presion     | numeric(7,2) | presión atmosférica en hPa         |
| humedad     | numeric(5,2) | humedad relativa en %              |
| id_sensor   | smallint     | identificador del sensor/dispositivo |

## 2. Dispositivo IoT (Wokwi + ESP32)

El circuito simulado en [Wokwi](https://wokwi.com) se conecta a internet
con la red **Wokwi-GUEST** y envía cada lectura mediante una petición
`POST` a la API REST de Supabase:

```
POST https://<tu-proyecto>.supabase.co/rest/v1/datos_sensor
Headers:
  apikey: <tu-anon-key>
  Authorization: Bearer <tu-anon-key>
  Content-Type: application/json
Body:
  { "temp": 24.5, "presion": 1013.2, "humedad": 70.1, "id_sensor": 1 }
```

## 3. Configurar y correr el dashboard

```bash
# 1. instalar dependencias
npm install

# 2. crear el archivo .env a partir del ejemplo
cp .env.example .env
# y completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
# (Supabase > Project Settings > API)

# 3. iniciar en modo desarrollo
npm run dev
```

Abre `http://localhost:5173` — deberías ver la tarjeta con la última
lectura y la tabla con el historial.

## Scripts disponibles

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (carpeta `dist/`)
- `npm run preview` — previsualiza el build de producción

## Notas

- Si el dashboard no muestra datos, revisa que la tabla `datos_sensor`
  exista en Supabase y tenga registros, y que las variables de entorno
  en `.env` sean correctas.
- Recuerda reiniciar `npm run dev` cada vez que edites `.env`.
- El archivo `.env` **no se sube a GitHub** (está en `.gitignore`); solo
  se sube `.env.example` como plantilla.
