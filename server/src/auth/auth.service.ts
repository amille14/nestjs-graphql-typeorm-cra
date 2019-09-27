import * as bcrypt from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.repo.findOne({ email })
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (isPasswordValid) return user
    }
    return null
  }

  async getAccessToken(user: User) {
    const payload = { userId: user.id }
    return this.jwtService.sign(payload)
  }

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = this.users.repo.create({
      email: email.toLowerCase(),
      password: hashedPassword
    })
    return this.users.repo.save(user)
  }
}
