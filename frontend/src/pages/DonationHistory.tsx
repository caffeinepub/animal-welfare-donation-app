import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDonationHistory, useGetAllCampaigns } from '../hooks/useQueries';
import DonationHistoryList from '../components/DonationHistoryList';
import ReceiptModal from '../components/ReceiptModal';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import type { Donation } from '../backend';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn } from 'lucide-react';

export default function DonationHistory() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();

  const { data: donations, isLoading: donationsLoading } = useGetDonationHistory();
  const { data: campaigns, isLoading: campaignsLoading } = useGetAllCampaigns();
  const { data: userProfile } = useGetCallerUserProfile();

  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const handleViewReceipt = (donation: Donation) => {
    setSelectedDonation(donation);
    setReceiptOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="font-serif font-bold text-xl text-foreground mb-2">Login to view your history</h2>
        <p className="text-muted-foreground text-sm mb-6">
          See all your past donations and download receipts.
        </p>
        <Button onClick={login} className="rounded-full font-semibold">
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: '/profile' })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Profile
        </Button>
        <h1 className="font-serif font-bold text-2xl text-foreground">Donation History</h1>
      </div>

      <DonationHistoryList
        donations={donations ?? []}
        campaigns={campaigns ?? []}
        isLoading={donationsLoading || campaignsLoading}
        onViewReceipt={handleViewReceipt}
      />

      <ReceiptModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        donation={selectedDonation}
        campaigns={campaigns ?? []}
        donorName={userProfile?.nickname || 'Anonymous'}
      />
    </div>
  );
}
