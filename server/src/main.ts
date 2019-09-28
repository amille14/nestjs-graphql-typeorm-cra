import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as helmet from 'helmet'
import { AppModule } from './app/app.module'

const PORT = parseInt(process.env.PORT, 10) || 5000
const HOST = process.env.HOST || 'localhost'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: `http://${HOST}:${PORT}` }
  })
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT)
  console.log(`Server listening on port ${PORT}!`) // tslint:disable-line: no-console
}
bootstrap()
