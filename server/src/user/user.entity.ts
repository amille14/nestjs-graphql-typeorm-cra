import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Field, ID } from 'type-graphql'

@Entity({ name: 'users' })
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(type => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  @Column('text', { unique: true })
  email: string

  @Column('text')
  password: string

  @Column('int', { default: 0 })
  tokenVersion: number
}
