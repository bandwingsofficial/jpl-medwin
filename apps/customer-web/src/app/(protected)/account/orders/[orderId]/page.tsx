import { OrderDetailPage } from "@/features/orders/pages/order-detail-page";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

/**
 * This is a Server Component that awaits the params
 * and passes them to the Client Component logic.
 */
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  return <OrderDetailPage orderId={resolvedParams.orderId} />;
}