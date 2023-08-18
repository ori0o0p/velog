import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import { ENV } from '@env'
import cors from '@fastify/cors'
import { ForbiddenError } from '@errors/ForbiddenError.js'

const corsPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  const corsWhitelist: RegExp[] = [
    /^https:\/\/velog.io$/,
    /^https:\/\/alpha.velog.io$/,
    /^https:\/\/prod.velog.io$/,
    /https:\/\/(.*)--velog.netlify.com/,
    /https:\/\/velog.graphcdn.app/,
    /^https:\/\/velog.pro$/, // stage
  ]

  if (ENV.appEnv === 'development') {
    corsWhitelist.push(/^http:\/\/localhost/)
  }

  fastify.register(cors, {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    optionsSuccessStatus: 204,
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.some((re) => re.test(origin))) {
        callback(null, true)
      } else {
        callback(new ForbiddenError(), false)
      }
    },
  })

  done()
}

export default corsPlugin
