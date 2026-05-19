import { appConfig } from '@/constants/config';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
