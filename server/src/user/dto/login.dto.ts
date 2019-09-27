import { User } from './../user.entity'
import { ArgsType, Field, ObjectType } from 'type-graphql'

@ArgsType()
export class LoginArgs {
  @Field()
  email: string

  @Field()
  password: string
}

@ObjectType()
export class LoginPayload {
  @Field(type => User)
  user: User

  @Field()
  accessToken: string
}
