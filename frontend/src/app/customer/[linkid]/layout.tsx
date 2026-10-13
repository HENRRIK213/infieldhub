export function generateStaticParams() {
  return [{ linkId: '_' }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}