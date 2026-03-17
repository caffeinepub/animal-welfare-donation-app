import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: bigint | number | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(Number(date)));
}

export function getDaysRemaining(
  endDate: bigint | number | null | undefined,
): number | null {
  if (endDate === null || endDate === undefined) return null;
  const end = new Date(Number(endDate));
  const now = new Date();
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

export function getAnimalEmoji(animalType: string): string {
  const type = animalType.toLowerCase();
  if (type.includes("cow")) return "\ud83d\udc04";
  if (type.includes("dog")) return "\ud83d\udc15";
  if (type.includes("cat")) return "\ud83d\udc08";
  if (type.includes("bird")) return "\ud83d\udc26";
  return "\ud83d\udc3e";
}
