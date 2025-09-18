import { Grid3X3, List } from "lucide-react";
import { Button } from "./ui/button";

export type ViewMode = "card" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewToggle({
  viewMode,
  onViewModeChange,
}: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 relative md:-top-5">
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className={`h-8 px-3`}
      >
        <List className="h-4 w-4 mr-1.5" />
        List
      </Button>
      <Button
        variant={viewMode === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("card")}
        className={`h-8 px-3`}
      >
        <Grid3X3 className="h-4 w-4 mr-1.5" />
        Cards
      </Button>
    </div>
  );
}
