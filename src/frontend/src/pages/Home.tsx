import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PawPrint, Search } from "lucide-react";
import { useMemo, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import CampaignFilters from "../components/CampaignFilters";
import { useGetActiveCampaigns, useGetAllCampaigns } from "../hooks/useQueries";

export default function Home() {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: activeCampaigns, isLoading: loadingActive } =
    useGetActiveCampaigns();
  const { data: allCampaigns, isLoading: loadingAll } = useGetAllCampaigns();

  const isLoading = loadingActive || loadingAll;

  const campaigns = useMemo(() => {
    const base =
      selectedStatus === "active"
        ? (activeCampaigns ?? [])
        : selectedStatus === "completed"
          ? (allCampaigns ?? []).filter((c) => !c.isActive)
          : (allCampaigns ?? []);

    return base.filter((c) => {
      const matchesType =
        selectedType === "All" ||
        c.animalType.toLowerCase().includes(selectedType.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [
    activeCampaigns,
    allCampaigns,
    selectedType,
    selectedStatus,
    searchQuery,
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      {/* Hero Banner */}
      <div className="relative -mx-4 mb-8 overflow-hidden">
        <img
          src="/assets/generated/pawfund-hero.dim_1200x400.png"
          alt="Animal Welfare - Help Animals in Need"
          className="w-full object-cover max-h-72 md:max-h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="font-serif font-bold text-2xl md:text-4xl text-foreground drop-shadow-sm">
            Help Cows, Dogs, Cats & Birds
          </h1>
          <p className="text-sm md:text-base text-foreground/80 mt-1 max-w-lg">
            Support welfare campaigns for cows, dogs, cats, and birds -- every
            donation makes a real difference.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-full bg-card border-border"
          data-ocid="home.search_input"
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <CampaignFilters
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          onTypeChange={setSelectedType}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* Campaign Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="campaigns.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-44 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
              <Skeleton className="h-2 rounded-full" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16" data-ocid="campaigns.empty_state">
          <PawPrint className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif font-bold text-lg text-foreground">
            No campaigns found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery || selectedType !== "All"
              ? "Try adjusting your filters or search query."
              : "No campaigns are available right now. Check back soon!"}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id.toString()} campaign={campaign} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
