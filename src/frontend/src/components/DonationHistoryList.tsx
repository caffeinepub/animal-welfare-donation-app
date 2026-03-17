import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, RefreshCw } from "lucide-react";
import type { AnimalCampaign, Donation } from "../backend";
import { formatCurrency, formatDate } from "../lib/helpers";

interface DonationHistoryListProps {
  donations: Donation[];
  campaigns: AnimalCampaign[];
  isLoading: boolean;
  onViewReceipt: (donation: Donation) => void;
}

export default function DonationHistoryList({
  donations,
  campaigns,
  isLoading,
  onViewReceipt,
}: DonationHistoryListProps) {
  const getCampaignTitle = (campaignId: bigint) => {
    return (
      campaigns?.find((c) => c.id === campaignId)?.title ||
      `Campaign #${campaignId}`
    );
  };

  const sorted = [...(donations || [])].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold text-foreground">No donations yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your donation history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((donation) => (
        <Card key={donation.referenceId} className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-foreground truncate">
                    {getCampaignTitle(donation.campaignId)}
                  </p>
                  {donation.isRecurring && (
                    <Badge
                      variant="secondary"
                      className="text-xs rounded-full flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      Recurring
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(donation.timestamp)}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                  Ref: {donation.referenceId}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-base font-bold text-primary">
                  {formatCurrency(Number(donation.amount) / 100)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-full"
                  onClick={() => onViewReceipt(donation)}
                >
                  <Receipt className="w-3 h-3 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
