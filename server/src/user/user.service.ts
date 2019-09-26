import { User } from './user.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) public readonly repo: Repository<User>) {}
}
