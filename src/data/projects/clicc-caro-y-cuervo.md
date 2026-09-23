---
title: "CLICC - Plataforma de Análisis de Corpus Lingüísticos"
description: "Plataforma integral para la gestión, tokenización y análisis de corpus lingüísticos con soporte para KWIC, concordancias y múltiples formatos."
date: 2025-05-15
tags: []
techIcons: [Nextdotjs, Nestjs, Typescript, Mongodb, React, Tailwindcss]
repo: ""
featured: true
---

## Descripción

[**CLICC**](https://clicc.caroycuervo.gov.co/) es una plataforma de software para la gestión, procesamiento y análisis de corpus lingüísticos desarrollada para el [Instituto Caro y Cuervo](https://www.caroycuervo.gov.co/). Permite a investigadores subir textos, tokenizarlos automáticamente, buscar palabras clave y generar concordancias ( KWIC - Key Word In Context) sobre uno o múltiples corpus de forma simultanea.

El sistema procesa textos en tres formatos de entrada (texto plano, CoNLL-U y TEI XML), almacena los tokens con anotaciones lingüísticas completas (lema, POS, dependencias) y ofrece una interfaz web moderna para realizar búsquedas avanzadas con contexto configurable.
![alt text](../../assets/projects/clicc-caro-y-cuervo/scr_clicc_kwic.png)
*Sistema de busqueda de concordancias.*
![alt text](../../assets/projects/clicc-caro-y-cuervo/scr_clicc_src_alineacion.png)
*Sistema de archivos multimedia alineados.*
## Tecnologías

- **Next.js 15** (frontend)
- **NestJS** (backend API)
- **React 19** + **MUI** (interfaz de usuario)
- **MongoDB** (almacenamiento)
- **FFmpeg** (conversion de videos)
- **TipTap** (editor de texto enriquecido)
- **Zustand** (gestión de estado)
- **TypeScript** + **Zod** (validación)
- **Tailwind CSS** + **Emotion** (estilos)

## Lo que hice

- Desarrollé el **frontend completo en Next.js 15 (App Router)**: layouts anidados, autenticación con JWT, registro de usuarios y flujo de confirmación por email
- Implementé el **dashboard de corpus** con tabla virtualizada (renderiza solo las filas visibles para soportar miles de registros), subida de archivos y metadatos geográficos en GeoJSON
- Construí la interfaz de **búsqueda de concordancias (KWIC - Key Word In Context)**: muestra cada aparición de la palabra buscada junto a N tokens de contexto a izquierda y derecha, con paginación y resultados combinados de varios corpus
- Implementé el **pipeline de tokenización** con una estrategia por formato de entrada: texto plano (tokenizado con UDPipe en el servidor), CoNLL-U (importación directa de tokens y anotaciones) y TEI XML (parseo preservando anotaciones)
- Desarrollé el **backend NestJS** con arquitectura modular por dominio: corpus, archivos, tokens, autenticación, usuarios, idiomas, localización y correo
- Desarrollé un **microservicio de email** independiente (Express + MongoDB como cola de trabajos) con worker asíncrono, reintentos con backoff, lease `lockedUntil` para evitar envíos duplicados y SMTP por Office 365
- Optimicé el acceso a datos en MongoDB con índices compuestos para las consultas de concordancias y escrituras masivas (`insertMany`) en lotes de 10.000 tokens para cargar corpus grandes sin agotar memoria
- Integré **FFmpeg** para convertir videos MOV a MP4 en el servidor, con diálogo de confirmación al usuario antes de procesar
- Configuré el despliegue en producción con PM2 + Nginx (HTTPS, reverse proxy y secretos inyectados como variables de entorno en build)
- Implementé scripts ETL para migrar datos legacy (MySQL → MongoDB) de corpus, speakers y archivos
- Agregué tests unitarios con Vitest en el backend y Testing Library en el frontend

## Arquitectura

```
clicc-25/          (Frontend - Next.js)
  └── src/
      ├── app/      (rutas: auth, corpus, home, KWIC, concordancias)
      ├── components/(interfaz reusable, tablas, formularios)
      ├── services/ (cliente API, tokenización)
      ├── stores/   (estado global con Zustand)
      └── hooks/    (hooks personalizados)

clicc-backend/     (Backend - NestJS)
  └── src/
      ├── tokenization/ (KWIC, concordancias, procesamiento de archivos)
      ├── corpus/       (gestión de corpus y archivos)
      ├── auth/         (JWT, registro, confirmación de email)
      ├── user/         (CRUD de usuarios)
      ├── speaker/      (gestión de oradores)
      ├── location/     (ubicaciones geográficas)
      └── files/        (subida y conversión de archivos)
```

## Caso técnico backend

> Código privado del Instituto. A continuación el diseño, contratos y despliegue verificables, sin exponer fuente ni secretos.

### 1. Arquitectura en producción

```
Browser --> Nginx :80/443 --> Next.js :3002 (frontend)
                          --> NestJS :8010 /api (backend) --> MongoDB
Backend --POST /api/send-mail (x-api-token)--> clicc-mailer :4000
  --> mailQueue (Mongo) --> worker polling 10s --> SMTP Office 365 :587
```

* `clicc-backend`: NestJS 10 + TypeScript, modular (`auth, user, corpus, files, tokenization, mail, settings`), Swagger, validación con `class-validator`, `ScheduleModule` para jobs.
* `clicc-mailer`: Express + Mongoose + Nodemailer, API + worker en un solo proceso PM2 (`combined.js`).
* `clicc-25`: Next.js 15 + React 19 + Zustand + Zod.

### 2. Contratos API

`POST /api/auth/login` → JWT + confirmación por email. `401` si no confirmado, nunca `404` si Nginx apunta bien.

`POST /api/send-mail` — Header `x-api-token: <token>`:
```json
{ "to": "user@ejemplo.com", "subject": "Asunto", "html": "<p>Hola</p>" }
```
* `200 {"ok":true,"id":"..."}` encolado, `400` campos faltantes, `403` token inválido.

`POST /kwic/generate`:
```json
{ "form": "análisis", "leftContext": 5, "rightContext": 5, "corpusId": "corpus-principal" }
```

### 3. Cola `mailQueue` y worker

```js
{ to, subject, html, status: 'pending|sending|sent|failed',
  attempts: 0, lastError: String, lockedUntil: Date, sentAt: Date }
 // índice { status: 1, lockedUntil: 1 }
```

Worker cada `POLL_MS=10000`, lote 10:
1. Reclama `pending` no bloqueados → `sending + lockedUntil = now + 5min` (lease anti-duplicado).
2. `sendMail` por SMTP. Éxito → `sent`. Fallo → `attempts++`, si `>=5` → `failed`, si no → `pending` para reintento.

### 4. Despliegue Azure

VM Ubuntu LTS + Node 20 vía `nvm` + `PM2` + `Nginx` reverse proxy + SSL:
* `location /api → 127.0.0.1:8010`, `location / → 127.0.0.1:3002`, `client_max_body_size 2048M`.
* `ecosystem.config.js`: apps `clicc-backend` y `clicc-frontend` + `clicc-mailer`, `pm2 save + pm2 startup`.
* Secretos solo por entorno (`MONGODB_URI, JWT_SECRET, MAIL_X_API_TOKEN`), nunca en git. Monitoreo con `pm2 status/logs/monit`.

### 5. Decisiones clave

* Cola en Mongo en vez de envío sincrónico: el backend no se cae si SMTP falla.
* Microservicio separado: si el monolito se apaga, el correo sigue funcionando.
* Lease `lockedUntil`: permite 1 instancia PM2 hoy y N instancias mañana sin duplicados.
* ETL legacy: scripts `extract/import` MySQL → Mongo para corpus, speakers y archivos + `seed:settings` idempotente.

### 6. Cómo lo llevaría a su stack

* A Cloud Run: dockerizar `clicc-mailer` y backend, mismo contrato, secretos a Secret Manager, worker como Cloud Run Job / Cloud Scheduler.
* A Firestore: mismo modelo `mailQueue`, colección `mailQueue` con `status + lockedUntil`, transacciones para el lease.
* A WhatsApp Cloud API: mismo patrón que `mail.service.ts` — `POST graph.facebook.com/.../messages` con token, webhook de estados, reintentos y logs.
