// API client functions for frontend
import { FeedbackFormData } from '../src/types/feedback'

const API_BASE = '/api'

export interface ApiFeedback {
  id: string
  title: string
  description: string
  category: string
  upvoteCount: number
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
  }
  comments: ApiComment[]
  _count: {
    upvotes: number
  }
}

export interface ApiComment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
  }
}

export interface FeedbackResponse {
  feedbacks: ApiFeedback[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Feedback API functions
export const feedbackApi = {
  // Get all feedback with filters
  async getAll(params?: {
    category?: string
    search?: string
    sortBy?: 'recent' | 'upvotes'
    page?: number
    limit?: number
  }): Promise<FeedbackResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`${API_BASE}/feedback?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch feedback')
    return response.json()
  },

  // Create new feedback
  async create(data: FeedbackFormData & { authorUsername: string }): Promise<ApiFeedback> {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        category: data.category.toUpperCase(),
        authorUsername: data.authorUsername
      })
    })
    if (!response.ok) throw new Error('Failed to create feedback')
    return response.json()
  },

  // Toggle upvote
  async toggleUpvote(feedbackId: string, username: string): Promise<{ upvoted: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/feedback/${feedbackId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    if (!response.ok) throw new Error('Failed to toggle upvote')
    return response.json()
  },

  // Add comment
  async addComment(feedbackId: string, content: string, authorUsername: string): Promise<ApiComment> {
    const response = await fetch(`${API_BASE}/feedback/${feedbackId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, authorUsername })
    })
    if (!response.ok) throw new Error('Failed to add comment')
    return response.json()
  }
}

// User API functions
export const userApi = {
  // Get user's upvoted feedback IDs
  async getUpvotes(username: string): Promise<{ upvotedFeedbackIds: string[] }> {
    const response = await fetch(`${API_BASE}/user/${username}/upvotes`)
    if (!response.ok) throw new Error('Failed to fetch user upvotes')
    return response.json()
  }
}
