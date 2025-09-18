import { useState, useEffect } from 'react'
import { feedbackApi, userApi, ApiFeedback } from '../../lib/api'
import { FeedbackFormData } from '../types/feedback'

export interface UseFeedbackOptions {
  category?: string
  search?: string
  sortBy?: 'recent' | 'upvotes'
  username?: string
}

export function useFeedback(options: UseFeedbackOptions = {}) {
  const [feedback, setFeedback] = useState<ApiFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set())

  // Fetch feedback data
  const fetchFeedback = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await feedbackApi.getAll({
        category: options.category !== 'all' ? options.category : undefined,
        search: options.search,
        sortBy: options.sortBy || 'recent'
      })
      
      setFeedback(response.feedbacks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user upvotes
  const fetchUserUpvotes = async () => {
    if (!options.username) return
    
    try {
      const response = await userApi.getUpvotes(options.username)
      setUpvotedIds(new Set(response.upvotedFeedbackIds))
    } catch (err) {
      console.error('Failed to fetch user upvotes:', err)
    }
  }

  // Create new feedback
  const createFeedback = async (data: FeedbackFormData, authorUsername: string) => {
    try {
      const newFeedback = await feedbackApi.create({
        ...data,
        authorUsername
      })
      
      // Add to local state
      setFeedback(prev => [newFeedback, ...prev])
      return newFeedback
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create feedback')
    }
  }

  // Toggle upvote
  const toggleUpvote = async (feedbackId: string, username: string) => {
    try {
      const response = await feedbackApi.toggleUpvote(feedbackId, username)
      
      // Update local state
      setFeedback(prev => prev.map(item => 
        item.id === feedbackId 
          ? { 
              ...item, 
              upvoteCount: response.upvoted 
                ? item.upvoteCount + 1 
                : item.upvoteCount - 1 
            }
          : item
      ))
      
      // Update upvoted IDs
      setUpvotedIds(prev => {
        const newSet = new Set(prev)
        if (response.upvoted) {
          newSet.add(feedbackId)
        } else {
          newSet.delete(feedbackId)
        }
        return newSet
      })
      
      return response
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to toggle upvote')
    }
  }

  // Add comment
  const addComment = async (feedbackId: string, content: string, authorUsername: string) => {
    try {
      const newComment = await feedbackApi.addComment(feedbackId, content, authorUsername)
      
      // Update local state
      setFeedback(prev => prev.map(item => 
        item.id === feedbackId 
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      ))
      
      return newComment
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add comment')
    }
  }

  // Fetch data on mount and when options change
  useEffect(() => {
    fetchFeedback()
  }, [options.category, options.search, options.sortBy])

  // Fetch user upvotes when username changes
  useEffect(() => {
    fetchUserUpvotes()
  }, [options.username])

  return {
    feedback,
    loading,
    error,
    upvotedIds,
    createFeedback,
    toggleUpvote,
    addComment,
    refetch: fetchFeedback
  }
}
