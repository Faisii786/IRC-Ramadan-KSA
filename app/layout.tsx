import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "./LocaleProvider";

export const metadata: Metadata = {
  title: "Annual Ramadan Suhoor | Attendance Confirmation",
  description: "Confirm your attendance for the Annual Ramadan Suhoor — Wednesday 4 March 2026, 10:00 PM – 2:00 AM. Location and entry details shared upon confirmation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
