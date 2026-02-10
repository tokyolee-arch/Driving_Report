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
    <html lang="ko">
      <body className="bg-ivi-bg text-gray-200 antialiased">
        <div className="mx-auto max-w-ivi min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
