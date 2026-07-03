# Portal de Clientes — Guía de puesta en marcha

Este proyecto es tu portal de clientes real: inicio de sesión individual por cliente,
catálogos, galería de fotos, documentos descargables y solicitudes de cotización.

Usa dos servicios (ambos con plan gratuito suficiente para empezar):

- **Supabase** → cuentas de clientes, base de datos y almacenamiento de archivos.
- **Vercel** → publica el portal en internet.

Tiempo estimado de puesta en marcha: 1 a 2 horas la primera vez.

---

## PASO 1 — Crear tu proyecto en Supabase

1. Entra a https://supabase.com y crea una cuenta gratuita.
2. Crea un proyecto nuevo (elige la región más cercana, ej. `East US`).
3. Guarda bien la contraseña de la base de datos que te pide (no la vas a compartir con nadie).

## PASO 2 — Crear las tablas y permisos

1. En el panel de Supabase, ve a **SQL Editor**.
2. Abre el archivo `supabase/schema.sql` de este proyecto, copia TODO su contenido,
   pégalo en el editor y presiona **Run**.
3. Eso crea las tablas: `clientes`, `catalogos`, `productos`, `fotos`, `documentos`
   y `cotizaciones`, con reglas de seguridad para que cada cliente solo vea lo que debe.

## PASO 3 — Crear los espacios de archivos (Storage)

1. En el panel de Supabase, ve a **Storage** → **New bucket**.
2. Crea un bucket llamado `archivos` (privado, NO marques "public").
   Aquí subirás los PDF de catálogos y documentos.
3. Crea otro bucket llamado `fotos` y este SÍ márcalo como **public**.
   Aquí subirás las fotos de productos.
4. Para el bucket `archivos`, ve a **Policies** y agrega una política que permita
   `SELECT` a usuarios autenticados (el schema.sql ya incluye estas políticas,
   pero verifica que aparezcan).

## PASO 4 — Conectar el código con tu Supabase

1. En Supabase ve a **Project Settings → API** y copia dos valores:
   - `Project URL`
   - `anon public key`
2. En este proyecto, copia el archivo `.env.example` y renómbralo a `.env`.
3. Pega ahí tus dos valores. La clave "anon" está diseñada para usarse en el
   navegador, no es un secreto crítico, pero nunca uses la clave "service_role" aquí.

## PASO 5 — Probarlo en tu computadora

Necesitas tener Node.js instalado (https://nodejs.org, versión LTS).

```bash
npm install
npm run dev
```

Abre http://localhost:5173 y deberías ver la pantalla de inicio de sesión.

## PASO 6 — Crear cuentas para tus clientes

Así le das acceso individual a cada cliente:

1. En Supabase, ve a **Authentication → Users → Add user → Create new user**.
2. Escribe el correo del cliente y una contraseña temporal. Marca "Auto Confirm User".
3. Copia el **UUID** del usuario recién creado.
4. Ve a **Table Editor → clientes → Insert row** y llena:
   - `id`: pega el UUID del usuario
   - `nombre`: nombre de la empresa cliente (ej. "Ferretería El Tornillo")
   - `contacto`: nombre de la persona
   - `nivel`: ej. "Cliente Mayorista"
5. Entrégale al cliente su correo y contraseña temporal por un canal seguro
   (llamada o en persona; evita mandar contraseñas por mensaje escrito).

## PASO 7 — Subir tu contenido

**Catálogos y documentos (PDF):**
1. Storage → bucket `archivos` → sube el PDF (ej. `catalogo-general-2026.pdf`).
2. Table Editor → `catalogos` (o `documentos`) → Insert row → llena título,
   descripción y en `ruta_archivo` escribe el nombre exacto del archivo subido.

**Fotos:**
1. Storage → bucket `fotos` → sube la imagen.
2. Table Editor → `fotos` → Insert row → título y en `ruta_archivo` el nombre del archivo.

**Productos (para cotizaciones):**
1. Table Editor → `productos` → Insert row → nombre, código y categoría.

**Ver cotizaciones recibidas:**
Table Editor → `cotizaciones`. Cada fila muestra el cliente, los productos con
cantidades y las notas. (Más adelante se puede conectar un aviso por correo.)

## PASO 8 — Publicarlo en internet con Vercel

1. Sube este proyecto a un repositorio en https://github.com (puede ser privado).
2. Entra a https://vercel.com, crea cuenta con tu GitHub e importa el repositorio.
3. En la configuración del proyecto en Vercel, agrega las dos variables de entorno
   (las mismas del archivo `.env`): `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Presiona **Deploy**. En un par de minutos tendrás una dirección tipo
   `tuportal.vercel.app`. Puedes conectar tu propio dominio en Settings → Domains.

---

## Preguntas frecuentes

**¿Cuánto cuesta mantenerlo?**
Con pocos clientes: $0. Los planes gratuitos de Supabase y Vercel alcanzan de sobra
para empezar. Si creces mucho, el siguiente nivel ronda los $25/mes.

**¿Cómo cambio los colores o el logo?**
En `src/App.jsx`, al inicio, está el objeto `S` con los colores y el componente
`Marca` con el nombre de la empresa.

**¿Un cliente olvidó su contraseña?**
En Supabase → Authentication → Users → busca al usuario → "Send password recovery"
o asígnale una nueva manualmente.

**¿Puedo mostrar contenido distinto a cada cliente?**
Sí. Las tablas tienen una columna `visible_para` (lista de IDs de clientes).
Si está vacía, el contenido es visible para todos; si tiene IDs, solo esos
clientes lo ven.
