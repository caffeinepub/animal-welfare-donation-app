import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import {
  useCancelRecurringDonation,
  useGetAllCampaigns,
  useGetRecurringDonations,
} from "../hooks/useQueries";
import { formatCurrency, formatDate } from "../lib/utils";

export default function RecurringDonationsList() {
  const { data: recurringDonations, isLoading } = useGetRecurringDonations();
  const { data: campaigns } = useGetAllCampaigns();
  const { mutateAsync: cancelRecurring, isPending: isCancelling } =
    useCancelRecurringDonation();

  const getCampaignTitle = (campaignId: bigint) => {
    return (
      campaigns?.find((c) => c.id === campaignId)?.title ||
      `Campaign #${campaignId}`
    );
  };

  const handleCancel = async () => {
    try {
      await cancelRecurring();
      toast.success("Recurring donation cancelled.");
    } catch {
      toast.error("Failed to cancel recurring donation.");
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" />
            Recurring Donations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const active = recurringDonations?.filter((d) => d.isRecurring) ?? [];

  return (
    <Card className="border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-base flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary" />
          Recurring Donations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active recurring donations.
          </p>
        ) : (
          <div className="space-y-3">
            {active.slice(0, 5).map((donation) => (
              <div
                key={donation.referenceId}
                className="flex items-center justify-between p-3 bg-accent/40 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {getCampaignTitle(donation.campaignId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(Number(donation.amount) / 100)} / month ·
                    Since {formatDate(donation.timestamp)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2 flex-shrink-0"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  title="Cancel recurring donation"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
