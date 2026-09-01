import { BannerImage } from "../types/banner.types";

/**
 * Resolves the destination URL from a banner image object.
 * Prioritizes the generic `link` property, and falls back to `productSlug` / `productId` for legacy banners.
 */
export function getBannerDestination(
  banner?: (Partial<BannerImage> & { product?: { slug?: string } | null }) | null,
): string | null {
  if (!banner) return null;

  // 1. Direct Link (internal or external)
  if (banner.link && typeof banner.link === "string" && banner.link.trim()) {
    return banner.link.trim();
  }

  // 2. Backward compatibility fallback: productSlug / product.slug
  if (banner.productSlug && typeof banner.productSlug === "string" && banner.productSlug.trim()) {
    return `/products/${banner.productSlug.trim()}`;
  }

  if (banner.product?.slug && typeof banner.product.slug === "string" && banner.product.slug.trim()) {
    return `/products/${banner.product.slug.trim()}`;
  }

  // 3. Backward compatibility fallback: productId
  if (banner.productId && typeof banner.productId === "string" && banner.productId.trim()) {
    return `/products/${banner.productId.trim()}`;
  }

  return null;
}

/**
 * Handles navigation when a customer clicks a banner image.
 * - External URLs (starting with http://, https://, or //) navigate via standard browser location.
 * - Internal paths (e.g. /products/slug, /categories/slug) navigate via Next.js router.
 * - Empty / null links perform no action and avoid crashing.
 */
export function navigateToBannerLink(
  banner?: (Partial<BannerImage> & { product?: { slug?: string } | null }) | null,
  router?: { push: (url: string) => void },
): void {
  const destination = getBannerDestination(banner);
  if (!destination) return;

  const isExternal =
    destination.startsWith("http://") ||
    destination.startsWith("https://") ||
    destination.startsWith("//");

  if (isExternal) {
    if (typeof window !== "undefined") {
      window.location.href = destination;
    }
  } else {
    const internalPath = destination.startsWith("/") ? destination : `/${destination}`;
    if (router) {
      router.push(internalPath);
    } else if (typeof window !== "undefined") {
      window.location.href = internalPath;
    }
  }
}
