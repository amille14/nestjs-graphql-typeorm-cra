import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { DefaultResolver } from './default.resolver'
import { GqlContext } from './types/gql-context.type'

const isDev = process.env.NODE_ENV === 'development'

// Our apollo graphql api

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async ([authService]: AuthService[]) => ({
        autoSchemaFile: 'schema.gql',
        path: '/api',
        debug: isDev,
        playground: isDev,
        installSubscriptionHandlers: true,
        subscriptions: {
          path: '/api/ws',
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
        context: async ({ req, res, connection }): Promise<GqlContext> => {
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
    })
  ],
  providers: [DefaultResolver]
})
export class ApiModule {}
