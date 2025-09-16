export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'balance' | 'content';
  upvotes: number;
  createdAt: Date;
  comments: Comment[];
}

export interface FeedbackFormData {
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'balance' | 'content';
}

export type SortOption = 'recent' | 'upvotes';

export interface CategoryInfo {
  label: string;
  emoji: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface FeedbackCardProps {
  feedback: Feedback;
  hasUpvoted: boolean;
  onUpvote: (id: string) => void;
  onAddComment: (feedbackId: string, author: string, content: string) => void;
}

export interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => void;
  onClose: () => void;
}

export interface FeedbackFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  sortBy: SortOption;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}
