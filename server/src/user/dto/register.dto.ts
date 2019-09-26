import { ArgsType, Field } from 'type-graphql'
import { IsEmail, MinLength } from 'class-validator'

@ArgsType()
export class RegisterArgs {
  @Field()
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  email: string

  @Field()
  @MinLength(8, { message: 'PASSWORD_TOO_SHORT' })
  password: string
}
