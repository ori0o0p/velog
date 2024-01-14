import styles from './BasicLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import Header from '@/components/Header'
import { UserLogo } from '@/state/header'
import HeaderCustomLogo from '@/components/Header/HeaderCustomLogo'
import getNotificationCount from '@/prefetch/getNotificationCount'

const cx = bindClassNames(styles)

export type DefaultHeaderProps = {
  children: React.ReactNode
  isCustomHeader?: false
}

export type CustomLogoHeaderProps = {
  children: React.ReactNode
  username: string
  userLogo: UserLogo
  isCustomHeader?: true
}

type Props = DefaultHeaderProps | CustomLogoHeaderProps

function isDefaultHeaderProps(props: Props): props is DefaultHeaderProps {
  return !props.isCustomHeader
}

async function BasicLayout(props: Props) {
  const notificationCount = await getNotificationCount()

  const header = isDefaultHeaderProps(props) ? (
    <Header notificationCount={notificationCount} />
  ) : (
    <Header
      notificationCount={notificationCount}
      logo={<HeaderCustomLogo username={props.username} userLogo={props.userLogo} />}
    />
  )

  return (
    <div className={cx('block')}>
      <FloatingHeader header={header} />
      <div className={cx('mainResponsive')}>
        {header}
        <main>{props.children}</main>
      </div>
    </div>
  )
}

export default BasicLayout
