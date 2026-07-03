-- ============================================================
-- PORTAL DE CLIENTES · Esquema de base de datos para Supabase
-- Pega todo este archivo en SQL Editor y presiona Run.
-- ============================================================

-- Perfil de cada cliente (vinculado a su usuario de acceso)
create table if not exists public.clientes (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  contacto text,
  nivel text default 'Cliente',
  creado_en timestamptz default now()
);

-- Catálogos (PDF en el bucket privado "archivos")
create table if not exists public.catalogos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  paginas int,
  ruta_archivo text not null,          -- nombre del archivo en Storage
  visible_para uuid[] default '{}',    -- vacío = visible para todos
  creado_en timestamptz default now()
);

-- Productos disponibles para cotizar
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  codigo text,
  categoria text,
  activo boolean default true,
  creado_en timestamptz default now()
);

-- Fotos (imágenes en el bucket público "fotos")
create table if not exists public.fotos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  ruta_archivo text not null,
  visible_para uuid[] default '{}',
  creado_en timestamptz default now()
);

-- Documentos descargables (bucket privado "archivos")
create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text default 'PDF',
  ruta_archivo text not null,
  visible_para uuid[] default '{}',
  creado_en timestamptz default now()
);

-- Solicitudes de cotización enviadas por los clientes
create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) not null,
  items jsonb not null,                -- [{producto, codigo, cantidad}]
  notas text,
  estado text default 'pendiente',
  creado_en timestamptz default now()
);

-- ============================================================
-- SEGURIDAD (RLS): cada cliente solo ve lo que le corresponde
-- ============================================================

alter table public.clientes     enable row level security;
alter table public.catalogos    enable row level security;
alter table public.productos    enable row level security;
alter table public.fotos        enable row level security;
alter table public.documentos   enable row level security;
alter table public.cotizaciones enable row level security;

-- Cada cliente puede leer únicamente su propio perfil
create policy "leer mi perfil" on public.clientes
  for select using (auth.uid() = id);

-- Contenido: visible si la lista está vacía (todos) o si incluye al cliente
create policy "ver catalogos" on public.catalogos
  for select using (
    auth.role() = 'authenticated'
    and (visible_para = '{}' or auth.uid() = any(visible_para))
  );

create policy "ver productos" on public.productos
  for select using (auth.role() = 'authenticated' and activo);

create policy "ver fotos" on public.fotos
  for select using (
    auth.role() = 'authenticated'
    and (visible_para = '{}' or auth.uid() = any(visible_para))
  );

create policy "ver documentos" on public.documentos
  for select using (
    auth.role() = 'authenticated'
    and (visible_para = '{}' or auth.uid() = any(visible_para))
  );

-- Cotizaciones: el cliente crea las suyas y solo ve las suyas
create policy "crear mi cotizacion" on public.cotizaciones
  for insert with check (auth.uid() = cliente_id);

create policy "ver mis cotizaciones" on public.cotizaciones
  for select using (auth.uid() = cliente_id);

-- ============================================================
-- STORAGE: permitir a clientes autenticados descargar archivos
-- (ejecutar DESPUÉS de crear los buckets "archivos" y "fotos")
-- ============================================================

create policy "descargar archivos autenticado" on storage.objects
  for select using (
    bucket_id = 'archivos' and auth.role() = 'authenticated'
  );
