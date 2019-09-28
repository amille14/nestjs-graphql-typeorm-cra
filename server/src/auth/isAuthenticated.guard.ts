import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable
  } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from './auth.service'

@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const gqlCtx = ctx.getContext()
    const token = this.authService.getAccessTokenFromContext(gqlCtx)
    return !!this.authService.validateAccessToken(token)
  }
}
