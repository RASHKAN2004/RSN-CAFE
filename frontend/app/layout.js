import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
      className={`${playfair.variable} ${manrope.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(215,161,95,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(26,109,106,0.15),transparent_25%)]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
