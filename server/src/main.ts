import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import * as cookieParser from 'cookie-parser'
import debug from 'debug'
import * as helmet from 'helmet'
import { AppModule } from './app.module'
debug('server')

const PORT = parseInt(process.env.PORT, 10) || 5000
const HOST = process.env.HOST || 'localhost'

async function bootstrap() {
  // Create main nest app with CORS
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: `http://${HOST}:${PORT}` }
  })

  // Global middlewares
  app.use(helmet())
  app.use(cookieParser())

  // Setup validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalPipes(new ValidationPipe())

  // Start server
  await app.listen(PORT)
  console.log(`Server listening on port ${PORT}!`) // tslint:disable-line: no-console
}
bootstrap()
