import { ENV } from './env'
import * as aws from '@pulumi/aws'
import { createECSfargateService, getLatestImage } from './src/server/ecs'

export = async () => {
  const velogServerRepository = await aws.ecr.getRepository({
    name: ENV.ecrServerRepositoryName,
  })

  const serverImage = getLatestImage(velogServerRepository)
  createECSfargateService(serverImage)
}
