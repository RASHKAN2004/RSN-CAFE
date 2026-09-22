import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: { default: "RSN CAFE — Kalpitiya", template: "%s · RSN CAFE" },
  description:
    "Order coffee, breakfast, and Sri Lankan favourites from RSN CAFE in Kalpitiya. Pay online or at the counter and get SMS updates.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="bg-bg text-ink antialiased selection:bg-[#d7a15f]/30">
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(215,161,95,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(26,109,106,0.15),transparent_28%)]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
