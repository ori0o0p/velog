import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { UserProfile } from '@prisma/client'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

interface Service {
  userProfileLoader(): DataLoader<string, UserProfile>
}

@injectable()
@singleton()
export class UserProfileService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public userProfileLoader() {
    return this.createUserProfileLoader()
  }
  private createUserProfileLoader(): DataLoader<string, UserProfile> {
    return new DataLoader(async (userIds) => {
      const profiles = await this.db.userProfile.findMany({
        where: {
          fk_user_id: {
            in: userIds as string[],
          },
        },
      })
      const nomalized = this.utils.normalize(profiles, (profile) => profile.fk_user_id!)
      const ordered = userIds.map((id) => nomalized[id])
      return ordered
    })
  }
}
