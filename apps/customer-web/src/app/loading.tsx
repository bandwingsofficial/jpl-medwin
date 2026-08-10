import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Image
        src="/Logo/jpl_logo.png"
        alt="JPL Medwin"
        width={230}
        height={90}
        priority
        className="h-auto w-[180px] sm:w-[210px] md:w-[230px]"
      />
    </div>
  );
}