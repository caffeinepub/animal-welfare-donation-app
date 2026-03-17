import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Heart, LogIn, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useSubmitDonation,
  useSubmitRecurringDonation,
} from "../hooks/useQueries";

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

interface DonationFormProps {
  campaignId: bigint;
  isActive: boolean;
  onSuccess: (
    referenceId: string,
    amount: number,
    isRecurring: boolean,
  ) => void;
}

export default function DonationForm({
  campaignId,
  isActive,
  onSuccess,
}: DonationFormProps) {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const { mutateAsync: submitDonation, isPending: isSubmitting } =
    useSubmitDonation();
  const { mutateAsync: submitRecurring, isPending: isSubmittingRecurring } =
    useSubmitRecurringDonation();

  const isPending = isSubmitting || isSubmittingRecurring;

  const handlePreset = (val: number) => {
    setAmount(val.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number.parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    const amountBigInt = BigInt(Math.round(numAmount * 100)); // store as cents

    try {
      let refId: string;
      if (isRecurring) {
        refId = await submitRecurring({ campaignId, amount: amountBigInt });
      } else {
        refId = await submitDonation({ campaignId, amount: amountBigInt });
      }
      onSuccess(refId, numAmount, isRecurring);
      setAmount("");
    } catch (err: any) {
      const msg = err?.message || "Donation failed. Please try again.";
      if (msg.includes("profile not found")) {
        toast.error("Please complete your profile setup first.");
      } else {
        toast.error(msg);
      }
    }
  };

  if (!isActive) {
    return (
      <Card className="border-border shadow-card">
        <CardContent className="p-5 text-center">
          <p className="text-muted-foreground font-medium">
            This campaign has ended. Thank you to all donors! 🐾
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="border-border shadow-card">
        <CardContent className="p-5 text-center space-y-3">
          <Heart className="w-8 h-8 text-primary mx-auto" />
          <p className="font-semibold text-foreground">
            Login to make a donation
          </p>
          <p className="text-sm text-muted-foreground">
            Join PawFund and help animals in need.
          </p>
          <Button onClick={login} className="rounded-full font-semibold w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Login to Donate
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          Make a Donation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset amounts */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Choose Amount (USD)</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                    amount === preset.toString()
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-sm font-semibold">
              Or enter custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                $
              </span>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 rounded-lg"
              />
            </div>
          </div>

          {/* Recurring toggle */}
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Monthly donation
                </p>
                <p className="text-xs text-muted-foreground">
                  Donate this amount every month
                </p>
              </div>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>

          <Button
            type="submit"
            disabled={isPending || !amount}
            className="w-full rounded-full font-bold text-base h-11"
          >
            {isPending ? (
              "Processing..."
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2 fill-current" />
                {isRecurring ? "Donate Monthly" : "Donate Now"}
                {amount && ` — $${Number.parseFloat(amount) || 0}`}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
