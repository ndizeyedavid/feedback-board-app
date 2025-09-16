"use client";

import { useState, useMemo } from "react";
import FeedbackCard from "@/components/FeedbackCard";
import FeedbackFilters from "@/components/FeedbackFilters";
import FeedbackForm from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gamepad2, MessageSquare, Plus, Zap } from "lucide-react";
import { Feedback, FeedbackFormData, SortOption } from "@/types/feedback";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import ViewToggle, { ViewMode } from "@/components/ViewToggle";
import FeedbackListItem from "@/components/FeedbackListItem";
import Image from "next/image";

export default function page() {
  // State management
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const [upvotes, setUpvotes] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Handlers
  const handleSubmitFeedback = (data: FeedbackFormData) => {
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      category: data.category,
      upvotes: 0,
      createdAt: new Date(),
      comments: [],
    };

    setFeedback((prev) => [newFeedback, ...prev]);
    setIsFormOpen(false);

    // Trigger confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#9333ea", "#3b82f6", "#06b6d4", "#10b981"],
    });

    // Show success toast
    toast.success("🎮 Feedback submitted successfully!", {
      description:
        "Your feedback has been added to the community board. Thanks for helping improve the game!",
      duration: 4000,
    });
  };

  const handleUpvote = (id: string) => {
    if (upvotes[id]) {
      toast.info("⚡ Already upvoted!", {
        description: "You've already upvoted this feedback.",
        duration: 2000,
      });
      return;
    }

    setUpvotes((prev) => ({ ...prev, [id]: true }));
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
      )
    );

    toast.success("👍 Upvoted!", {
      description:
        "Your vote has been counted. Thanks for supporting this feedback!",
      duration: 2000,
    });
  };

  const handleAddComment = (
    feedbackId: string,
    author: string,
    content: string
  ) => {
    const newComment = {
      id: `c${Date.now()}`,
      author,
      content,
      createdAt: new Date(),
    };

    setFeedback((prev) =>
      prev.map((item) =>
        item.id === feedbackId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );

    toast.success("💬 Comment added!", {
      description: `Your comment has been posted as ${author}. Join the discussion!`,
      duration: 3000,
    });
  };

  // Filtered and sorted feedback
  const filteredAndSortedFeedback = useMemo(() => {
    let filtered = feedback.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return b.upvotes - a.upvotes;
      }
    });
  }, [feedback, searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in mt-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg">
                <Image
                  src="/logo.png"
                  alt="GTA VI LOGO"
                  width={50}
                  height={50}
                  className="object-contain p-1"
                />
              </div>
              <h1 className="text-5xl font-bold">GTA VI Feedback Board</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Level up our game together! Share bugs, request features, suggest
              balance changes, and vote on what the community wants most. Your
              feedback shapes the adventure.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Submit Feedback
                    <MessageSquare className="h-4 w-4 ml-2 opacity-80" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                  <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="sr-only">
                      Submit Feedback
                    </DialogTitle>
                  </DialogHeader>
                  <div className="px-6 pb-6">
                    <FeedbackForm
                      onSubmit={handleSubmitFeedback}
                      onClose={() => setIsFormOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div className="flex-1 items-center justify-center w-full">
                <FeedbackFilters
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  sortBy={sortBy}
                  onSearchChange={setSearchTerm}
                  onCategoryChange={setSelectedCategory}
                  onSortChange={setSortBy}
                  totalCount={feedback.length}
                  filteredCount={filteredAndSortedFeedback.length}
                />
              </div>
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>

          {/* Feedback List */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {filteredAndSortedFeedback.length === 0 ? (
              <div className="text-center py-16">
                <div className="size-28 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                  <Image
                    src="/logo.png"
                    alt="GTA VI LOGO"
                    width={180}
                    height={180}
                    className="object-cover p-1"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feedback.length === 0
                    ? "No player feedback yet"
                    : "No feedback matches your quest parameters"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feedback.length === 0
                    ? "Be the first player to share feedback and help shape the game!"
                    : "Try adjusting your search or category filters to find what you're looking for."}
                </p>
                {feedback.length === 0 && (
                  <Button onClick={() => setIsFormOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit First Feedback
                  </Button>
                )}
              </div>
            ) : viewMode === "card" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedFeedback.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.1 * (index % 6)}s` }}
                  >
                    <FeedbackCard
                      feedback={item}
                      hasUpvoted={!!upvotes[item.id]}
                      onUpvote={handleUpvote}
                      onAddComment={handleAddComment}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedFeedback.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.05 * (index % 10)}s` }}
                  >
                    <FeedbackListItem
                      feedback={item}
                      hasUpvoted={!!upvotes[item.id]}
                      onUpvote={handleUpvote}
                      onAddComment={handleAddComment}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
