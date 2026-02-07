import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  })

  if (!user) {
    redirect('/login')
  }

  const images = await prisma.image.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return <DashboardClient user={user} initialImages={images} />
}
