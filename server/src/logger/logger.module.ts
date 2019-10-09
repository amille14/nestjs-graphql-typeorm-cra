import { Module } from '@nestjs/common'
import { GqlLoggerService } from './gql-logger.service'

@Module({
  providers: [GqlLoggerService],
  exports: [GqlLoggerService]
})
export class LoggerModule {}
