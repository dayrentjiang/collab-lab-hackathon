import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { 
  ClerkProvider,
} from "@clerk/nextjs";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "CollabLab - Student Collaboration Platform",
  description: "Connect with students and collaborate on meaningful projects"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">
                    © 2025 CollabLab. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Terms
                  </a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Privacy
                  </a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}