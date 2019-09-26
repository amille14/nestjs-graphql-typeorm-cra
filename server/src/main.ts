import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import logger from 'morgan'

async function bootstrap() {
  const PORT = parseInt(process.env.PORT, 10) || 5000
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
  console.log(`Server listening at port ${PORT}!`)
}
bootstrap()
