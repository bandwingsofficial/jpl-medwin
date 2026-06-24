import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names safely.
 * - Handles conditional classes (clsx)
 * - Resolves Tailwind conflicts (twMerge)
 *
 * Example:
 * cn("px-2", condition && "bg-red-500", "px-4")
 * → "px-4 bg-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}