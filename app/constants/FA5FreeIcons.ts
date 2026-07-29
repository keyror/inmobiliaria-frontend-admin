export interface FA5Icon {
  name: string;
  cls: string;
  keywords: string[];
}

export const FA5_FREE_ICONS: FA5Icon[] = [
  // ── Inmuebles y propiedad ──
  { name: "Casa", cls: "fas fa-home", keywords: ["casa", "home", "inicio", "house", "vivienda"] },
  { name: "Edificio", cls: "fas fa-building", keywords: ["edificio", "building", "apartamento", "oficina", "office"] },
  { name: "Ciudad", cls: "fas fa-city", keywords: ["ciudad", "city", "skyline", "metropoli"] },
  { name: "Almacén / Bodega", cls: "fas fa-warehouse", keywords: ["bodega", "almacen", "warehouse", "deposito", "industria"] },
  { name: "Llave", cls: "fas fa-key", keywords: ["llave", "key", "acceso", "entrada", "alquiler"] },
  { name: "Puerta abierta", cls: "fas fa-door-open", keywords: ["puerta", "door", "entrada", "acceso"] },
  { name: "Puerta cerrada", cls: "fas fa-door-closed", keywords: ["puerta", "door", "cerrado", "privado"] },
  { name: "Escaleras", cls: "fas fa-stairs", keywords: ["escaleras", "stairs", "pisos", "nivel"] },
  { name: "Cama / Habitación", cls: "fas fa-bed", keywords: ["cama", "bed", "habitacion", "cuarto", "dormitorio", "alcoba"] },
  { name: "Baño", cls: "fas fa-bath", keywords: ["bano", "bath", "ducha", "sanitario"] },
  { name: "Piscina", cls: "fas fa-swimming-pool", keywords: ["piscina", "pool", "natacion", "alberca"] },
  { name: "Parking / Garaje", cls: "fas fa-parking", keywords: ["garaje", "parking", "carro", "parqueadero", "garage"] },
  { name: "Couch / Sala", cls: "fas fa-couch", keywords: ["sala", "couch", "sofa", "living"] },
  { name: "Ventana / Sala", cls: "fas fa-tv", keywords: ["sala", "tv", "television", "living"] },
  { name: "Árbol / Jardín", cls: "fas fa-tree", keywords: ["jardin", "tree", "arbol", "verde", "zona verde"] },
  { name: "Piscina / Área social", cls: "fas fa-umbrella-beach", keywords: ["area social", "piscina", "playa", "recreacion"] },
  { name: "Terraza / Sol", cls: "fas fa-sun", keywords: ["terraza", "sol", "sun", "exterior", "balcon"] },
  { name: "Montaña / Lote", cls: "fas fa-mountain", keywords: ["lote", "terreno", "montaña", "finca", "mountain"] },
  { name: "Palma / Vacacional", cls: "fas fa-umbrella-beach", keywords: ["vacacional", "palma", "recreacion", "playa"] },
  { name: "Regla / Área", cls: "fas fa-ruler", keywords: ["area", "ruler", "medidas", "metros", "dimensiones"] },
  { name: "Regla combinada", cls: "fas fa-ruler-combined", keywords: ["area", "medidas", "planos", "dimensiones"] },
  { name: "Candado", cls: "fas fa-lock", keywords: ["seguridad", "lock", "candado", "privacidad", "proteccion"] },
  { name: "Candado abierto", cls: "fas fa-lock-open", keywords: ["acceso", "open", "libre", "disponible"] },
  { name: "Escudo / Seguridad", cls: "fas fa-shield-alt", keywords: ["seguridad", "shield", "proteccion", "guardia", "vigilancia"] },
  { name: "Camara seguridad", cls: "fas fa-video", keywords: ["camara", "cctv", "vigilancia", "video", "seguridad"] },

  // ── Servicios ──
  { name: "Herramientas", cls: "fas fa-tools", keywords: ["herramientas", "tools", "mantenimiento", "reparacion", "servicios"] },
  { name: "Llave inglesa", cls: "fas fa-wrench", keywords: ["plomeria", "wrench", "reparacion", "mantenimiento"] },
  { name: "Martillo", cls: "fas fa-hammer", keywords: ["construccion", "hammer", "obra", "remodelacion"] },
  { name: "Casco obra", cls: "fas fa-hard-hat", keywords: ["construccion", "obra", "casco", "hard-hat", "ingeniero"] },
  { name: "Apretón de manos", cls: "fas fa-handshake", keywords: ["acuerdo", "handshake", "negocio", "contrato", "alianza"] },
  { name: "Atención al cliente", cls: "fas fa-headset", keywords: ["atencion", "headset", "soporte", "servicio", "cliente", "agente"] },
  { name: "Electricidad", cls: "fas fa-bolt", keywords: ["electricidad", "bolt", "energia", "luz", "rayo"] },
  { name: "Agua", cls: "fas fa-tint", keywords: ["agua", "tint", "plomeria", "grifo", "liquido"] },
  { name: "Fuego / Gas", cls: "fas fa-fire", keywords: ["gas", "fire", "calefaccion", "chimenea", "fuego"] },
  { name: "Wifi", cls: "fas fa-wifi", keywords: ["wifi", "internet", "conexion", "red", "tecnologia"] },
  { name: "Ascensor", cls: "fas fa-elevator", keywords: ["ascensor", "elevator", "elevador", "piso"] },

  // ── Negocio e inversión ──
  { name: "Dinero / Precio", cls: "fas fa-dollar-sign", keywords: ["precio", "dinero", "dollar", "valor", "costo"] },
  { name: "Monedas", cls: "fas fa-coins", keywords: ["monedas", "coins", "dinero", "inversion", "rentabilidad"] },
  { name: "Billete", cls: "fas fa-money-bill-wave", keywords: ["billete", "pago", "dinero", "efectivo"] },
  { name: "Gráfica", cls: "fas fa-chart-line", keywords: ["grafica", "chart", "valorización", "crecimiento", "tendencia"] },
  { name: "Porcentaje", cls: "fas fa-percent", keywords: ["porcentaje", "percent", "tasa", "descuento", "interes"] },
  { name: "Calculadora", cls: "fas fa-calculator", keywords: ["calculadora", "calculator", "calculo", "precio"] },
  { name: "Maletín", cls: "fas fa-briefcase", keywords: ["maletin", "briefcase", "negocio", "profesional", "oficina"] },
  { name: "Empresa / Industria", cls: "fas fa-industry", keywords: ["empresa", "industry", "fabrica", "comercial"] },
  { name: "Trofeo", cls: "fas fa-trophy", keywords: ["trofeo", "trophy", "premio", "logro", "calidad"] },
  { name: "Medalla", cls: "fas fa-medal", keywords: ["medalla", "medal", "certificacion", "calidad", "premio"] },
  { name: "Estrella", cls: "fas fa-star", keywords: ["estrella", "star", "favorito", "destacado", "calidad"] },
  { name: "Pulgar arriba", cls: "fas fa-thumbs-up", keywords: ["pulgar", "like", "aprobado", "bueno", "calidad"] },

  // ── Navegación y ubicación ──
  { name: "Pin / Ubicación", cls: "fas fa-map-marker-alt", keywords: ["ubicacion", "pin", "mapa", "direccion", "lugar", "localizacion"] },
  { name: "Mapa", cls: "fas fa-map", keywords: ["mapa", "map", "ciudad", "navegacion", "plano"] },
  { name: "Brújula", cls: "fas fa-compass", keywords: ["brujula", "compass", "navegacion", "orientacion"] },
  { name: "Ruta", cls: "fas fa-route", keywords: ["ruta", "route", "camino", "direccion", "via"] },
  { name: "Globo", cls: "fas fa-globe", keywords: ["globo", "globe", "internacional", "mundo", "sitio web"] },
  { name: "Flecha derecha", cls: "fas fa-arrow-right", keywords: ["flecha", "arrow", "siguiente", "continuar", "mas"] },
  { name: "Flecha izquierda", cls: "fas fa-arrow-left", keywords: ["flecha", "arrow", "anterior", "volver", "atras"] },
  { name: "Ángulo derecho", cls: "fas fa-angle-right", keywords: ["angulo", "chevron", "siguiente", "menu"] },
  { name: "Enlace externo", cls: "fas fa-external-link-alt", keywords: ["link", "enlace", "externo", "sitio", "url"] },

  // ── Personas ──
  { name: "Usuario", cls: "fas fa-user", keywords: ["usuario", "user", "persona", "cliente", "propietario"] },
  { name: "Usuarios / Equipo", cls: "fas fa-users", keywords: ["equipo", "users", "personas", "familia", "grupo"] },
  { name: "Agente", cls: "fas fa-user-tie", keywords: ["agente", "ejecutivo", "vendedor", "profesional", "asesor"] },
  { name: "Grupo / Comunidad", cls: "fas fa-people-group", keywords: ["comunidad", "grupo", "conjunto", "personas"] },
  { name: "Niño / Familia", cls: "fas fa-child", keywords: ["nino", "familia", "child", "kids"] },
  { name: "Corazón / Favorito", cls: "fas fa-heart", keywords: ["favorito", "heart", "corazon", "me gusta", "amor"] },

  // ── Comunicación ──
  { name: "Teléfono", cls: "fas fa-phone-alt", keywords: ["telefono", "phone", "llamada", "contacto"] },
  { name: "Celular", cls: "fas fa-mobile-alt", keywords: ["celular", "mobile", "smartphone", "movil"] },
  { name: "Correo", cls: "fas fa-envelope", keywords: ["correo", "email", "envelope", "mensaje", "contacto"] },
  { name: "Chat / Comentarios", cls: "fas fa-comments", keywords: ["chat", "comments", "mensaje", "conversacion", "whatsapp"] },
  { name: "Mensaje", cls: "fas fa-comment-alt", keywords: ["mensaje", "comment", "chat", "texto"] },
  { name: "Megáfono", cls: "fas fa-bullhorn", keywords: ["anuncio", "bullhorn", "publicidad", "oferta"] },

  // ── Documentos ──
  { name: "Documento", cls: "fas fa-file-alt", keywords: ["documento", "file", "contrato", "papel"] },
  { name: "Contrato / Firma", cls: "fas fa-file-signature", keywords: ["contrato", "firma", "signature", "acuerdo"] },
  { name: "Portapapeles", cls: "fas fa-clipboard-list", keywords: ["lista", "clipboard", "inventario", "formulario"] },
  { name: "Carpeta", cls: "fas fa-folder", keywords: ["carpeta", "folder", "archivos", "documentos"] },
  { name: "Clipboard / Check", cls: "fas fa-clipboard-check", keywords: ["checklist", "aprobado", "revisado", "completado"] },
  { name: "Búsqueda / Lupa", cls: "fas fa-search", keywords: ["buscar", "lupa", "search", "encontrar", "filtro"] },

  // ── Iconos de estado ──
  { name: "Check / Disponible", cls: "fas fa-check-circle", keywords: ["check", "disponible", "aprobado", "listo", "activo"] },
  { name: "Check simple", cls: "fas fa-check", keywords: ["check", "ok", "listo", "confirmado"] },
  { name: "Info", cls: "fas fa-info-circle", keywords: ["informacion", "info", "ayuda", "detalle"] },
  { name: "Alerta", cls: "fas fa-exclamation-triangle", keywords: ["alerta", "warning", "advertencia", "cuidado"] },
  { name: "Plus / Agregar", cls: "fas fa-plus-circle", keywords: ["agregar", "plus", "añadir", "nuevo"] },
  { name: "Reloj / Tiempo", cls: "fas fa-clock", keywords: ["tiempo", "clock", "hora", "horario", "disponibilidad"] },
  { name: "Calendario", cls: "fas fa-calendar-alt", keywords: ["calendario", "calendar", "fecha", "cita", "agenda"] },
  { name: "Etiqueta / Precio", cls: "fas fa-tag", keywords: ["etiqueta", "tag", "precio", "oferta", "categoria"] },
  { name: "Certificado", cls: "fas fa-certificate", keywords: ["certificado", "certificate", "garantia", "calidad"] },

  // ── Extras útiles ──
  { name: "Cámara / Galería", cls: "fas fa-camera", keywords: ["camara", "foto", "galeria", "imagen", "fotografia"] },
  { name: "Imagen", cls: "fas fa-image", keywords: ["imagen", "image", "foto", "galeria"] },
  { name: "Video", cls: "fas fa-film", keywords: ["video", "film", "pelicula", "media"] },
  { name: "Configuración", cls: "fas fa-cog", keywords: ["configuracion", "settings", "ajustes", "cog"] },
  { name: "Reciclar / Sostenible", cls: "fas fa-recycle", keywords: ["sostenible", "verde", "ecologico", "reciclar"] },
  { name: "Luz / Iluminación", cls: "fas fa-lightbulb", keywords: ["luz", "lightbulb", "idea", "iluminacion", "electricidad"] },
  { name: "Ventilador / Aire", cls: "fas fa-wind", keywords: ["aire", "viento", "climatizacion", "brisa"] },
  { name: "Snowflake / AC", cls: "fas fa-snowflake", keywords: ["aire acondicionado", "frio", "snowflake", "AC", "climatizacion"] },
  { name: "Termómetro", cls: "fas fa-thermometer-half", keywords: ["temperatura", "calefaccion", "termometro", "clima"] },
  { name: "Cuadricula / Vista", cls: "fas fa-th-large", keywords: ["vista", "cuadricula", "grid", "galeria"] },
];
