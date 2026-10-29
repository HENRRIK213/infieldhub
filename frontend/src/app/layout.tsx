import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InfieldHub | Integrated Stock',
  description: 'Solar, Electrical, and Water solutions management system.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}