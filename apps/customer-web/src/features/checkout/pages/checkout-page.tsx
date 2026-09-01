"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Home,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";


import { useCreateCheckout } from "@/features/checkout/hooks/use-create-checkout";


import { useCheckoutSession } from "@/features/checkout/hooks/use-checkout-session";


import { CheckoutHeader } from "@/features/checkout/components/checkout-header";


import { CheckoutItems } from "@/features/checkout/components/checkout-items";


import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";


import { DeliveryAddress } from "@/features/checkout/components/delivery-address";


import { PaymentMethods } from "@/features/checkout/components/payment-methods";


import { SavedAddress } from "@/features/address/types/address.type";


export function CheckoutPage() {
  const router = useRouter();
const [
  selectedBillingAddress,
  setSelectedBillingAddress,
] = useState<SavedAddress | null>(null);

const [
  isBillingSameAsShipping,
  setIsBillingSameAsShipping,
] = useState(true);

const [
  gstNumber,
  setGstNumber,
] = useState<string>("");


const [
  gstError,
  setGstError,
] = useState<string>("");

const handleGstChange = (val: string) => {
  setGstNumber(val);
  if (!val) {
    setGstError("");
    return;
  }
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (val.length === 15 && !gstinRegex.test(val)) {
    setGstError("Please enter a valid GST number.");
  } else {
    setGstError("");
  }
};

const [
  paymentMethod,
  setPaymentMethod,
] = useState<
  "RAZORPAY" | "UPI" | "COD"
>("RAZORPAY");

  /*
   |--------------------------------------------------------------------------
   | INITIALIZATION GUARDS
   |--------------------------------------------------------------------------
   */
  const hasInitialized = useRef(false);


  const isInitializing = useRef(false);


  /*
   |--------------------------------------------------------------------------
   | AUTH
   |--------------------------------------------------------------------------
   */
  const { isAuthenticated } = useAuth();


  /*
   |--------------------------------------------------------------------------
   | LOCAL STATE
   |--------------------------------------------------------------------------
   */
  const [
    checkoutSessionId,
    setCheckoutSessionId,
  ] = useState<string | null>(
    null
  );


  /*
   |--------------------------------------------------------------------------
   | SELECTED ADDRESS STATE
   |--------------------------------------------------------------------------
   */
  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState<SavedAddress | null>(
    null
  );


  /*
   |--------------------------------------------------------------------------
   | RESTORE SESSION FROM STORAGE
   |--------------------------------------------------------------------------
   */
  useEffect(() => {
    const storedSessionId =
      sessionStorage.getItem(
        "checkout-session-id"
      );


    if (storedSessionId) {
          setCheckoutSessionId(
        storedSessionId
      );
    }
  }, []);


  /*
   |--------------------------------------------------------------------------
   | CREATE CHECKOUT
   |--------------------------------------------------------------------------
   */
  const {
    mutateAsync:
      createCheckoutSession,


    isPending:
      isCreatingSession,


    isError:
      isCreateSessionError,


    error:
      createSessionError,
  } = useCreateCheckout();


  /*
   |--------------------------------------------------------------------------
   | INITIALIZE CHECKOUT FLOW
   |--------------------------------------------------------------------------
   */
  useEffect(() => {



    /*
     |--------------------------------------------------------------------------
     | REQUIRE AUTH
     |--------------------------------------------------------------------------
     */
    if (!isAuthenticated) {
      console.warn(
        "USER NOT AUTHENTICATED → REDIRECT LOGIN"
      );


      router.push("/login");


      return;
    }


    /*
     |--------------------------------------------------------------------------
     | PREVENT DUPLICATE INITIALIZATION
     |--------------------------------------------------------------------------
     */
    if (hasInitialized.current) {
      console.warn(
        "CHECKOUT ALREADY INITIALIZED"
      );


      return;
    }


    /*
     |--------------------------------------------------------------------------
     | SESSION ALREADY EXISTS
     |--------------------------------------------------------------------------
     */
    if (
  checkoutSessionId &&
  !isSessionError
) {
  console.warn(
    "CHECKOUT SESSION ALREADY EXISTS:",
    checkoutSessionId
  );

  return;
}


    hasInitialized.current = true;


    async function initializeCheckout() {
      /*
       |--------------------------------------------------------------------------
       | PREVENT PARALLEL REQUESTS
       |--------------------------------------------------------------------------
       */
      if (isInitializing.current) {
        console.warn(
          "CHECKOUT INITIALIZATION ALREADY RUNNING"
        );


        return;
      }


      isInitializing.current = true;

      try {
        /*
         |--------------------------------------------------------------------------
         | CREATE / RESTORE CHECKOUT SESSION
         |--------------------------------------------------------------------------
         */
        const response =
          await createCheckoutSession();



        const sessionId =
          response?.checkoutSessionId;


        /*
         |--------------------------------------------------------------------------
         | INVALID RESPONSE
         |--------------------------------------------------------------------------
         */
        if (!sessionId) {
          console.error(
            "CHECKOUT SESSION ID MISSING",
            response
          );


          throw new Error(
            "Checkout session ID missing."
          );
        }


        /*
         |--------------------------------------------------------------------------
         | REUSED SESSION
         |--------------------------------------------------------------------------
         */
        if (response?.reused) {
          console.warn(
            "REUSING EXISTING CHECKOUT SESSION:",
            sessionId
          );
        } else {
          
        }


        /*
         |--------------------------------------------------------------------------
         | SAVE SESSION
         |--------------------------------------------------------------------------
         */
        setCheckoutSessionId(
          sessionId
        );

      } catch (error) {
  console.error(
    "CHECKOUT INIT ERROR:",
    error
  );

  const checkoutError =
    error as Error & {
      code?: string;
    };

  if (
    checkoutError.code ===
    "EMPTY_CART"
  ) {
    console.warn(
      "EMPTY CART DETECTED → REDIRECT CART"
    );

    router.replace("/cart");

    return;
  }

  /*
   |--------------------------------------------------------------------------
   | RESET INITIALIZATION
   |--------------------------------------------------------------------------
   */
  hasInitialized.current =
    false;
} finally {
        isInitializing.current =
          false;

      }
    }


    initializeCheckout();
  }, [
  isAuthenticated,
  router,
  checkoutSessionId,
]);


  /*
   |--------------------------------------------------------------------------
   | FETCH CHECKOUT SESSION
   |--------------------------------------------------------------------------
   */
  const {
    data: sessionResponse,


    isLoading:
      isSessionLoading,


    isError:
      isSessionError,


    error: sessionError,
  } = useCheckoutSession(
    checkoutSessionId
  );


  /*
   |--------------------------------------------------------------------------
   | SELF HEAL INVALID SESSION
   |--------------------------------------------------------------------------
   */
  useEffect(() => {
    const errorData = (
      sessionError as any
    )?.response?.data;


    if (
      isSessionError &&
      errorData?.errorCode ===
        "CHECKOUT_SESSION.INVALID"
    ) {
      console.warn(
        "INVALID CHECKOUT SESSION DETECTED"
      );


      sessionStorage.removeItem(
        "checkout-session-id"
      );


      setCheckoutSessionId(
        null
      );


      hasInitialized.current =
        false;

    }
  }, [
    isSessionError,
    sessionError,
  ]);


  /*
   |--------------------------------------------------------------------------
   | MEMOIZED CHECKOUT
   |--------------------------------------------------------------------------
   */
  const checkout = useMemo(
    () => sessionResponse,
    [sessionResponse]
  );

  /*
   |--------------------------------------------------------------------------
   | LOADING STATE
   |--------------------------------------------------------------------------
   */
  if (
    (
      checkoutSessionId &&
      isSessionLoading
    ) ||
    (
      checkoutSessionId &&
      !checkout &&
      !isSessionError
    )
  ) {
   


    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#0F172A]" />


          <p className="text-sm font-medium text-gray-500">
            Preparing secure checkout...
          </p>
        </div>
      </div>
    );
  }


  /*
   |--------------------------------------------------------------------------
   | ERROR STATE
   |--------------------------------------------------------------------------
   */
  if (
    isCreateSessionError ||
    isSessionError
  ) {
    console.error(
      "CHECKOUT PAGE ERROR STATE",
      {
        createSessionError,
        sessionError,
      }
    );


    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-red-500">
            Checkout Failed
          </h2>


          <p className="mt-3 text-sm leading-6 text-gray-500">
  {(createSessionError as any)
    ?.message ===
  "Cart is empty"
    ? "Redirecting to cart..."
    : (createSessionError as any)
        ?.message ||
      (sessionError as any)
        ?.message ||
      "Unable to initialize checkout session."}
</p>

          <button
            type="button"
            onClick={() => {
              console.warn(
                "RETRYING CHECKOUT..."
              );


              sessionStorage.removeItem(
                "checkout-session-id"
              );


              setCheckoutSessionId(
                null
              );


              hasInitialized.current =
                false;


              isInitializing.current =
                false;


              window.location.reload();
            }}
            className="mt-6 h-12 rounded-2xl bg-[#0F172A] px-6 text-sm font-semibold text-white hover:bg-black"
          >
            Retry Checkout
          </button>
        </div>
      </div>
    );
  }


  /*
   |--------------------------------------------------------------------------
   | NO CHECKOUT DATA
   |--------------------------------------------------------------------------
   */
  if (!checkout) {
    console.warn(
      "NO CHECKOUT DATA AVAILABLE"
    );


    return null;
  }


  /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   */
  return (
  <div className="min-h-screen bg-[#F8FAFC]">
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">

      {/* BREADCRUMBS */}

      <div className="mb-5 flex items-center gap-2 text-sm">
        <Link
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
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <Link
          href="/cart"
          className="
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Cart
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          Checkout
        </span>
      </div>

      <CheckoutHeader
        checkout={checkout}
      />


       <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
  {/* LEFT SIDE */}
  <div className="min-w-0 max-w-full space-y-6">
    <DeliveryAddress
      selectedAddress={selectedAddress}
      onSelectAddress={setSelectedAddress}
      selectedBillingAddress={selectedBillingAddress}
      onSelectBillingAddress={setSelectedBillingAddress}
      isBillingSameAsShipping={isBillingSameAsShipping}
      onBillingSameChange={setIsBillingSameAsShipping}
      gstNumber={gstNumber}
      onGstNumberChange={handleGstChange}
      gstError={gstError}
    />

    <CheckoutItems checkout={checkout} />

    <PaymentMethods
      selectedMethod={paymentMethod}
      onSelectMethod={setPaymentMethod}
    />
  </div>

  {/* RIGHT SIDE - STICKY SUMMARY */}
  <div className="min-w-0 max-w-full self-start lg:sticky lg:top-6">
    <CheckoutSummary
      checkout={checkout}
      selectedAddress={selectedAddress}
      selectedBillingAddress={selectedBillingAddress}
      isBillingSameAsShipping={isBillingSameAsShipping}
      paymentMethod={paymentMethod}
      gstNumber={gstNumber}
    />
  </div>
</div>
      </div>
    </div>
  );
}


