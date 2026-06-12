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
    <div>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
