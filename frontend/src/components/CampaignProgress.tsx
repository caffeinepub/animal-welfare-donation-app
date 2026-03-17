import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import type { AnimalCampaign } from '../backend';
import { formatCurrency, getDaysRemaining } from '../lib/utils';
import { Target, Users, Clock, TrendingUp } from 'lucide-react';

interface CampaignProgressProps {
  campaign: AnimalCampaign;
  donorCount?: number;
}

export default function CampaignProgress({ campaign, donorCount = 0 }: CampaignProgressProps) {
  const goal = Number(campaign.fundraisingGoal);
  const raised = Number(campaign.amountRaised);
  const percentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const daysLeft = getDaysRemaining(campaign.endDate);

  return (
    <Card className="border-border shadow-card">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{formatCurrency(raised)}</p>
              <p className="text-sm text-muted-foreground">raised of {formatCurrency(goal)} goal</p>
            </div>
            <span className="text-3xl font-bold text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 p-3 bg-accent/50 rounded-xl">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-bold text-foreground">{formatCurrency(raised)}</p>
            <p className="text-xs text-muted-foreground text-center">Raised</p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-accent/50 rounded-xl">
            <Users className="w-4 h-4 text-primary" />
            <p className="text-sm font-bold text-foreground">{donorCount}</p>
            <p className="text-xs text-muted-foreground text-center">Donors</p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-accent/50 rounded-xl">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-bold text-foreground">
              {daysLeft === null ? '∞' : daysLeft > 0 ? daysLeft : 0}
            </p>
            <p className="text-xs text-muted-foreground text-center">
              {daysLeft === null ? 'No end' : 'Days left'}
            </p>
          </div>
        </div>

        {daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
          <div className="bg-destructive/10 text-destructive text-xs font-semibold rounded-lg px-3 py-2 text-center">
            ⏰ Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining!
          </div>
        )}
        {daysLeft !== null && daysLeft <= 0 && (
          <div className="bg-muted text-muted-foreground text-xs font-semibold rounded-lg px-3 py-2 text-center">
            This campaign has ended.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
