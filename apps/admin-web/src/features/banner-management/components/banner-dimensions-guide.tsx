import React from 'react';
import { BANNER_DIMENSIONS } from '../constants/banner-dimensions.constants';

interface BannerDimensionsGuideProps {
  variant?: 'card' | 'inline-hint';
  selectedType?: string;
}

export const BannerDimensionsGuide: React.FC<BannerDimensionsGuideProps> = ({
  variant = 'card',
  selectedType,
}) => {
  // Helper to map UI types to constant keys and handle Category special rules
  const getDimensionInfo = (type: string) => {
    switch (type) {
      case 'HOME_BANNER':
        return `Recommended size: ${BANNER_DIMENSIONS.HOME_BANNER.width}x${BANNER_DIMENSIONS.HOME_BANNER.height}px`;
      case 'CATEGORY_BANNER':
        return `Horizontal banners: ${BANNER_DIMENSIONS.CATEGORY_BANNER_HORIZONTAL.width}x${BANNER_DIMENSIONS.CATEGORY_BANNER_HORIZONTAL.height}px. Note: The 3rd slot must be Vertical (${BANNER_DIMENSIONS.CATEGORY_BANNER_VERTICAL.width}x${BANNER_DIMENSIONS.CATEGORY_BANNER_VERTICAL.height}px).`;
      case 'SUB_CATEGORY_BANNER':
        return `Recommended size: ${BANNER_DIMENSIONS.SUB_CATEGORY_BANNER.width}x${BANNER_DIMENSIONS.SUB_CATEGORY_BANNER.height}px`;
      case 'PROMOTIONAL_BANNER':
        return `Recommended size: ${BANNER_DIMENSIONS.PROMOTIONAL_BANNER.width}x${BANNER_DIMENSIONS.PROMOTIONAL_BANNER.height}px`;
      case 'PRODUCT_BANNER':
        return `Recommended size: ${BANNER_DIMENSIONS.PRODUCT_BANNER.width}x${BANNER_DIMENSIONS.PRODUCT_BANNER.height}px`;
      default:
        return null;
    }
  };

  // Variant 1: The Form field contextual helper text
  if (variant === 'inline-hint' && selectedType) {
    const hint = getDimensionInfo(selectedType);
    if (!hint) return null;
    return (
      <div className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-md border border-emerald-100 dark:border-emerald-900/50">
        💡 {hint}
      </div>
    );
  }

  // Variant 2: The full dashboard Master Guide layout
  return (
    <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📐</span>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Banner Image Dimensions Reference Guide
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Home Banners</span>
          <p className="text-zinc-600 dark:text-zinc-400">Size: {BANNER_DIMENSIONS.HOME_BANNER.width} × {BANNER_DIMENSIONS.HOME_BANNER.height}px</p>
        </div>

        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/70 dark:border-amber-900/30 rounded-lg text-xs md:col-span-2">
          <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">Category Banners (Special Rule)</span>
          <p className="text-amber-700 dark:text-amber-400">
            • <strong>Images 1, 2, and 4+:</strong> Horizontal ({BANNER_DIMENSIONS.CATEGORY_BANNER_HORIZONTAL.width} × {BANNER_DIMENSIONS.CATEGORY_BANNER_HORIZONTAL.height}px) <br />
            • <strong>Image Slot 3 Only:</strong> Vertical ({BANNER_DIMENSIONS.CATEGORY_BANNER_VERTICAL.width} × {BANNER_DIMENSIONS.CATEGORY_BANNER_VERTICAL.height}px)
          </p>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Sub-Category Banners</span>
          <p className="text-zinc-600 dark:text-zinc-400">Size: {BANNER_DIMENSIONS.SUB_CATEGORY_BANNER.width} × {BANNER_DIMENSIONS.SUB_CATEGORY_BANNER.height}px</p>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Promotional Banners</span>
          <p className="text-zinc-600 dark:text-zinc-400">Size: {BANNER_DIMENSIONS.PROMOTIONAL_BANNER.width} × {BANNER_DIMENSIONS.PROMOTIONAL_BANNER.height}px</p>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Product Banners</span>
          <p className="text-zinc-600 dark:text-zinc-400">Size: {BANNER_DIMENSIONS.PRODUCT_BANNER.width} × {BANNER_DIMENSIONS.PRODUCT_BANNER.height}px</p>
        </div>
      </div>
    </div>
  );
};