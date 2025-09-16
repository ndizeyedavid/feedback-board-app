import { useState } from "react";
import { ArrowUp, MessageCircle, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Feedback } from "@/types/feedback";
import CommentSection from "./CommentSection";

interface FeedbackListItemProps {
  feedback: Feedback;
  hasUpvoted: boolean;
  onUpvote: (id: string) => void;
  onAddComment: (feedbackId: string, author: string, content: string) => void;
}

const categoryConfig = {
  bug: { label: "Bug Report", color: "bg-red-100 text-red-800 border-red-200" },
  feature: {
    label: "New Feature",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  balance: {
    label: "Balance Change",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  content: {
    label: "Content Request",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

export default function FeedbackListItem({
  feedback,
  hasUpvoted,
  onUpvote,
  onAddComment,
}: FeedbackListItemProps) {
  const [showComments, setShowComments] = useState(false);
  const categoryInfo = categoryConfig[feedback.category];

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Upvote Section */}
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <Button
            variant={hasUpvoted ? "default" : "outline"}
            size="sm"
            onClick={() => onUpvote(feedback.id)}
            className={`h-10 w-10 p-0 `}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {feedback.upvotes}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
                {feedback.title}
              </h3>
              <Badge
                variant="secondary"
                className={`${categoryInfo.color} border text-xs font-medium`}
              >
                {categoryInfo.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {feedback.createdAt.toLocaleDateString()}
            </div>
          </div>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            {feedback.description}
          </p>

          {/* Comments Section */}
          <div className="pt-2 ">
            <CommentSection
              comments={feedback.comments}
              onAddComment={(author, content) =>
                onAddComment(feedback.id, author, content)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
