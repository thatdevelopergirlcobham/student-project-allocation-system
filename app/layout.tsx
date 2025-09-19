import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { DataProvider } from "@/context/DataContext";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Student Project Allocation and Management System",
  description: "A comprehensive system for managing student project allocations and progress tracking",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${poppins.variable} font-sans`}>
        <DataProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
