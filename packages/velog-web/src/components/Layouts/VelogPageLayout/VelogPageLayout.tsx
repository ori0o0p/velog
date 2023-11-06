'use client'

import Header from '@/components/Header'
import styles from './VelogPageLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import UserProfile from '@/components/UserProfile'
import { ProfileLinks } from '@/types/user'
import HeaderCustomLogo from '@/components/Header/HeaderCustomLogo'
import { UserLogo } from '@/state/header'

import VelogTab from '@/features/velog/components/VelogTab'
import MobileSeparator from '@/features/velog/components/MobileSeparator'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  displayName: string
  shortBio: string
  profileLikns: ProfileLinks
  username: string
  thumbnail: string | null
  userLogo: UserLogo
}

function VelogPageLayout({
  displayName,
  shortBio,
  profileLikns,
  username,
  thumbnail,
  children,
  userLogo,
}: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader />
      <div className={cx('responsive')}>
        <div className={cx('innerBlock')}>
          <Header headerCustomLogo={<HeaderCustomLogo username={username} userLogo={userLogo} />} />
        </div>
        <main className={cx('mainWrapper')}>
          <UserProfile
            displayName={displayName}
            shortBio={shortBio}
            profileLinks={profileLikns as ProfileLinks}
            thumbnail={thumbnail}
            username={username}
          />
          <MobileSeparator />
          <VelogTab username={username} />
          <section className={cx('section')}>{children}</section>
        </main>
      </div>
    </div>
  )
}

export default VelogPageLayout
