import './globals.css';

export const metadata = {
  title: 'InfieldHub – Integrated Stock Management',
  description: 'Infield Engineering – Solar • Electrical • Water Solutions',
  icons: { icon: '/logo.png', apple: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}