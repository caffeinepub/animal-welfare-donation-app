import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(dollars);
}

export function formatDate(timestamp: bigint): string {
  // ICP timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(ms));
}

export function getDaysRemaining(endDate: bigint): number | null {
  if (!endDate || endDate === BigInt(0)) return null;
  const endMs = Number(endDate) / 1_000_000;
  const now = Date.now();
  const diff = endMs - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getAnimalEmoji(animalType: string): string {
  const type = animalType?.toLowerCase() || '';
  if (type.includes('dog')) return '🐕';
  if (type.includes('cat')) return '🐈';
  if (type.includes('bird')) return '🦜';
  if (type.includes('horse')) return '🐴';
  if (type.includes('rabbit')) return '🐇';
  if (type.includes('wildlife') || type.includes('wild')) return '🦁';
  if (type.includes('fish') || type.includes('marine')) return '🐠';
  if (type.includes('reptile') || type.includes('turtle')) return '🐢';
  return '🐾';
}
