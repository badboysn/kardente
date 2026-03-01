"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BadgeForm from "@/components/BadgeForm";
import BadgeRecto from "@/components/BadgeRecto";
import BadgeVerso from "@/components/BadgeVerso";
import { BadgePayload, createBadge } from "@/services/api";
import { downloadBadgeRecto } from "@/utils/generateBadge";

import { AiOutlineLogout } from "react-icons/ai";
import { PiIdentificationBadgeLight } from "react-icons/pi";
import { FaRegIdBadge } from "react-icons/fa6";
import { MdSaveAlt } from "react-icons/md";

const initialData: BadgePayload = {
  nom: "",
  prenom: "",
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
    <main className="bg-gray-100 min-h-screen">
      <div className="bg-white flex justify-between py-6 mb-10 px-[10%] border-b border-gray-300">
        <h1 className="text-4xl font-bold">Kardente</h1>
        <div className="flex gap-4">
          <button className="cursor-pointer flex gap-2 items-center font-semibold p-2 px-4 rounded-xl" onClick={() => router.push("/personnes")}>
            <PiIdentificationBadgeLight size={25}/>
            Badges générés
          </button>
          <button className="cursor-pointer flex gap-2 items-center bg-red-500 text-white p-2 px-4 rounded-xl" onClick={logout}>
            <AiOutlineLogout size={20}/>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="flex gap-10 px-[10%] w-full">
        
        <BadgeForm data={data} onChange={handleDataChange} onSubmit={submit} submitting={submitting} feedback={feedback} />
        
        <section className="bg-blue-60 flex flex-col gap-4">
          
          <h2 className="italic text-sm">Prévisualisation</h2>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div className="flex flex-col gap-2">
              <span className="font-bold">Recto</span>
              <div ref={rectoRef}>
                <BadgeRecto data={data} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold">Verso</span>
              <div ref={versoRef}>
                <BadgeVerso data={data} />
              </div>
            </div>
          </div>

          {!isSavedForDownload &&
            <p className="text-gray-500 italic">Enregistrer d'abord la formulaire avant de pouvoir télécharger.</p>
          }

          <div className="flex gap-4">
            <button
              onClick={downloadRecto}
              disabled={!canDownload}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${canDownload ? "pointer" : "not-allowed"} ${ canDownload ? "bg-green-500 text-white cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              <MdSaveAlt size={20}/>
              Telecharger recto (PNG)
            </button>
            <button
              onClick={downloadVerso}
              disabled={!canDownload}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${canDownload ? "pointer" : "not-allowed"} ${ canDownload ? "bg-green-800 text-white cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              <MdSaveAlt size={20}/>
              Telecharger verso (PNG)
            </button>
          </div>
          
        </section>
      </div>
    </main>
  );
}
