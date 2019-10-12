import { DocumentNode, OperationDefinitionNode } from 'graphql'
import { useEffect, useState } from 'react'

export const useForceUpdate = () => {
  const [update, setUpdate] = useState(true)
  return () => setUpdate(!update)
}

export const itemsUpdateQuery = (
  subscriptionName: string,
  prev: any,
  { subscriptionData: { data } }
) => {
  const {
    [subscriptionName]: { mutation, entity }
  } = data as any
  const queryName = Object.keys(prev)[0]
  let next = [...prev[queryName]]
  switch (mutation) {
    case 'INSERT':
      next.push(entity)
      break
    case 'UPDATE':
      const i = next.findIndex(u => u.id === entity.id)
      next[i] = entity
      break
    case 'DELETE':
      next = next.filter(u => u.id !== entity.id)
      break
    default:
      break
  }
  return { [queryName]: next }
}

// Subscribe to changes on a list of items query
export const useSubscribeToItems = (
  subscribeToMore: Function, // subscribeToMore function from useQuery hook
  document: DocumentNode, // Subscription document
  variables?: object,
  onError?: Function
) => {
  useEffect(() => {
    return subscribeToMore({
      document,
      variables,
      onError,
      updateQuery: (prev, updateOptions) => {
        const operation = document.definitions.find(
          d => d.kind === 'OperationDefinition' && d.operation === 'subscription'
        ) as OperationDefinitionNode
        const selection = operation.selectionSet.selections[0] as any
        const subscriptionName = selection.name.value
        return itemsUpdateQuery(subscriptionName, prev, updateOptions)
      }
    })
  }, [subscribeToMore, document, variables, onError])
}
