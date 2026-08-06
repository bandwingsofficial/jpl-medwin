import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Order } from "../types/order.type";

export const exportOrdersToExcel = (
  orders: Order[]
) => {
  if (!orders?.length) {
    return;
  }

  const rows = orders.map(
  (order, index) => ({
    "S.No": index + 1,

    "Order ID":
      order.id || "-",

    "Order Number":
      order.orderNumber || "-",

    Status:
      order.status || "-",

    "Payment Status":
      order.paymentStatus || "-",

    "User ID":
      order.userId || "-",

    Customer:
      order.shippingAddress?.name ||
      order.shippingAddress?.fullName ||
      order.billingAddress?.name ||
      order.billingAddress?.fullName ||
      "-",

    Phone:
      order.shippingAddress?.phone ||
      order.shippingAddress?.phoneNumber ||
      order.billingAddress?.phone ||
      order.billingAddress?.phoneNumber ||
      "-",

    "Address Line":
      order.shippingAddress?.line1 ||
      "-",

    City:
      order.shippingAddress?.city ||
      "-",

    State:
      order.shippingAddress?.state ||
      "-",

    "Postal Code":
      order.shippingAddress?.postalCode ||
      "-",

    Country:
      order.shippingAddress?.country ||
      "-",

    "Total Items":
      order.summary?.totalQuantity ||
      order.items?.length ||
      0,

    Subtotal:
      Number(
        order.subtotal ||
        order.summary?.subtotal ||
        0
      ),

    Tax:
      Number(
        order.tax ||
        order.summary?.tax ||
        0
      ),

    Shipping:
      Number(
        order.shippingCharge ||
        order.summary?.shipping ||
        0
      ),

    Discount:
      Number(
        order.discount ||
        order.summary?.couponDiscount ||
        0
      ),

    "Total Savings":
      Number(
        order.totalSavings ||
        order.summary?.totalSavings ||
        0
      ),

    "Redeemed Coins":
      Number(
        order.redeemedCoins || 0
      ),

    "Redeemed Amount":
      Number(
        order.redeemedAmount || 0
      ),

    "Earned Coins":
      Number(
        order.earnedCoins || 0
      ),

    "Grand Total":
      Number(
        order.grandTotal ||
        order.summary?.grandTotal ||
        0
      ),

    "Tracking ID":
      order.shipment?.trackingId ||
      "-",

    Courier:
      order.shipment?.courierName ||
      "-",

    "Created Date":
      order.createdAt
        ? new Date(
            order.createdAt
          ).toLocaleString("en-IN")
        : "-",

    "Updated Date":
      order.updatedAt
        ? new Date(
            order.updatedAt
          ).toLocaleString("en-IN")
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
  { wch: 28 },
  { wch: 18 },
  { wch: 18 },
  { wch: 40 },
  { wch: 25 },
  { wch: 18 },
  { wch: 40 },
  { wch: 18 },
  { wch: 18 },
  { wch: 15 },
  { wch: 18 },
  { wch: 15 },
  { wch: 15 },
  { wch: 15 },
  { wch: 15 },
  { wch: 18 },
  { wch: 18 },
  { wch: 18 },
  { wch: 18 },
  { wch: 25 },
  { wch: 20 },
  { wch: 25 },
  { wch: 25 },
];
  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Orders"
  );

  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  const fileName =
    `Orders_Report_${
      new Date()
        .toISOString()
        .split("T")[0]
    }.xlsx`;

  saveAs(blob, fileName);
};