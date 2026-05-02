import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    // Admin check
    const user = await (await clerkClient()).users.getUser(userId)
    const isAdmin = user.primaryEmailAddress?.emailAddress === 'alandkurd485@gmail.com'
    if (!isAdmin) return new NextResponse('Forbidden', { status: 403 })

    const users = await (await clerkClient()).users.getUserList({
      limit: 100,
      orderBy: '-created_at',
    })

    return NextResponse.json(users.data)
  } catch (error) {
    console.error('ADMIN_USERS_ERROR', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
