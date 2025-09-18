import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const upvoteSchema = z.object({
  username: z.string().min(1, 'Username is required')
})

// POST /api/feedback/[id]/upvote - Toggle upvote on feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { username } = upvoteSchema.parse(body)
    const { id: feedbackId } = await params

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { username }
      })
    }

    // Check if user already upvoted this feedback
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_feedbackId: {
          userId: user.id,
          feedbackId
        }
      }
    })

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.upvote.delete({
          where: { id: existingUpvote.id }
        }),
        prisma.feedback.update({
          where: { id: feedbackId },
          data: { upvoteCount: { decrement: 1 } }
        })
      ])

      return NextResponse.json({ upvoted: false, message: 'Upvote removed' })
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.upvote.create({
          data: {
            userId: user.id,
            feedbackId
          }
        }),
        prisma.feedback.update({
          where: { id: feedbackId },
          data: { upvoteCount: { increment: 1 } }
        })
      ])

      return NextResponse.json({ upvoted: true, message: 'Upvote added' })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error toggling upvote:', error)
    return NextResponse.json(
      { error: 'Failed to toggle upvote' },
      { status: 500 }
    )
  }
}
