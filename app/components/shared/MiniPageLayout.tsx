export interface MiniPageLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}

export function MiniPageLayout({
  title,
  subtitle,
  children,
}: MiniPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">
              {subtitle}
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
