import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Connection } from 'typeorm'

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments) {
    // Check if another record of the same type exists with this property value
    const exists = await this.connection.manager.findOne(args.targetName, {
      where: { [args.property]: args.value }
    })
    return !exists
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property.toUpperCase()}_ALREADY_EXISTS`
  }
}
