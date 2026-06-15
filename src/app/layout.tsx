import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiza Education",
  description: "Plataforma escolar para orientacion, convivencia, gestion institucional y juegos socioemocionales interactivos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
