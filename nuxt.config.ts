export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Montserrat:400,400i,500,500i,600,600i,700,700i,800,800i",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Rubik:400,400i,500,500i,700,700i",
        },
      ],
    },
  },

  css: ["@/assets/scss/app.scss", "sweetalert2/dist/sweetalert2.min.css"],

  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  modules: [
    "@nuxt/icon",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
  ],
  i18n: {
    locales: [
      { code: "es", name: "Español", file: "es.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    defaultLocale: "es",
    langDir: "locales/",
  },
  pinia: {
    storesDirs: ["./store/**", "./custom-folder/store/**"],
  },

  plugins: [
    {
      src: "@/plugins/usebootstrap.client.ts",
      mode: "client",
    },
    {
      src: "@/plugins/plugins.ts",
      mode: "client",
    },
    {
      src: "@/plugins/ssrplugins.ts",
    },
  ],

  vite: {
    optimizeDeps: {
      include: [
        "bootstrap/dist/js/bootstrap.bundle",
        "@syncfusion/ej2-vue-maps",
        "dropzone-vue",
        "vue-datamaps",
        "vue3-apexcharts",
        "vue3-openlayers",
        "swiper/vue",
        "vue3-easy-data-table",
        "vuedraggable",
        "sweetalert2",
        "vee-validate",
        "@vee-validate/yup",
        "yup",
      ],
    },
  },
  compatibilityDate: "2025-02-24",
});
