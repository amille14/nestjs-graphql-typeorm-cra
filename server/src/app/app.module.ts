import { Inject, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { AuthService } from './../auth/auth.service'

const isDev = process.env.NODE_ENV === 'development'

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
    // Setup apollo graphql server
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async ([authService]: AuthService[]) => ({
        autoSchemaFile: 'schema.gql',
        debug: isDev,
        playground: isDev,
        path: process.env.GRAPHQL_ENDPOINT || '/graphql',
        context: async ({ req, res, connection }) => {
          // Get socket connection metadata, if available (subscriptions only)
          let conn
          if (connection) conn = connection.context

          // Get access token, if available
          const accessToken = authService.getAccessTokenFromContext({
            req,
            conn
          })

          // Get current user from access token, if available
          const currentUser = authService.getUserFromToken(accessToken)

          return {
            req,
            res,
            conn,
            currentUser
          }
        }
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
