import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, ExternalLink, PawPrint, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AnimalCampaign } from "../backend";
import CampaignCard from "../components/CampaignCard";
import CampaignFilters from "../components/CampaignFilters";
import { useGetActiveCampaigns, useGetAllCampaigns } from "../hooks/useQueries";

const UPI_ID = "Nikhil.thanedar@ybl";
const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=GOSEVA+PASHUPALAK&cu=INR`;

const ANIMAL_SECTIONS = [
  {
    key: "cow",
    label: "Gau Seva",
    emoji: "🐄",
    subtitle: "गौ सेवा — Cow Welfare",
    image: "/assets/generated/cow-eating.dim_800x600.jpg",
    match: (type: string) => type.toLowerCase().includes("cow"),
  },
  {
    key: "dog",
    label: "Shvan Seva",
    emoji: "🐕",
    subtitle: "श्वान सेवा — Dog Welfare",
    image: "/assets/generated/dog-eating.dim_800x600.jpg",
    match: (type: string) => type.toLowerCase().includes("dog"),
  },
  {
    key: "cat",
    label: "Billi Seva",
    emoji: "🐈",
    subtitle: "बिल्ली सेवा — Cat Welfare",
    image: "/assets/generated/cat-eating.dim_800x600.jpg",
    match: (type: string) => type.toLowerCase().includes("cat"),
  },
  {
    key: "bird",
    label: "Pakshi Seva",
    emoji: "🐦",
    subtitle: "पक्षी सेवा — Bird Welfare",
    image: "/assets/generated/birds-eating.dim_800x600.jpg",
    match: (type: string) =>
      type.toLowerCase().includes("bird") ||
      type.toLowerCase().includes("pakshi"),
  },
];

function UpiPaymentSection() {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      toast.success("UPI ID copied!", { description: UPI_ID });
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mb-8 rounded-2xl overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg text-white text-3xl select-none">
          🙏
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-serif font-bold text-xl md:text-2xl text-amber-900 leading-tight">
            Seedha Seva Karein
          </h2>
          <p className="text-sm text-amber-700 mt-1">
            Direct donation via UPI — fast, secure & trusted
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/70 border border-amber-200 rounded-full px-4 py-1.5">
            <span className="font-mono text-sm font-semibold text-amber-800">
              {UPI_ID}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-amber-600 hover:text-amber-900 hover:bg-amber-100"
              onClick={handleCopy}
              aria-label="Copy UPI ID"
              data-ocid="home.payment.button"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            {copied && (
              <span className="text-xs text-green-600 font-medium">
                Copied!
              </span>
            )}
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-amber-700 border-amber-300 hover:bg-amber-100 rounded-full text-xs"
              onClick={() => setShowQr((v) => !v)}
              data-ocid="home.payment.toggle"
            >
              {showQr ? "Hide QR Code" : "Show QR Code"}
            </Button>
          </div>
          {showQr && (
            <div className="mt-4 flex flex-col items-center md:items-start gap-2">
              <div className="rounded-xl overflow-hidden border-2 border-amber-300 bg-white p-2 shadow-md inline-block">
                <img
                  src="/assets/generated/upi-qr-code.dim_400x400.png"
                  alt="Scan to Pay via UPI"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <p className="text-xs text-amber-700 font-medium">
                Scan with any UPI app to donate
              </p>
            </div>
          )}
        </div>
        <a
          href={UPI_LINK}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base px-7 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          data-ocid="home.payment.primary_button"
          aria-label="Pay via UPI"
        >
          <ExternalLink className="h-4 w-4" />
          Pay via UPI
        </a>
      </div>
      <div className="bg-amber-100/60 border-t border-amber-200/60 px-6 py-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-amber-700">
        <span className="font-medium">Accepted on:</span>
        {["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((app) => (
          <span
            key={app}
            className="bg-white/70 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium"
          >
            {app}
          </span>
        ))}
      </div>
    </div>
  );
}

interface AnimalSectionProps {
  section: (typeof ANIMAL_SECTIONS)[number];
  campaigns: AnimalCampaign[];
}

function AnimalSection({ section, campaigns }: AnimalSectionProps) {
  if (campaigns.length === 0) return null;

  return (
    <section className="mb-12" data-ocid={`${section.key}.section`}>
      {/* Section Header */}
      <div className="relative rounded-2xl overflow-hidden mb-5 shadow-md">
        <img
          src={section.image}
          alt={section.label}
          className="w-full h-36 md:h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 md:px-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl md:text-5xl drop-shadow-lg">
                {section.emoji}
              </span>
              <div>
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-white drop-shadow-md leading-tight">
                  {section.label}
                </h2>
                <p className="text-white/80 text-xs md:text-sm font-medium mt-0.5">
                  {section.subtitle}
                </p>
              </div>
            </div>
            <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full mt-1">
              {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((campaign, idx) => (
          <div
            key={campaign.id.toString()}
            data-ocid={`${section.key}.item.${idx + 1}`}
          >
            <CampaignCard campaign={campaign} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: activeCampaigns, isLoading: loadingActive } =
    useGetActiveCampaigns();
  const { data: allCampaigns, isLoading: loadingAll } = useGetAllCampaigns();

  const isLoading = loadingActive || loadingAll;

  const baseCampaigns = useMemo(() => {
    return selectedStatus === "active"
      ? (activeCampaigns ?? [])
      : selectedStatus === "completed"
        ? (allCampaigns ?? []).filter((c) => !c.isActive)
        : (allCampaigns ?? []);
  }, [activeCampaigns, allCampaigns, selectedStatus]);

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return baseCampaigns;
    const q = searchQuery.toLowerCase();
    return baseCampaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [baseCampaigns, searchQuery]);

  const hasAnyResults = ANIMAL_SECTIONS.some((s) =>
    filteredCampaigns.some((c) => s.match(c.animalType)),
  );

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
            Support welfare campaigns for cows, dogs, cats, and birds — every
            donation makes a real difference.
          </p>
        </div>
      </div>

      {/* UPI Payment Section */}
      <UpiPaymentSection />

      {/* Search + Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns across all animals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full bg-card border-border"
            data-ocid="home.search_input"
          />
        </div>
        <CampaignFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-10" data-ocid="campaigns.loading_state">
          {[1, 2].map((s) => (
            <div key={s}>
              <Skeleton className="h-36 md:h-48 rounded-2xl mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-44 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !hasAnyResults ? (
        <div className="text-center py-16" data-ocid="campaigns.empty_state">
          <PawPrint className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif font-bold text-lg text-foreground">
            No campaigns found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery
              ? "Try adjusting your search query."
              : "No campaigns are available right now. Check back soon!"}
          </p>
        </div>
      ) : (
        <div>
          {ANIMAL_SECTIONS.map((section) => {
            const sectionCampaigns = filteredCampaigns.filter((c) =>
              section.match(c.animalType),
            );
            return (
              <AnimalSection
                key={section.key}
                section={section}
                campaigns={sectionCampaigns}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
