import { useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Comment } from "@/types/feedback";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (author: string, content: string) => Promise<void>;
}

export default function CommentSection({
  comments,
  onAddComment,
}: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleAddComment = async (author: string, content: string) => {
    await onAddComment(author, content);
    setShowCommentForm(false);
  };

  return (
    <div className="border-t border-border/50 pt-3 mt-3">
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-2 h-auto"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {isExpanded && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="h-8 text-xs"
          >
            Add Comment
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-3 animate-slide-up">
          {showCommentForm && (
            <CommentForm
              onSubmit={handleAddComment}
              onCancel={() => setShowCommentForm(false)}
            />
          )}

          {comments.length > 0 ? (
            <div className="space-y-2">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
