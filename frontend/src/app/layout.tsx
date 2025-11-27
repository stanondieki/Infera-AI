import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "../utils/auth";
import { DebugPanel } from "../components/DebugPanel";

// Temporarily use system fonts for build
// const inter = Inter({
//   subsets: ["latin"],
//   display: 'swap',
//   fallback: ['system-ui', 'arial'],
// });

export const metadata: Metadata = {
  title: "Taskify - Professional Task Management & AI Training Platform",
  description: "Join Taskify and work on professional AI training tasks. Complete projects on your schedule, earn competitive rates, and contribute to cutting-edge technology development.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
          <DebugPanel />
        </AuthProvider>
      </body>
    </html>
  );
}
