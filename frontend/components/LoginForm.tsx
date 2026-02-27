"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/api";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(username, password);
      localStorage.setItem("auth_token", token);
      document.cookie = `auth_token=${token}; path=/; max-age=86400; samesite=lax`;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card slide-up"
      style={{ width: "100%", maxWidth: 420 }}
    >
      <h1 style={{ marginTop: 0 }}>Connexion</h1>
      <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
        Identifiant
        <input value={username} onChange={(e) => setUsername(e.target.value)} required style={{ marginTop: 4 }} />
      </label>
      <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginTop: 4 }}
        />
      </label>
      {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}
      <button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
