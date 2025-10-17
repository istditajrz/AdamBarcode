// @ts-expect-error
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core';
import { DropShadow } from "@/common/DropShadow";
import { ErrorList } from "@/error/ErrorList";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RMScanner',
  description: 'Barcode companion for AdamRMS'
}

const theme = createTheme({
  fontFamily: "Source Sans 3, sans-serif",
  primaryColor: '#007bff',
  black: '#343a40',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet={"utf-8"} />
        <script type={"module"} src={"/common/error.mts"}></script>
        <script type={"module"} src={"./list-projects.mts"}></script>
        <ColorSchemeScript />
      </head>
      <body>
        <ErrorList />
        <MantineProvider theme={theme}>
          <DropShadow>
            {children}
          </DropShadow>
        </MantineProvider>
      </body>
    </html>
  );
}
