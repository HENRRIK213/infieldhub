import './globals.css';
// Cache Buster: 990768571
// Cache Buster: 2126764595
// Cache Buster: 800264071
// Cache Buster: 668898733
// Cache Buster: 106870576
// Cache Buster: 1442033156
// Build: 1315682515
// Build: 1092419867
// Build: 718341394
// Build: 303379397
// Build: 1699773345
// Build: 1117521381
// Build: 2133204802
// Build: 414000273
// Build: 218343256
// Build: 717615007
// Build: 2108465977
// Cache Buster: 431543159
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



















