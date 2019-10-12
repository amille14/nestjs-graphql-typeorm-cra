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
  constructor(@Inject('AuthService') private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext()
    const accessToken = this.authService.getAccessTokenFromContext(ctx)
    return !!this.authService.validateAccessToken(accessToken)
  }
}
