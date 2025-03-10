import type { Metadata } from "next";
import { TanstackQueryProvider } from "@/providers/TanstackQuery";
import glancyr from "./font/glancyr";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Kingdom Millionaires Convention",
  description: "Rich In Christ & Rich In Cash.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${glancyr.className} antialiased`}>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
