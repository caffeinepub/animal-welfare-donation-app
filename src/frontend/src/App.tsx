import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import Admin from "./pages/Admin";
import CampaignDetail from "./pages/CampaignDetail";
import DonationHistory from "./pages/DonationHistory";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/generated/goseva-icon.dim_512x512.png"
            alt="GOSEVA PASHUPALAK"
            className="w-16 h-16 rounded-full animate-pulse"
          />
          <p className="text-muted-foreground font-medium">
            Loading GOSEVA PASHUPALAK...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Outlet />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const campaignDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaign/$id",
  component: CampaignDetail,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const donationHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donation-history",
  component: DonationHistory,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  campaignDetailRoute,
  profileRoute,
  donationHistoryRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
