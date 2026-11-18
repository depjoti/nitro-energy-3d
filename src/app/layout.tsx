import type { Metadata, Viewport } from "next";
import { Exo_2, Outfit } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Display face. The Figma uses "Sakana"; Exo 2 Black Italic is the closest
// freely licensed match until the original font file is added.
const display = Exo_2({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NITRO — Zero Sugar Energy Drink",
  description:
    "NITRO energy drink: zero sugar, full voltage. Explore the flavours in an interactive 3D experience.",
  openGraph: {
    title: "NITRO — Zero Sugar Energy Drink",
    description: "Zero sugar, full voltage. Explore the NITRO flavours in 3D.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${display.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] bg-nitro px-4 py-2 font-medium text-black focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
