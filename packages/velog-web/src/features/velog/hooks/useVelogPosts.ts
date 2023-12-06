import {
  Post,
  VelogPostsDocument,
  VelogPostsQuery,
  VelogPostsQueryVariables,
} from '@/graphql/generated'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

type Args = {
  username: string
  tag?: string
  initialData: Post[]
  limit?: number
}

export default function useVelogPosts({ username, tag, initialData, limit = 10 }: Args) {
  const { data, fetchMore, isFetching, isLoading } = useCustomInfiniteQuery<
    VelogPostsQuery,
    VelogPostsQueryVariables
  >({
    queryKey: ['velogPosts.infinite'],
    document: VelogPostsDocument,
    initialPageParam: {
      input: {
        cursor: initialData[initialData.length - 1].id,
        username,
        limit,
        tag,
      },
    },
    getNextPageParam: (page) => {
      const { posts } = page
      if (!posts) return undefined
      if (posts.length === 0) return undefined
      if (posts.length < limit) return undefined
      return {
        username,
        tag,
        cursor: posts[posts.length - 1]?.id,
        limit,
      }
    },
  })

  const posts = useMemo(() => {
    return [...initialData, ...(data?.pages?.flatMap((page) => page.posts) ?? [])] as Post[]
  }, [data, initialData])

  return {
    posts,
    originData: data,
    isLoading,
    isFetching,
    fetchMore,
  }
}
