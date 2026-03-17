import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Copy, PawPrint, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { AnimalCampaign, Donation } from "../backend";
import { formatCurrency, formatDate } from "../lib/utils";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  donation: Donation | null;
  campaigns: AnimalCampaign[];
  donorName: string;
}

export default function ReceiptModal({
  open,
  onClose,
  donation,
  campaigns,
  donorName,
}: ReceiptModalProps) {
  if (!donation) return null;

  const campaign = campaigns?.find((c) => c.id === donation.campaignId);
  const campaignTitle = campaign?.title || `Campaign #${donation.campaignId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(donation.referenceId);
    toast.success("Reference ID copied!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full paw-gradient flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-primary-foreground" />
            </div>
            <DialogTitle className="font-serif text-lg">
              Donation Receipt
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-accent/40 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Donor</span>
              <span className="font-semibold text-foreground">{donorName}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Campaign</span>
              <span className="font-semibold text-foreground text-right max-w-[160px]">
                {campaignTitle}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-primary text-lg">
                {formatCurrency(Number(donation.amount) / 100)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-foreground">
                {formatDate(donation.timestamp)}
              </span>
            </div>
            {donation.isRecurring && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Monthly Recurring
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">
              Transaction Reference
            </p>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <code className="text-xs text-foreground flex-1 truncate font-mono">
                {donation.referenceId}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Thank you for supporting animal welfare!
          </p>

          <Button
            onClick={onClose}
            className="w-full rounded-full font-semibold"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
