import ResponsiveLayout from '@/components/Layouts/ResponsiveLayout'

type Props = {
  children: React.ReactNode
}

export default function SettingLayout({ children }: Props) {
  return <ResponsiveLayout>{children}</ResponsiveLayout>
}
