import { Injectable } from '@nestjs/common';
import { ParsedProduct } from '../types/product-import.types';

@Injectable()
export class ProductExportFlattenerService {
  flatten(products: ParsedProduct[]): any[] {
    const rows: any[] = [];

    for (const product of products) {
      for (const variant of product.variants) {
        rows.push({
          GST: "",

          "Zoho HSN": product.hsnCode ?? "",

          SKU: variant.sku,

          Group_name: product.name,

          Variant_name: variant.name,

          Category: product.category,

          Sub_category: product.subCategory,

          "Mini Catory": product.miniCategory,

          Product_type: product.type === "VARIABLE" ? "Variant" : "Non Variant",

          "Purchase Price": variant.purchasePrice ?? "",

          "Selling Price": variant.sellingPrice ?? "",

          MRP: variant.mrp ?? "",

          quantity: variant.quantity ?? "",

          Brand: product.brand,

          "Display note": product.displayNotes?.filter(Boolean).join("\n") ?? "",

          image: variant.images.main ?? product.images.main ?? "",

          Description:
            product.shortDescription ??
            product.longDescription ??
            "",

          Features:
            product.features?.filter(Boolean).join("\n") ?? "",

          "Key Specification":
            product.specifications
              ?.map(spec => `${spec.key}: ${spec.value}`)
              .join("\n") ?? "",

          Packing:
            product.packing?.filter(Boolean).join("\n") ?? "",

          "Direction Of Use":
            product.directionOfUse?.filter(Boolean).join("\n") ?? "",

          "Additional Info":
            product.additionalInfo?.filter(Boolean).join("\n") ?? "",

          FAQ:
            product.faq
              ?.map(faq => `${faq.question}:${faq.answer}`)
              .join("\n") ?? "",
        });
      }
    }

    return rows;
  }
}