export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  return `******${phone.slice(-4)}`;
}
