import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines classNames safely with Tailwind support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}