import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";
import CampaignProgress from "../components/CampaignProgress";
import DonationForm from "../components/DonationForm";
import DonationSuccessModal from "../components/DonationSuccessModal";
import RecentDonors from "../components/RecentDonors";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllCampaigns,
  useGetCampaign,
  useGetDonationHistory,
} from "../hooks/useQueries";
import { formatDate, getAnimalEmoji } from "../lib/helpers";

export default function CampaignDetail() {
  const { id } = useParams({ from: "/campaign/$id" });
  const navigate = useNavigate();
  const campaignId = BigInt(id);

  const { data: campaign, isLoading } = useGetCampaign(campaignId);
  const { data: allDonations, isLoading: donationsLoading } =
    useGetDonationHistory();
  const { identity } = useInternetIdentity();

  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    referenceId: string;
    amount: number;
    isRecurring: boolean;
  }>({ open: false, referenceId: "", amount: 0, isRecurring: false });

  const handleDonationSuccess = (
    referenceId: string,
    amount: number,
    isRecurring: boolean,
  ) => {
    setSuccessModal({ open: true, referenceId, amount, isRecurring });
  };

  const campaignDonations = (allDonations ?? []).filter(
    (d) => d.campaignId === campaignId,
  );
  const donorCount = new Set(campaignDonations.map((d) => d.donor.toString()))
    .size;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-64 rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-2xl mb-2">🐾</p>
        <h2 className="font-serif font-bold text-xl text-foreground">
          Campaign not found
        </h2>
        <p className="text-muted-foreground mt-1 mb-4">
          This campaign may have been removed.
        </p>
        <Button
          onClick={() => navigate({ to: "/" })}
          variant="outline"
          className="rounded-full"
        >
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-12">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 rounded-full text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: "/" })}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Campaigns
      </Button>

      {/* Cover Image */}
      <div className="relative rounded-2xl overflow-hidden mb-6 bg-accent h-56 md:h-80">
        {campaign.imageUrl ? (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20">
            <span className="text-8xl">
              {getAnimalEmoji(campaign.animalType)}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant={campaign.isActive ? "default" : "secondary"}
            className="rounded-full font-semibold"
          >
            {campaign.isActive ? "🟢 Active" : "✅ Completed"}
          </Badge>
          <Badge
            variant="outline"
            className="bg-card/90 rounded-full backdrop-blur-sm font-semibold"
          >
            {getAnimalEmoji(campaign.animalType)} {campaign.animalType}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left: Campaign Info */}
        <div className="md:col-span-3 space-y-5">
          <div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-foreground leading-tight">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(campaign.startDate)}
                {campaign.endDate &&
                  campaign.endDate !== BigInt(0) &&
                  ` – ${formatDate(campaign.endDate)}`}
              </span>
            </div>
          </div>

          <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
            {campaign.description}
          </p>

          {/* Progress */}
          <CampaignProgress campaign={campaign} donorCount={donorCount} />

          {/* Recent Donors */}
          <RecentDonors
            donations={allDonations ?? []}
            campaignId={campaignId}
            isLoading={!!identity && donationsLoading}
          />
        </div>

        {/* Right: Donation Form */}
        <div className="md:col-span-2 space-y-4">
          <DonationForm
            campaignId={campaignId}
            isActive={campaign.isActive}
            onSuccess={handleDonationSuccess}
          />
        </div>
      </div>

      {/* Success Modal */}
      <DonationSuccessModal
        open={successModal.open}
        onClose={() => setSuccessModal((s) => ({ ...s, open: false }))}
        referenceId={successModal.referenceId}
        amount={successModal.amount}
        campaignTitle={campaign.title}
        isRecurring={successModal.isRecurring}
      />
    </div>
  );
}
