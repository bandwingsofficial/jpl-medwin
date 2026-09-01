"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";

/* ============================================================
   NAVIGATION CONTEXT
   ============================================================ */

type CheckoutNavigationContextType = {
  navigate: (href: string) => void;
};

const CheckoutNavigationContext =
  createContext<CheckoutNavigationContextType | null>(null);

/**
 * Use this hook for programmatic navigation that should be
 * protected while the customer is on the checkout page.
 *
 * Example:
 * navigate("/cart");
 * navigate("/wishlist");
 * navigate("/account");
 */
export function useCheckoutNavigation() {
  const context = useContext(CheckoutNavigationContext);

  if (!context) {
    throw new Error(
      "useCheckoutNavigation must be used inside CheckoutNavigationGuard"
    );
  }

  return context;
}

/* ============================================================
   GUARD
   ============================================================ */

type CheckoutNavigationGuardProps = {
  children: ReactNode;
};

export function CheckoutNavigationGuard({
  children,
}: CheckoutNavigationGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [isBrowserBack, setIsBrowserBack] = useState(false);

  /*
   * Used when the customer clicks "Exit Anyway" for browser Back.
   *
   * Without this ref, router.back() can trigger the popstate
   * listener again and reopen the confirmation popup.
   */
  const allowNextBackRef = useRef(false);

  const isCheckoutPage = pathname === "/checkout";

  /* ============================================================
     PROGRAMMATIC NAVIGATION
     ============================================================ */

  const navigate = useCallback(
    (href: string) => {
      /*
       * Outside checkout:
       * behave exactly like normal router.push().
       */
      if (!isCheckoutPage) {
        router.push(href);
        return;
      }

      /*
       * Ignore navigation to the exact same page.
       */
      if (href === pathname) {
        return;
      }

      /*
       * We are on checkout, so ask for confirmation.
       */
      setPendingPath(href);
      setIsBrowserBack(false);
      setShowConfirmation(true);
    },
    [isCheckoutPage, pathname, router]
  );

  /* ============================================================
     BROWSER BACK BUTTON
     ============================================================ */

  useEffect(() => {
    if (!isCheckoutPage) {
      return;
    }

    const currentUrl = window.location.href;

    /*
     * Add a protected history entry while on checkout.
     */
    window.history.pushState(
      { checkoutNavigationGuard: true },
      "",
      currentUrl
    );

    const handlePopState = () => {
      /*
       * "Exit Anyway" intentionally triggered router.back().
       * Allow that one back navigation without showing the popup.
       */
      if (allowNextBackRef.current) {
        allowNextBackRef.current = false;
        return;
      }

      /*
       * Immediately restore the checkout history entry.
       */
      window.history.pushState(
        { checkoutNavigationGuard: true },
        "",
        currentUrl
      );

      setPendingPath(null);
      setIsBrowserBack(true);
      setShowConfirmation(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isCheckoutPage]);

  /* ============================================================
     NORMAL <Link> CLICKS
     ============================================================ */

  useEffect(() => {
    if (!isCheckoutPage) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      /*
       * Another handler already handled the click.
       */
      if (event.defaultPrevented) {
        return;
      }

      /*
       * Only normal left-clicks.
       */
      if (event.button !== 0) {
        return;
      }

      /*
       * Do not interfere with:
       * Ctrl + Click
       * Cmd + Click
       * Shift + Click
       * Alt + Click
       */
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;

      const anchor = target?.closest("a");

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href) {
        return;
      }

      /*
       * Ignore:
       * anchors
       * external URLs
       * email links
       * telephone links
       */
      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      /*
       * Same-page link doesn't need confirmation.
       */
      if (href === pathname) {
        return;
      }

      /*
       * Stop Next.js <Link> from navigating immediately.
       */
      event.preventDefault();

      /*
       * Send navigation through the same confirmation system.
       */
      navigate(href);
    };

    /*
     * Capture phase ensures the guard gets the click before
     * Next.js performs Link navigation.
     */
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [isCheckoutPage, pathname, navigate]);

  /* ============================================================
     CONTINUE CHECKOUT
     ============================================================ */

  const continueCheckout = () => {
    setShowConfirmation(false);
    setPendingPath(null);
    setIsBrowserBack(false);
  };

  /* ============================================================
     EXIT ANYWAY
     ============================================================ */

  const exitAnyway = () => {
    const path = pendingPath;
    const browserBack = isBrowserBack;

    /*
     * Close popup first.
     */
    setShowConfirmation(false);
    setPendingPath(null);
    setIsBrowserBack(false);

    /*
     * Browser Back navigation -> always go to cart page.
     */
    if (browserBack) {
      allowNextBackRef.current = true;
      router.push("/cart");
      return;
    }

    /*
     * Normal Header/Footer/button navigation.
     */
    if (path) {
      router.push(path);
      return;
    }

    // Default fallback
    router.push("/cart");
  };

  /* ============================================================
     PROVIDER
     ============================================================ */

  return (
    <CheckoutNavigationContext.Provider value={{ navigate }}>
      {children}

      {/* ======================================================
          CONFIRMATION POPUP
          ====================================================== */}

      {showConfirmation && isCheckoutPage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-exit-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6 sm:p-7">
              {/* TOP */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>

                <button
                  type="button"
                  onClick={continueCheckout}
                  aria-label="Close"
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="mt-5">
                <h2
                  id="checkout-exit-title"
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  Leave checkout?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You are currently in the checkout process. If you leave
                  this page, your checkout progress may not be preserved.
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={continueCheckout}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Continue Checkout
                </button>

                <button
                  type="button"
                  onClick={exitAnyway}
                  className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Exit Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CheckoutNavigationContext.Provider>
  );
}