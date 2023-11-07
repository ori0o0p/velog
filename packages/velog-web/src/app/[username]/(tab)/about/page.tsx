import getUserProfile from '@/actions/getUserProfile'
import { Metadata } from 'next'
import strip from 'strip-markdown'
import { remark } from 'remark'
import { getUsernameFromParams } from '@/lib/utils'
import VelogAbout from '@/features/velog/components/VelogAbout'

interface Props {
  params: { username: string }
}

export default async function VelogAboutPage({ params }: Props) {
  const username = getUsernameFromParams(params)
  return <VelogAbout username={username} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const username = getUsernameFromParams(params)
  const profile = await getUserProfile(username)

  if (!profile) {
    return {}
  }

  return {
    title: `${username} (${profile.display_name}) / 소개 - velog`,
    description: profile?.about
      ? `${await remark().use(strip).process(profile.about)}`
      : `${username}님의 자기소개가 비었습니다.`,
  }
}
