import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllMenuItems, groupByCategory } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { AdminNav } from "@/components/AdminNav";
import {
  toggleAvailabilityAction,
  deleteMenuItemAction,
  saveMenuItemAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  if (!(await getSession())) redirect("/admin");

  const { edit: editId, new: isNew } = await searchParams;
  const items = await getAllMenuItems();
  const sections = groupByCategory(items);
  const editing = editId ? items.find((i) => i.id === editId) : undefined;
  const showForm = Boolean(editing) || isNew !== undefined;

  return (
    <div className="page" style={{ padding: "48px 20px" }}>
      <AdminNav active="menu" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 6 }}>Menu</h1>
          <p className="muted">{items.length} items</p>
        </div>
        {!showForm && (
          <a href="/admin/menu?new" className="btn btnPrimary btnSm">
            Add item
          </a>
        )}
      </div>

      {showForm && (
        <form
          action={saveMenuItemAction}
          className="card"
          style={{ padding: 24, margin: "24px 0", maxWidth: 620 }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>
            {editing ? `Edit ${editing.name}` : "New item"}
          </h2>
          <input type="hidden" name="itemId" value={editing?.id ?? ""} />

          <div className="field">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" className="input" required defaultValue={editing?.name} />
          </div>

          <div className="field">
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="textarea"
              rows={3}
              defaultValue={editing?.description}
            />
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div className="field" style={{ flex: 1, minWidth: 160 }}>
              <label className="label" htmlFor="price">Price (dollars)</label>
              <input
                id="price"
                name="price"
                className="input"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={editing ? (editing.price / 100).toFixed(2) : ""}
              />
            </div>
            <div className="field" style={{ flex: 1, minWidth: 160 }}>
              <label className="label" htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                className="input"
                required
                list="category-options"
                defaultValue={editing?.category}
              />
              <datalist id="category-options">
                {sections.map((s) => (
                  <option key={s.category} value={s.category} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              className="input"
              type="url"
              defaultValue={editing?.imageUrl ?? ""}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
            <input
              type="checkbox"
              name="available"
              defaultChecked={editing ? editing.available : true}
            />
            Available to order
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button type="submit" className="btn btnPrimary">
              {editing ? "Save changes" : "Create item"}
            </button>
            <a href="/admin/menu" className="btn btnSecondary">Cancel</a>
          </div>
        </form>
      )}

      {sections.map((section) => (
        <section key={section.category} style={{ marginTop: 34 }}>
          <h2 className="sectionTitle" style={{ fontSize: 21 }}>
            {section.category}
          </h2>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {section.items.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  opacity: item.available ? 1 : 0.6,
                }}
              >
                <div style={{ flex: 1, minWidth: 180 }}>
                  <strong>{item.name}</strong>{" "}
                  <span className="muted">· {formatPrice(item.price)}</span>
                  {!item.available && (
                    <span
                      className="badge"
                      style={{
                        marginLeft: 8,
                        background: "var(--status-cancelled-bg)",
                        color: "var(--status-cancelled)",
                      }}
                    >
                      hidden
                    </span>
                  )}
                </div>

                <form action={toggleAvailabilityAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input
                    type="hidden"
                    name="available"
                    value={item.available ? "false" : "true"}
                  />
                  <button type="submit" className="btn btnSecondary btnSm">
                    {item.available ? "Hide" : "Show"}
                  </button>
                </form>

                <a
                  href={`/admin/menu?edit=${item.id}`}
                  className="btn btnSecondary btnSm"
                >
                  Edit
                </a>

                <form action={deleteMenuItemAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button type="submit" className="btn btnDanger btnSm">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
