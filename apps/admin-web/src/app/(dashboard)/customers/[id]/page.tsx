import {
  CustomerDetailPage,
} from "@/features/customer-management/pages/customer-detail-page";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({
  params,
}: Props) {
  const { id } =
    await params;

  return (
    <CustomerDetailPage
      customerId={id}
    />
  );
}