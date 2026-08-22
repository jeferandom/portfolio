---
title: "LEXICC - Sistema Gestor Lexicográfico"
description: "Plataforma integral para la creación, gestión y publicación de diccionarios en línea con soporte para estructuras jerárquicas, referencias cruzadas y colaboración en equipo."
date: 2024
tags: ["React", "Redux", "Express.js", "MongoDB", "Mongoose", "Passport.js"]
repo: ""
featured: true
---

## **Descripción**

[**LEXICC**](https://lexicc.caroycuervo.gov.co/) es un sistema gestor lexicográfico desarrollado para el [Instituto Caro y Cuervo](https://www.caroycuervo.gov.co/) que permite a lexicógrafos y entusiastas de la lexicografía crear, editar, gestionar, importar y publicar diccionarios en línea. Soporta diccionarios con estructuras de entrada jerárquicas, referencias cruzadas, atributos de nodo, esquemas personalizados, importación masiva y colaboración en equipo.

El sistema cubre el ciclo de vida completo de un diccionario: creación, configuración de metadatos y campos, definición de estructura con esquemas de árbol, edición de entradas con vista previa en tiempo real, asignación de tareas para trabajo colaborativo, publicación y exportación a Excel y PDF.

## **Tecnologías**

- **React 16** (frontend con componentes funcionales y hooks)
- **Redux Toolkit** (gestión de estado global)
- **React Context** 
- **Express.js** 
- **MongoDB** + **Mongoose** (almacenamiento y capa de acceso a datos)
- **Passport.js** (autenticación JWT y local)
- **Bootstrap 5** + **React-Bootstrap** (interfaz de usuario)
- **SCSS/Sass** + **styled-components** (estilos)
- **Draft.js** + **react-draft-wysiwyg** (editor de texto enriquecido)
- **react-hook-form** (formularios)
- **react-data-table-component** (tablas virtualizadas)
- **SheetJS/xlsx** + **jsPDF** (exportación Excel y PDF)
- **fast-xml-parser** (parseo de XML)
- **Webpack 5** + **Babel 7** (bundling y transpilación)
- **PM2** + **Nginx** (despliegue en producción con HTTPS)

## Lo que hice

- Desarrollé el **frontend completo en React** con arquitectura de componentes, rutas con role guards y 6 contextos de React para gestión de estado
- Implementé el **editor de entradas jerárquico** con renderizado schema-driven de formularios recursivos, adición/eliminación de nodos hijos en cualquier nivel y gestión de atributos y referencias cruzadas
- Construí el **asistente de importación masiva** en 4 pasos: selección de esquema/archivo, mapeo de campos, revisión de entradas e importación por lotes con detección de duplicados y resolución de referencias cruzadas
- Implementé el **motor de renderizado de entradas** con numeración de acepciones (numérica/alfabética/romana), posicionamiento de referencias cruzadas en 4 posiciones y estilos personalizados por nodo
- Desarrollé el **backend API con Express.js** y arquitectura de servicios: autenticación JWT, roles de usuario, CRUD de diccionarios, entradas, esquemas, atributos, referencias cruzadas, equipos, tareas, notificaciones e invitaciones
- Configuré el **despliegue en producción** con PM2 y Nginx (SSL, reverse proxy)
- Implementé **persistencia dual** con DictionaryRepository que soporta localStorage (diccionarios locales) y API (diccionarios en línea) según el rol del usuario
- Agregué tests unitarios con Jest y Testing Library para componentes y servicios críticos

## Arquitectura

´Proximamente´