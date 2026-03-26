import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateCampaign,
  useDeactivateCampaign,
  useGetAllCampaigns,
  useIsCallerAdmin,
} from "../hooks/useQueries";

const ANIMAL_OPTIONS = [
  { value: "Cow", label: "🐄 Cow — Gau Seva" },
  { value: "Dog", label: "🐕 Dog — Shvan Seva" },
  { value: "Cat", label: "🐈 Cat — Billi Seva" },
  { value: "Bird", label: "🐦 Bird — Pakshi Seva" },
];

function dateToNanos(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * 1_000_000n;
}

export default function Admin() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: campaigns, isLoading: campaignsLoading } = useGetAllCampaigns();
  const createCampaign = useCreateCampaign();
  const deactivateCampaign = useDeactivateCampaign();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !animalType ||
      !goal ||
      !startDate ||
      !endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createCampaign.mutateAsync({
        title,
        description,
        animalType,
        imageUrl,
        fundraisingGoal: BigInt(Math.round(Number(goal))),
        startDate: dateToNanos(startDate),
        endDate: dateToNanos(endDate),
      });
      toast.success("Campaign created successfully! 🙏");
      setTitle("");
      setDescription("");
      setAnimalType("");
      setImageUrl("");
      setGoal("");
      setStartDate("");
      setEndDate("");
    } catch {
      toast.error("Failed to create campaign. Please try again.");
    }
  };

  const handleDeactivate = async (campaignId: bigint) => {
    try {
      await deactivateCampaign.mutateAsync(campaignId);
      toast.success("Campaign deactivated successfully.");
    } catch {
      toast.error("Failed to deactivate campaign.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <ShieldAlert className="w-16 h-16 text-amber-500" />
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Please Log In
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          You must be logged in to access the admin panel.
        </p>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-3"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4"
        data-ocid="admin.error_state"
      >
        <ShieldAlert className="w-16 h-16 text-destructive" />
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Access Denied
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          This area is restricted to administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage campaigns for GOSEVA PASHUPALAK
        </p>
      </motion.div>

      {/* Create Campaign Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <Card className="border-amber-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl border-b border-amber-100">
            <CardTitle className="flex items-center gap-2 font-serif text-xl text-foreground">
              <PlusCircle className="w-5 h-5 text-primary" />
              Create New Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              data-ocid="admin.create_campaign.form"
            >
              {/* Title */}
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="camp-title">Campaign Title *</Label>
                <Input
                  id="camp-title"
                  placeholder="e.g. Cow feeding on occasion of Navratri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  data-ocid="admin.title.input"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="camp-desc">Description *</Label>
                <Textarea
                  id="camp-desc"
                  placeholder="Describe the campaign and its purpose..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  data-ocid="admin.description.textarea"
                />
              </div>

              {/* Animal Type */}
              <div className="space-y-1.5">
                <Label>Animal Type *</Label>
                <Select
                  value={animalType}
                  onValueChange={setAnimalType}
                  required
                >
                  <SelectTrigger data-ocid="admin.animal_type.select">
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANIMAL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fundraising Goal */}
              <div className="space-y-1.5">
                <Label htmlFor="camp-goal">Fundraising Goal (₹) *</Label>
                <Input
                  id="camp-goal"
                  type="number"
                  placeholder="e.g. 51000"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                  min="1"
                  data-ocid="admin.goal.input"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="camp-image">Image URL (optional)</Label>
                <Input
                  id="camp-image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  data-ocid="admin.image_url.input"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <Label htmlFor="camp-start">Start Date *</Label>
                <Input
                  id="camp-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  data-ocid="admin.start_date.input"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <Label htmlFor="camp-end">End Date *</Label>
                <Input
                  id="camp-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  data-ocid="admin.end_date.input"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2 pt-2">
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 font-bold px-8 rounded-full shadow-md"
                  disabled={createCampaign.isPending}
                  data-ocid="admin.create_campaign.submit_button"
                >
                  {createCampaign.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "🙏 Create Campaign"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-serif text-2xl font-bold text-foreground mb-5">
          All Campaigns
        </h2>

        {campaignsLoading ? (
          <div className="space-y-3" data-ocid="admin.campaigns.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground border-2 border-dashed border-amber-200 rounded-xl"
            data-ocid="admin.campaigns.empty_state"
          >
            <p className="text-lg font-medium">No campaigns yet</p>
            <p className="text-sm mt-1">Create your first campaign above.</p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="admin.campaigns.list">
            {campaigns.map((campaign, idx) => (
              <motion.div
                key={campaign.id.toString()}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-amber-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
                data-ocid={`admin.campaign.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground truncate">
                      {campaign.title}
                    </span>
                    <Badge
                      variant={campaign.isActive ? "default" : "secondary"}
                      className={
                        campaign.isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }
                    >
                      {campaign.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-amber-700 border-amber-200 bg-amber-50"
                    >
                      {campaign.animalType}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Goal: ₹
                      {Number(campaign.fundraisingGoal).toLocaleString("en-IN")}
                    </span>
                    <span>
                      Raised: ₹
                      {Number(campaign.amountRaised).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {campaign.isActive && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full flex-shrink-0"
                        data-ocid={`admin.deactivate.button.${idx + 1}`}
                      >
                        Deactivate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="admin.deactivate.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Deactivate Campaign?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to deactivate &ldquo;
                          {campaign.title}&rdquo;? Donors will no longer see
                          this campaign.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.deactivate.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeactivate(campaign.id)}
                          className="bg-destructive hover:bg-destructive/90"
                          data-ocid="admin.deactivate.confirm_button"
                        >
                          Yes, Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
