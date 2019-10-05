import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
  } from 'typeorm'
import { User } from './user.entity'

// Listen for insert and update events on all entities and run validation

const SALT_ROUNDS = 12

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return User
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS)
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { password } = event.entity
    if (password) {
      event.entity.password = await this.hashPassword(password)
    }
  }
}
