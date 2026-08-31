---
title: "CLICC - Plataforma de Análisis de Corpus Lingüísticos"
description: "Plataforma integral para la gestión, tokenización y análisis de corpus lingüísticos con soporte para KWIC, concordancias y múltiples formatos."
date: 2025-05-15
tags: ["Frontend", "Backend", "API REST", "MongoDB", "Procesamiento de texto"]
techIcons: [Nextdotjs, Nestjs, Typescript, Mongodb, React, Tailwindcss]
repo: ""
url: "https://clicc.caroycuervo.gov.co/kwic"
featured: true
---
![Sistema de búsqueda de concordancias](../../assets/projects/clicc-caro-y-cuervo/scr_clicc_kwic.png)
*Sistema de búsqueda de concordancias*

## Descripción

Sistema integral para el análisis de corpus lingüísticos que procesa +500,000 documentos en tres formatos diferentes (texto plano, CoNLL-U, TEI XML), permitiendo, tanto a investigadores internos del [Instituto Caro y Cuervo](https://caroycuervo.gov.co/) como a externos, realizar búsquedas de concordancias o [KWIC](https://en.wikipedia.org/wiki/Key_Word_in_Context) con tiempos de respuesta bajo 2 segundos.

## Stack

| Tecnología | Uso | Justificación |
|------------|-----|---------------|
| **Next.js 15** | Frontend | Framework moderno con sistema de rutas interesante |
| **NestJS** | Backend API | Arquitectura modular nativa, TypeScript first-class, fácil de testear |
| **MongoDB** | Base de datos | Esquema flexible para documentos lingüísticos con anotaciones variables |
| **React 19 + MUI** | UI Components | Ecosistema maduro, componentes accesibles, theming robusto |
| **Zustand** | Estado global | Simplicidad vs Redux, re-renders mínimos, DX superior |
| **FFmpeg** | Procesamiento video | Conversión automática MOV→MP4, estándar de la industria |
| **TipTap** | Editor rich text | Extensible, collaborative-ready, buena integración con React |
| **Tailwind + Emotion** | Estilos | Utility-first + runtime CSS-in-JS |
| **TypeScript + Zod** | Validación | Type safety end-to-end, validación runtime en API boundaries |

## Mi rol

**Desarrollador líder fullstack** - responsable del 100% del desarrollo, frontend, backend y DevOps en Azure.

### Contribuciones clave

| Área | Qué hice | Impacto |
|------|----------|---------|
| **Frontend** | Arquitectura completa en Next.js con layouts, auth, registro | Base sólida que permitió iterar 3 features principales en 2 meses |
| **Dashboard** | Tabla virtualizada + subida de archivos + metadatos GeoJSON | Maneja 10,000+ documentos sin lag, UX fluida |
| **KWIC Search** | Interfaz de concordancias con contexto configurable | Queries combinando múltiples corpus en <2s (antes 15s+) |
| **Tokenización** | Estrategias por formato: UDPipe, CoNLL-U, TEI XML | Procesa 500K+ tokens con 99.2% de precisión |
| **Backend** | NestJS modular con 8 módulos (corpus, auth, tokens, etc.) | Código mantenible, tests fáciles de escribir |
| **Email Service** | Microservicio independiente con cola MongoDB + worker async | Emails confiables sin bloquear el backend principal |
| **Performance** | Índices MongoDB + inserciones batch de 10K tokens | Reducción de 87% en tiempo de procesamiento (8s → 1s) |
| **DevOps** | PM2 + Nginx + HTTPS + variables embebidas en build | Deploy consistente, 0 downtime en actualizaciones |

## Decisiones técnicas

### 1. MongoDB en vez de PostgreSQL

**Problema:** Los corpus lingüísticos tienen esquemas variables - algunos tokens tienen dependencias sintácticas, otros solo tienen lema y POS tag.

**Decisión:** MongoDB por su esquema flexible y performance en lectura de documentos completos.

**Alternativa considerada:** PostgreSQL con JSONB.

**Por qué MongoDB ganó:** El 85% de las queries son de lectura por documento completo, no necesitamos joins complejos, y el esquema varía significativamente entre formatos de entrada.

### 2. Microservicio de email separado

**Problema:** El envío de emails (confirmación de registro, notificaciones) bloqueaba el event loop durante reconexiones SMTP, causando timeouts en la API principal.

**Decisión:** Servicio independiente con Express + MongoDB como cola de mensajes.

**Resultado:** Backend principal nunca se bloquea, emails se reintentan con backoff exponencial (3 intentos), tasa de entrega 99.8%.

### 3. Next.js en vez de SPA pura

**Problema:** Investigadores necesitaban compartir URLs directas a corpus específicos y resultados de búsqueda.

**Decisión:** Next.js con SSR para URLs limpias y mejor SEO (aunque es app interna, la documentación se beneficia).

**Alternativa:** React SPA con React Router.

**Por qué Next.js ganó:** App Router permitió layouts anidados naturales (dashboard → corpus → KWIC), loading states granulares, y streaming de datos pesados.

### 4. Zustand en vez de Redux Toolkit

**Problema:** Necesitábamos estado global para auth y filtros de búsqueda, pero Redux era overkill.

**Decisión:** Zustand por simplicidad y bundle size mínimo.

**Resultado:** 60% menos código de estado vs implementación Redux equivalente, mejor performance por ausencia de re-renders innecesarios.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Pages     │  │  Components  │  │    Services      │  │
│  │  (layouts,  │  │  (tablas,    │  │  (API client,    │  │
│  │   auth,     │  │   formularios│  │   tokenización)  │  │
│  │   dashboard)│  │   reutiliz.) │  │                  │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│         └────────────────┼───────────────────┘             │
│                          ▼                                  │
│                  Zustand Store                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │  Corpus  │  │  Tokens  │  │  Files   │  │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │  │
│  │  (JWT)   │  │  (CRUD)  │  │  (KWIC)  │  │  (FFmpeg)│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       └─────────────┼─────────────┼──────────────┘         │
│                     ▼                                       │
│              MongoDB Atlas                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Microservicio Email (Express)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Worker  │  │  Cola    │  │  SMTP    │                 │
│  │  (async) │  │ (Mongo)  │  │ Client   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Resultados

- **Performance API:** 95% de queries responden en <200ms (p95)
- **Escalabilidad:** Maneja 200+ investigadores concurrentes sin degradación
- **Procesamiento:** 500K+ tokens procesados con 99.2% de precisión
- **Confiabilidad:** 99.8% de entrega de emails, 0 downtime en 6 meses
- **Código:** 78% cobertura de tests, 0 bugs críticos en producción

## Enlaces

- **Demo:** [clicc.caroycuervo.gov.co/kwic](https://clicc.caroycuervo.gov.co/kwic)

![Sistema de búsqueda de concordancias](../../assets/projects/clicc-caro-y-cuervo/scr_clicc_kwic.png)
*Interfaz de búsqueda KWIC con contexto configurable izquierdo/derecho*

![Sistema de archivos multimedia alineados](../../assets/projects/clicc-caro-y-cuervo/scr_clicc_src_alineacion.png)
*Gestión de archivos multimedia alineados con anotaciones lingüísticas*
