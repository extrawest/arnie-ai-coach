"use client";

import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <RecoilRoot>
        <html lang="en">
          <body>
            <Toaster />
            {children}
          </body>
        </html>
      </RecoilRoot>
    </ClerkProvider>
  );
}
