import { useState } from "react";
import { ArrowUp, MessageCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CategoryInfo, Feedback } from "@/types/feedback";
import CommentSection from "./CommentSection";

interface FeedbackListItemProps {
  feedback: Feedback;
  hasUpvoted: boolean;
  onUpvote: (id: string) => Promise<void>;
  onAddComment: (feedbackId: string, author: string, content: string) => Promise<void>;
}

const categoryConfig = {
  gameplay: {
    label: "Gameplay Mechanics",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  story: {
    label: "Story & Characters",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  graphics: {
    label: "Graphics & Visuals",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  multiplayer: {
    label: "Multiplayer Features",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  mechanics: {
    label: "Game Mechanics",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  world: {
    label: "Open World Design",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
};

export default function FeedbackListItem({
  feedback,
  hasUpvoted,
  onUpvote,
  onAddComment,
}: FeedbackListItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const getCategoryInfo = (category: string): CategoryInfo => {
    switch (category) {
      case "gameplay":
        return { label: "Gameplay Mechanics", emoji: "", variant: "default" };
      case "story":
        return { label: "Story & Characters", emoji: "", variant: "secondary" };
      case "graphics":
        return { label: "Graphics & Visuals", emoji: "", variant: "outline" };
      case "multiplayer":
        return {
          label: "Multiplayer Features",
          emoji: "",
          variant: "destructive",
        };
      case "mechanics":
        return { label: "Game Mechanics", emoji: "", variant: "secondary" };
      case "world":
        return { label: "Open World Design", emoji: "", variant: "outline" };
      default:
        return { label: "General", emoji: "", variant: "outline" };
    }
  };
  // console.log(feedback.category);
  const categoryInfo = getCategoryInfo(feedback.category.toLocaleLowerCase());

  // Format date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(feedback.createdAt));
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Upvote Section */}
        <div className="flex flex-col items-center gap-1 mx-auto relative left-[95px] md:mx-0 md:left-0 min-w-[60px]">
          <Button
            variant={hasUpvoted ? "default" : "outline"}
            size="sm"
            onClick={async () => {
              if (isUpvoting) return;
              try {
                setIsUpvoting(true);
                await onUpvote(feedback.id);
              } finally {
                setIsUpvoting(false);
              }
            }}
            disabled={isUpvoting}
            className="h-10 w-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpvoting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {feedback.upvotes}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
                {feedback.title}
              </h3>
              <Badge
                variant={categoryInfo.variant}
                className="text-xs font-medium"
              >
                {categoryInfo.emoji} {categoryInfo.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formattedDate}
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
