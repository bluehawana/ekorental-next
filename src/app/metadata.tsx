// app/metadata.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Car Rental App',
  description: 'Rent your dream car today',
};

export default function MetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
