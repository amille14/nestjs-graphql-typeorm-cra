import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { PublishableRepository } from '../publishable-repository.service'
import { RedisPubSubService } from '../redis/redis-pubsub.service'
import { User } from './user.entity'

@Injectable()
export class UserService extends PublishableRepository {
  eventPrefix = 'user'

  constructor(
    @InjectRepository(User) repo: Repository<User>,
    pubsub: RedisPubSubService
  ) {
    super(repo, pubsub)
  }

  incrementTokenVersion(user: FindConditions<User>) {
    return this.repo.increment(user, 'tokenVersion', 1)
  }
}
