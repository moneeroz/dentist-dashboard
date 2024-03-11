import '@/app/ui/global.css';
import { readex_pro } from './ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | A&F Dashboard',
    default: 'A&F Dashboard',
  },
  description: 'A&F Dentist Dashboard.',
  // metadataBase: new URL('https://hosted-app-link'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body dir="RTL" className={`${readex_pro.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
