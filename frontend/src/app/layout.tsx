import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infera AI - Shape the Future of Artificial Intelligence",
  description: "Join Infera AI and help train the world's most advanced AI models. Work on your schedule, earn competitive rates, and contribute to cutting-edge technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
