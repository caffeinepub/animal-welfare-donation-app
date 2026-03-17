import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Hand, LogIn, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useSubmitDonation,
  useSubmitRecurringDonation,
} from "../hooks/useQueries";

const PRESET_AMOUNTS = [51, 101, 251, 501, 1001];
const UPI_ID = "Nikhil.thanedar@ybl";
const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=GOSEVA+PASHUPALAK&cu=INR`;

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

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      toast.success("UPI ID copied!");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number.parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Kripya sahi seva rashi darj karein.");
      return;
    }

    const amountBigInt = BigInt(Math.round(numAmount * 100));

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
      const msg =
        err?.message || "Seva mein samasya aayi. Punah prayaas karein.";
      if (msg.includes("profile not found")) {
        toast.error("Pehle apna profile poora karein.");
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
            Yah abhiyaan samaapt ho gaya hai. Saare sevakjon ka dhanyavaad! 🙏
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="border-border shadow-card">
        <CardContent className="p-5 text-center space-y-3">
          <div className="text-3xl">🙏</div>
          <p className="font-semibold text-foreground">
            Login karein aur Seva karein
          </p>
          <p className="text-sm text-muted-foreground">
            GOSEVA PASHUPALAK mein juden aur pashuon ki seva mein sahyog den.
          </p>
          <Button
            data-ocid="auth.primary_button"
            onClick={login}
            className="rounded-full font-semibold w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login karein — Seva karein
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Hand className="w-5 h-5 text-primary" />
          Seva Karein
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seva Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              data-ocid="seva.tab"
              onClick={() => setIsRecurring(false)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                !isRecurring
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🙏</span>
              <span>Ek Bar Seva</span>
            </button>
            <button
              type="button"
              data-ocid="seva.toggle"
              onClick={() => setIsRecurring(true)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                isRecurring
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Masik Seva</span>
            </button>
          </div>

          {/* Preset amounts */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">
              Seva Rashi Chunein (₹)
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  data-ocid="seva.primary_button"
                  onClick={() => handlePreset(preset)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                    amount === preset.toString()
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-sm font-semibold">
              Ya apni rashi darj karein
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                ₹
              </span>
              <Input
                id="amount"
                data-ocid="seva.input"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            data-ocid="seva.submit_button"
            disabled={isPending || !amount}
            className="w-full rounded-full font-bold text-base h-11"
          >
            {isPending ? (
              "Prakriya ho rahi hai..."
            ) : isRecurring ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Masik Seva Shuru Karein
                {amount && ` — ₹${Number.parseFloat(amount) || 0}/माह`}
              </>
            ) : (
              <span>
                🙏 Ek Bar Seva Karein
                {amount && ` — ₹${Number.parseFloat(amount) || 0}`}
              </span>
            )}
          </Button>
        </form>

        {/* UPI Payment Section */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
              ya UPI se bhugtan karein
            </span>
            <Separator className="flex-1" />
          </div>

          <a
            href={UPI_LINK}
            data-ocid="seva.secondary_button"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <span>📱</span>
            UPI se Seva Karein
          </a>

          <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
            <div>
              <p className="text-xs text-muted-foreground">UPI ID</p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {UPI_ID}
              </p>
            </div>
            <button
              type="button"
              data-ocid="seva.button"
              onClick={handleCopyUPI}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Copy UPI ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
