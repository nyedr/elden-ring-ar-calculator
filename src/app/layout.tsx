import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Elden Rind AR Calculator",
  description: "A calculator for Elden Ring weapon Attack Rating (AR) values.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased w-full",
          fontSans.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
