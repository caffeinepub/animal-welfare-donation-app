import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import type { Donation } from "../backend";
import { formatCurrency, formatDate } from "../lib/helpers";

interface RecentDonorsProps {
  donations: Donation[];
  campaignId: bigint;
  isLoading?: boolean;
}

export default function RecentDonors({
  donations,
  campaignId,
  isLoading,
}: RecentDonorsProps) {
  const campaignDonations = donations
    .filter((d) => d.campaignId === campaignId)
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 10);

  if (isLoading) {
    return (
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Recent Donors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (campaignDonations.length === 0) {
    return (
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Recent Donors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Be the first to donate!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-serif flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary fill-primary" />
          Recent Donors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaignDonations.map((donation) => {
          const name = donation.donorName || "Anonymous";
          const initials = name.slice(0, 2).toUpperCase();
          return (
            <div key={donation.referenceId} className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(donation.timestamp)}
                </p>
              </div>
              <span className="text-sm font-bold text-primary">
                {formatCurrency(Number(donation.amount))}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
