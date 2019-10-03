import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { RedisPubSubService } from '../../db/redis/redis-pubsub.service'
import { PublisherRepository } from '../publisher-repository.service'
import { User } from './user.entity'

@Injectable()
export class UserService extends PublisherRepository {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo)
  }

  incrementTokenVersion(user: FindConditions<User>) {
    return this.repo.increment(user, 'tokenVersion', 1)
  }
}
