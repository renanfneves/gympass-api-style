import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0', // it ensures external access for some frontend projects (ex.: React Native apps)
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
