import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnimalCampaign, Donation, DonorProfile } from "../backend";
import { useActor } from "./useActor";

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<DonorProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: DonorProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ---- Campaigns ----

export function useGetActiveCampaigns() {
  const { actor, isFetching } = useActor();

  return useQuery<AnimalCampaign[]>({
    queryKey: ["activeCampaigns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCampaigns() {
  const { actor, isFetching } = useActor();

  return useQuery<AnimalCampaign[]>({
    queryKey: ["allCampaigns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCampaign(campaignId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AnimalCampaign | null>({
    queryKey: ["campaign", campaignId?.toString()],
    queryFn: async () => {
      if (!actor || campaignId === null) return null;
      return actor.getCampaign(campaignId);
    },
    enabled: !!actor && !isFetching && campaignId !== null,
  });
}

// ---- Donations ----

export function useSubmitDonation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      amount,
    }: { campaignId: bigint; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitDonation(campaignId, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activeCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["allCampaigns"] });
      queryClient.invalidateQueries({
        queryKey: ["campaign", variables.campaignId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["donationHistory"] });
    },
  });
}

export function useSubmitRecurringDonation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      amount,
    }: { campaignId: bigint; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitRecurringDonation(campaignId, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activeCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["allCampaigns"] });
      queryClient.invalidateQueries({
        queryKey: ["campaign", variables.campaignId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["donationHistory"] });
      queryClient.invalidateQueries({ queryKey: ["recurringDonations"] });
    },
  });
}

export function useCancelRecurringDonation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.cancelRecurringDonation();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringDonations"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetDonationHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Donation[]>({
    queryKey: ["donationHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDonationHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecurringDonations() {
  const { actor, isFetching } = useActor();

  return useQuery<Donation[]>({
    queryKey: ["recurringDonations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecurringDonations();
    },
    enabled: !!actor && !isFetching,
  });
}
