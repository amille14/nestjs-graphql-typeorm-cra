import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'
import { IdEntity, IdEntityPartial } from '../shared/types/id-entity.types'
import { createMutationPayloadType } from '../shared/types/mutation-payload.types'

@Entity()
@ObjectType()
export class User extends IdEntity {
  @Field()
  @Column('text', { unique: true })
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  @IsNotEmpty()
  email?: string

  @Column('text')
  @MinLength(8, { message: 'PASSWORD_TOO_SHORT' })
  @IsNotEmpty()
  password?: string

  @Column('int', { default: 0 })
  tokenVersion?: number
}

@ObjectType()
export class UserPartial extends IdEntityPartial {
  @Field({ nullable: true })
  email?: string
}

@ObjectType()
export class UserMutationPayload extends createMutationPayloadType(
  User,
  UserPartial
) {}
