import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('DateTime', type => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description =
    'The javascript `Date` as string. Type represents date and time as the ISO Date string.'

  parseValue(value: string): Date {
    return new Date(value)
  }

  serialize(value: Date | string): string {
    return new Date(value).toISOString()
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
}
