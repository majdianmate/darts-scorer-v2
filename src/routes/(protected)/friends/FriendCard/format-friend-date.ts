import type { Timestamp } from "firebase/firestore";

function toDate(timestamp: Timestamp): Date {
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  return new Date();
}

export function formatFriendshipDate(timestamp: Timestamp): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(toDate(timestamp));
}

export function formatFriendshipRelative(timestamp: Timestamp): string {
  const date = toDate(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
