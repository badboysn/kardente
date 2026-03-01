"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/api";

import { IoPersonOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import { IoLogInOutline } from "react-icons/io5";

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
    <form onSubmit={handleSubmit} className="w-120 bg-green-20 flex flex-col gap-8">
      <h1 className="text-4xl font-semibold">Bienvenu, Daalal aak diam</h1>
      
      <div className="flex flex-col gap-4 mb-6">
        <label className="pl-5 text-xl flex items-center gap-4"> <IoPersonOutline /> Identifiant</label>
        <input value={username} className="outline-0 border-2 py-4 px-6 rounded-full text-2xl border-gray-200" placeholder="Yekini" onChange={(e) => setUsername(e.target.value)} required />
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
      <label className="pl-5 text-xl flex items-center gap-4">
        <TbLockPassword />
        Mot de passe
      </label>
      <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="outline-0 border-2 py-4 px-6 rounded-full text-2xl border-gray-200"
        />
      </div>
      {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}
      <button type="submit" className="outline-0 flex justify-center items-center gap-4 py-4 px-6 rounded-full text-2xl bg-orange-600 text-white" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Connexion" : "Se connecter"}
        <IoLogInOutline />
      </button>
    </form>
  );
}
