import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId: adminId } = await auth()
    if (!adminId) return new NextResponse('Unauthorized', { status: 401 })

    // Admin check
    const admin = await (await clerkClient()).users.getUser(adminId)
    const isAdmin = admin.primaryEmailAddress?.emailAddress === 'alandkurd485@gmail.com'
    if (!isAdmin) return new NextResponse('Forbidden', { status: 403 })

    const { targetUserId, action, value } = await req.json()

    if (!targetUserId) return new NextResponse('Missing targetUserId', { status: 400 })

    const updateData: any = { publicMetadata: {} }
    const currentTarget = await (await clerkClient()).users.getUser(targetUserId)
    const existingMetadata = currentTarget.publicMetadata || {}

    if (action === 'SET_PLAN') {
      const expiry = new Date()
      expiry.setMonth(expiry.getMonth() + 1) // 1 month from now
      
      updateData.publicMetadata = {
        ...existingMetadata,
        plan: value, // 'FREE', 'PRO', or 'ULTRA'
        plan_expiry: value === 'FREE' ? null : expiry.toISOString()
      }
    } else if (action === 'BAN') {
      updateData.publicMetadata = {
        ...existingMetadata,
        is_banned: value // boolean
      }
    } else if (action === 'TIMEOUT') {
      const timeoutDate = new Date()
      if (value === '1H') timeoutDate.setHours(timeoutDate.getHours() + 1)
      else if (value === '24H') timeoutDate.setDate(timeoutDate.getDate() + 1)
      else if (value === '1W') timeoutDate.setDate(timeoutDate.getDate() + 7)
      else if (value === 'NONE') timeoutDate.setTime(0)

      updateData.publicMetadata = {
        ...existingMetadata,
        timeout_until: value === 'NONE' ? null : timeoutDate.toISOString()
      }
    }

    await (await clerkClient()).users.updateUser(targetUserId, updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('ADMIN_UPDATE_ERROR', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
