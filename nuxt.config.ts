export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        {rel:'stylesheet' , href:'https://fonts.googleapis.com/css?family=Montserrat:400,400i,500,500i,600,600i,700,700i,800,800i'},
        {rel:'stylesheet' , href:'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i&display=swap'},
        {rel:'stylesheet' , href:'https://fonts.googleapis.com/css?family=Rubik:400,400i,500,500i,700,700i'}
      ]
    },
  },

  css:['@/assets/scss/app.scss'],

  script:[
    {
      src:'/bootstrap.bundle.min.js'
    }
],



  build: {
    transpile: ['@vuepic/vue-datepicker']
  },

  modules: ['nuxt-icon' , '@pinia/nuxt'],
  pinia: {
    storesDirs: ['./store/**', './custom-folder/store/**'],
  },

  plugins:[
    {
      src:'@/plugins/usebootstrap.client.ts',
      mode:'client'
    },
    {
      src:'@/plugins/plugins.ts',
      mode:'client'
    },
    {
      src:'@/plugins/ssrplugins.ts'
    }
  ],

  compatibilityDate: '2025-02-24'
})