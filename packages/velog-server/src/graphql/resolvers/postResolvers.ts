import { Resolvers } from '@graphql/generated'
import { container } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'
import { UserService } from '@services/UserService/index.js'
import { PostIncludeComment, PostIncludeUser } from '@services/PostService/PostServiceInterface.js'
import removeMd from 'remove-markdown'
import { CommentService } from '@services/CommentService/index.js'
import { Post } from '@prisma/client'
import { PostLikeService } from '@services/PostLikeService/index.js'
import { DbService } from '@lib/db/DbService.js'

const postResolvers: Resolvers = {
  Post: {
    user: async (parent: PostIncludeUser) => {
      if (!parent.user) {
        const userService = container.resolve(UserService)
        return await userService.getCurrentUser(parent.fk_user_id)
      }
      return parent?.user
    },
    short_description: (parent: Post) => {
      if (!parent.body) return ''
      if ((parent.meta as any)?.short_description) {
        return (parent.meta as any).short_description
      }
      const removed = removeMd(
        parent.body
          .replace(/```([\s\S]*?)```/g, '')
          .replace(/~~~([\s\S]*?)~~~/g, '')
          .slice(0, 500),
      )
      return removed.slice(0, 200) + (removed.length > 200 ? '...' : '')
    },
    comments_count: async (parent: PostIncludeComment) => {
      if (parent?.comment) return parent.comment.length
      const commentService = container.resolve(CommentService)
      const count = await commentService.count(parent.id)
      return count
    },
    liked: async (parent: Post, _, ctx) => {
      if (!ctx.user) return false
      const db = container.resolve(DbService)
      const liked = await db.postLike.findFirst({
        where: {
          fk_post_id: parent.id,
          fk_user_id: ctx.user.id,
        },
      })
      return !!liked
    },
  },
  Query: {
    post: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getPost(input, ctx.user?.id)
    },
    recentPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getRecentPosts(input, ctx.user?.id)
    },
    trendingPosts: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getTrendingPosts(input, ctx.ip)
    },
    readingList: async (_, { input }, ctx) => {
      const postService = container.resolve(PostService)
      return await postService.getReadingList(input, ctx.user?.id)
    },
  },
  Mutation: {
    likePost: async (_, { input }, ctx): Promise<Post> => {
      const postLikeService = container.resolve(PostLikeService)
      return await postLikeService.likePost(input.postId, ctx.user?.id)
    },
    unlikePost: async (_, { input }, ctx): Promise<Post> => {
      const postLikeService = container.resolve(PostLikeService)
      return await postLikeService.unlikePost(input.postId, ctx.user?.id)
    },
  },
}

export default postResolvers
