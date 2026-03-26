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
const UPI_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(UPI_LINK)}`;

const ANIMAL_SECTIONS = [
  {
    key: "cow",
    label: "Gau Seva",
    emoji: "🐄",
    subtitle: "गौ सेवा — Cow Welfare",
    image: "/assets/generated/gau-seva-cow.dim_600x400.jpg",
    match: (type: string) => type.toLowerCase().includes("cow"),
  },
  {
    key: "dog",
    label: "Shvan Seva",
    emoji: "🐕",
    subtitle: "श्वान सेवा — Dog Welfare",
    image: "/assets/generated/shvan-seva-dog.dim_600x400.jpg",
    match: (type: string) => type.toLowerCase().includes("dog"),
  },
  {
    key: "cat",
    label: "Billi Seva",
    emoji: "🐈",
    subtitle: "बिल्ली सेवा — Cat Welfare",
    image: "/assets/generated/billi-seva-cat.dim_600x400.jpg",
    match: (type: string) => type.toLowerCase().includes("cat"),
  },
  {
    key: "bird",
    label: "Pakshi Seva",
    emoji: "🐦",
    subtitle: "पक्षी सेवा — Bird Welfare",
    image: "/assets/generated/pakshi-seva-birds.dim_600x400.jpg",
    match: (type: string) =>
      type.toLowerCase().includes("bird") ||
      type.toLowerCase().includes("pakshi"),
  },
];

const ANIMAL_CAUSES = [
  {
    key: "cow",
    emoji: "🐄",
    hindiName: "गौ सेवा",
    name: "Gau Seva",
    englishName: "Cow Welfare",
    description:
      "Cows are sacred in our tradition. Support shelters, feeding programs, and medical care for abandoned and injured cows.",
    image: "/assets/generated/gau-seva-cow.dim_600x400.jpg",
    anchor: "#campaigns",
  },
  {
    key: "dog",
    emoji: "🐕",
    hindiName: "श्वान सेवा",
    name: "Shvan Seva",
    englishName: "Dog Welfare",
    description:
      "Street dogs deserve love and care. Donate to feeding drives, vaccination programs, and rescue operations for stray dogs.",
    image: "/assets/generated/shvan-seva-dog.dim_600x400.jpg",
    anchor: "#campaigns",
  },
  {
    key: "cat",
    emoji: "🐈",
    hindiName: "बिल्ली सेवा",
    name: "Billi Seva",
    englishName: "Cat Welfare",
    description:
      "Cats are gentle creatures that need our protection. Help fund food, shelter, and medical care for stray and abandoned cats.",
    image: "/assets/generated/billi-seva-cat.dim_600x400.jpg",
    anchor: "#campaigns",
  },
  {
    key: "bird",
    emoji: "🐦",
    hindiName: "पक्षी सेवा",
    name: "Pakshi Seva",
    englishName: "Bird Welfare",
    description:
      "Birds sing the glory of creation. Your donation helps feed thousands of birds daily and supports bird rescue programs.",
    image: "/assets/generated/pakshi-seva-birds.dim_600x400.jpg",
    anchor: "#campaigns",
  },
];

const IMPACT_STATS = [
  { number: "1000+", label: "Animals Helped", emoji: "🐾" },
  { number: "50+", label: "Campaigns Run", emoji: "📋" },
  { number: "500+", label: "Kind Donors", emoji: "🙏" },
  { number: "4", label: "Animal Causes", emoji: "❤️" },
];

const HOW_TO_STEPS = [
  {
    step: 1,
    title: "Choose a Campaign",
    desc: "Browse active campaigns for cows, dogs, cats, and birds. Find the cause closest to your heart.",
    emoji: "👀",
  },
  {
    step: 2,
    title: "Select Your Seva Amount",
    desc: "Choose a one-time (Ek Bar Seva) or monthly (Masik Seva) donation. Auspicious amounts available.",
    emoji: "💛",
  },
  {
    step: 3,
    title: "Pay via UPI",
    desc: "Donate instantly via Google Pay, PhonePe, Paytm, or any UPI app. Safe, fast & transparent.",
    emoji: "📱",
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
    <section
      id="donate"
      className="py-16 md:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
            <span>🙏</span> Seedha Seva Karein
          </div>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
            Donate Directly via UPI
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Fast, secure, and trusted. Your donation reaches the animals
            directly.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-amber-200 bg-white shadow-saffron-lg">
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-saffron-deep to-saffron-mid flex items-center justify-center shadow-saffron text-white text-4xl select-none">
              🙏
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-serif font-bold text-2xl text-foreground mb-2">
                GOSEVA PASHUPALAK
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Donate directly to help animals in need
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-5 py-2 mb-4">
                <span className="font-mono text-sm font-bold text-foreground">
                  {UPI_ID}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-primary hover:text-foreground hover:bg-amber-100"
                  onClick={handleCopy}
                  aria-label="Copy UPI ID"
                  data-ocid="payment.copy.button"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                {copied && (
                  <span className="text-xs text-green-600 font-semibold">
                    Copied!
                  </span>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary/30 hover:bg-primary/10 rounded-full text-xs font-semibold"
                  onClick={() => setShowQr((v) => !v)}
                  data-ocid="payment.qr.toggle"
                >
                  {showQr ? "Hide QR Code" : "📷 Show QR Code"}
                </Button>
              </div>
              {showQr && (
                <div className="mt-5 flex flex-col items-center md:items-start gap-2">
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-300 bg-white p-2 shadow-md inline-block">
                    <img
                      src={UPI_QR_URL}
                      alt="Scan to Pay via UPI"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Scan with any UPI app to donate
                  </p>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <a
                href={UPI_LINK}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-base px-8 py-4 rounded-full shadow-saffron transition-all duration-200 hover:scale-105 hover:shadow-saffron-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                data-ocid="payment.upi.primary_button"
                aria-label="Pay via UPI"
              >
                <ExternalLink className="h-4 w-4" />
                Pay via UPI
              </a>
            </div>
          </div>
          <div className="bg-amber-50/80 border-t border-amber-100 px-8 py-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold">Accepted on:</span>
            {["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map(
              (app) => (
                <span
                  key={app}
                  className="bg-white border border-amber-200 rounded-full px-3 py-0.5 font-semibold"
                >
                  {app}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface AnimalSectionProps {
  section: (typeof ANIMAL_SECTIONS)[number];
  campaigns: AnimalCampaign[];
}

function AnimalSection({ section, campaigns }: AnimalSectionProps) {
  if (campaigns.length === 0) return null;

  return (
    <section className="mb-14" data-ocid={`${section.key}.section`}>
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-card">
        <img
          src={section.image}
          alt={section.label}
          className="w-full h-40 md:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
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
            <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full">
              {campaigns.length} active campaign
              {campaigns.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
  const [selectedStatus, setSelectedStatus] = useState("all");
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
    <div>
      {/* ── HERO SECTION ── */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        data-ocid="hero.section"
      >
        {/* Background image */}
        <img
          src="/assets/generated/goseva-hero.dim_1200x500.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M30 30m-8 0a8 8 0 1 1 16 0a8 8 0 1 1-16 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating animal badges */}
        <div className="absolute top-12 left-8 md:left-20 text-5xl animate-float opacity-80 hidden md:block">
          🐄
        </div>
        <div className="absolute top-20 right-12 md:right-24 text-4xl animate-float-delay opacity-80 hidden md:block">
          🐕
        </div>
        <div className="absolute bottom-24 left-16 md:left-32 text-3xl animate-float-delay-2 opacity-70 hidden md:block">
          🐈
        </div>
        <div className="absolute bottom-20 right-8 md:right-20 text-4xl animate-float opacity-70 hidden md:block">
          🐦
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full mb-8">
            <span>🙏</span> GOSEVA PASHUPALAK
          </div>

          {/* Main headline */}
          <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4">
            पशु सेवा ही
            <br />
            <span className="text-gold">परम धर्म</span>
          </h1>

          {/* English subtitle */}
          <p className="text-lg md:text-xl text-white/90 font-medium mb-3 tracking-wide">
            Animal Welfare is the Highest Duty
          </p>

          {/* Description */}
          <p className="text-sm md:text-base text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of compassionate souls in serving cows, dogs, cats,
            and birds. Every rupee you donate brings relief to a living
            creature. Seva is never wasted.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#campaigns"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 rounded-full shadow-saffron-lg transition-all duration-200 hover:scale-105 hover:shadow-saffron"
              data-ocid="hero.donate.primary_button"
            >
              🙏 Donate Now
            </a>
            <a
              href="#mission"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/40 text-white font-bold text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 rounded-full transition-all duration-200 hover:scale-105"
              data-ocid="hero.learn_more.secondary_button"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <div className="w-0.5 h-8 bg-white/60 rounded-full animate-pulse" />
        </div>
      </section>

      {/* ── MISSION SECTION ── */}
      <section id="mission" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <span>🕉️</span> Our Purpose
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-foreground mb-5">
              Our Sacred Mission
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              GOSEVA PASHUPALAK was founded on the belief that serving animals
              is a spiritual act. In our tradition, every living being carries a
              divine spark. When we feed a hungry cow, shelter a stray dog, or
              care for an injured bird — we perform seva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Seva",
                hindi: "सेवा",
                desc: "Service is the foundation of our work. We believe that selfless action for the welfare of animals purifies the soul and strengthens community bonds.",
                emoji: "🤲",
                color: "from-orange-50 to-amber-50",
                border: "border-orange-200",
              },
              {
                title: "Karuna",
                hindi: "करुणा",
                desc: "Compassion is our guiding principle. Every campaign we run is driven by empathy for creatures who cannot speak for themselves but deserve care and dignity.",
                emoji: "💛",
                color: "from-yellow-50 to-amber-50",
                border: "border-yellow-200",
              },
              {
                title: "Dharma",
                hindi: "धर्म",
                desc: "Duty to all living beings is a cornerstone of our faith. Protecting animals is not charity — it is righteousness, a sacred obligation we joyfully fulfil.",
                emoji: "🕉️",
                color: "from-amber-50 to-orange-50",
                border: "border-amber-200",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} p-7 md:p-8 card-hover`}
              >
                <div className="text-4xl mb-4">{card.emoji}</div>
                <div className="mb-1">
                  <span className="font-serif font-bold text-xl text-foreground">
                    {card.title}
                  </span>
                  <span className="ml-2 text-muted-foreground text-sm font-medium">
                    ({card.hindi})
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="py-14 md:py-20 bg-gradient-to-br from-saffron-deep via-saffron-mid to-saffron-light">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-3">
              Our Impact So Far
            </h2>
            <p className="text-white/80 text-base">
              Every number here represents a life touched by your generosity
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {IMPACT_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-6 md:p-8 text-center"
              >
                <div className="text-3xl md:text-4xl mb-2">{stat.emoji}</div>
                <div className="font-serif font-bold text-3xl md:text-4xl text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANIMAL CAUSES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <span>🐾</span> Animal Causes
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-foreground mb-4">
              Who We Serve
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              We run dedicated welfare programs for four animal types, each with
              their own campaigns and needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANIMAL_CAUSES.map((cause) => (
              <div
                key={cause.key}
                className="group rounded-2xl overflow-hidden border border-border bg-card shadow-card card-hover"
                data-ocid={`causes.${cause.key}.card`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cause.image}
                    alt={cause.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-3xl">{cause.emoji}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-1">
                    <span className="font-serif font-bold text-base text-foreground">
                      {cause.name}
                    </span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      — {cause.hindiName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {cause.description}
                  </p>
                  <a
                    href={cause.anchor}
                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
                    data-ocid={`causes.${cause.key}.link`}
                  >
                    View Campaigns →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO DONATE ── */}
      <section className="py-16 md:py-24 devotional-bg">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <span>💫</span> Simple & Easy
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-foreground mb-4">
              How to Donate
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Donating takes less than a minute. Here's how:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {HOW_TO_STEPS.map((step) => (
              <div
                key={step.step}
                className="relative bg-white rounded-2xl border border-border p-7 shadow-card card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/25 flex items-center justify-center font-serif font-bold text-primary text-lg">
                    {step.step}
                  </div>
                  <div className="text-3xl">{step.emoji}</div>
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
                {step.step < 3 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPI PAYMENT ── */}
      <UpiPaymentSection />

      {/* ── CAMPAIGNS ── */}
      <section id="campaigns" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <span>📋</span> Live Now
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-foreground mb-4">
              Active Campaigns
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Browse all running campaigns and choose the cause you'd like to
              support today.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full bg-white border-border"
                data-ocid="campaigns.search_input"
              />
            </div>
            <CampaignFilters
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-12" data-ocid="campaigns.loading_state">
              {[1, 2].map((s) => (
                <div key={s}>
                  <Skeleton className="h-40 md:h-56 rounded-2xl mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((i) => (
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
            <div
              className="text-center py-20"
              data-ocid="campaigns.empty_state"
            >
              <PawPrint className="w-16 h-16 text-muted-foreground mx-auto mb-5" />
              <h3 className="font-serif font-bold text-xl text-foreground mb-2">
                No campaigns found
              </h3>
              <p className="text-sm text-muted-foreground">
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
      </section>
    </div>
  );
}
