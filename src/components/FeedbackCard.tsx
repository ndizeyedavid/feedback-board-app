import { ArrowUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { FeedbackCardProps, CategoryInfo } from "@/types/feedback";
import { cn } from "@/lib/utils";
import CommentSection from "./CommentSection";

export default function FeedbackCard({ feedback, hasUpvoted, onUpvote, onAddComment }: FeedbackCardProps) {
  // Category information mapping
  const getCategoryInfo = (category: string): CategoryInfo => {
    switch (category) {
      case 'bug':
        return { label: 'Bug Report', emoji: '🐛', variant: 'destructive' };
      case 'feature':
        return { label: 'New Feature', emoji: '⚡', variant: 'default' };
      case 'balance':
        return { label: 'Balance Change', emoji: '⚖️', variant: 'secondary' };
      case 'content':
        return { label: 'Content Request', emoji: '🎮', variant: 'outline' };
      default:
        return { label: 'General', emoji: '💡', variant: 'outline' };
    }
  };

  const categoryInfo = getCategoryInfo(feedback.category);
  
  // Format date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(feedback.createdAt));
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {feedback.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={categoryInfo.variant}
                className="text-xs font-medium"
              >
                {categoryInfo.emoji} {categoryInfo.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formattedDate}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpvote(feedback.id)}
            disabled={hasUpvoted}
            className={cn(
              "flex items-center gap-1 min-w-[60px] h-8 transition-all duration-200",
              hasUpvoted
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground"
                : "hover:bg-primary/5 hover:border-primary/50 hover:text-primary"
            )}
          >
            <ArrowUp
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                hasUpvoted
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
                hasUpvoted && "scale-110"
              )}
            />
            <span className="text-xs font-medium">{feedback.upvotes}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {feedback.description}
        </p>
        
        <CommentSection 
          comments={feedback.comments}
          onAddComment={(author, content) => onAddComment(feedback.id, author, content)}
        />
      </CardContent>
    </Card>
  );
}
