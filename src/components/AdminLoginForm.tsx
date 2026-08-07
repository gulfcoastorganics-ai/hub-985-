"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="card" style={{ padding: 28, maxWidth: 400 }}>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>Staff login</h1>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        Hub 985 admin dashboard.
      </p>

      <div className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className="input" required autoComplete="username" />
      </div>

      <div className="field">
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          required
          autoComplete="current-password"
        />
      </div>

      {state?.error && <div className="errorBox">{state.error}</div>}

      <button type="submit" className="btn btnPrimary" style={{ width: "100%", marginTop: 14 }} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
