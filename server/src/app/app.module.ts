import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { UserModule } from '../user/user.module'

const isDev = process.env.NODE_ENV === 'development'

const ENTITY_MODULES = []
const GQL_ENTITY_MODULES = [AuthModule, UserModule]

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
      entities: ['./src/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true
    }),
    ...ENTITY_MODULES,
    // Create db entities and graphql schema
    // Setup apollo graphql server
    GraphQLModule.forRootAsync({
      imports: GQL_ENTITY_MODULES,
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: 'schema.gql',
        debug: isDev,
        playground: isDev,
        path: process.env.GRAPHQL_ENDPOINT || '/graphql',
        context: ({ req, res, connection }) => ({
          req,
          res,
          conn: connection ? connection.context : null

          // TODO: Add current user to context
        })
      })
    }),
    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../client/build'),
      renderPath: '/static'
    })
  ]
})
export class AppModule {}
