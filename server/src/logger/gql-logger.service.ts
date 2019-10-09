import { Injectable } from '@nestjs/common'
import { GraphQLRequest, GraphQLResponse } from 'apollo-server-core'
import chalk from 'chalk'
import { GraphQLError, parse, print } from 'graphql'
import { inspect } from 'util'

// tslint:disable: no-console

@Injectable()
export class GqlLoggerService {
  private readonly colors = {
    req: 'blue',
    res: 'cyan',
    err: 'red'
  }

  private log(type: 'req' | 'res' | 'err', output) {
    const color = this.colors[type]
    console.log(chalk[color](`[GQL ${type.toUpperCase()}] `, output))
  }

  logRequest(req: Request) {
    const { query } = req.body as any
    const parsed = parse(query)
    parsed.definitions.forEach(def => {
      // Don't log fragments or introspection queries
      if (def.kind === 'OperationDefinition') {
        if (def.name && def.name.value === 'IntrospectionQuery') return
        this.log('req', print(def))
      }
    })
  }

  logResponse(res: GraphQLResponse) {
    // Don't log introspection queries
    if (res.data && !res.data.__schema) {
      this.log('res', inspect(res.data, { depth: 2 }))
    }
  }

  logError(error: GraphQLError) {
    this.log('err', inspect(error.extensions))
  }
}
