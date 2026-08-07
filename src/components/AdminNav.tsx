import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav({ active }: { active: "orders" | "menu" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 28,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href="/admin"
          className={`btn btnSm ${active === "orders" ? "btnPrimary" : "btnSecondary"}`}
        >
          Orders
        </Link>
        <Link
          href="/admin/menu"
          className={`btn btnSm ${active === "menu" ? "btnPrimary" : "btnSecondary"}`}
        >
          Menu
        </Link>
      </div>
      <form action={logoutAction}>
        <button type="submit" className="btn btnSecondary btnSm">
          Sign out
        </button>
      </form>
    </div>
  );
}
