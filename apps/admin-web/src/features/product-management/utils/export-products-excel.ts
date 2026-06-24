import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Product } from "../types/product.type";

export const exportProductsToExcel = (
  products: Product[]
) => {
  if (!products?.length) {
    return;
  }

  const rows = products.map(
    (product, index) => ({
      "S.No": index + 1,

      "Product ID":
        product.id,

      Name:
        product.name,

      Slug:
        product.slug,

      Type:
        product.type,

      Status:
        product.status,

      Brand:
        product.brand?.name ||
        "-",

      Category:
        product.category?.name ||
        "-",

      "Sub Category":
        product.subCategory?.name ||
        "-",

      "Mini Category":
        product.miniCategory?.name ||
        "-",

      Currency:
        product.currency ||
        "INR",

      "Min Price":
        product.price?.min ||
        0,

      "Max Price":
        product.price?.max ||
        0,

      Quantity:
        product.stock?.quantity ||
        0,

      "In Stock":
        product.stock?.inStock
          ? "YES"
          : "NO",

      Rating:
        product.ratings?.average ||
        0,

      Reviews:
        product.ratings?.count ||
        0,

      Variants:
        product.variants
          ?.length || 0,

      Weighted:
        product.isWeighted
          ? "YES"
          : "NO",

      Warranty:
        product.warrantyMonths ||
        0,

      Features:
        product.features?.join(
          ", "
        ) || "",

      Tags:
        product.tags?.join(", ") ||
        "",

      "Short Description":
        product.shortDescription ||
        "",

      "Created Date":
        product.createdAt
          ? new Date(
              product.createdAt
            ).toLocaleString(
              "en-IN"
            )
          : "-",

      "Updated Date":
        product.updatedAt
          ? new Date(
              product.updatedAt
            ).toLocaleString(
              "en-IN"
            )
          : "-",
    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );

  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 40 },
    { wch: 35 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 50 },
    { wch: 50 },
    { wch: 35 },
    { wch: 35 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Products"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    blob,
    `Products_Report_${
      new Date()
        .toISOString()
        .split("T")[0]
    }.xlsx`
  );
};