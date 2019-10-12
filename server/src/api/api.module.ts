import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { pick } from 'lodash'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { GqlLoggerService } from '../logger/gql-logger.service'
import { LoggerModule } from '../logger/logger.module'
import { CORS_OPTIONS } from '../main'
import { DefaultResolver } from './default.resolver'
import { DateTimeScalar } from './scalars/datetime.scalar'
import { GqlContext } from './types/gql-context.type'

// Our apollo graphql api

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [AuthModule, ConfigModule, LoggerModule],
      inject: [AuthService, ConfigService, GqlLoggerService],
      useFactory: async (
        authService: AuthService,
        configService: ConfigService,
        loggerService: GqlLoggerService
      ) => ({
        autoSchemaFile: 'schema.gql',
        path: '/api',
        cors: CORS_OPTIONS,
        debug: configService.isDev(),
        playground: configService.isDev(),
        installSubscriptionHandlers: true,
        subscriptions: {
          path: '/api',
          onConnect: async (params, socket, context) => {
            const { accessToken, clientId } = params
            console.log(`Websocket connected (client id: ${clientId}).`)

            socket.metadata = {
              clientId
            }

            // This gets attached to connection.context object and passed to graphql context
            return { accessToken }
          },
          onDisconnect: async (socket, context) => {
            console.log(`Websocket disconnected (client id: ${socket.metadata.clientId}).`)
          }
        },
        context: async ({ req, res, connection, payload = {} }): Promise<GqlContext> => {
          if (req) loggerService.logRequest(req)

          // Get socket connection metadata, if available (subscriptions only)
          let conn
          if (connection) {
            // On each subscription operation we send additional metadata (like accessToken) in payload.
            // We need to merge it with metadata sent on initializing the connection.
            Object.assign(connection.context, pick(payload, ['accessToken', 'clientId']))
            conn = connection.context
          }

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
        },
        formatError: error => {
          loggerService.logError(error)
          return error
        },
        formatResponse: res => {
          loggerService.logResponse(res)
          return res
        }
      })
    })
  ],
  providers: [DateTimeScalar, DefaultResolver]
})
export class ApiModule {}
