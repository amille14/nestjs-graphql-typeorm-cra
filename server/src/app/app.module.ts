import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserResolver } from '../user/user.resolver'
import { UserModule } from './../user/user.module'

const isDev = process.env.NODE_ENV === 'development'

const ENTITY_MODULES = [UserModule]

@Module({
  imports: [
    // Setup postgres connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: null,
      database: 'development',
      entities: ['./**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    // Create db entities and graphql schema
    ...ENTITY_MODULES,
    // Setup apollo graphql server
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: isDev,
      playground: isDev,
      path: process.env.GRAPHQL_ENDPOINT || '/graphql'
    }),
    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../client/build'),
      renderPath: '/static'
    })
  ]
})
export class AppModule {}
