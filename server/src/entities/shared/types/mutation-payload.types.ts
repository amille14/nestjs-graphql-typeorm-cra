import {
  ClassType,
  Field,
  ObjectType,
  registerEnumType
  } from 'type-graphql'

export enum MutationType {
  INSERT = 'created',
  UPDATE = 'updated',
  DELETE = 'deleted'
}
registerEnumType(MutationType, { name: 'MutationEventType' })

export interface MutationPayload<Entity> {
  mutation: MutationType
  entity: Entity
  updatedFields?: string[]
  previousValues?: Partial<Entity>
}

// Factory function for creating mutation payload graphql types for a given entity type
export function createMutationPayloadType<Entity>(
  EntityClass: ClassType<Entity>,
  PartialEntityClass: ClassType<Entity>
): any {
  @ObjectType({ isAbstract: true })
  abstract class MutationPayloadClass implements MutationPayload<Entity> {
    @Field(type => MutationType)
    mutation: MutationType
    @Field(type => EntityClass)
    entity: Entity
    @Field(type => [String], { nullable: true })
    updatedFields?: string[]
    @Field(type => PartialEntityClass, { nullable: true })
    previousValues?: Partial<Entity>
  }

  return MutationPayloadClass
}
