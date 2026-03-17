import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PawPrint } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DonorProfile } from "../backend";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const [nickname, setNickname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !mobileNumber.trim()) return;

    const profile: DonorProfile = {
      nickname: nickname.trim(),
      imageUrl: "",
      mobileNumber: mobileNumber.trim(),
      anonymous: false,
      totalDonated: BigInt(0),
      recurringDonationAmount: BigInt(0),
    };

    try {
      await saveProfile(profile);
      toast.success("Welcome to GOSEVA PASHUPALAK!");
    } catch (_err) {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full paw-gradient flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="font-serif text-xl">
              Welcome to GOSEVA PASHUPALAK!
            </DialogTitle>
          </div>
          <DialogDescription>
            Set up your donor profile to start supporting animal welfare
            campaigns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="nickname">Display Name *</Label>
            <Input
              id="nickname"
              placeholder="e.g. Ramesh Sharma"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="rounded-lg"
              data-ocid="profile_setup.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              type="tel"
              placeholder="+91 9876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="rounded-lg"
              data-ocid="profile_setup.input"
            />
            {mobileNumber && mobileNumber.trim().length < 10 && (
              <p
                className="text-xs text-destructive"
                data-ocid="profile_setup.error_state"
              >
                Please enter a valid mobile number
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending || !nickname.trim() || !mobileNumber.trim()}
            className="w-full rounded-full font-semibold"
            data-ocid="profile_setup.submit_button"
          >
            {isPending ? "Saving..." : "Start Seva"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
