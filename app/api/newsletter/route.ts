import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '@/lib/api/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action = 'subscribe' } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    if (action === 'subscribe') {
      const result = await subscribeToNewsletter(email)
      
      if (result.success) {
        return NextResponse.json({
          message: result.message,
          alreadySubscribed: result.alreadySubscribed || false
        }, { status: result.alreadySubscribed ? 200 : 201 })
      } else {
        return NextResponse.json(
          { error: result.message },
          { status: 500 }
        )
      }
    } else if (action === 'unsubscribe') {
      const result = await unsubscribeFromNewsletter(email)
      
      if (result.success) {
        return NextResponse.json({ message: result.message })
      } else {
        return NextResponse.json(
          { error: result.message },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "subscribe" or "unsubscribe"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
