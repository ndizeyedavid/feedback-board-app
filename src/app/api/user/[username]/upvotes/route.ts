import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/user/[username]/upvotes - Get user's upvoted feedback IDs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        upvotes: {
          select: { feedbackId: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ upvotedFeedbackIds: [] });
    }

    const upvotedFeedbackIds = user.upvotes.map((upvote) => upvote.feedbackId);

    return NextResponse.json({ upvotedFeedbackIds });
  } catch (error) {
    console.error("Error fetching user upvotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch user upvotes" },
      { status: 500 }
    );
  }
}
