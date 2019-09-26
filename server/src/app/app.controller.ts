import { Controller, Get } from '@nestjs/common'

@Controller('app')
export class AppController {
  @Get()
  hello(): string {
    return 'Hello, world!'
  }
}
