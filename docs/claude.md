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
| Crear componente | [arquitectura.md](./arquitectura.md) + [componentes.md](./componentes.md) |
| Crear store Pinia | [stores-pinia.md](./stores-pinia.md) |
| Consumir API del backend | [consumo-api.md](./consumo-api.md) |
| Crear composable | [arquitectura.md](./arquitectura.md) + [ejemplos/crear-composable.md](./ejemplos/crear-composable.md) |
| Crear página/ruta | [arquitectura.md](./arquitectura.md) |

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
