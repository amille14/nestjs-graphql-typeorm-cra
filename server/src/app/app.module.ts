import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppController } from './app.controller'

const isDev = process.env.NODE_ENV === 'development'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../client')
    }),
    GraphQLModule.forRoot({
      debug: isDev,
      playground: isDev
    })
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
