# SurgiMed.pe

Sitio web corporativo de **Surgical Medical Equipment E.I.R.L.** (SURGIMED), empresa peruana dedicada a la importación y provisión de material de osteosíntesis y equipamiento para neurocirugía, cirugía maxilofacial y cirugía torácica, con sede en Sullana, Piura, Perú.

🔗 Producción: [surgimed.pe](https://www.surgimed.pe)

---

## Estado actual del proyecto

El sitio está **desplegado en producción y operativo**, funcionando como landing corporativo / catálogo institucional (no transaccional). No es una tienda en línea: no procesa pagos, no tiene backend propio ni base de datos.

### Páginas activas (enlazadas en la navegación, en español, con contenido real)

| Página | Ruta | Estado |
|---|---|---|
| Inicio | `index.html` | ✅ Completa — hero, especialidades, misión resumida |
| Nosotros | `about.html` | ✅ Completa — misión, visión, historia |
| Servicios | `services.html` | ✅ Completa — catálogo de dispositivos (distractores maxilares/mandibulares, etc.) con contacto directo por WhatsApp |
| Contacto | `contact.html` | ✅ Completa — mapa, formulario, WhatsApp, correo |
| 404 | `404.html` | ✅ Completa |

### Páginas pendientes de trabajo (huérfanas de la plantilla original)

`doctors.html`, `blog.html` y `blog-details.html` siguen desplegadas en el hosting pero **no están enlazadas desde el menú principal** y conservan el contenido de plantilla sin traducir/adaptar (inglés, texto *Lorem ipsum*, correos de ejemplo como `mail@example.com`). Quedan accesibles por URL directa aunque no forman parte del recorrido real del sitio. Pendiente: decidir si se completan con contenido propio (equipo médico, artículos) o se eliminan del hosting para no exponer contenido inacabado.

### Funcionalidades desactivadas intencionalmente
Quedan comentadas en el HTML (no se renderizan) piezas heredadas de la plantilla original que no aplican al modelo de negocio actual: formulario de "Agendar cita", buscador de navbar, sección de descarga de app móvil y login/registro de usuarios.

### Deuda técnica identificada
- Dos tarjetas de servicio en `services.html` usan la misma imagen y el mismo texto (`distractor-de-reconstrucción-mandibular-01-RC`, duplicado).
- Varios enlaces de contacto en la topbar (`href="#"`) no están conectados a `tel:`/`mailto:`.
- No existe pipeline de build/optimización de imágenes (~6.6 MB en `html/assets/img`, mezcla de `.jpg`/`.png`/`.webp` sin compresión sistemática).

---

## Arquitectura

Sitio **estático multi-página (MPA)**, sin framework de frontend ni build step: HTML servido directamente por Firebase Hosting.

```
surgimed.pe/
├── html/                      # Raíz pública servida por Firebase Hosting
│   ├── index.html             # Inicio
│   ├── about.html             # Nosotros
│   ├── services.html          # Catálogo de servicios/productos
│   ├── contact.html           # Contacto + mapa + formulario
│   ├── doctors.html           # (plantilla, sin adaptar)
│   ├── blog.html               # (plantilla, sin adaptar)
│   ├── blog-details.html      # (plantilla, sin adaptar)
│   ├── 404.html
│   └── assets/
│       ├── css/                # Bootstrap 4, tema propio (estilos.css), iconos (maicons)
│       ├── js/                 # jQuery 3.5.1, Bootstrap bundle, integración Google Maps
│       ├── fonts/               # Iconfont Maicons
│       ├── vendor/              # Owl Carousel, Animate.css, WOW.js
│       └── img/                 # Imágenes de producto, doctores, blog, sección "person"
├── .github/workflows/          # CI/CD hacia Firebase Hosting (GitHub Actions)
├── firebase.json               # Configuración de Firebase Hosting (public: "html")
├── .firebaserc                 # Proyecto Firebase: surgimed-pe
├── Credits.txt                 # Créditos de assets de terceros
└── LICENSE.txt                 # CC BY 4.0 (plantilla base "One Health")
```

### Flujo de despliegue (CI/CD)

```
push a main
   │
   ▼
GitHub Actions (firebase-hosting-merge.yml)
   │  usa secrets: FIREBASE_SERVICE_ACCOUNT_SURGIMED_PE, GITHUB_TOKEN
   ▼
Firebase Hosting (canal "live")  →  https://www.surgimed.pe
```

Adicionalmente, cada Pull Request dispara `firebase-hosting-pull-request.yml`, que genera un **canal de vista previa** temporal en Firebase Hosting para revisar los cambios antes de fusionar a `main`.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Marcado | HTML5 semántico, 8 páginas independientes (sin SPA/router) |
| Estilos | Bootstrap 4 (CSS), hoja de estilo propia `estilos.css`, iconos `maicons` |
| Interactividad | jQuery 3.5.1, Bootstrap Bundle JS, Owl Carousel 2 (slider de especialidades), WOW.js + Animate.css (animaciones on-scroll) |
| Mapas | Google Maps JavaScript API (ubicación de la empresa en Sullana) |
| Formularios | [FormSubmit](https://formsubmit.co) — envío de formulario de contacto sin backend propio |
| Mensajería | Integración directa con WhatsApp Click-to-Chat (botón flotante + enlaces por producto) |
| Hosting | Firebase Hosting (proyecto `surgimed-pe`) |
| CI/CD | GitHub Actions + `FirebaseExtended/action-hosting-deploy` |
| Licencia base | Plantilla "One Health" (CC BY 4.0), adaptada a contenido propio de SURGIMED |

No hay backend, base de datos, sistema de autenticación ni gestor de paquetes (`package.json`) en el repositorio: es un sitio 100% estático.

---

## Análisis de seguridad y credenciales

Se realizó una revisión del repositorio (código actual + historial completo de `git log`) en busca de credenciales, claves y secretos expuestos.

### ✅ Buenas prácticas ya aplicadas
- **No hay archivos `.env`, claves privadas (`.pem`/`.key`) ni credenciales de servicio commiteadas** en el repositorio ni en su historial.
- El despliegue a Firebase usa **GitHub Secrets** correctamente: `FIREBASE_SERVICE_ACCOUNT_SURGIMED_PE` y `GITHUB_TOKEN` están referenciados como `${{ secrets.* }}` en los workflows, nunca en texto plano.
- `.gitignore` ya contempla `.env` y artefactos de build/caché de Firebase.

### ⚠️ Punto a revisar: clave de Google Maps expuesta en el cliente
En `html/contact.html` (línea 352) se carga la API de Google Maps con una clave visible en el HTML:

```
https://maps.googleapis.com/maps/api/js?key=AIzaSyD1UnZOhxZCE8ge5BD1owzX4HfRli0bj2Q&callback=initMap
```

Esto **es el patrón esperado** para la Google Maps JavaScript API (es una clave de cliente, no un secreto de servidor) y así ha estado desde el commit inicial del proyecto. Sin embargo, si no está restringida, cualquiera puede copiarla y consumir la cuota/facturación del proyecto de Google Cloud asociado. Recomendación:
1. Verificar en Google Cloud Console → *Credenciales* que esta clave tenga **restricciones de referente HTTP** limitadas a `surgimed.pe`/`www.surgimed.pe`.
2. Restringir también la clave a la API "Maps JavaScript API" únicamente.
3. Si actualmente no tiene restricciones, rotarla (crear una nueva restringida y reemplazarla) por precaución.

### ℹ️ Información de contacto pública (no es una vulnerabilidad, pero se documenta)
El correo `surmedequip@hotmail.com` y el número `+51 941176311` están expuestos intencionalmente como datos de contacto en varias páginas — es el comportamiento esperado de un sitio corporativo. Se sugiere, a nivel de imagen profesional, migrar a un correo bajo dominio propio (`contacto@surgimed.pe`) en vez de un dominio Hotmail.

**Conclusión:** no se encontraron credenciales sensibles (contraseñas, tokens de API privados, llaves de servicio, cadenas de conexión) expuestas en el código ni en el historial de Git. El único punto de atención es confirmar las restricciones de la clave pública de Google Maps.

---

## Desarrollo local

No requiere instalación de dependencias ni build. Basta con servir la carpeta `html/` con cualquier servidor estático:

```bash
cd html
python3 -m http.server 8080
# o
npx serve .
```

También puede usarse el propio Firebase CLI para replicar el entorno de hosting:

```bash
npm install -g firebase-tools
firebase login
firebase serve --only hosting
```

## Despliegue

El despliegue a producción es automático vía GitHub Actions al hacer push a `main`. Para desplegar manualmente:

```bash
firebase deploy --only hosting --project surgimed-pe
```

---

## Créditos

Basado en la plantilla HTML5 "One Health" (CC BY 4.0). Ver [`Credits.txt`](./Credits.txt) para el detalle de librerías de terceros (Bootstrap 4, jQuery, Owl Carousel, WOW.js, Animate.css, Maicons) y fuentes de imágenes. Ver [`LICENSE.txt`](./LICENSE.txt) para los términos completos de la licencia.
