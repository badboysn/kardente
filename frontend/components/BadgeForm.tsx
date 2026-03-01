"use client";

import { ChangeEvent, FormEvent } from "react";

import { BadgePayload, WorkType } from "@/services/api";
import { IoSaveOutline } from "react-icons/io5";

interface Props {
  data: BadgePayload;
  submitting: boolean;
  feedback: string;
  onChange: (next: BadgePayload) => void;
  onSubmit: () => Promise<void>;
}

const toUpper = (value: string) => value.toLocaleUpperCase();
const onlyDigits = (value: string) => value.replace(/\D/g, "");

function parseFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Impossible de lire la photo"));
    reader.readAsDataURL(file);
  });
}

export default function BadgeForm({ data, submitting, feedback, onChange, onSubmit }: Props) {
  const setField = (key: keyof BadgePayload, value: string | number | null) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  const onWorkTypeChange = (value: WorkType) => {
    onChange({
      ...data,
      type_travail: value,
      employeur_nom: value === "groupe" ? data.employeur_nom ?? "" : null,
      employeur_prenom: value === "groupe" ? data.employeur_prenom ?? "" : null
    });
  };

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const encoded = await parseFileAsBase64(file);
    setField("photo_base64", encoded);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form onSubmit={submit} className=" bg-white w-1/2 py-10 px-6 rounded-2xl">
      <h2 className="mb-10 text-3xl">Formulaire badge</h2>
      <div className="grid grid-cols-2 gap-6">
        <input placeholder="Nom de famille" value={data.nom} onChange={(e) => setField("nom", toUpper(e.target.value))} 
          required 
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Prénom"
          value={data.prenom}
          onChange={(e) => setField("prenom", toUpper(e.target.value))}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Date de naissance"
          type="date"
          value={data.date_naissance}
          onChange={(e) => setField("date_naissance", e.target.value)}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Lieu de naissance"
          value={data.lieu_naissance}
          onChange={(e) => setField("lieu_naissance", e.target.value)}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Nationalité"
          value={data.nationalite}
          onChange={(e) => setField("nationalite", e.target.value)}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Téléphone"
          type="tel"
          inputMode="numeric"
          value={data.telephone}
          onChange={(e) => setField("telephone", onlyDigits(e.target.value))}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Ami proche à contacter"
          value={data.contact_urgence}
          onChange={(e) => setField("contact_urgence", toUpper(e.target.value))}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Numéro ami proche à contacter"
          type="tel"
          inputMode="numeric"
          value={data.contact_urgence_numero}
          onChange={(e) => setField("contact_urgence_numero", onlyDigits(e.target.value))}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Membre de famille à contacter"
          value={data.contact_membre_urgence}
          onChange={(e) => setField("contact_membre_urgence", toUpper(e.target.value))}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Numéro membre de famille"
          type="tel"
          inputMode="numeric"
          value={data.contact_membre_urgence_numero}
          onChange={(e) => setField("contact_membre_urgence_numero", onlyDigits(e.target.value))}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Adresse domicile"
          value={data.adresse}
          onChange={(e) => setField("adresse", e.target.value)}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <input
          placeholder="Profession"
          value={data.profession}
          onChange={(e) => setField("profession", e.target.value)}
          required
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        />
        <select value={data.type_travail} 
          className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
        onChange={(e) => onWorkTypeChange(e.target.value as WorkType)}>
          <option value="individuel">Individuel</option>
          <option value="groupe">Groupe</option>
        </select>
        
        {data.type_travail === "groupe" ? (
          <>
            <input
              placeholder="Nom employeur"
              value={data.employeur_nom ?? ""}
              onChange={(e) => setField("employeur_nom", e.target.value)}
              required
              className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
            />
            <input
              placeholder="Prenom employeur"
              value={data.employeur_prenom ?? ""}
              onChange={(e) => setField("employeur_prenom", e.target.value)}
              required
              className="border border-gray-300 outline-0 rounded-full px-4 py-2 text-lg"
            />
          </>
        ) : null}
      </div>

      <div className="py-6">
        
        <input type="file" className="w-full cursor-pointer bg-gray-100 p-4 rounded-full border-2 border-gray-200" accept="image/*" onChange={handlePhoto} />
      </div>

      {/* {feedback ? <p style={{ marginBottom: 0 }}>{feedback}</p> : "null"} */}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer flex gap-2 items-center justify-center py-3 px-4 rounded-full text-2xl bg-orange-600 text-white w-full text-center"
      > 
        <IoSaveOutline size={20}/>
        {submitting ? "Enregistrement encours" : "Enregistrer"}
      </button>
    </form>
  );
}
