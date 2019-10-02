import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from './../auth/auth.service'

const isDev = process.env.NODE_ENV === 'development'

@Module({
  imports: [
    // Setup postgres connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
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
        installSubscriptionHandlers: true,
        subscriptions: {
          // path: process.env.GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
          onConnect: async (params, socket, context) => {
            const { accessToken } = params

            console.log('WEBSOCKET CONNECTED')

            // TODO: Handle cookies

            // This gets attached to connection.context object
            return { accessToken }
          },
          onDisconnect: async (socket, context) => {
            console.log('WEBSOCKET DISCONNECTED')
          }
        },
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
