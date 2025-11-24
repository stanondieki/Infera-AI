import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "../utils/auth";

// Temporarily use system fonts for build
// const inter = Inter({
//   subsets: ["latin"],
//   display: 'swap',
//   fallback: ['system-ui', 'arial'],
// });

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
      <body className="font-sans antialiased bg-white">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
