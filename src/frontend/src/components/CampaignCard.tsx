import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { AnimalCampaign } from "../backend";
import {
  formatCurrency,
  getAnimalEmoji,
  getDaysRemaining,
} from "../lib/helpers";

interface CampaignCardProps {
  campaign: AnimalCampaign;
}

function getAnimalImage(animalType: string, title?: string): string {
  // Special campaigns with custom images
  if (
    title?.toLowerCase().includes("padwa") ||
    title?.toLowerCase().includes("padva")
  ) {
    return "/assets/generated/cow-padwa-feeding.dim_800x600.jpg";
  }
  switch (animalType.toLowerCase()) {
    case "cow":
      return "/assets/generated/cow-eating.dim_800x600.jpg";
    case "dog":
      return "/assets/generated/dog-eating.dim_800x600.jpg";
    case "cat":
      return "/assets/generated/cat-eating.dim_800x600.jpg";
    case "bird":
      return "/assets/generated/birds-eating.dim_800x600.jpg";
    default:
      return "/assets/generated/cow-eating.dim_800x600.jpg";
  }
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const navigate = useNavigate();
  const goal = Number(campaign.fundraisingGoal);
  const raised = Number(campaign.amountRaised);
  const percentage =
    goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const daysLeft = getDaysRemaining(campaign.endDate);

  const animalImage = getAnimalImage(campaign.animalType, campaign.title);
  const [imgSrc, setImgSrc] = useState(
    campaign.imageUrl ? campaign.imageUrl : animalImage,
  );

  const handleClick = () => {
    navigate({ to: "/campaign/$id", params: { id: campaign.id.toString() } });
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer card-hover shadow-card border-border group"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-44 bg-accent overflow-hidden">
        <img
          src={imgSrc}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgSrc(animalImage)}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant={campaign.isActive ? "default" : "secondary"}
            className="text-xs font-semibold rounded-full"
          >
            {campaign.isActive ? "🟢 Active" : "✅ Completed"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className="bg-card/90 text-xs font-semibold rounded-full backdrop-blur-sm"
          >
            {getAnimalEmoji(campaign.animalType)} {campaign.animalType}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-serif font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>{formatCurrency(raised)} raised</span>
            <span className="font-bold text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 rounded-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Goal: {formatCurrency(goal)}</span>
            {daysLeft !== null && (
              <span
                className={
                  daysLeft <= 7 ? "text-destructive font-semibold" : ""
                }
              >
                {daysLeft > 0 ? `${daysLeft}d left` : "Ended"}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
