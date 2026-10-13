export function generateStaticParams() {
  return [{ linkId: '_' }];
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return children;
}