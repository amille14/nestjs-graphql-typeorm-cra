import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};


export type LoginPayload = {
   __typename?: 'LoginPayload',
  user: User,
  accessToken: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  delete: User,
  updateUserEmail: User,
  register: LoginPayload,
  login: LoginPayload,
  logoutOtherClients: Scalars['Boolean'],
  default: Scalars['String'],
  setAccessToken: Scalars['String'],
  generateClientId: Scalars['String'],
};


export type MutationUpdateUserEmailArgs = {
  email: Scalars['String']
};


export type MutationRegisterArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type MutationLoginArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type MutationSetAccessTokenArgs = {
  token: Scalars['String']
};

export enum MutationEventType {
  Insert = 'INSERT',
  Update = 'UPDATE',
  Delete = 'DELETE'
}

export type Query = {
   __typename?: 'Query',
  me: User,
  default: Scalars['String'],
  accessToken: Scalars['String'],
  clientId: Scalars['String'],
};

export type Subscription = {
   __typename?: 'Subscription',
  users: UserMutationPayload,
  default: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  email: Scalars['String'],
};

export type UserMutationPayload = {
   __typename?: 'UserMutationPayload',
  mutation: MutationEventType,
  entity: User,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<UserPartial>,
};

export type UserPartial = {
   __typename?: 'UserPartial',
  id?: Maybe<Scalars['ID']>,
  createdAt?: Maybe<Scalars['DateTime']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  email?: Maybe<Scalars['String']>,
};

export type GetAccessTokenQueryVariables = {};


export type GetAccessTokenQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'accessToken'>
);

export type SetAccessTokenMutationVariables = {
  token: Scalars['String']
};


export type SetAccessTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setAccessToken'>
);

export type GetClientIdQueryVariables = {};


export type GetClientIdQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'clientId'>
);

export type GenerateClientIdMutationVariables = {};


export type GenerateClientIdMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'generateClientId'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type UserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'createdAt' | 'updatedAt' | 'email'>
);

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  createdAt
  updatedAt
  email
}
    `;
export const GetAccessTokenDocument = gql`
    query getAccessToken {
  accessToken @client
}
    `;

/**
 * __useGetAccessTokenQuery__
 *
 * To run a query within a React component, call `useGetAccessTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccessTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccessTokenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAccessTokenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAccessTokenQuery, GetAccessTokenQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAccessTokenQuery, GetAccessTokenQueryVariables>(GetAccessTokenDocument, baseOptions);
      }
export function useGetAccessTokenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAccessTokenQuery, GetAccessTokenQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAccessTokenQuery, GetAccessTokenQueryVariables>(GetAccessTokenDocument, baseOptions);
        }
export type GetAccessTokenQueryHookResult = ReturnType<typeof useGetAccessTokenQuery>;
export type GetAccessTokenLazyQueryHookResult = ReturnType<typeof useGetAccessTokenLazyQuery>;
export type GetAccessTokenQueryResult = ApolloReactCommon.QueryResult<GetAccessTokenQuery, GetAccessTokenQueryVariables>;
export const SetAccessTokenDocument = gql`
    mutation setAccessToken($token: String!) {
  setAccessToken(token: $token) @client
}
    `;
export type SetAccessTokenMutationFn = ApolloReactCommon.MutationFunction<SetAccessTokenMutation, SetAccessTokenMutationVariables>;

/**
 * __useSetAccessTokenMutation__
 *
 * To run a mutation, you first call `useSetAccessTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAccessTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAccessTokenMutation, { data, loading, error }] = useSetAccessTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useSetAccessTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetAccessTokenMutation, SetAccessTokenMutationVariables>) {
        return ApolloReactHooks.useMutation<SetAccessTokenMutation, SetAccessTokenMutationVariables>(SetAccessTokenDocument, baseOptions);
      }
export type SetAccessTokenMutationHookResult = ReturnType<typeof useSetAccessTokenMutation>;
export type SetAccessTokenMutationResult = ApolloReactCommon.MutationResult<SetAccessTokenMutation>;
export type SetAccessTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<SetAccessTokenMutation, SetAccessTokenMutationVariables>;
export const GetClientIdDocument = gql`
    query getClientId {
  clientId @client
}
    `;

/**
 * __useGetClientIdQuery__
 *
 * To run a query within a React component, call `useGetClientIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientIdQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClientIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetClientIdQuery, GetClientIdQueryVariables>) {
        return ApolloReactHooks.useQuery<GetClientIdQuery, GetClientIdQueryVariables>(GetClientIdDocument, baseOptions);
      }
export function useGetClientIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClientIdQuery, GetClientIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetClientIdQuery, GetClientIdQueryVariables>(GetClientIdDocument, baseOptions);
        }
export type GetClientIdQueryHookResult = ReturnType<typeof useGetClientIdQuery>;
export type GetClientIdLazyQueryHookResult = ReturnType<typeof useGetClientIdLazyQuery>;
export type GetClientIdQueryResult = ApolloReactCommon.QueryResult<GetClientIdQuery, GetClientIdQueryVariables>;
export const GenerateClientIdDocument = gql`
    mutation generateClientId {
  generateClientId @client
}
    `;
export type GenerateClientIdMutationFn = ApolloReactCommon.MutationFunction<GenerateClientIdMutation, GenerateClientIdMutationVariables>;

/**
 * __useGenerateClientIdMutation__
 *
 * To run a mutation, you first call `useGenerateClientIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateClientIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateClientIdMutation, { data, loading, error }] = useGenerateClientIdMutation({
 *   variables: {
 *   },
 * });
 */
export function useGenerateClientIdMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GenerateClientIdMutation, GenerateClientIdMutationVariables>) {
        return ApolloReactHooks.useMutation<GenerateClientIdMutation, GenerateClientIdMutationVariables>(GenerateClientIdDocument, baseOptions);
      }
export type GenerateClientIdMutationHookResult = ReturnType<typeof useGenerateClientIdMutation>;
export type GenerateClientIdMutationResult = ApolloReactCommon.MutationResult<GenerateClientIdMutation>;
export type GenerateClientIdMutationOptions = ApolloReactCommon.BaseMutationOptions<GenerateClientIdMutation, GenerateClientIdMutationVariables>;
export const MeDocument = gql`
    query me {
  me {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;