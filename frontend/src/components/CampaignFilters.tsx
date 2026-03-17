import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

const ANIMAL_TYPES = ['All', 'Dogs', 'Cats', 'Birds', 'Wildlife', 'Horses', 'Rabbits', 'Other'];
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Campaigns' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

interface CampaignFiltersProps {
  selectedType: string;
  selectedStatus: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
}

export default function CampaignFilters({
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange,
}: CampaignFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filter Campaigns</span>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={selectedStatus === opt.value ? 'default' : 'outline'}
            size="sm"
            className="rounded-full text-xs font-semibold h-8"
            onClick={() => onStatusChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Animal Type Filter */}
      <div className="flex flex-wrap gap-2">
        {ANIMAL_TYPES.map((type) => (
          <Badge
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            className="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold hover:bg-primary/10 transition-colors"
            onClick={() => onTypeChange(type)}
          >
            {type}
          </Badge>
        ))}
      </div>
    </div>
  );
}
