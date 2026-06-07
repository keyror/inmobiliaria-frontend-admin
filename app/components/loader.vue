<template>
  <div class="loader-wrapper" v-if="isLoading">
    <div class="loader-backdrop"></div>
    <div class="loader-content">
      <div class="loader-card" role="status" aria-label="Cargando">
        <span class="loader-ring"></span>
        <svg
          class="loader-property"
          viewBox="0 0 120 120"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="loader-property-gradient"
              x1="0%"
              x2="100%"
              y1="0%"
              y2="100%"
            >
              <stop offset="0%" stop-color="var(--theme-default6)" />
              <stop offset="100%" stop-color="var(--theme-default7)" />
            </linearGradient>
          </defs>

          <g class="loader-property-glow" aria-hidden="true">
            <path
              class="loader-property-glow-line loader-property-roof"
              d="M28 57 L60 30 L92 57"
            />
            <path
              class="loader-property-glow-line loader-property-frame"
              d="M36 57 V91 H84 V57"
            />
            <path
              class="loader-property-glow-line loader-property-door"
              d="M54 91 V72 H66 V91"
            />
            <path class="loader-property-glow-scan" d="M38 101 H82" />
          </g>

          <g class="loader-property-lines">
            <path
              class="loader-property-outline loader-property-roof"
              d="M28 57 L60 30 L92 57"
            />
            <path
              class="loader-property-outline loader-property-frame"
              d="M36 57 V91 H84 V57"
            />
            <path
              class="loader-property-outline loader-property-door"
              d="M54 91 V72 H66 V91"
            />
            <path class="loader-property-scan" d="M38 101 H82" />
            <rect
              class="loader-window loader-window-1"
              x="43"
              y="61"
              width="8"
              height="8"
              rx="2"
            />
            <rect
              class="loader-window loader-window-2"
              x="56"
              y="61"
              width="8"
              height="8"
              rx="2"
            />
            <rect
              class="loader-window loader-window-3"
              x="69"
              y="61"
              width="8"
              height="8"
              rx="2"
            />
            <circle class="loader-dot loader-dot-1" cx="40" cy="101" r="3" />
            <circle class="loader-dot loader-dot-2" cx="60" cy="101" r="3" />
            <circle class="loader-dot loader-dot-3" cx="80" cy="101" r="3" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import loadingService from "~/services/LoadingService";

const isLoading = computed(() => loadingService.isLoading);
</script>

<style scoped>
.loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto; /* Cambiado de none a auto */
}

.loader-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-in-out;
  pointer-events: auto; /* Asegura que el backdrop también capture clicks */
}

.loader-content {
  position: relative;
  z-index: 10000;
  animation: scaleIn 0.3s ease-in-out;
  pointer-events: none; /* El contenido del loader no necesita capturar clicks */
}

.loader-card {
  position: relative;
  display: flex;
  width: 136px;
  height: 136px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 34px;
  background:
    radial-gradient(
      circle at 50% 42%,
      color-mix(in srgb, var(--theme-default6) 12%, transparent) 0%,
      transparent 58%
    ),
    rgba(255, 255, 255, 0.055);
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.34),
    0 0 34px color-mix(in srgb, var(--theme-default6) 28%, transparent),
    0 0 72px color-mix(in srgb, var(--theme-default7) 18%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.45));
  -webkit-backdrop-filter: blur(10px);
  isolation: isolate;
  overflow: visible;
}

.loader-card::before {
  position: absolute;
  inset: 20px;
  content: "";
  border-radius: 999px;
  background: var(--theme-gradient8);
  filter: blur(30px);
  opacity: 0.22;
  pointer-events: none;
  animation: loaderGlow 1.8s ease-in-out infinite;
}

.loader-ring {
  position: absolute;
  z-index: 1;
  inset: 13px;
  border: 1px solid color-mix(in srgb, var(--theme-default7) 28%, transparent);
  border-radius: 30px;
}

