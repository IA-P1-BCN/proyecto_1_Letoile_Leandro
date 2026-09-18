import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxiTech Solutions",
  description: "Sistema de taxímetro digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}