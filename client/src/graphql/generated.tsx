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
  accessToken: Scalars['String']
};

export enum MutationEventType {
  Insert = 'INSERT',
  Update = 'UPDATE',
  Delete = 'DELETE'
}

export type Query = {
   __typename?: 'Query',
  me?: Maybe<User>,
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

export type LoginMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginPayload' }
    & Pick<LoginPayload, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & UserFragment
    ) }
  ) }
);

export type RegisterMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'LoginPayload' }
    & Pick<LoginPayload, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & UserFragment
    ) }
  ) }
);

export type GetAccessTokenQueryVariables = {};


export type GetAccessTokenQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'accessToken'>
);

export type SetAccessTokenMutationVariables = {
  accessToken: Scalars['String']
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
  & { me: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type UserFragment = (
  { __typename: 'User' }
  & Pick<User, 'id' | 'createdAt' | 'updatedAt' | 'email'>
);

export const UserFragmentDoc = gql`
    fragment User on User {
  __typename
  id
  createdAt
  updatedAt
  email
}
    `;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      ...User
    }
    accessToken
  }
}
    ${UserFragmentDoc}`;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    user {
      ...User
    }
    accessToken
  }
}
    ${UserFragmentDoc}`;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
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
    mutation setAccessToken($accessToken: String!) {
  setAccessToken(accessToken: $accessToken) @client
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
 *      accessToken: // value for 'accessToken'
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
    ...User
  }
}
    ${UserFragmentDoc}`;

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