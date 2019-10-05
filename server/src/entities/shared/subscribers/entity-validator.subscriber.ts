import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { validateOrReject } from 'class-validator'
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
  } from 'typeorm'

// Listen for insert and update events on all entities and run validation

@EventSubscriber()
@Injectable()
export class EntityValidatorSubscriber implements EntitySubscriberInterface {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this)
  }

  async validateEventEntity(
    event: InsertEvent<any> | UpdateEvent<any>,
    skipMissingProperties: boolean = false
  ) {
    try {
      // Save accepts raw objects so we need to build an entity of
      // the target class in order to access validation metadata
      const entity = event.manager.create(
        event.metadata.target as any,
        event.entity
      )

      await validateOrReject(entity, {
        skipMissingProperties,
        forbidUnknownValues: true
      })
    } catch (err) {
      throw new UnprocessableEntityException(err)
    }
  }

  async beforeInsert(event: InsertEvent<any>) {
    await this.validateEventEntity(event)
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    await this.validateEventEntity(event, true)
  }
}
