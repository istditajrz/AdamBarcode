// @ts-expect-error
import '@mantine/core/styles.layer.css';
// @ts-expect-error
import './global.css';
import { MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ErrorList } from "@/app/ErrorList";
import type { Metadata } from 'next';
import { authenticate } from '@/common/api.mts';

export const metadata: Metadata = {
  title: 'RMScanner',
  description: 'Barcode companion for AdamRMS'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  authenticate();
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet={"utf-8"} />
        <meta name="viewport" content="width=device-width, inital-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"></link>
      </head>
      <body className='h-screen w-screen p-8'>
        <MantineProvider withCssVariables={false} withGlobalClasses={false}>
          <ErrorList />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
