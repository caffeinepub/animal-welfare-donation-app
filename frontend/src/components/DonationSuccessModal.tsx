import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DonationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  referenceId: string;
  amount: number;
  campaignTitle: string;
  isRecurring: boolean;
}

export default function DonationSuccessModal({
  open,
  onClose,
  referenceId,
  amount,
  campaignTitle,
  isRecurring,
}: DonationSuccessModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    toast.success('Reference ID copied!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-success" />
            </div>
          </div>
          <DialogTitle className="font-serif text-xl text-center">Thank You! 🐾</DialogTitle>
          <DialogDescription className="text-center">
            Your donation has been recorded successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="bg-accent/50 rounded-xl p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Campaign</span>
              <span className="font-semibold text-foreground text-right max-w-[180px] truncate">{campaignTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Amount</span>
              <span className="font-bold text-primary">${amount.toFixed(2)}</span>
            </div>
            {isRecurring && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Type</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Monthly
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Transaction Reference</p>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <code className="text-xs text-foreground flex-1 truncate font-mono">{referenceId}</code>
              <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <Button onClick={onClose} className="w-full rounded-full font-semibold">
            Continue Helping Animals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
