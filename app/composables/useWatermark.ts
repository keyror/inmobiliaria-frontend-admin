let _cachedLogoUrl = "";
let _cachedLogoElement: HTMLImageElement | null = null;

/**
 * Convierte una URL absoluta a pathname cuando el origen es diferente
 * (dev: cross-origin entre :3001 y :8000).
 * En producción admin y backend comparten dominio, así que la URL completa funciona.
 * El devProxy de Nuxt mapea /storage → http://localhost:8000.
 */
const toSameOriginUrl = (url: string): string => {
  if (!import.meta.client) return url;
  try {
    const parsed = new URL(url);
    if (parsed.origin !== window.location.origin) {
      return parsed.pathname + parsed.search;
    }
    return url;
  } catch {
    return url;
  }
};

const loadLogoImage = (logoUrl: string): Promise<HTMLImageElement> => {
  if (_cachedLogoElement && _cachedLogoUrl === logoUrl) {
    return Promise.resolve(_cachedLogoElement);
  }

  const fetchUrl = toSameOriginUrl(logoUrl);

  return fetch(fetchUrl)
    .then((r) => {
      if (!r.ok) throw new Error(`Logo fetch failed: ${r.status}`);
      return r.blob();
    })
    .then(
      (blob) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            _cachedLogoUrl = logoUrl;
            _cachedLogoElement = img;
            resolve(img);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        }),
    );
};

export const useWatermark = () => {
  const applyWatermark = async (
    file: File,
    logoUrl: string,
  ): Promise<File> => {
    if (!logoUrl) return file;

    let logo: HTMLImageElement;
    try {
      logo = await loadLogoImage(logoUrl);
    } catch (err) {
      console.warn("[useWatermark] No se pudo cargar el logo:", err);
      return file;
    }

    return new Promise((resolve) => {
      const base = new Image();

      base.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = base.width;
        canvas.height = base.height;
        const ctx = canvas.getContext("2d")!;

        // 1. Imagen base
        ctx.drawImage(base, 0, 0);

        // 2. Escalar logo al 45 % del lado más corto, centrado
        const shortSide = Math.min(base.width, base.height);
        const maxDim = shortSide * 0.45;
        const scale = Math.min(maxDim / logo.width, maxDim / logo.height, 1);
        const logoW = logo.width * scale;
        const logoH = logo.height * scale;
        const x = (base.width - logoW) / 2;
        const y = (base.height - logoH) / 2;

        // 3. Fondo blanco tenue para visibilidad en fotos oscuras
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 16, y - 16, logoW + 32, logoH + 32);
        ctx.restore();

        // 4. Logo semitransparente — marca de agua
        ctx.globalAlpha = 0.52;
        ctx.drawImage(logo, x, y, logoW, logoH);
        ctx.globalAlpha = 1;

        canvas.toBlob(
          (blob) => {
            resolve(
              blob ? new File([blob], file.name, { type: file.type }) : file,
            );
          },
          file.type,
          0.9,
        );
      };

      base.onerror = () => resolve(file);
      base.src = URL.createObjectURL(file);
    });
  };

  return { applyWatermark };
};
