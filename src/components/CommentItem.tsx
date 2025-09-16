import { Comment } from "@/types/feedback";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(comment.createdAt));

  return (
    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      <div className="h-8 w-8 rounded-full bg-primary/60 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-white">
          {comment.author.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-foreground">
            {comment.author}
          </span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
