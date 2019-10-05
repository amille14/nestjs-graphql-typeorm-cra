import { Inject } from '@nestjs/common'
import { pick } from 'lodash'
import { DeepPartial, FindManyOptions, Repository } from 'typeorm'
import { RedisPubSubService } from '../../db/redis/redis-pubsub.service'
import { IdEntity } from './types/id-entity.types'
import { MutationPayload, MutationType } from './types/mutation-payload.types'

// A typeorm repository service that publishes mutation events
// for use with graphql subscriptions.

export abstract class PublisherRepository<Entity extends IdEntity> {
  @Inject('RedisPubSubService') protected readonly pubsub: RedisPubSubService
  protected readonly eventPrefix: string

  constructor(protected readonly repo: Repository<Entity>) {
    const { name } = repo.metadata
    this.eventPrefix = name
  }

  // Publish an arbitrary event with this repo's event prefix
  publish(eventType: string, data?) {
    return this.pubsub.publish(`${this.eventPrefix}_${eventType}`, data)
  }

  // Initialize a new entity without saving
  build(entity: DeepPartial<Entity>): Entity {
    return this.repo.create(entity)
  }

  // Create and save an entity, updating it if it already exists
  async createOrUpdate(entity: DeepPartial<Entity>) {
    return await this.repo.save(this.build(entity) as any)
  }

  // Update an existing entity
  // TODO: Can this be done in a single query?
  async update(entity: Entity, updates: Partial<Entity>) {
    const current = await this.repo.findOneOrFail({ where: entity })
    // Build a new entity with only the id and updated fields.
    // This allows us to publish only the fields that changed in the MutationPublisherSubscriber.
    const toUpdate: any = this.build({ id: current.id, ...updates } as any)
    return await this.repo.save(toUpdate)
  }

  // Find and delete an existing entity
  // TODO: Can this be done in a single query?
  async delete(entity: Entity) {
    const current = await this.repo.findOneOrFail({ where: entity })
    // Delete the clone so we can return all the original values
    const toDelete = this.build(current as any)
    await this.repo.remove(toDelete)
    return current
  }

  // Find one matching entity
  async findOne(where: any) {
    return this.repo.findOne({ where })
  }

  async findById(id: number | string) {
    return this.repo.findOne({ where: { id } })
  }

  async findByIds(ids: number[] | string[], options?: FindManyOptions<Entity>) {
    return this.repo.findByIds(ids, options)
  }

  async findWhere(where: Partial<Entity>, options?: FindManyOptions<Entity>) {
    return this.repo.find({ where, ...options })
  }

  getRepo() {
    return this.repo
  }

  buildQuery() {
    return this.repo.createQueryBuilder()
  }
}
