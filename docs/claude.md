# FRONTEND (Admin) — Guía para Claude

## Contexto
- **Stack**: Nuxt 4 con SSR: false (SPA) + Pinia + TypeScript
- **Skill**: `frontend/.claude/skills/nuxt-admin`
- **Ubicación**: `/frontend`
- **Propósito**: Panel de administración con autenticación

---

## Cuándo leer qué

| Tarea | Leer primero |
|---|---|
| Entender módulos, páginas existentes, qué hace cada sección | [dominio.md](./dominio.md) |
| Crear componente | [arquitectura.md](./arquitectura.md) + [componentes.md](./componentes.md) |
| Crear store Pinia | [stores-pinia.md](./stores-pinia.md) |
| Consumir API del backend | [consumo-api.md](./consumo-api.md) |
| Crear composable | [arquitectura.md](./arquitectura.md) + [ejemplos/crear-composable.md](./ejemplos/crear-composable.md) |
| Crear página/ruta | [arquitectura.md](./arquitectura.md) |
| Galería con imágenes / marca de agua | Ver sección [Componente Gallery](#componente-gallery) abajo |
| Store de empresa / favicon / logo | Ver sección [Store publicCompany](#store-publiccompany) abajo |

---

## Estructura de carpetas clave

```
app/
├── pages/            # Rutas automáticas Nuxt
├── layouts/          # Layouts (default, auth, etc.)
├── components/       # Componentes reutilizables
├── composables/      # useXxx.ts (lógica compartida)
├── store/            # Pinia stores (carpeta singular)
├── services/         # Clases singleton: XxxService
├── interfaces/       # IXxx.ts — TypeScript interfaces
├── constants/        # ApiUrls, etc.
├── schemas/          # Validación de formularios
├── middleware/       # Middleware de rutas Nuxt
├── plugins/          # Plugins Vue/Nuxt
├── utils/            # Utilidades puras
└── data/             # Datos estáticos
```

---

## Patrones obligatorios

### Servicio API (singleton)
```ts
// services/XxxService.ts
import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

class XxxService {
  async getAll(params: IParamsTable): Promise<any> {
    return useApi(ApiUrls.XXX_GET, { query: params });
  }
  async create(payload: any): Promise<any> {
    return useApi(ApiUrls.XXX_CREATE_POST, { method: "POST", body: payload });
  }
}
export default new XxxService();
```

### Consumo en componente/página
```ts
const { run } = useApiHandler();
const result = await run(XxxService.create(payload), {
  showSuccess: true,
  setErrors: (errs) => { errors.value = errs; },
});
```

### Store Pinia (composition API)
```ts
export const useXxxStore = defineStore("xxx", () => {
  const items = ref<IXxx[]>([]);
  // ...
  return { items };
}, { persist: true }); // si requiere persistencia
```

---

## Reglas de código

1. Siempre `<script setup lang="ts">` en componentes
2. Props tipadas con `interface` + `defineProps<Props>()`
3. Emits definidos con `defineEmits<{ (e: 'update', v: string): void }>()`
4. Llamadas API siempre a través de `useApiHandler().run()` para manejo de errores
5. Interfaces en `~/interfaces/IXxx.ts`
6. URLs de API en `~/constants/ApiUrls`

---

## Componente Gallery

`components/gallery/index.vue` — gestiona subida, orden (drag), portada y eliminación de imágenes.

**Props relevantes:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `watermark` | `boolean` | `false` | Aplica marca de agua del logo de empresa sobre cada imagen al subirla |
| `maxImages` | `number` | `10` | Máximo de imágenes permitidas |
| `showCover` | `boolean` | `true` | Muestra el selector de portada |
| `dimensions` | `string` | `""` | Texto de ayuda con dimensiones recomendadas |

**Uso con marca de agua** (módulo de propiedades):
```vue
<Gallery :watermark="true" @updateImages="handleImages" />
```

Solo activar `watermark` donde se requiera — actualmente solo en propiedades.

### Composable `useWatermark`

`composables/useWatermark.ts` — aplica el logo de empresa como marca de agua semitransparente sobre imágenes usando Canvas API.

- El logo se carga una sola vez y se cachea a nivel de módulo (compartido entre instancias)
- Tamaño: 45% del lado más corto de la imagen (proporcional, funciona con cualquier resolución)
- Opacidad: 0.52 (logo) + fondo blanco 0.18 para contraste en fotos oscuras
- Si la carga del logo falla, retorna la imagen original sin watermark (falla silenciosa)
- Usa `toSameOriginUrl()` para convertir la URL del logo a pathname cuando es cross-origin (desarrollo) — en producción same-origin, usa la URL completa directamente

---

## Store publicCompany

`store/publicCompany.ts` — carga datos de `/api/public/company` una vez y los expone globalmente.

**Propiedades expuestas:**

| Propiedad | Descripción |
|---|---|
| `logoUrl` | URL del logo principal de la empresa |
| `faviconUrl` | `favicon_url` del sitio (de site-settings) o `logoUrl` como fallback |
| `displayName` | Nombre de la empresa |

`faviconUrl` se usa en `app.vue` para el favicon del panel admin. Se actualiza cuando se cambia en la sección de gestión del sitio.

---

## DevProxy (solo desarrollo)

`nuxt.config.ts` > `nitro.devProxy` — activo únicamente en `npm run dev`, ignorado en builds de producción.

```ts
nitro: {
  devProxy: {
    "/api":     { target: "http://localhost:8000/api",     changeOrigin: true },
    "/storage": { target: "http://localhost:8000/storage", changeOrigin: true },
  },
}
```

**Regla crítica**: el target debe incluir el mismo prefijo que la key (`/api` → `.../api`, `/storage` → `.../storage`). Nitro elimina el prefijo del path antes de concatenar con el target — si el target no lo repone, la URL queda incompleta.

En producción (Docker), Traefik enruta todo en el mismo dominio: no hay cross-origin, no se necesita proxy.
