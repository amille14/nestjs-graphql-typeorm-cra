import { DocumentNode, OperationDefinitionNode, SelectionNode } from 'graphql'
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
  variables?: any // Variables to pass to subscribeToMore options
) => {
  useEffect(() => {
    return subscribeToMore({
      document,
      variables,
      updateQuery: (prev, options) => {
        const operation = document.definitions.find(
          d => d.kind === 'OperationDefinition' && d.operation === 'subscription'
        ) as OperationDefinitionNode
        const selection = operation.selectionSet.selections[0] as any
        const subscriptionName = selection.name.value
        return itemsUpdateQuery(subscriptionName, prev, options)
      }
    })
  }, [subscribeToMore, document, variables])
}
