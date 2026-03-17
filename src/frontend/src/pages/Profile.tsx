import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Edit2, Heart, History, LogIn, Phone, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DonorProfile } from "../backend";
import RecurringDonationsList from "../components/RecurringDonationsList";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import { formatCurrency } from "../lib/helpers";

export default function Profile() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();

  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile, isPending: isSaving } =
    useSaveCallerUserProfile();

  const profile = userProfile as DonorProfile | null | undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editMobileNumber, setEditMobileNumber] = useState("");

  const startEdit = () => {
    setEditNickname(profile?.nickname || "");
    setEditMobileNumber(profile?.mobileNumber || "");
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const handleSave = async () => {
    if (!editNickname.trim() || !profile) return;
    const updated: DonorProfile = {
      ...profile,
      nickname: editNickname.trim(),
      mobileNumber: editMobileNumber.trim(),
    };
    try {
      await saveProfile(updated);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h2 className="font-serif font-bold text-xl text-foreground mb-2">
          Login to view your profile
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Track your donations and manage your recurring contributions.
        </p>
        <Button onClick={login} className="rounded-full font-semibold">
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const initials = profile?.nickname?.slice(0, 2).toUpperCase() || "U";
  const totalDonated = Number(profile?.totalDonated ?? 0);
  const mobileNumber = profile?.mobileNumber || "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-12">
      <h1 className="font-serif font-bold text-2xl text-foreground">
        My Profile
      </h1>

      {/* Profile Card */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="font-serif text-base">
              Donor Profile
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={startEdit}
                className="rounded-full h-8"
                data-ocid="profile.edit_button"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="rounded-full h-8"
                  data-ocid="profile.cancel_button"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full h-8"
                  data-ocid="profile.save_button"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={profile?.imageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isEditing ? (
              <div>
                <p className="font-bold text-lg text-foreground">
                  {profile?.nickname || "Anonymous"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Principal: {identity?.getPrincipal().toString().slice(0, 12)}
                  ...
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {mobileNumber.trim() ? mobileNumber : "Not provided"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Display Name</Label>
                  <Input
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="h-8 text-sm rounded-lg"
                    placeholder="Your name"
                    data-ocid="profile.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Mobile Number *
                  </Label>
                  <Input
                    type="tel"
                    value={editMobileNumber}
                    onChange={(e) => setEditMobileNumber(e.target.value)}
                    className="h-8 text-sm rounded-lg"
                    placeholder="+91 9876543210"
                    data-ocid="profile.input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-accent/50 rounded-xl p-3 text-center">
              <Heart className="w-5 h-5 text-primary mx-auto mb-1 fill-primary" />
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(totalDonated / 100)}
              </p>
              <p className="text-xs text-muted-foreground">Total Donated</p>
            </div>
            <div className="bg-accent/50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🐾</div>
              <p className="text-lg font-bold text-foreground">
                {profile?.recurringDonationAmount &&
                Number(profile.recurringDonationAmount) > 0
                  ? `${formatCurrency(
                      Number(profile.recurringDonationAmount) / 100,
                    )}/mo`
                  : "None"}
              </p>
              <p className="text-xs text-muted-foreground">Monthly Giving</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Donations */}
      <RecurringDonationsList />

      {/* Donation History Link */}
      <Button
        variant="outline"
        className="w-full rounded-full font-semibold"
        onClick={() => navigate({ to: "/donation-history" })}
        data-ocid="profile.secondary_button"
      >
        <History className="w-4 h-4 mr-2" />
        View Donation History
      </Button>
    </div>
  );
}
