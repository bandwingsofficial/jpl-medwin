import {
  BannerDetailContainer,
} from "@/features/banner-management/pages/banner-detail-container";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({
  params,
}: Props) {
  return (
    <BannerDetailContainer
      bannerId={params.id}
    />
  );
}