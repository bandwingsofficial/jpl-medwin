import { ReactNode } from "react";

type StaticContentLayoutProps = {
  title: string;
  children: ReactNode;
};

export function StaticContentLayout({
  title,
  children,
}: StaticContentLayoutProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">{title}</h1>
      <div className="space-y-4 text-slate-700">{children}</div>
    </section>
  );
}