"use client";

interface ValidationError {
  row: number;
  product?: string;
  sku?: string;
  reason?: string;
  message?: string;
}

interface Props {
  errors: ValidationError[];
}

export function ImportValidationErrors({
  errors,
}: Props) {
  if (!errors?.length) {
    return null;
  }

  return (
    <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
      {errors.map(
        (
          error,
          index
        ) => (
          <div
            key={index}
            className="
              rounded-md
              border
              border-rose-200
              bg-rose-50
              p-3
            "
          >
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-800">
                Row {error.row}
              </p>

              {error.product && (
                <p className="text-xs text-slate-700">
                  <span className="font-medium">
                    Product:
                  </span>{" "}
                  {error.product}
                </p>
              )}

              {error.sku && (
                <p className="text-xs text-slate-700">
                  <span className="font-medium">
                    SKU:
                  </span>{" "}
                  {error.sku}
                </p>
              )}

              <p className="text-xs font-medium text-rose-600">
                {error.reason ||
                  error.message}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}