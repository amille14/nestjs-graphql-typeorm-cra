import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import { AppModule } from './app.module'

const CLIENT_HOST = process.env.REACT_APP_CLIENT_HOST || 'localhost'
const CLIENT_PORT = parseInt(process.env.REACT_APP_CLIENT_PORT, 10) || 3000
const SERVER_PORT = parseInt(process.env.PORT, 10) || 4000

export const CORS_OPTIONS = {
  credentials: true,
  origin: `http://${CLIENT_HOST}:${CLIENT_PORT}`
}

async function bootstrap() {
  // Create main nest app with CORS
  const app = await NestFactory.create(AppModule, { cors: CORS_OPTIONS })

  // Global middlewares
  app.use(helmet())
  app.use(cookieParser())

  // Setup validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalPipes(new ValidationPipe())

  // Start server
  await app.listen(SERVER_PORT)
  console.log(`Server listening on port ${SERVER_PORT}!`) // tslint:disable-line: no-console
}
bootstrap()
