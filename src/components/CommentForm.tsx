import { useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CommentFormProps {
  onSubmit: (author: string, content: string) => Promise<void>;
  onCancel?: () => void;
}

export default function CommentForm({ onSubmit, onCancel }: CommentFormProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!author.trim()) {
      toast.error("❌ Name required", {
        description: "Please enter your gaming username.",
        duration: 2000,
      });
      return;
    }

    if (!content.trim()) {
      toast.error("❌ Comment required", {
        description: "Please write a comment to share.",
        duration: 2000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(author.trim(), content.trim());
      setAuthor("");
      setContent("");
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50"
    >
      <div className="space-y-2">
        <Label htmlFor="author" className="text-sm font-medium">
          Your Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="author"
          placeholder="Enter your gaming username"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            if (errors.author) {
              const newErrors = { ...errors };
              delete newErrors.author;
              setErrors(newErrors);
            }
          }}
          className="h-9"
        />
        {errors.author && (
          <p className="text-sm text-destructive">{errors.author}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">
          Comment <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Share your thoughts on this feedback..."
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) {
              const newErrors = { ...errors };
              delete newErrors.content;
              setErrors(newErrors);
            }
          }}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-9"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="h-9 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
