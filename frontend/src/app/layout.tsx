import './globals.css';
// Force Vercel Rebuild: 726486853
// Cache Buster: 1766456943

export const metadata = {
  title: 'InfieldHub â€“ Integrated Stock Management',
  description: 'Infield Engineering â€“ Solar â€¢ Electrical â€¢ Water Solutions',
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

