import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate
  } from 'class-validator'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'
import { IdEntity, IdEntityPartial } from '../shared/types/id-entity.types'
import { IsUnique } from '../shared/validators/is-unique.validator'

@Entity()
@ObjectType()
export class User extends IdEntity {
  // Graphql fields
  // ==============

  @Field()
  @IsEmail(undefined, { message: 'INVALID_EMAIL' })
  @IsNotEmpty()
  @Validate(IsUnique)
  @Column('text', { unique: true })
  email?: string

  // Database only
  // =============

  @Column()
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
