import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Campaigns" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

interface CampaignFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export default function CampaignFilters({
  selectedStatus,
  onStatusChange,
}: CampaignFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <SlidersHorizontal className="w-4 h-4" />
        <span>Status:</span>
      </div>
      {STATUS_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={selectedStatus === opt.value ? "default" : "outline"}
          size="sm"
          className="rounded-full text-xs font-semibold h-8"
          onClick={() => onStatusChange(opt.value)}
          data-ocid={`filter.${opt.value}.button`}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
