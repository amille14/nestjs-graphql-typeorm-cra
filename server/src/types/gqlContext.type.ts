import { Request, Response } from 'express'
import { User } from '../user/user.entity'

export class GqlContext {
  req?: Request
  res?: Response
  conn?: any
  currentUser?: User
}
