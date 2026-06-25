export const TOKENS = {
  // =======================
  // PRISMA (FOR TRANSACTIONS)
  // =======================
  PRISMA: Symbol('PRISMA'),
  // =======================
  // REPOSITORIES (DB)
  // =======================
  USER_REPO: Symbol('USER_REPO'),
  SESSION_REPO: Symbol('SESSION_REPO'),
  AUTH_IDENTITY_REPO: Symbol('AUTH_IDENTITY_REPO'),

  // =======================
  // PORTS (CORE)
  // =======================
  TOKEN_PORT: Symbol('TOKEN_PORT'),
  NOTIFICATION_PORT: Symbol('NOTIFICATION_PORT'),

  // =======================
  // REDIS STORES
  // =======================
  OTP_STORE: Symbol('OTP_STORE'),
  RATE_LIMIT_STORE: Symbol('RATE_LIMIT_STORE'),

  // =======================
  // CATEGORY
  // =======================
  CATEGORY_REPO: Symbol('CATEGORY_REPO'),
  SUB_CATEGORY_REPO: Symbol('SUB_CATEGORY_REPO'),
  MINI_CATEGORY_REPO: Symbol('MINI_CATEGORY_REPO'),

  // =======================
  // BRAND
  // =======================
  BRAND_REPO: Symbol('BRAND_REPO'),

  // =======================
  // PRODUCT
  // =======================
  PRODUCT_REPO: Symbol('PRODUCT_REPO'),
  VARIANT_REPO: Symbol('VARIANT_REPO'),
  PRODUCT_IMAGE_REPO: Symbol('PRODUCT_IMAGE_REPO'),

  // =======================
  // PROFILE
  // =======================
  PROFILE_REPO: Symbol('PROFILE_REPO'),

  // =======================
  // SAVED ADDRESS
  // =======================
  SAVED_ADDRESS_REPO: Symbol('SAVED_ADDRESS_REPO'),

  // =======================
  // CART
  // =======================
  CART_REPO: Symbol('CART_REPO'),
  CART_ITEM_REPO: Symbol('CART_ITEM_REPO'),

  // =======================
  // CHECKOUT SESSION
  // =======================
  CHECKOUT_SESSION_REPO: Symbol('CHECKOUT_SESSION_REPO'),
  CHECKOUT_SESSION_ITEM_REPO: Symbol('CHECKOUT_SESSION_ITEM_REPO'),

  // =======================
  // ORDER
  // =======================
  ORDER_REPO: Symbol('ORDER_REPO'),
  ORDER_ITEM_REPO: Symbol('ORDER_ITEM_REPO'),

  // =======================
  // PAYMENT
  // =======================
  PAYMENT_REPO: Symbol('PAYMENT_REPO'),

  //=========================
  // COUPONS
  //=======================
  COUPON_REPO: Symbol('COUPON_REPO'),

  //===============================
  //COINS
  //===================================

  REWARD_CONFIG_REPO: Symbol('REWARD_CONFIG_REPO'),
  COIN_WALLET_REPO: Symbol('COIN_WALLET_REPO'),
  COIN_TRANSACTION_REPO: Symbol('COIN_TRANSACTION_REPO'),
  COIN_REDEMPTION_REPO: Symbol('COIN_REDEMPTION_REPO'),
  REWARD_TIER_REPO: Symbol('REWARD_TIER_REPO'),
  REWARD_CAMPAIGN_REPO: Symbol('REWARD_CAMPAIGN_REPO'),

  // =======================
  // CUSTOMER
  // =======================
  CUSTOMER_REPO: Symbol('CUSTOMER_REPO'),

  // =======================
  // WISHLIST
  // =======================
  WISHLIST_REPO: Symbol('WISHLIST_REPO'),

  // =======================
  // COLLECTION
  // =======================
  COLLECTION_REPO: Symbol('COLLECTION_REPO'),

  COLLECTION_PRODUCT_REPO: Symbol('COLLECTION_PRODUCT_REPO'),

  // =======================
  // BANNER
  // =======================
  BANNER_REPO: Symbol('BANNER_REPO'),
  BANNER_IMAGE_REPO: Symbol('BANNER_IMAGE_REPO'),

  //=========================
  // SEARCH
  //=========================

  SEARCH_REPOSITORY: Symbol('SEARCH_REPOSITORY'),

  //=========================
  // RETURN
  //=========================

  RETURN_REPO: Symbol('RETURN_REPO'),

  // =======================
  // SHIPPING CONFIGURATION
  // =======================
  SHIPPING_CONFIGURATION_REPO: Symbol('SHIPPING_CONFIGURATION_REPO'),
} as const;
