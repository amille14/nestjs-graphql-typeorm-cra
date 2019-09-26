import * as bcrypt from 'bcryptjs'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { User } from './user.entity'
import { UserService } from './user.service'
import { RegisterArgs } from './dto/register.dto'

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly users: UserService) {}

  @Query(returns => String)
  hello() {
    return 'Hello world!'
  }

  @Mutation(returns => User)
  async register(@Args() { email, password }: RegisterArgs): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = this.users.repo.create({
      email: email.toLowerCase(),
      password: hashedPassword
    })
    return this.users.repo.save(user)
  }
}
