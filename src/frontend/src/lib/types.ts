import type { DonorProfile } from "../backend.d";

// Extended DonorProfile with mobileNumber field added in backend
export type DonorProfileExtended = DonorProfile & {
  mobileNumber?: string;
};
