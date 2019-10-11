import { Inject, Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
  } from 'typeorm'
import { RedisPubSubService } from '../../../db/redis/redis-pubsub.service'
import { MutationPayload, MutationType } from '../types/mutation-payload.types'

// Listen for "insert", "update", and "delete" events on all entities and
// publish corresponding mutation events for graphql subscriptions

@EventSubscriber()
@Injectable()
export class MutationPublisherSubscriber implements EntitySubscriberInterface<any> {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject('RedisPubSubService') private readonly pubsub: RedisPubSubService
  ) {
    connection.subscribers.push(this)
  }

  publishMutation(
    mutationType: MutationType,
    event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>
  ) {
    const {
      metadata: { target, targetName }
    } = event

    const mutation: MutationPayload<any> = {
      mutation: mutationType,
      entity: mutationType === MutationType.DELETE ? (event as any).databaseEntity : event.entity
    }

    if (mutationType === MutationType.UPDATE) {
      const updatedFields = Object.keys(event.entity.changes)
      mutation.updatedFields = updatedFields
      mutation.previousValues = (event as any).databaseEntity
      delete mutation.entity.changes
    }

    this.pubsub.publish(`${targetName}_${mutationType}`, mutation)
  }

  // Store entity changes before updating
  async beforeUpdate(event: UpdateEvent<any>) {
    const { entity, databaseEntity } = event
    if (!entity.changes) event.entity.changes = { ...entity }
    delete event.entity.changes.id
  }

  async afterInsert(event: InsertEvent<any>) {
    this.publishMutation(MutationType.INSERT, event)
  }

  async afterUpdate(event: UpdateEvent<any>) {
    this.publishMutation(MutationType.UPDATE, event)
  }

  async afterRemove(event: RemoveEvent<any>) {
    this.publishMutation(MutationType.DELETE, event)
  }
}
