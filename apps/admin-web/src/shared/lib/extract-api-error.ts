import { ERROR_MAP } from "@/shared/lib/error-map";

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ParsedApiError = {
  message: string;
  errors: ApiFieldError[];
};

export function extractApiError(error: unknown): ParsedApiError {
  const fallback: ParsedApiError = {
    message: "Unexpected server error",
    errors: [],
  };

  const response = (error as any)?.response?.data;

  if (!response) {
    return fallback;
  }

  const errors: ApiFieldError[] = Array.isArray(response.errors)
    ? response.errors
    : [];

  if (!errors.length && response.details?.field && response.message) {
    errors.push({
      field: String(response.details.field),
      message: String(response.message),
    });
  }

  let message =
    typeof response.message === "string"
      ? response.message
      : fallback.message;

  if (response.errorCode && ERROR_MAP[response.errorCode]) {
    message = ERROR_MAP[response.errorCode];
  }

  if (errors.length > 0) {
    const combined = errors.map((item) => item.message).join(" ");

    if (message === "Validation failed" || message === "Validation Failed") {
      message = errors[0].message;
    } else if (!message || message === "Unexpected server error") {
      message = combined;
    }
  }

  return {
    message,
    errors,
  };
}

export function getFieldError(
  errors: ApiFieldError[],
  field: string,
): string | undefined {
  return errors.find((item) => item.field === field)?.message;
}
