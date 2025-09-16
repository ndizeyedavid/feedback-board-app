import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FeedbackFormProps, FeedbackFormData } from "@/types/feedback";

export default function FeedbackForm({ onSubmit, onClose }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    title: "",
    description: "",
    category: "feature"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("❌ Title required", {
        description: "Please enter a title for your feedback.",
        duration: 3000,
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("❌ Description required", {
        description: "Please provide a description of your feedback.",
        duration: 3000,
      });
      return;
    }
    
    if (!formData.category) {
      toast.error("❌ Category required", {
        description: "Please select a category for your feedback.",
        duration: 3000,
      });
      return;
    }
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "feature"
    });
  };

  const handleInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Share Your Gaming Feedback
        </h2>
        <p className="text-muted-foreground">
          Help us level up the game! Report bugs, request features, suggest balance changes, 
          or share ideas for new content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Brief description of your feedback"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="h-11"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Provide detailed information about your feedback"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              handleInputChange("category", value as FeedbackFormData["category"])
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">🐛 Bug Report</SelectItem>
              <SelectItem value="feature">⚡ New Feature</SelectItem>
              <SelectItem value="balance">⚖️ Balance Change</SelectItem>
              <SelectItem value="content">🎮 Content Request</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">
              {errors.category}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
      </form>
    </div>
  );
}
