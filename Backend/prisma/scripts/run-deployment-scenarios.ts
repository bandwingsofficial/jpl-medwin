/**
 * Deployment verification scenarios (read-only + mapper-level E2E).
 * Does not mutate production data except optional rollback simulation cleanup.
 */
import * as crypto from 'crypto';

import { PrismaClient } from '@prisma/client';

import { AddressType } from '../../src/modules/saved-address/domain/enums/address-type.enum';
import { SavedAddress } from '../../src/modules/saved-address/domain/entities/saved-address.entity';
import { OrderAddressSnapshotMapper } from '../../src/modules/order/application/mappers/order-address-snapshot.mapper';
import { OrderAddressResponseMapper } from '../../src/modules/order/application/mappers/order-address-response.mapper';
import { Order } from '../../src/modules/order/domain/entities/order.entity';

const prisma = new PrismaClient();

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function scenarioSnapshotImmutabilityAfterAddressEdit() {
  const address = new SavedAddress(
    'verify-addr-1',
    'verify-user',
    'Original Name',
    '9999999999',
    AddressType.HOME,
    'Original Street',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  const snapshot = OrderAddressSnapshotMapper.fromSavedAddress(address);

  address.updateDetails({
    fullName: 'Edited Name',
    addressLine1: 'Edited Street',
  });

  const order = new Order('order-verify-1', 'ORD-VERIFY-1');
  order.shippingAddressSnapshot = snapshot;
  order.shippingAddress = address;

  const response = OrderAddressResponseMapper.resolveShippingAddress(order);

  assert(response?.fullName === 'Original Name', 'Snapshot should not change after address edit');
  assert(response?.addressLine1 === 'Original Street', 'Snapshot street should remain original');

  return { pass: true, name: 'C_edit_address_snapshot_unchanged' };
}

async function scenarioSoftDeleteDoesNotBreakSnapshotRead() {
  const deletedAddress = new SavedAddress(
    'verify-addr-2',
    'verify-user',
    'Akshay',
    '9999999999',
    AddressType.HOME,
    'Whitefield',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  const snapshot = OrderAddressSnapshotMapper.fromSavedAddress(deletedAddress);
  deletedAddress.softDelete();

  const order = new Order('order-verify-2', 'ORD-VERIFY-2');
  order.shippingAddressSnapshot = snapshot;
  order.shippingAddress = deletedAddress;

  const response = OrderAddressResponseMapper.resolveShippingAddress(order);

  assert(response?.city === 'Bangalore', 'Order history should remain readable after soft delete');

  return { pass: true, name: 'D_soft_delete_order_history_readable' };
}

async function scenarioSameAndDifferentBilling() {
  const shipping = new SavedAddress(
    'ship-1',
    'user-1',
    'Akshay',
    '9999999999',
    AddressType.HOME,
    'Whitefield',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  const billing = new SavedAddress(
    'bill-1',
    'user-1',
    'Akshay',
    '9999999999',
    AddressType.WORK,
    'ITPL',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  const sameOrder = new Order('o1', 'ORD-1');
  sameOrder.isBillingSameAsShipping = true;
  sameOrder.shippingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(shipping);
  sameOrder.billingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(shipping);

  const differentOrder = new Order('o2', 'ORD-2');
  differentOrder.isBillingSameAsShipping = false;
  differentOrder.shippingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(shipping);
  differentOrder.billingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(billing);

  const sameFields = OrderAddressResponseMapper.toOrderAddressFields(sameOrder);
  const diffFields = OrderAddressResponseMapper.toOrderAddressFields(differentOrder);

  assert(
    sameFields.shippingAddress?.addressLine1 === sameFields.billingAddress?.addressLine1,
    'Same billing/shipping should match',
  );
  assert(
    diffFields.shippingAddress?.addressLine1 !== diffFields.billingAddress?.addressLine1,
    'Different billing/shipping should differ',
  );

  return {
    pass: true,
    name: 'A_B_same_and_different_billing_shipping',
  };
}

async function scenarioReplacementOrderCopiesSnapshots() {
  const original = new Order('orig-1', 'ORD-ORIG');
  const shipping = new SavedAddress(
    'addr-1',
    'user-1',
    'Akshay',
    '9999999999',
    AddressType.HOME,
    'Whitefield',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  original.shippingAddressId = 'addr-1';
  original.billingAddressId = 'addr-1';
  original.isBillingSameAsShipping = true;
  original.shippingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(shipping);
  original.billingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(shipping);

  const replacement = new Order('rep-1', 'REP-1');
  replacement.shippingAddressId = original.shippingAddressId;
  replacement.billingAddressId = original.billingAddressId;
  replacement.isBillingSameAsShipping = original.isBillingSameAsShipping;
  replacement.shippingAddressSnapshot = original.shippingAddressSnapshot;
  replacement.billingAddressSnapshot = original.billingAddressSnapshot;

  assert(
    JSON.stringify(OrderAddressResponseMapper.toOrderAddressFields(replacement)) ===
      JSON.stringify(OrderAddressResponseMapper.toOrderAddressFields(original)),
    'Replacement order should copy address references and snapshots',
  );

  return { pass: true, name: 'E_replacement_order_copies_snapshots' };
}

async function scenarioRollbackSimulation() {
  const testOrderNumber = `ROLLBACK-TEST-${Date.now()}`;
  const testOrderId = crypto.randomUUID();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          id: testOrderId,
          orderNumber: testOrderNumber,
          userId: null,
          subtotal: 100,
          grandTotal: 100,
          status: 'PENDING_PAYMENT',
          paymentStatus: 'PENDING',
        },
      });

      throw new Error('Simulated order item failure');
    });
  } catch {
    // expected
  }

  const order = await prisma.order.findUnique({ where: { id: testOrderId } });
  const items = await prisma.orderItem.count({ where: { orderId: testOrderId } });

  assert(order === null, 'Rollback should not persist order');
  assert(items === 0, 'Rollback should not persist order items');

  return { pass: true, name: 'rollback_simulation_no_partial_state' };
}

async function main() {
  const results: { pass: boolean; name: string }[] = [];

  results.push(await scenarioSameAndDifferentBilling());
  results.push(await scenarioSnapshotImmutabilityAfterAddressEdit());
  results.push(await scenarioSoftDeleteDoesNotBreakSnapshotRead());
  results.push(await scenarioReplacementOrderCopiesSnapshots());
  results.push(await scenarioRollbackSimulation());

  console.log(JSON.stringify({ scenarios: results }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
