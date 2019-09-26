import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app/app.module'

const PORT = parseInt(process.env.PORT, 10) || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT)
  console.log(`Server listening at port ${PORT}!`) // tslint:disable-line: no-console
}
bootstrap()
