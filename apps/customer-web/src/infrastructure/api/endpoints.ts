export const API_ENDPOINTS = {
  CART: {
    GET: "/cart",

    ADD_ITEM: "/cart/items",

    UPDATE_ITEM: (
      cartItemId: string
    ) => `/cart/items/${cartItemId}`,

    REMOVE_ITEM: (
      cartItemId: string
    ) => `/cart/items/${cartItemId}`,

    CLEAR: "/cart",

    LOCK: "/cart/lock",

    UNLOCK: "/cart/unlock",

    APPLY_COUPON:
      "/cart/apply-coupon",

    REMOVE_COUPON:
      "/cart/remove-coupon",
  },

  CHECKOUT: {
  CREATE_SESSION: "/checkout-sessions",

  GET_SESSION: (sessionId: string) =>
    `/checkout-sessions/${sessionId}`,

  EXPIRE_SESSION: (sessionId: string) =>
    `/checkout-sessions/${sessionId}/expire`,

  COMPLETE_SESSION: (sessionId: string) =>
    `/checkout-sessions/${sessionId}/complete`,
},
WISHLIST: {
  GET: "/wishlist",

  COUNT: "/wishlist/count",

  ADD: "/wishlist",

  REMOVE: (productId: string) =>
    `/wishlist/${productId}`,
},

};

