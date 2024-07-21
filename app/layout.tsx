import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "#/components/ThemeProvider"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drag and Drop",
  description: "drag and drop block builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // add suppressHydrationWarning to prevent warning on browser
    <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
                {children}
            </ThemeProvider>
        </body>
    </html>
  );
}
