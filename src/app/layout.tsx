import type { Metadata } from "next";
import Link from "next/link";
import { SHOP, formattedAddress } from "@/lib/shop";
import { CartProvider } from "@/components/CartProvider";
import { CartButton } from "@/components/CartButton";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SHOP.name} — ${SHOP.tagline}`,
  description: SHOP.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header className="siteHeader">
            <div className="page siteHeaderInner">
              <Link href="/" className="logo">
                Hub<span>985</span>
              </Link>
              <nav className="nav">
                <Link href="/menu">Menu</Link>
                <Link href="/#hours">Hours</Link>
                <Link href="/#visit">Visit</Link>
                <CartButton />
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="siteFooter">
            <div className="page">
              <strong>{SHOP.name}</strong> · {formattedAddress()} ·{" "}
              <a href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}>
                {SHOP.phone}
              </a>
              <div style={{ marginTop: 8 }}>
                <Link href="/admin">Staff login</Link>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
