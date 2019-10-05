import { ObjectType } from 'type-graphql'
import { createMutationPayloadType } from '../shared/types/mutation-payload.types'
import { User, UserPartial } from './user.entity'

@ObjectType()
export class UserMutationPayload extends createMutationPayloadType(
  User,
  UserPartial
) {}
