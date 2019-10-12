import { ApolloLink } from 'apollo-link'

export const OPERATION_COLORS: any = {
  query: 'fuchsia',
  mutation: 'lightSeaGreen',
  subscription: 'darkOrange'
}

export const createLoggerLink = () => {
  return new ApolloLink((operation, forward) => {
    const { operationName, variables, query } = operation
    const { operation: opType } = query.definitions[0] as any

    // Log requests
    console.info(
      `%c[REQ] %c${opType.toUpperCase()} ${operationName}`,
      'color: lightskyblue;',
      `color: ${OPERATION_COLORS[opType]};`,
      variables
    )

    // Log responses
    return forward(operation).map(result => {
      if (result.errors) {
        console.error(
          `%c[RES] %c${opType.toUpperCase()} ${operationName}`,
          'color: indianred;',
          `color: ${OPERATION_COLORS[opType]}`,
          result.errors[0].message
        )
      } else {
        console.info(
          `%c[RES] %c${opType.toUpperCase()} ${operationName}`,
          'color: lightgreen;',
          `color: ${OPERATION_COLORS[opType]}`,
          result.data
        )
      }

      return result
    })
  })
}
