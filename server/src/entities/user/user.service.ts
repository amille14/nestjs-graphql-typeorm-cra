import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { PublisherRepository } from '../shared/publisher-repository.service'
import { User } from './user.entity'

@Injectable()
export class UserService extends PublisherRepository<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo)
  }

  incrementTokenVersion(user: FindConditions<User>) {
    return this.repo.increment(user, 'tokenVersion', 1)
  }
}
