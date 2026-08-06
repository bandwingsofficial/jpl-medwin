import {
  ProductVariantPage,
} from "@/features/product-management/components/product-variant-page";

// =========================================
// TYPES
// =========================================

interface VariantsPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// =========================================
// PAGE
// =========================================

export default async function VariantsPage(
  props: VariantsPageProps
) {
  const params =
    await props.params;

  const {
    productId,
  } = params;

  // =========================================
  // VALIDATION
  // =========================================

  if (!productId) {
    return (
      <div className="p-6 text-sm text-red-500">
        Invalid Product ID
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <ProductVariantPage
      key={productId}
      productId={productId}
    />
  );
}