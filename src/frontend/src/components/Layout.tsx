import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Download,
  Heart,
  History,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

interface LayoutProps {
  children: React.ReactNode;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const initials = userProfile?.nickname
    ? userProfile.nickname.slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Install App Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-saffron-deep to-saffron-mid text-white px-4 py-2 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/goseva-icon.dim_512x512.png"
              alt="GOSEVA"
              className="w-7 h-7 rounded-full"
            />
            <span className="font-medium">
              Add GOSEVA PASHUPALAK to your home screen
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 px-3 text-xs font-bold rounded-full bg-white text-orange-600 hover:bg-orange-50"
              onClick={handleInstall}
              data-ocid="layout.install_button"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </Button>
            <button
              type="button"
              onClick={() => setShowInstallBanner(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-amber-100"
            : "bg-white border-b border-amber-100/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group flex-shrink-0"
            data-ocid="nav.home.link"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-saffron flex-shrink-0">
              <img
                src="/assets/generated/goseva-icon.dim_512x512.png"
                alt="GOSEVA PASHUPALAK"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="leading-tight">
              <div className="font-serif font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                GOSEVA PASHUPALAK
              </div>
              <div className="text-[10px] text-muted-foreground hidden md:block tracking-wider uppercase">
                पशु सेवा ही परम धर्म
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/#campaigns", label: "Campaigns" },
              { to: "/#mission", label: "About" },
              { to: "/#donate", label: "Donate" },
            ].map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors"
                data-ocid={`nav.${item.label.toLowerCase()}.link`}
              >
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors [&.active]:text-primary"
                  data-ocid="nav.profile.link"
                >
                  My Profile
                </Link>
                <Link
                  to="/donation-history"
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors [&.active]:text-primary"
                  data-ocid="nav.history.link"
                >
                  History
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-sm font-semibold text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1.5 [&.active]:text-primary"
                    data-ocid="nav.admin.link"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                    data-ocid="nav.account.button"
                  >
                    <Avatar className="w-9 h-9 border-2 border-primary/30">
                      <AvatarImage src={userProfile?.imageUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-semibold text-foreground max-w-[120px] truncate">
                      {userProfile?.nickname || "My Account"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  data-ocid="nav.account.dropdown_menu"
                >
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/profile" })}
                    data-ocid="nav.profile.button"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/donation-history" })}
                    data-ocid="nav.history.button"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Donation History
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/admin" })}
                        className="text-amber-700 focus:text-amber-900"
                        data-ocid="nav.admin.button"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="rounded-full font-bold px-6 bg-primary hover:bg-primary/90 shadow-saffron"
                data-ocid="nav.login.button"
              >
                {isLoggingIn ? "Logging in..." : "🙏 Login"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.mobile_menu.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-100 bg-white/98 px-4 py-3 flex flex-col gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/#campaigns", label: "Campaigns" },
              { href: "/#mission", label: "About" },
              { href: "/#donate", label: "Donate" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2.5 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="py-2.5 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/donation-history"
                  className="py-2.5 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Donation History
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="py-2.5 px-3 text-sm font-semibold text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                    data-ocid="nav.admin.mobile.link"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-cream mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/50">
                  <img
                    src="/assets/generated/goseva-icon.dim_512x512.png"
                    alt="GOSEVA PASHUPALAK"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg text-cream">
                    GOSEVA PASHUPALAK
                  </div>
                  <div className="text-xs text-cream/60 tracking-wider">
                    पशु सेवा ही परम धर्म
                  </div>
                </div>
              </div>
              <p className="text-sm text-cream/70 leading-relaxed">
                Dedicated to the welfare of cows, dogs, cats, and birds. Every
                donation is an act of devotion.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                {[
                  "🐄 Gau Seva",
                  "🐕 Shvan Seva",
                  "🐈 Billi Seva",
                  "🐦 Pakshi Seva",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/10 border border-white/20 text-cream/80 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-serif font-bold text-base text-cream mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/", label: "Home" },
                  { href: "/#campaigns", label: "Active Campaigns" },
                  { href: "/#mission", label: "Our Mission" },
                  { href: "/#donate", label: "Donate via UPI" },
                  { href: "/donation-history", label: "Donation History" },
                  { href: "/profile", label: "My Profile" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-cream/70 hover:text-cream transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Donate / Contact */}
            <div>
              <h3 className="font-serif font-bold text-base text-cream mb-4">
                Donate Directly
              </h3>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
                <div className="text-xs text-cream/60 mb-1">UPI ID</div>
                <div className="font-mono font-bold text-cream text-sm">
                  Nikhil.thanedar@ybl
                </div>
              </div>
              <p className="text-xs text-cream/60 mb-3">
                Accepted on Google Pay, PhonePe, Paytm, BHIM & more
              </p>
              <a
                href="upi://pay?pa=Nikhil.thanedar@ybl&pn=GOSEVA+PASHUPALAK&cu=INR"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
                data-ocid="footer.donate.primary_button"
              >
                🙏 Pay via UPI
              </a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-cream/50">
              © {new Date().getFullYear()} GOSEVA PASHUPALAK. All rights
              reserved.
            </p>
            <p className="text-xs text-cream/50">
              Built with{" "}
              <Heart className="inline w-3 h-3 text-primary fill-primary" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "goseva-pashupalak")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
