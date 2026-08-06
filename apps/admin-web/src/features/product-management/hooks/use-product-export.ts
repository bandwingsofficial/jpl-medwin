import { productApi } from "@/infrastructure/api/product.api";
import { toast } from "sonner";

export const useProductExport = () => {
  const exportProducts = async () => {
    try {
      const response =
        await productApi.exportProducts();

      const blob = new Blob(
        [response.data],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "products.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

      toast.success(
        "Products exported successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to export products"
      );
    }
  };

  return {
    exportProducts,
  };
};