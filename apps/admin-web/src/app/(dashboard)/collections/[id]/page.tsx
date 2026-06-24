import {
  CollectionDetailsPage,
} from "@/features/collection-management/pages/collection-details-page";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({
  params,
}: Props) {
  return (
    <CollectionDetailsPage
      collectionId={params.id}
    />
  );
}