.loader-ring::before {
  position: absolute;
  width: 8px;
  height: 8px;
  content: "";
  border-radius: 50%;
  background: var(--theme-default7);
  box-shadow: 0 0 18px var(--theme-default7);
  offset-path: path(
    "M 16 0 H 86 Q 102 0 102 16 V 86 Q 102 102 86 102 H 16 Q 0 102 0 86 V 16 Q 0 0 16 0"
  );
  offset-rotate: 0deg;
  animation: loaderOrbit 1.7s linear infinite;
}

.loader-property {
  position: relative;
  z-index: 2;
  width: 92px;
  height: 92px;
  overflow: visible;
  animation: loaderFloat 1.9s ease-in-out infinite;
}

.loader-property-outline,
.loader-property-scan,
.loader-property-glow-line,
.loader-property-glow-scan {
  fill: none;
  stroke: url("#loader-property-gradient");
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loader-property-glow {
  filter: blur(3px);
  opacity: 0.34;
}

.loader-property-outline {
  stroke-width: 5;
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  filter: drop-shadow(
    0 0 2px color-mix(in srgb, var(--theme-default7) 34%, transparent)
  );
  animation: loaderDraw 1.8s ease-in-out infinite;
}

.loader-property-glow-line {
  stroke-width: 8;
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  animation: loaderDraw 1.8s ease-in-out infinite;
}

.loader-property-roof {
  animation-delay: 0s;
}

.loader-property-frame {
  animation-delay: 0.14s;
}

.loader-property-door {
  animation-delay: 0.28s;
}

.loader-property-scan {
  stroke-width: 3.6;
  stroke-dasharray: 44;
  stroke-dashoffset: 44;
  opacity: 0.58;
  animation: loaderScan 1.8s ease-in-out infinite 0.16s;
}

.loader-property-glow-scan {
  stroke-width: 6;
  stroke-dasharray: 44;
  stroke-dashoffset: 44;
  animation: loaderScan 1.8s ease-in-out infinite 0.16s;
}

.loader-window,
.loader-dot {
  fill: var(--theme-default7);
  filter: drop-shadow(
    0 0 4px color-mix(in srgb, var(--theme-default7) 28%, transparent)
  );
}

.loader-window {
  opacity: 0.16;
  animation: loaderWindow 1.8s ease-in-out infinite;
}

.loader-window-1 {
  animation-delay: 0.1s;
}

.loader-window-2 {
  animation-delay: 0.24s;
}

.loader-window-3 {
  animation-delay: 0.38s;
}

.loader-dot {
  opacity: 0.18;
  animation: loaderDot 1.8s ease-in-out infinite;
}

.loader-dot-1 {
  animation-delay: 0.05s;
}

.loader-dot-2 {
  animation-delay: 0.2s;
}

.loader-dot-3 {
  animation-delay: 0.35s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes loaderFloat {
  0%,
  100% {
    transform: translate3d(0, 3px, 0);
  }
  50% {
    transform: translate3d(0, -4px, 0);
  }
}

@keyframes loaderDraw {
  0% {
    stroke-dashoffset: 130;
    opacity: 0.24;
  }
  46%,
  68% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -130;
    opacity: 0.28;
  }
}

@keyframes loaderScan {
  0% {
    stroke-dashoffset: 44;
    opacity: 0.18;
  }
  45%,
  70% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  100% {
    stroke-dashoffset: -44;
    opacity: 0.18;
  }
}

@keyframes loaderWindow {
  0%,
  100% {
    opacity: 0.14;
    transform: translateY(0);
  }
  50% {
    opacity: 0.92;
    transform: translateY(-1px);
  }
}

@keyframes loaderDot {
  0%,
  100% {
    opacity: 0.18;
    transform: scale(0.78);
  }
  50% {
    opacity: 0.92;
    transform: scale(1);
  }
}

@keyframes loaderGlow {
  0%,
  100% {
    opacity: 0.24;
    transform: scale(0.92);
  }
  50% {
    opacity: 0.48;
    transform: scale(1.08);
  }
}

@keyframes loaderOrbit {
  to {
    offset-distance: 100%;
  }
}
</style>
