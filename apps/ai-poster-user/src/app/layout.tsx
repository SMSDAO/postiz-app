import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Poster - User Dashboard',
  description: 'AI-powered social media poster user dashboard',
  keywords: 'AI, poster, social media, automation, dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
