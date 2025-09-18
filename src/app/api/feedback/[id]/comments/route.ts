import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment too long'),
  authorUsername: z.string().min(1, 'Username is required')
})

// POST /api/feedback/[id]/comments - Add comment to feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const validatedData = createCommentSchema.parse(body)
    const { id: feedbackId } = await params

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { username: validatedData.authorUsername }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { username: validatedData.authorUsername }
      })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        authorId: user.id,
        feedbackId
      },
      include: {
        author: {
          select: { id: true, username: true }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
