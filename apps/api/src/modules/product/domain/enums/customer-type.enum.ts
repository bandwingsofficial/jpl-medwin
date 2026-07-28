export enum CustomerType {
  DOCTOR = 'DOCTOR',
  HOSPITAL = 'HOSPITAL',
}

export function getCustomerTypeCode(customerType: CustomerType): string {
  return customerType === CustomerType.DOCTOR ? 'D' : 'H';
}

export function parseCustomerType(value?: string | null): CustomerType | null {
  const normalized = value?.trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  if (normalized === 'DOCTOR' || normalized === 'D') {
    return CustomerType.DOCTOR;
  }

  if (normalized === 'HOSPITAL' || normalized === 'H') {
    return CustomerType.HOSPITAL;
  }

  return null;
}
