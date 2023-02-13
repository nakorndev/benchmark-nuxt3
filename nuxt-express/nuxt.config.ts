// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  serverHandlers: [{ route: '/api', middleware: true, handler: '~/subsystem/express.ts' }]
})
