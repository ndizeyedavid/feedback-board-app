import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const createFeedbackSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  category: z.enum([
    "GAMEPLAY",
    "STORY",
    "GRAPHICS",
    "MULTIPLAYER",
    "MECHANICS",
    "WORLD",
  ]),
  authorUsername: z.string().min(1, "Username is required"),
});

const querySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["recent", "upvotes"]).optional().default("recent"),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
});

// GET /api/feedback - Get all feedback with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const where: any = {};

    // Category filter
    if (query.category && query.category !== "all") {
      where.category = query.category.toUpperCase();
    }

    // Search filter
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Sorting
    const orderBy: any = {};
    if (query.sortBy === "upvotes") {
      orderBy.upvoteCount = "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const skip = (query.page - 1) * query.limit;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        include: {
          author: {
            select: { id: true, username: true },
          },
          comments: {
            include: {
              author: {
                select: { id: true, username: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          _count: {
            select: { upvotes: true },
          },
        },
      }),
      prisma.feedback.count({ where }),
    ]);

    return NextResponse.json({
      feedbacks,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// POST /api/feedback - Create new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createFeedbackSchema.parse(body);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { username: validatedData.authorUsername },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { username: validatedData.authorUsername },
      });
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true },
            },
          },
        },
        _count: {
          select: { upvotes: true },
        },
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
