# Guía de despliegue a GitHub Pages

Sitio publicado en: <https://jeferandom.github.io/portfolio/>

## Cómo funciona

Este proyecto usa dos ramas con roles distintos:

| Rama | Contenido | Quién la actualiza |
|------|-----------|--------------------|
| `master` | Código fuente (`.astro`, configs) | Tú, con `git push` |
| `gh-pages` | Solo el sitio compilado (`dist/`: HTML/CSS) | El workflow de GitHub Actions |

Cuando haces push a `master`, el workflow (`.github/workflows/deploy.yml`) corre en GitHub:

1. Instala dependencias (`npm ci`)
2. Compila el sitio (`npm run build` → genera `dist/`)
3. Publica el contenido de `dist/` en la rama `gh-pages` (acción `peaceiris/actions-gh-pages`)

GitHub Pages sirve el contenido de `gh-pages` en la URL de arriba.

> **Importante:** GitHub Pages no construye el sitio; solo sirve archivos estáticos. Por eso el build se hace en el workflow y solo el resultado va a `gh-pages`.

## Desplegar cambios (flujo normal)

Solo necesitas hacer push a `master`:

```sh
git add -A
git commit -m "tu mensaje"
git push
```

El workflow corre automáticamente (~1-2 min). Verifica el estado en la pestaña **Actions** del repo.

## Configuración única de GitHub Pages

Solo se hace una vez (ya debería estar hecho). Verifica en el repo:

**Settings → Pages → Build and deployment:**
- **Source:** `Branch`
- **Branch:** `gh-pages` → `/ (root)`

Si el sitio no carga, esta es la primera cosa a revisar.

## Requisito clave: el `base` en Astro

Como el sitio vive en un **subdirectorio** (`/portfolio/`), `astro.config.mjs` tiene:

```js
export default defineConfig({
  site: 'https://jef.github.io',
  base: '/portfolio',
});
```

Astro **no reescribe los `<a href>` automáticamente**. Por eso todos los enlaces internos se escriben con `import.meta.env.BASE_URL`:

```astro
<a href={import.meta.env.BASE_URL + '/projects'}>Proyectos</a>
```

**Si añades un enlace interno nuevo**, usa ese mismo patrón (nunca `href="/ruta"` a pelo, porque apuntaría a la raíz del dominio y fallaría en producción).

## Despliegue manual (si el workflow falla)

Si GitHub Actions no corre o está deshabilitado, puedes publicar a mano:

```sh
npm run build

rm -rf /tmp/gh-deploy && mkdir -p /tmp/gh-deploy
cp -r dist/. /tmp/gh-deploy/
cd /tmp/gh-deploy

git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy manual"

git push git@github.com:jeferandom/portfolio.git gh-pages --force
```

Esto sobreescribe `gh-pages` con tu build local. El sitio queda actualizado al instante.

## Verificación

Tras desplegar (automático o manual), comprueba:

1. Pestaña **Actions**: el workflow terminó en verde.
2. `git ls-remote --heads origin gh-pages` → existe y tiene commit reciente.
3. El sitio carga en <https://jeferandom.github.io/portfolio/> y la navegación funciona.

## Troubleshooting

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| El sitio da 404 | Pages no apunta a `gh-pages` | Settings → Pages → Source: Branch `gh-pages` |
| Enlaces rotos / 404 al navegar | Falta el prefijo `/portfolio` | Usa `import.meta.env.BASE_URL` en el enlace |
| Workflow no corre | Actions deshabilitado | Settings → Actions → General → activa workflows |
| Workflow falla en el deploy | Rama `gh-pages` protegida | Revisa Settings → Branches → rules |
| Cambios no aparecen | Workflow corriendo o caché | Espera ~2 min; fuerza recarga (Ctrl+Shift+R) |

## Comandos útiles

```sh
npm run dev       # desarrollo local (localhost:4321)
npm run build     # compilar a dist/
npm run preview   # previsualizar el build
```
