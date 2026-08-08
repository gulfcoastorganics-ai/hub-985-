import Image from "next/image";
import Link from "next/link";
import {
  SHOP,
  formattedAddress,
  mapEmbedUrl,
  mapLinkUrl,
  phoneHref,
} from "@/lib/shop";

export default function HomePage() {
  return (
    <>
      <section
        className="page"
        style={{
          padding: "56px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 52, maxWidth: 620 }}>
            Fresh energy,{" "}
            <span style={{ color: "var(--brand)" }}>made daily</span>.
          </h1>
          <p
            className="muted"
            style={{ fontSize: 19, maxWidth: 540, marginTop: 16 }}
          >
            {SHOP.tagline} Order ahead and skip the line.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <Link href="/menu" className="btn btnPrimary">
              Order now
            </Link>
            <a href="#visit" className="btn btnSecondary">
              Find us
            </a>
          </div>
        </div>
        <div
          className="card"
          style={{ overflow: "hidden", padding: 0, maxHeight: 420 }}
        >
          <Image
            src="/images/drink-lineup.jpg"
            alt="A lineup of colorful Hub 985 loaded teas and shakes"
            width={2000}
            height={1945}
            priority
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </section>

      <section id="hours" className="page" style={{ paddingBottom: 56 }}>
        <h2 className="sectionTitle">Hours</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Walk in or order ahead — pickup is ready when you are.
        </p>
        <div
          className="card"
          style={{ padding: 8, maxWidth: 460, overflow: "hidden" }}
        >
          {SHOP.hours.map((entry) => (
            <div
              key={entry.day}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                fontSize: 15,
              }}
            >
              <span style={{ fontWeight: 600 }}>{entry.day}</span>
              <span className="muted">
                {entry.open} – {entry.close}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="visit" className="page" style={{ paddingBottom: 72 }}>
        <h2 className="sectionTitle">Visit us</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          {formattedAddress()}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--gap)",
          }}
        >
          <div
            className="card"
            style={{ overflow: "hidden", minHeight: 300, padding: 0, position: "relative" }}
          >
            <Image
              src="/images/storefront.jpg"
              alt="The Hub 985 Nutrition storefront in Covington, LA"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className="card"
            style={{ overflow: "hidden", minHeight: 300, padding: 0 }}
          >
            <iframe
              title="Map to Hub 985"
              src={mapEmbedUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: 300 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Get in touch</h3>
            <p style={{ margin: "0 0 10px" }}>
              <strong>Phone</strong>
              <br />
              <a href={phoneHref()}>{SHOP.phone}</a>
            </p>
            <p style={{ margin: "0 0 18px" }}>
              <strong>Address</strong>
              <br />
              {SHOP.address.line1}
              <br />
              {SHOP.address.city}, {SHOP.address.state} {SHOP.address.zip}
            </p>
            <a
              href={mapLinkUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btnSecondary btnSm"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
