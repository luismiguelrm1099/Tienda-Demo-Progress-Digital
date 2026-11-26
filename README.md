# PD Archive — Tienda Demo Progress Digital

Demo interactiva de portafolio creada por **Progress Digital**: carrusel en espiral 3D WebGL2 nativo (*Spiral Flux* en escritorio y celular), showroom espacial 2.5D full-bleed de ropa y sneakers con zoom en sala, comparador wireframe interactivo, bolsa de compra demo y selector en vivo `EN / ES`.

## Estructura del proyecto

- `index.html` — Aplicación completa en HTML, CSS y JavaScript puro (sin frameworks ni paso de compilación).
- `assets/logo.webp` — Logo de Progress Digital.
- `assets/garments/` — 6 prendas recortadas en WebP transparente.
- `assets/sneakers/` — 5 sneakers recortados en WebP transparente.
- `Dockerfile` y `nginx.conf` — Configuración ligera de Nginx con compresión gzip, `Accept-Ranges` y caché inmutable para `/assets/` lista para Coolify.

## Despliegue en Coolify (VPS)

### Opción A — Dockerfile (Recomendada)
1. En Coolify: **New Resource → Git Repository** y selecciona este repositorio (`main`).
2. **Build Pack:** `Dockerfile` (detecta automáticamente `Dockerfile` y `nginx.conf`).
3. **Ports Exposes:** `80`.
4. Asigna tu dominio HTTPS y activa **Auto Deploy**.

### Opción B — Static Site
1. **Build Pack:** `Static` (o `Nixpacks` con *Is it a static site?*).
2. **Publish Directory:** `.` (o `/` según versión de Coolify).

> Recuerda actualizar las etiquetas `og:url` y `og:image` marcadas con `<!-- DEPLOY STEP -->` en `index.html` cuando definas tu dominio final.

## Cómo cambiar las prendas o sneakers

Reemplaza las imágenes recortadas en `assets/garments/` o `assets/sneakers/` y actualiza el arreglo `CATALOG` al inicio del `<script>` en `index.html`. Tanto la Espiral 3D WebGL2 como el showroom, el zoom en sala y la bolsa se actualizan automáticamente.
