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
import { IdEntity } from '../types/id-entity.types'
import { MutationPayload, MutationType } from '../types/mutation-payload.types'

// Listen for "insert", "update", and "delete" events on all entities and
// publish corresponding mutation events for graphql subscriptions

@EventSubscriber()
@Injectable()
export class MutationPublisherSubscriber
  implements EntitySubscriberInterface<IdEntity> {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject('RedisPubSubService') private readonly pubsub: RedisPubSubService
  ) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return IdEntity
  }

  publishMutation(
    mutationType: MutationType,
    event: InsertEvent<IdEntity> | UpdateEvent<IdEntity> | RemoveEvent<IdEntity>
  ) {
    const {
      metadata: { target, targetName }
    } = event

    const mutation: MutationPayload<any> = {
      mutation: mutationType,
      entity:
        mutationType === MutationType.DELETE
          ? (event as any).databaseEntity
          : event.entity
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
  async beforeUpdate(event: UpdateEvent<IdEntity>) {
    const { entity, databaseEntity } = event
    if (!entity.changes) event.entity.changes = { ...entity }
    delete event.entity.changes.id
  }

  async afterInsert(event: InsertEvent<IdEntity>) {
    this.publishMutation(MutationType.INSERT, event)
  }

  async afterUpdate(event: UpdateEvent<IdEntity>) {
    this.publishMutation(MutationType.UPDATE, event)
  }

  async afterRemove(event: RemoveEvent<IdEntity>) {
    this.publishMutation(MutationType.DELETE, event)
  }
}
