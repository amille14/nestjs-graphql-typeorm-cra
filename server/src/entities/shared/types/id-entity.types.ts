import { Field, ID, ObjectType } from 'type-graphql'
import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn
  } from 'typeorm'
import cuid = require('cuid')

// Base class for all entities
@ObjectType({ isAbstract: true })
export abstract class IdEntity {
  @Field(type => ID)
  @PrimaryColumn()
  id: string // uses cuid

  @Field(type => Date)
  @CreateDateColumn()
  createdAt?: Date

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt?: Date

  // Stores changes when updating so we can access later
  changes?: Partial<IdEntity>

  @BeforeInsert()
  generateId() {
    this.id = cuid()
  }
}

// Base class for all entity partials (used for updating)
@ObjectType({ isAbstract: true })
export abstract class IdEntityPartial implements Partial<IdEntity> {
  @Field(type => ID, { nullable: true })
  id: string

  @Field(type => Date, { nullable: true })
  createdAt: Date

  @Field(type => Date, { nullable: true })
  updatedAt: Date

  generateId() {}
}
