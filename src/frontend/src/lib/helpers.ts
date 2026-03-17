/**
 * Shared utility helpers for GOSEVA PASHUPALAK
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(timestamp: bigint | number): string {
  const ms =
    typeof timestamp === "bigint"
      ? Number(timestamp) / 1_000_000
      : timestamp * 1000;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ms));
}

export function getAnimalEmoji(animalType: string): string {
  switch (animalType.toLowerCase()) {
    case "cow":
      return "🐄";
    case "dog":
      return "🐶";
    case "cat":
      return "🐱";
    case "bird":
      return "🐦";
    default:
      return "🐾";
  }
}

export function getDaysRemaining(
  endDate: bigint | null | undefined,
): number | null {
  if (!endDate || endDate === BigInt(0)) return null;
  const endMs = Number(endDate) / 1_000_000;
  const now = Date.now();
  return Math.ceil((endMs - now) / (1000 * 60 * 60 * 24));
}
