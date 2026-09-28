import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import StoreHeader from "@/components/store-header";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Punto | Tecnología para tu espacio",
  description: "Accesorios y equipo para trabajar, jugar y crear.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${playfair.variable}`}
    >
      <body>
        <CartProvider>
          <StoreHeader />
          {children}
          <footer className="site-footer">
            <span className="brand-mark">p.</span>
            <p>
              Punto <span>·</span> Tecnología que acompaña.
            </p>
            <span>Equipo para todos los días.</span>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
