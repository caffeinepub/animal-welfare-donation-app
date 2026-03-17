import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DonorProfile {
    nickname: string;
    recurringDonationAmount: bigint;
    mobileNumber: string;
    anonymous: boolean;
    imageUrl: string;
    totalDonated: bigint;
}
export interface Donation {
    isRecurring: boolean;
    donorName: string;
    campaignId: bigint;
    referenceId: string;
    timestamp: Time;
    amount: bigint;
    donor: Principal;
}
export type Time = bigint;
export interface AnimalCampaign {
    id: bigint;
    title: string;
    endDate: Time;
    description: string;
    isActive: boolean;
    imageUrl: string;
    animalType: string;
    amountRaised: bigint;
    fundraisingGoal: bigint;
    startDate: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelRecurringDonation(): Promise<void>;
    createCampaign(title: string, description: string, animalType: string, imageUrl: string, fundraisingGoal: bigint, startDate: Time, endDate: Time): Promise<bigint>;
    deactivateCampaign(campaignId: bigint): Promise<void>;
    getActiveCampaigns(): Promise<Array<AnimalCampaign>>;
    getAllCampaigns(): Promise<Array<AnimalCampaign>>;
    getCallerUserProfile(): Promise<DonorProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaign(campaignId: bigint): Promise<AnimalCampaign | null>;
    getDonationHistory(): Promise<Array<Donation>>;
    getRecurringDonations(): Promise<Array<Donation>>;
    getUserProfile(user: Principal): Promise<DonorProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: DonorProfile): Promise<void>;
    submitDonation(campaignId: bigint, amount: bigint): Promise<string>;
    submitRecurringDonation(campaignId: bigint, amount: bigint): Promise<string>;
}
