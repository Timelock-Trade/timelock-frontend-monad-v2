import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "@/providers/Providers";
// import { ReactScan } from "@/components/ReactScan";

const ibmFont = localFont({
  src: "./ibm.ttf",
  variable: "--font-ibm",
});

// TODO: Replace this later
export const metadata: Metadata = {
  title: "Timelock",
  description: "Timelock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      {/* {process.env.NODE_ENV === "development" && <ReactScan />} */}
      <body className={`${ibmFont.variable} antialiased min-h-dvh bg-[#0D0D0D] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
