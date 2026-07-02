export interface ProductExportFilters {
  exportType:
    | "created-at"
    | "updated-at";

  fromDate: string;

  toDate: string;
}