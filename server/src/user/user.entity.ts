import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
  } from 'typeorm'

@Entity()
@ObjectType()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(type => Date)
  @CreateDateColumn()
  createdAt?: Date

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt?: Date

  @Field()
  @Column('text', { unique: true })
  email?: string

  @Column('text')
  password?: string

  @Column('int', { default: 0 })
  tokenVersion?: number
}
