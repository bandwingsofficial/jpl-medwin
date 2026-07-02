  "use client";

  import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  import { Download } from "lucide-react";

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
  } from "lucide-react";

  import {
    useOrders,
    useOrderDetails,
  } from "../hooks/use-orders";

  import { Order } from "../types/order.type";

  import OrderTable from "./order-table";

  import OrderDetailsDrawer from "./order-details-drawer";

  import { OrderStats } from "./order-stats";

  import { Input } from "@/shared/components/ui/input";

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
    ] = useState("");

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
            p-4
            md:p-5
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

              <h1 className="text-2xl font-bold text-gray-900">
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

                          setPage(
                            1
                          );

                          setActiveStatus(
                            tab.value
                          );
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