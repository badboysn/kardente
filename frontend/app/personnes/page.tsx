"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BadgeRecto from "@/components/BadgeRecto";
import BadgeVerso from "@/components/BadgeVerso";
import { BadgePayload, BadgeResponse, listBadges } from "@/services/api";
import { downloadBadgeRecto } from "@/utils/generateBadge";
import { AiOutlineLogout } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiRefresh } from "react-icons/hi";
import { MdSaveAlt } from "react-icons/md";


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
    adresse: item.adresse,
    contact_membre_urgence: item.contact_membre_urgence,
    contact_membre_urgence_numero: item.contact_membre_urgence_numero
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
    <main className="app-main fade-in bg-gray-100 min-h-screen">
      <div className="bg-white flex justify-between py-6 mb-10 px-[10%] border-b border-gray-300">
        <h1 className="text-4xl font-bold">Kardente</h1>
        <div className="flex gap-4">
          <button className="cursor-pointer flex gap-2 items-center font-semibold p-2 px-4 rounded-xl" onClick={() => router.push("/dashboard")}>
            <LuLayoutDashboard size={25}/>
            Retour Tableau de bord
          </button>
          <button className="cursor-pointer flex gap-2 items-center bg-green-500 text-white p-2 px-4 rounded-xl" onClick={load} disabled={loading}>
            <HiRefresh size={20}/>
            {loading ? "Chargement" : "Rafraichir"}
          </button>
        </div>
      </div>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {!loading && !error && items.length === 0 ? <p>Aucune personne enregistree.</p> : null}

      <section className="px-[10%] flex flex-col gap-4">

      <div>
        <input
          placeholder="Filtrer par nom ou prenom"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="border border-gray-300 rounded-full py-3 px-4 text-xl outline-0"
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="overflow-x-auto bg-white min-h-[60vh] mt-4 rounded-2xl">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr className="bg-gray-200 text-xl">
                <th className="text-start p-4">Nom complet</th>
                <th className="text-start p-4">Profession</th>
                <th className="text-start p-4">Telephone</th>
                <th className="text-start p-4">Type travail</th>
                <th className="text-start p-4">Date creation</th>
                <th className="text-start p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-4 text-lg border-b border-gray-100">
                    <Link href={`/personnes/${item.id}`} className="text-green-600 font-semibold">
                      {item.prenom} {item.nom}
                    </Link>
                  </td>
                  <td className="p-4 text-lg border-b border-gray-100">{item.profession || "-"}</td>
                  <td className="p-4 text-lg border-b border-gray-100">{item.telephone || "-"}</td>
                  <td className="p-4 text-lg border-b border-gray-100">{item.type_travail}</td>
                  <td className="p-4 text-lg border-b border-gray-100">
                    {new Date(item.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => handleDownloadRecto(item)} disabled={downloadingKey === `${item.id}-recto`} className="flex items-center gap-2 bg-green-600 rounded-full text-white px-6 py-2">
                        <MdSaveAlt size={20}/>
                        {downloadingKey === `${item.id}-recto` ? "Generation..." : "Recto (PNG)"}
                      </button>

                      <button onClick={() => handleDownloadVerso(item)} disabled={downloadingKey === `${item.id}-verso`} className="flex items-center gap-2 bg-green-800 rounded-full text-white px-6">
                        <MdSaveAlt size={20}/>
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

      </section>
    </main>
  );
}
