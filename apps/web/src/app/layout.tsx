import type { Metadata } from "next";
import { MiniAppProvider } from "../contexts/miniapp-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarbNB - Car Between Neighbors",
  description: "Alquila autos de locales cuando viajes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}