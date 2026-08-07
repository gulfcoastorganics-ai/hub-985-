import Image from "next/image";
import { getAvailableMenuItems, groupByCategory } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";

// Menu availability changes from the admin dashboard, so never cache this.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const sections = groupByCategory(await getAvailableMenuItems());

  return (
    <div className="page" style={{ padding: "56px 20px 40px" }}>
      <h1 style={{ fontSize: 42 }}>Menu</h1>
      <p className="muted" style={{ marginTop: 10, marginBottom: 40 }}>
        Everything is made to order. Tap add, then check out when you&apos;re
        ready.
      </p>

      {sections.length === 0 && (
        <p className="muted">Nothing is available right now — check back soon.</p>
      )}

      {sections.map((section) => (
        <section key={section.category} style={{ marginBottom: 48 }}>
          <h2 className="sectionTitle">{section.category}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "var(--gap)",
              marginTop: 18,
            }}
          >
            {section.items.map((item) => (
              <article
                key={item.id}
                className="card"
                style={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {item.imageUrl && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "4 / 3",
                      background: "var(--surface-alt)",
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 600px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div
                  style={{
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <h3 style={{ fontSize: 18 }}>{item.name}</h3>
                  {item.description && (
                    <p
                      className="muted"
                      style={{ fontSize: 14, margin: "8px 0 0", flex: 1 }}
                    >
                      {item.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 16,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 17 }}>
                      {formatPrice(item.price)}
                    </span>
                    <AddToCartButton item={item} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
