import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions
  } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { RedisPubSubService } from './redis/redis-pubsub.service'

export enum MutationEventType {
  INSERT = 'created',
  UPDATE = 'updated',
  DELETE = 'deleted'
}

export interface MutationEvent {
  mutation: MutationEventType
  node: any
  updatedFields?: string[]
}

export abstract class PublishableRepository {
  protected readonly eventPrefix: string

  constructor(
    protected readonly repo: Repository<any>,
    protected readonly pubsub: RedisPubSubService
  ) {}

  // Publish an arbitrary event
  publish(eventType: string, data?) {
    return this.pubsub.publish(`${this.eventPrefix}_${eventType}`, data)
  }

  // Publish a mutation event ("created", "updated", "deleted")
  publishMutation(event: MutationEvent) {
    return this.publish(event.mutation, event)
  }

  async create(entity: any) {
    const result = await this.repo.save(this.repo.create(entity))
    this.publishMutation({
      mutation: MutationEventType.INSERT,
      node: result
    })
    return result as any
  }

  async update(entity: any, updates: any) {
    const result = await this.repo.update(entity, updates)
    this.publishMutation({
      mutation: MutationEventType.UPDATE,
      node: result,
      updatedFields: Object.keys(updates)
    })
    return result as any
  }

  async delete(entity: any) {
    console.log('ENTITY', entity)
    const result = await this.repo.remove(entity)

    console.log('DELETED:', result)

    this.publishMutation({
      mutation: MutationEventType.DELETE,
      node: result
    })
    return result as any
  }

  // Warning: saving does not publish changes
  async save(entity: any, options?: SaveOptions) {
    return this.repo.save(entity, options) as any
  }

  async findWhere(where: object, options?: FindManyOptions<any>) {
    return this.repo.find({ where, ...options })
  }

  async findOne(where: object, options?: FindOneOptions<any>) {
    return this.repo.findOne({ where }, options)
  }

  async findById(id: number | string) {
    return this.repo.findOne({ where: { id } })
  }

  async findByIds(ids: any[], options?: FindManyOptions<any>) {
    return this.repo.findByIds(ids, options)
  }
}
