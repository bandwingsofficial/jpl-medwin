export enum CustomerType {
  CUSTOMER = 'CUSTOMER',
  DOCTOR = 'DOCTOR',
  HOSPITAL = 'HOSPITAL',
}

export function getCustomerTypeCode(customerType: CustomerType): string {
  switch (customerType) {
    case CustomerType.DOCTOR:
      return 'D';

    case CustomerType.HOSPITAL:
      return 'H';

    case CustomerType.CUSTOMER:
    default:
      return 'D';
  }
}

export function parseCustomerType(
  value?: string | null,
): CustomerType {
  const normalized = value?.trim().toUpperCase();

  switch (normalized) {
    case 'DOCTOR':
    case 'D':
      return CustomerType.DOCTOR;

    case 'HOSPITAL':
    case 'H':
      return CustomerType.HOSPITAL;

    case 'CUSTOMER':
    case 'C':
    default:
      return CustomerType.CUSTOMER;
  }
}