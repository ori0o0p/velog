import { UserTags, UserTagsDocument } from '@/graphql/helpers/generated'
import { getAccessToken } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getUserTags(username: string) {
  try {
    const headers = {}
    const token = getAccessToken()
    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token.value}` })
    }

    const body: GraphqlRequestBody = {
      operationName: 'userTags',
      query: UserTagsDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { userTags } = await graphqlFetch<{ userTags: UserTags }>({
      body,
      headers,
      next: { revalidate: 20 },
    })

    return userTags
  } catch (error) {
    console.log(error)
    throw new Error('Get user tags error')
  }
}
