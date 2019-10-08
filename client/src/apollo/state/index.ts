import cuid from 'cuid'

export const defaults = {
  accessToken: null,
  clientId: cuid()
}

export const resolvers = {
  Query: {},
  Mutation: {
    setAccessToken: (_: any, { token }: any, { cache }: any) => {
      cache.writeData({ data: { accessToken: token } })
    },
    generateClientId: (_: any, __: any, { cache }: any) => {
      cache.writeData({ data: { clientId: cuid() } })
    }
  }
}
