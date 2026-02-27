"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BadgeRecto from "@/components/BadgeRecto";
import BadgeVerso from "@/components/BadgeVerso";
import { BadgePayload, BadgeResponse, listBadges } from "@/services/api";
import { downloadBadgeRecto } from "@/utils/generateBadge";

export default function PersonnesPage() {
  const router = useRouter();
  const [items, setItems] = useState<BadgeResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [badgeToDownload, setBadgeToDownload] = useState<BadgePayload | null>(null);
  const hiddenRectoRef = useRef<HTMLDivElement>(null);
  const hiddenVersoRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter((item) => `${item.prenom} ${item.nom}`.toLowerCase().includes(query));
  }, [items, search]);

  const load = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await listBadges(token);
      setItems(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les personnes.");
    } finally {
      setLoading(false);
    }
  };

  const waitForPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

  const buildPayload = (item: BadgeResponse): BadgePayload => ({
    nom: item.nom,
    prenom: item.prenom,
    age: item.age,
    date_naissance: item.date_naissance,
    lieu_naissance: item.lieu_naissance,
    telephone: item.telephone,
    contact_urgence: item.contact_urgence,
    contact_urgence_numero: item.contact_urgence_numero,
    nationalite: item.nationalite,
    profession: item.profession,
    type_travail: item.type_travail,
    employeur_nom: item.employeur_nom,
    employeur_prenom: item.employeur_prenom,
    photo_base64: item.photo_base64,
    adresse: item.adresse
  });

  const handleDownloadRecto = async (item: BadgeResponse) => {
    const payload = buildPayload(item);
    setDownloadingKey(`${item.id}-recto`);
    setBadgeToDownload(payload);
    await waitForPaint();
    await waitForPaint();
    if (hiddenRectoRef.current) {
      await downloadBadgeRecto(hiddenRectoRef.current, `${item.prenom}-${item.nom}-badge-recto.png`);
    }
    setDownloadingKey(null);
    setBadgeToDownload(null);
  };

  const handleDownloadVerso = async (item: BadgeResponse) => {
    const payload = buildPayload(item);
    setDownloadingKey(`${item.id}-verso`);
    setBadgeToDownload(payload);
    await waitForPaint();
    await waitForPaint();
    if (hiddenVersoRef.current) {
      await downloadBadgeRecto(hiddenVersoRef.current, `${item.prenom}-${item.nom}-badge-verso.png`);
    }
    setDownloadingKey(null);
    setBadgeToDownload(null);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="app-main fade-in">
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Personnes enregistrees</h1>
        <div className="page-actions">
          <button className="button-secondary" onClick={() => router.push("/dashboard")}>
            Retour dashboard
          </button>
          <button className="button-secondary" onClick={load} disabled={loading}>
            {loading ? "Chargement..." : "Rafraichir"}
          </button>
        </div>
      </div>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {!loading && !error && items.length === 0 ? <p>Aucune personne enregistree.</p> : null}

      <div style={{ marginTop: 12 }}>
        <input
          placeholder="Filtrer par nom ou prenom"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: "100%", maxWidth: 380, padding: 10 }}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="card slide-up" style={{ marginTop: 16, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>Nom complet</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>Profession</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>Telephone</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>Type travail</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>Date creation</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>
                    <Link href={`/personnes/${item.id}`} style={{ color: "#1d4ed8", fontWeight: 600 }}>
                      {item.prenom} {item.nom}
                    </Link>
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>{item.profession || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>{item.telephone || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>{item.type_travail}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>
                    {new Date(item.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => handleDownloadRecto(item)} disabled={downloadingKey === `${item.id}-recto`}>
                        {downloadingKey === `${item.id}-recto` ? "Generation..." : "Recto (PNG)"}
                      </button>
                      <button onClick={() => handleDownloadVerso(item)} disabled={downloadingKey === `${item.id}-verso`}>
                        {downloadingKey === `${item.id}-verso` ? "Generation..." : "Verso (PNG)"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {!loading && !error && items.length > 0 && filteredItems.length === 0 ? <p>Aucun resultat.</p> : null}

      {badgeToDownload ? (
        <div
          style={{
            position: "fixed",
            left: -10000,
            top: -10000,
            opacity: 0,
            pointerEvents: "none"
          }}
        >
          <div ref={hiddenRectoRef}>
            <BadgeRecto data={badgeToDownload} />
          </div>
          <div ref={hiddenVersoRef} style={{ marginTop: 10 }}>
            <BadgeVerso data={badgeToDownload} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
