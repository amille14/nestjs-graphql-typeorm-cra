import { Inject } from '@nestjs/common'
import { pick } from 'lodash'
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions
  } from 'typeorm'
import { RedisPubSubService } from '../db/redis/redis-pubsub.service'

export enum MutationEventType {
  INSERT = 'created',
  UPDATE = 'updated',
  DELETE = 'deleted'
}

export interface MutationEvent {
  mutation: MutationEventType
  node: any
  updatedFields?: string[]
  previousValues?: any
}

// A typeorm repository service that publishes mutation events
// for use with graphql subscriptions.

export abstract class PublisherRepository {
  @Inject('RedisPubSubService') protected readonly pubsub: RedisPubSubService
  protected readonly eventPrefix: string

  constructor(protected readonly repo: Repository<any>) {
    const { name } = repo.metadata
    this.eventPrefix = name
  }

  // Publish an arbitrary event with this repo's event prefix
  publish(eventType: string, data?) {
    return this.pubsub.publish(`${this.eventPrefix}_${eventType}`, data)
  }

  // Publish a mutation event ("created", "updated", "deleted")
  publishMutation(event: MutationEvent) {
    return this.publish(event.mutation, event)
  }

  // Initialize a new entity without saving
  new(entity: any) {
    return this.repo.create(entity) as any
  }

  // Create and save an entity
  async create(entity: any) {
    const result = await this.repo.save(entity)
    this.publishMutation({
      mutation: MutationEventType.INSERT,
      node: result
    })
    return result as any
  }

  // Update an existing entity
  // TODO: Can this be done in a single query?
  async update(entity: any, updates: any) {
    const toUpdate = await this.findOne(entity)
    const result = await this.repo.save({ id: toUpdate.id, ...updates })
    const updatedFields = Object.keys(updates)
    this.publishMutation({
      mutation: MutationEventType.UPDATE,
      node: result,
      updatedFields,
      previousValues: pick(toUpdate, updatedFields)
    })
    return result as any
  }

  // Find and delete an existing entity
  // TODO: Can this be done in a single query?
  async delete(entity: any) {
    const toDelete = await this.findOne(entity)
    const result = await this.repo.remove(entity)
    this.publishMutation({
      mutation: MutationEventType.DELETE,
      node: toDelete
    })
    return toDelete as any
  }

  // Save an entity without publishing changes
  async save(entity: any, options?: SaveOptions) {
    return this.repo.save(entity, options) as any
  }

  // Find all matching entities
  async findWhere(where: object, options?: FindManyOptions<any>) {
    return this.repo.find({ where, ...options })
  }

  // Find one matching entity
  async findOne(where: object, options?: FindOneOptions<any>) {
    return this.repo.findOne({ where }, options)
  }

  async findById(id: number | string) {
    return this.repo.findOne({ where: { id } })
  }

  async findByIds(ids: any[], options?: FindManyOptions<any>) {
    return this.repo.findByIds(ids, options)
  }

  getRepo() {
    return this.repo
  }

  buildQuery() {
    return this.repo.createQueryBuilder()
  }
}
