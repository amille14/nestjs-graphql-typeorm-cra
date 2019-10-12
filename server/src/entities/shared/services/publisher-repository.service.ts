import { Inject } from '@nestjs/common'
import { DeepPartial, FindManyOptions, Repository } from 'typeorm'
import { RedisPubSubService } from '../../../db/redis/redis-pubsub.service'
import { IdEntity } from '../types/id-entity.types'

// A typeorm repository service capable of publishing events
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

  // Create and save an entity, updating if it already exists
  async createOrUpdate(entity: DeepPartial<Entity>) {
    return await this.repo.save(this.build(entity) as any)
  }

  // Update an existing entity
  // TODO: Can this be done in a single query?
  async update(entity: Entity, updates: Partial<Entity>) {
    const current = await this.repo.findOneOrFail({ where: entity })
    // Assign updates and set changes field so we can access changed fields later
    const toUpdate = Object.assign(current, updates, { changes: updates })
    return await this.repo.save(toUpdate as any)
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
  async findOne(where: Partial<Entity>) {
    if (!where) return Promise.resolve(null)
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

  async findAll() {
    return this.repo.find()
  }

  getRepo() {
    return this.repo
  }

  buildQuery() {
    return this.repo.createQueryBuilder()
  }
}
