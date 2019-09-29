import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
  } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { GqlContext } from '../types/gqlContext.type'
import { AuthService } from './auth.service'

@Injectable()
export class SetCurrentUser implements NestInterceptor {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  // Updates the graphql context to include the current user id (from the provided access token)
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context)
    const gqlCtx: GqlContext = ctx.getContext()
    const token = this.authService.getAccessTokenFromContext(gqlCtx)
    const user = this.authService.getUserFromToken(token)
    gqlCtx.currentUser = user
    return next.handle()
  }
}
