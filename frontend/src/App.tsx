import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import Home from './pages/Home';
import CampaignDetail from './pages/CampaignDetail';
import Profile from './pages/Profile';
import DonationHistory from './pages/DonationHistory';
import { Toaster } from '@/components/ui/sonner';

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <img src="/assets/generated/pawfund-logo.dim_256x256.png" alt="PawFund" className="w-16 h-16 rounded-full animate-pulse" />
          <p className="text-muted-foreground font-medium">Loading PawFund...</p>
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
  path: '/',
  component: Home,
});

const campaignDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/campaign/$id',
  component: CampaignDetail,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const donationHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donation-history',
  component: DonationHistory,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  campaignDetailRoute,
  profileRoute,
  donationHistoryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
