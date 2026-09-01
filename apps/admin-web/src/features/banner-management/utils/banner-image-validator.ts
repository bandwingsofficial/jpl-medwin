import {
  BANNER_DIMENSIONS,
} from "@/features/banner-management/constants/banner-dimensions.constants";

import {
  getImageDimensions,
} from "@/features/banner-management/utils/image-dimension";

export interface ValidationResult {
  isValid: boolean;

  error?: string;
}

export async function validateBannerImage(
  file: File,
  ruleKey: keyof typeof BANNER_DIMENSIONS
): Promise<ValidationResult> {
  try {
    const rule =
      BANNER_DIMENSIONS[
        ruleKey
      ];

    const dimensions =
      await getImageDimensions(
        file
      );
    const minWidth =
      rule.width -
      rule.tolerance;

    const maxWidth =
      rule.width +
      rule.tolerance;

    const minHeight =
      rule.height -
      rule.tolerance;

    const maxHeight =
      rule.height +
      rule.tolerance;

    const validWidth =
      dimensions.width >=
        minWidth &&
      dimensions.width <=
        maxWidth;

    const validHeight =
      dimensions.height >=
        minHeight &&
      dimensions.height <=
        maxHeight;
    if (
      !validWidth ||
      !validHeight
    ) {
      return {
        isValid: false,

        error: `
Invalid Banner Size

Expected:
${rule.width} × ${rule.height}px

Allowed Range:
${minWidth} × ${minHeight}
to
${maxWidth} × ${maxHeight}

Uploaded:
${dimensions.width} × ${dimensions.height}px
        `.trim(),
      };
    }

    return {
      isValid: true,
    };
  } catch (
    error
  ) {
    console.error(
      "Banner Validation Error:",
      error
    );

    return {
      isValid: false,

      error:
        error instanceof
        Error
          ? error.message
          : "Unable to validate image.",
    };
  }
}