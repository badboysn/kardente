import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Badge Manager",
  description: "Saisie et generation de badges d identification"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-teal-400">{children}</body>
    </html>
  );
}
