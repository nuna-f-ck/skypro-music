import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import StoreProvider from "../store/StoreProvider";
import { Suspense } from "react";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Skypro.Music",
  description: "Музыкальный сервис Skypro.Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <Suspense fallback={null}>
          <StoreProvider>{children}</StoreProvider>
        </Suspense> 
      </body>
    </html>
  );
}
