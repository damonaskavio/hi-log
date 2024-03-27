import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const APP_NAME = "HiLog";
const APP_DEFAULT_TITLE = "HiLog";
const APP_TITLE_TEMPLATE = "%s | PWA App";
const APP_DESCRIPTION = "Log your expenses";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
