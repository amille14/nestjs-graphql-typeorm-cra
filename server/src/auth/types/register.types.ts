import { IsEmail, MinLength } from 'class-validator'
import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class RegisterArgs {
  @Field()
  email: string

  @Field()
  password: string
}
