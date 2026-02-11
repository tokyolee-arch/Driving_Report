import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driving Report - BV IVI",
  description: "차량 주행 리포트 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full w-full bg-ivi-bg text-gray-200 antialiased">
        <div className="mx-auto w-full min-h-screen max-w-ivi">
          {children}
        </div>
      </body>
    </html>
  );
}
