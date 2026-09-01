# Order Address Deletion Strategy

## Decision: Allow soft deletion when referenced by orders

`ADDRESS_IN_USE` is **not** enforced during customer address soft-delete.

### Rationale

Orders persist immutable address snapshots (`shippingAddressSnapshot`, `billingAddressSnapshot`) at checkout. Historical order APIs read from snapshots first, so editing or soft-deleting a `SavedAddress` does not change completed order history.

### Runtime behavior

| Action | Result |
|--------|--------|
| Customer soft-deletes address used in past orders | Allowed |
| Address book listing | Hides soft-deleted addresses (`deletedAt IS NULL` filter) |
| Order history / admin order APIs | Returns snapshot payload captured at checkout |
| New order creation | Rejects inactive addresses (`ORDER_ADDRESS_INACTIVE`) |

### `ADDRESS_IN_USE` error code

Retained in `ErrorCode.SAVED_ADDRESS.IN_USE` for potential future **hard-delete** or admin tooling guards. It is not thrown by the customer delete flow.

### When blocking deletion would still make sense

- Regulatory requirement to retain address book entries linked to financial records
- Need to prevent FK `SetNull` if addresses are hard-deleted at database level

Neither applies to the current soft-delete-only customer flow with snapshot-backed reads.
