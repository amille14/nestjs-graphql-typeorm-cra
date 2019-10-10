import cuid from 'cuid'

export const defaults = {
  accessToken: '',
  clientId: cuid()
}

export const resolvers = {
  Query: {},
  Mutation: {
    setAccessToken: (_: any, { accessToken }: any, { cache }: any) => {
      cache.writeData({ data: { accessToken } })
    },
    generateClientId: (_: any, __: any, { cache }: any) => {
      cache.writeData({ data: { clientId: cuid() } })
    }
  }
}
