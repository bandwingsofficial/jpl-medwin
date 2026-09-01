  "use client";

  import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  import { Download, Home } from "lucide-react";

  import ExportOrdersDialog from "./export-orders-dialog";

  import {
    ChevronRight,
  } from "lucide-react";

  import {
    Loader2,
    Truck,
    CheckCircle2,
    Search,
    Clock3,
    RotateCcw,
    Settings2,
    ChevronLeft,
    Calendar,
    Filter,
    X,
  } from "lucide-react";

  import {
  useOrders,
  useOrderDetails,
} from "../hooks/use-orders";

import { useNewOrderNotification } from "../hooks/use-new-order-notification";

  import { Order } from "../types/order.type";

  import OrderTable from "./order-table";

  import OrderDetailsDrawer from "./order-details-drawer";

  import { OrderStats } from "./order-stats";

  import { Input } from "@/shared/components/ui/input";
import { useSearchParams, useRouter, } from "next/navigation";

  /*
  |--------------------------------------------------------------------------
  | TYPES
  |--------------------------------------------------------------------------
  */

  interface StatusTab {
    label: string;

    value: string;

    icon?: React.ReactNode;
  }

  /*
  |--------------------------------------------------------------------------
  | STATUS TABS
  |--------------------------------------------------------------------------
  */


  const STATUS_TABS: StatusTab[] = [
    {
      label: "Recent Orders",
      value: "",
      icon: <Clock3 size={16} />,
    },

    {
      label: "Pending",
      value: "PENDING_PAYMENT",
    },

    {
      label: "Confirmed",
      value: "CONFIRMED",
    },

    {
      label: "Processing",
      value: "PROCESSING",
      icon: <Settings2 size={16} />,
    },

    {
      label: "Shipped",
      value: "SHIPPED",
      icon: <Truck size={16} />,
    },

    {
      label: "Delivered",
      value: "DELIVERED",
      icon: (
        <CheckCircle2 size={16} />
      ),
    },

    {
      label: "Cancelled",
      value: "CANCELLED",
    },

  ];

  export default function OrderPage() {

  // =========================================
  // NEW ORDER NOTIFICATION
  // =========================================

  useNewOrderNotification();

  const router = useRouter();
const searchParams = useSearchParams();

const statusFromUrl =
  searchParams.get("status") ?? "";

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [
      selectedOrderId,
      setSelectedOrderId,
    ] = useState("");

    const [
      drawerOpen,
      setDrawerOpen,
    ] = useState(false);
    
  const [
    exportDialogOpen,
    setExportDialogOpen,
  ] = useState(false);

    const [page, setPage] =
      useState(1);

    // =========================================
    // SEARCH
    // =========================================

    const [
      search,
      setSearch,
    ] = useState("");

    const [
      searchInput,
      setSearchInput,
    ] = useState("");

    const [dateType, setDateType] = useState<"created" | "updated">("created");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [datePreset, setDatePreset] = useState<string>("all");

    useEffect(() => {

      const timeout =
        setTimeout(() => {

          setPage(1);

          setSearch(
            searchInput
          );

        }, 500);

      return () =>
        clearTimeout(
          timeout
        );

    }, [searchInput]);

    const [
  activeStatus,
  setActiveStatus,
] = useState(
  statusFromUrl
);
useEffect(() => {
  setActiveStatus(statusFromUrl);
  setPage(1);
}, [statusFromUrl]);

    const handlePresetChange = (preset: string) => {
      setDatePreset(preset);
      setPage(1);
      const now = new Date();
      const format = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      if (preset === "today") {
        const today = format(now);
        setFromDate(today);
        setToDate(today);
      } else if (preset === "yesterday") {
        const yest = new Date(now);
        yest.setDate(yest.getDate() - 1);
        const yestStr = format(yest);
        setFromDate(yestStr);
        setToDate(yestStr);
      } else if (preset === "7days") {
        const past = new Date(now);
        past.setDate(past.getDate() - 7);
        setFromDate(format(past));
        setToDate(format(now));
      } else if (preset === "30days" || preset === "thisMonth" || preset === "month") {
        const past = new Date(now);
        past.setDate(past.getDate() - 30);
        setFromDate(format(past));
        setToDate(format(now));
      } else {
        setFromDate("");
        setToDate("");
      }
    };

    const handleResetFilters = () => {
      setSearchInput("");
      setSearch("");
      setFromDate("");
      setToDate("");
      setDateType("created");
      setDatePreset("all");
      setPaymentStatus("");
      setActiveStatus("");
      setPage(1);
      router.push("/orders");
    };

    const activeFilterCount =
      (fromDate ? 1 : 0) +
      (toDate ? 1 : 0) +
      (paymentStatus ? 1 : 0) +
      (search ? 1 : 0) +
      (activeStatus ? 1 : 0);

    /*
    |--------------------------------------------------------------------------
    | ORDERS QUERY
    |--------------------------------------------------------------------------
    */

    const {
      data,

      isLoading,

      error,
    } = useOrders({
      page,
      limit: 1000000,
      search,
      status: activeStatus,
      paymentStatus,
      from: fromDate,
      to: toDate,
      dateType,
    });

    /*
    |--------------------------------------------------------------------------
    | ORDER DETAILS QUERY
    |--------------------------------------------------------------------------
    */

    const {
      data: selectedOrder,
      isLoading:
        orderDetailsLoading,
    } = useOrderDetails(
      selectedOrderId
    );

    /*
    |--------------------------------------------------------------------------
    | SAFE DATA
    |--------------------------------------------------------------------------
    */

    const orders =
      Array.isArray(
        data?.orders
      )
        ? data.orders
        : [];

    const pagination =
      data?.pagination ?? {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

    /*
    |--------------------------------------------------------------------------
    | VIEW ORDER
    |--------------------------------------------------------------------------
    */

    const handleViewOrder = (
      order: Order
    ) => {

      setSelectedOrderId(
        order.id
      );

      setDrawerOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */

    const stats = useMemo(() => {

      const totalOrders =
        pagination.total || 0;

      const confirmedOrders =
        orders.filter(
          (
            o: Order
          ) =>
            o.status ===
            "CONFIRMED"
        ).length;

      const deliveredOrders =
        orders.filter(
          (
            o: Order
          ) =>
            o.status ===
            "DELIVERED"
        ).length;

      const refundedOrders =
        orders.filter(
          (
            o: Order
          ) =>
            o.status ===
            "REFUNDED"
        ).length;

      const returnedOrders =
        orders.filter(
          (
            o: Order
          ) =>
            o.status ===
            "RETURNED"
        ).length;

      return {
        totalOrders,

        confirmedOrders,

        deliveredOrders,

        refundedOrders,

        returnedOrders,
      };

    }, [orders, pagination]);

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOADING ONLY
    |--------------------------------------------------------------------------
    */

    if (
      isLoading &&
      !data
    ) {

      return (
        <div className="flex h-[70vh] items-center justify-center">

          <Loader2
            className="animate-spin text-blue-600"
            size={34}
          />

        </div>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {

      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <h2 className="text-lg font-bold text-red-600">
            Failed to load orders
          </h2>

        </div>
      );
    }

    return (
      <>

       <div
  className="
    w-full
    min-w-0
    overflow-hidden
    space-y-5
    px-1
    pb-2
    md:px-2
    md:pb-5
  "
>

          {/* HEADER */}

<div
  className="
    flex
    flex-col
    gap-4
    lg:flex-row
    lg:items-center
    lg:justify-between
  "
>
  <div>

    {/* BREADCRUMBS */}

    <div className="mb-2 flex items-center gap-2 text-sm">

      {/* HOME */}

      <a
        href="/"
        className="
          inline-flex
          items-center
          gap-1.5
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        <Home className="h-4 w-4" />
        Home
      </a>

      {/* SEPARATOR */}

      <ChevronRight
        className="h-4 w-4 text-slate-300"
        strokeWidth={2}
      />

      {/* ORDERS */}

      <span className="font-semibold text-teal-600">
        Orders
      </span>

    </div>

    {/* TITLE */}

   <h1
            className="
              animate-text-shine
              bg-gradient-to-r
              from-[#001f3f]
              via-[#0d9488]
              to-[#001f3f]
              bg-clip-text
              text-[28px]
              font-bold
              leading-tight
              text-transparent
            "
          >
      Order Management
    </h1>

    <p className="mt-1 text-sm text-gray-500">
      Manage customer orders
    </p>

  </div>

            <div className="flex w-full items-center gap-3 lg:w-auto">

    <button
      type="button"
      onClick={() =>
        setExportDialogOpen(true)
      }
      className="
        inline-flex
        shrink-0
        items-center
        gap-2
        rounded-lg
        bg-teal-600
        px-4
        py-2.5
        text-sm
        font-medium
        text-white
        transition
        hover:bg-teal-700
      "
    >
      <Download size={16} />
      Export Excel
    </button>

    <div className="relative flex-1 lg:w-[320px]">

      <Search
        size={16}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <Input
        value={searchInput}
        onChange={(e) => {
          setSearchInput(
            e.target.value
          );
        }}
        placeholder="Search order..."
        className="pl-9"
      />

      {isLoading && (
        <Loader2
          size={16}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            animate-spin
            text-blue-600
          "
        />
      )}

    </div>

  </div>

          </div>

          {/* STATS */}

          <div
            className="
              w-full
              overflow-x-auto
              overflow-y-hidden
              scrollbar-hide
            "
          >

            <div
              className="
                min-w-[1200px]
                pb-2
              "
            >

              <OrderStats
                totalOrders={
                  stats.totalOrders
                }
                confirmedOrders={
                  stats.confirmedOrders
                }
                deliveredOrders={
                  stats.deliveredOrders
                }
                refundedOrders={
                  stats.refundedOrders
                }
                returnedOrders={
                  stats.returnedOrders
                }
              />

            </div>

          </div>

          {/* ========================================================= */}
{/* ADVANCED FILTERS PANEL */}
{/* ========================================================= */}

<div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
  {/* MAIN FILTER ROW */}
  <div className="flex flex-wrap items-center gap-3 px-4 py-3">

    {/* FILTER BY + DATE TYPE */}
    <div className="flex shrink-0 items-center gap-3">
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <Calendar
          size={15}
          className="text-teal-600"
        />
      </div>

      <div className="inline-flex h-9 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => {
            setDateType("created");
            setPage(1);
          }}
          className={`
            rounded-md px-3.5 text-xs font-semibold transition-all
            ${
              dateType === "created"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
            }
          `}
        >
          Created Time
        </button>

        <button
          type="button"
          onClick={() => {
            setDateType("updated");
            setPage(1);
          }}
          className={`
            rounded-md px-3.5 text-xs font-semibold transition-all
            ${
              dateType === "updated"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
            }
          `}
        >
          Updated Time
        </button>
      </div>
    </div>

    {/* DIVIDER */}
    <div className="hidden h-7 w-px bg-gray-200 xl:block" />

    {/* FROM */}
    <div className="flex shrink-0 items-center gap-2">
      <span className="text-xs font-semibold text-gray-500">
        From
      </span>

      <Input
        type="date"
        value={fromDate}
        onChange={(e) => {
          setDatePreset("custom");
          setPage(1);
          setFromDate(e.target.value);
        }}
        className="
          h-9
          w-[135px]
          rounded-lg
          border-gray-200
          bg-gray-50
          px-3
          text-xs
          focus:bg-white
          focus:ring-1
          focus:ring-teal-500
        "
      />
    </div>

    {/* TO */}
    <div className="flex shrink-0 items-center gap-2">
      <span className="text-xs font-semibold text-gray-500">
        To
      </span>

      <Input
        type="date"
        value={toDate}
        onChange={(e) => {
          setDatePreset("custom");
          setPage(1);
          setToDate(e.target.value);
        }}
        className="
          h-9
          w-[135px]
          rounded-lg
          border-gray-200
          bg-gray-50
          px-3
          text-xs
          focus:bg-white
          focus:ring-1
          focus:ring-teal-500
        "
      />
    </div>

    {/* PAYMENT */}
    <div className="flex shrink-0 items-center gap-2">
      <span className="text-xs font-semibold text-gray-500">
        Payment
      </span>

      <select
        value={paymentStatus}
        onChange={(e) => {
          setPage(1);
          setPaymentStatus(e.target.value);
        }}
        className="
          h-9
          min-w-[125px]
          rounded-lg
          border
          border-gray-200
          bg-gray-50
          px-3
          text-xs
          font-semibold
          text-gray-700
          outline-none
          transition
          focus:bg-white
          focus:ring-1
          focus:ring-teal-500
        "
      >
        <option value="">All Payments</option>
        <option value="SUCCESS">Success</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>
    </div>

    {/* RESET */}
    {activeFilterCount > 0 && (
      <button
        type="button"
        onClick={handleResetFilters}
        className="
          inline-flex
          h-9
          shrink-0
          items-center
          gap-1.5
          rounded-lg
          border
          border-red-200
          bg-red-50
          px-3
          text-xs
          font-semibold
          text-red-600
          transition
          hover:bg-red-100
        "
      >
        <RotateCcw size={13} />
        Reset ({activeFilterCount})
      </button>
    )}
  </div>

  {/* PRESETS */}
  <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-4 py-2.5">
    <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
      Presets
    </span>

    {[
      { label: "All Time", value: "all" },
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last 7 Days", value: "7days" },
      { label: "Month", value: "thisMonth" },
      { label: "Last 30 Days", value: "30days" },
    ].map((preset) => (
      <button
        key={preset.value}
        type="button"
        onClick={() =>
          handlePresetChange(preset.value)
        }
        className={`
          rounded-full
          border
          px-3
          py-1.5
          text-[11px]
          font-semibold
          transition-all
          ${
            datePreset === preset.value
              ? "border-teal-200 bg-teal-50 text-teal-700"
              : "border-transparent bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900"
          }
        `}
      >
        {preset.label}
      </button>
    ))}
  </div>
</div>

          {/* STATUS TABS */}

          <div className="relative w-full overflow-hidden">

            <button
              type="button"
              onClick={() => {

                document
                  .getElementById(
                    "status-tabs-scroll"
                  )
                  ?.scrollBy({
                    left: -250,
                    behavior: "smooth",
                  });
              }}
              className="
                absolute
                left-2
                top-1/2
                z-30
                hidden
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                shadow-lg
                transition
                hover:bg-gray-50
                lg:flex
              "
            >

              <ChevronLeft
                size={18}
                className="text-gray-700"
              />

            </button>

            <button
              type="button"
              onClick={() => {

                document
                  .getElementById(
                    "status-tabs-scroll"
                  )
                  ?.scrollBy({
                    left: 250,
                    behavior: "smooth",
                  });
              }}
              className="
                absolute
                right-2
                top-1/2
                z-30
                hidden
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                shadow-lg
                transition
                hover:bg-gray-50
                lg:flex
              "
            >

              <ChevronRight
                size={18}
                className="text-gray-700"
              />

            </button>

            <div
              id="status-tabs-scroll"
              className="
                w-full
                overflow-x-auto
                overflow-y-hidden
                scrollbar-hide
                scroll-smooth
                px-0
                lg:px-14
              "
            >

              <div
                className="
                  flex
                  w-max
                  gap-3
                  py-1
                "
              >

                {STATUS_TABS.map(
                  (tab) => {

                    const active =
                      activeStatus ===
                      tab.value;

                    return (
                      <button
                        key={
                          tab.label
                        }
                        onClick={() => {
  setPage(1);

  setActiveStatus(tab.value);

  if (tab.value) {
    router.push(
      `/orders?status=${encodeURIComponent(tab.value)}`
    );
  } else {
    router.push("/orders");
  }
}}
                        className={`
                          flex
                          shrink-0
                          items-center
                          gap-2
                          rounded-full
                          border
                          px-5
                          py-3
                          text-sm
                          font-medium
                          transition-all
                          duration-200

                          ${
                            active
                              ? `
                                border-blue-600
                                bg-blue-600
                                text-white
                                shadow-md
                              `

                              : `
                                border-gray-200
                                bg-white
                                text-gray-600
                                hover:border-blue-200
                                hover:bg-blue-50
                                hover:text-blue-600
                              `
                          }
                        `}
                      >

                        {tab.icon && (

                          <span className="flex items-center">
                            {tab.icon}
                          </span>

                        )}

                        <span className="whitespace-nowrap">
                          {tab.label}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* TABLE */}

          <div
            className="
              w-full
              min-w-0
              overflow-hidden
            "
          >

            <OrderTable
              orders={orders}
              onView={
                handleViewOrder
              }
            />

          </div>

        </div>

        {/* DRAWER */}

        <OrderDetailsDrawer
          open={drawerOpen}
          order={selectedOrder}
          loading={
            orderDetailsLoading
          }
          onClose={() => {

            setDrawerOpen(false);

            setSelectedOrderId(
              ""
            );
          }}
        />

        <ExportOrdersDialog
  open={exportDialogOpen}
  onClose={() =>
    setExportDialogOpen(false)
  }
/>

      </>
    );
  }