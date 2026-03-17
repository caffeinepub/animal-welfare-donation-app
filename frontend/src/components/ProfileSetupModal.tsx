import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { PawPrint } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [nickname, setNickname] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    try {
      await saveProfile({
        nickname: nickname.trim(),
        imageUrl: imageUrl.trim(),
        anonymous: false,
        totalDonated: BigInt(0),
        recurringDonationAmount: BigInt(0),
      });
      toast.success('Welcome to PawFund! 🐾');
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full paw-gradient flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="font-serif text-xl">Welcome to PawFund!</DialogTitle>
          </div>
          <DialogDescription>
            Set up your donor profile to start supporting animal welfare campaigns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="nickname">Display Name *</Label>
            <Input
              id="nickname"
              placeholder="e.g. Alex the Animal Lover"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Profile Picture URL (optional)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/avatar.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !nickname.trim()}
            className="w-full rounded-full font-semibold"
          >
            {isPending ? 'Saving...' : 'Start Helping Animals 🐾'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
