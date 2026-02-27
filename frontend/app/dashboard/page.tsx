"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BadgeForm from "@/components/BadgeForm";
import BadgeRecto from "@/components/BadgeRecto";
import BadgeVerso from "@/components/BadgeVerso";
import { BadgePayload, createBadge } from "@/services/api";
import { downloadBadgeRecto } from "@/utils/generateBadge";

const initialData: BadgePayload = {
  nom: "",
  prenom: "",
  age: 0,
  date_naissance: "",
  lieu_naissance: "",
  telephone: "",
  contact_urgence: "",
  contact_urgence_numero: "",
  nationalite: "",
  profession: "",
  type_travail: "individuel",
  employeur_nom: null,
  employeur_prenom: null,
  photo_base64: null,
  adresse: ""
};

export default function DashboardPage() {
  const router = useRouter();
  const rectoRef = useRef<HTMLDivElement>(null);
  const versoRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<BadgePayload>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSavedForDownload, setIsSavedForDownload] = useState(false);

  const canDownload = useMemo(
    () => Boolean(data.nom && data.prenom && isSavedForDownload),
    [data.nom, data.prenom, isSavedForDownload]
  );

  const handleDataChange = (next: BadgePayload) => {
    setData(next);
    setIsSavedForDownload(false);
  };

  const submit = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setFeedback("");
    try {
      await createBadge(data, token);
      setFeedback("Badge enregistre avec succes.");
      setIsSavedForDownload(true);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Echec d enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadRecto = async () => {
    if (!rectoRef.current || !canDownload) {
      return;
    }
    await downloadBadgeRecto(rectoRef.current, `${data.prenom}-${data.nom}-badge-recto.png`);
  };

  const downloadVerso = async () => {
    if (!versoRef.current || !canDownload) {
      return;
    }
    await downloadBadgeRecto(versoRef.current, `${data.prenom}-${data.nom}-badge-verso.png`);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; max-age=0; samesite=lax";
    router.push("/login");
  };

  return (
    <main className="app-main fade-in">
      <div className="page-header">
        <h1>Dashboard - Generation de badge</h1>
        <div className="page-actions">
          <button className="button-secondary" onClick={() => router.push("/personnes")}>
            Personnes enregistrees
          </button>
          <button className="button-secondary" onClick={logout}>
            Deconnexion
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <BadgeForm data={data} onChange={handleDataChange} onSubmit={submit} submitting={submitting} feedback={feedback} />
        <section className="card slide-up">
          <h2 style={{ marginTop: 0 }}>Previsualisation</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Recto</div>
              <div ref={rectoRef}>
                <BadgeRecto data={data} />
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Verso</div>
              <div ref={versoRef}>
                <BadgeVerso data={data} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <button
              onClick={downloadRecto}
              disabled={!canDownload}
              style={{
                background: canDownload ? "#0f766e" : "#94a3b8",
                color: "#fff",
                cursor: canDownload ? "pointer" : "not-allowed"
              }}
            >
              Telecharger recto (PNG)
            </button>
            <button
              onClick={downloadVerso}
              disabled={!canDownload}
              style={{
                background: canDownload ? "#14532d" : "#94a3b8",
                color: "#fff",
                cursor: canDownload ? "pointer" : "not-allowed"
              }}
            >
              Telecharger verso (PNG)
            </button>
          </div>
          {!isSavedForDownload ? (
            <p style={{ marginTop: 8, color: "#64748b" }}>Enregistre d abord la fiche avant de telecharger.</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
