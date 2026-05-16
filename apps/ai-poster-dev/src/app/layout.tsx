import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Poster - Developer Dashboard',
  description: 'AI Poster developer tools and API documentation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
