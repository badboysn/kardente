"use client";

import { ChangeEvent, FormEvent } from "react";

import { BadgePayload, WorkType } from "@/services/api";

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
    <form onSubmit={submit} className="card slide-up">
      <h2 style={{ marginTop: 0 }}>Formulaire badge</h2>
      <div className="form-grid stagger">
        <input placeholder="Nom" value={data.nom} onChange={(e) => setField("nom", toUpper(e.target.value))} required />
        <input
          placeholder="Prenom"
          value={data.prenom}
          onChange={(e) => setField("prenom", toUpper(e.target.value))}
          required
        />
        <input
          placeholder="Age"
          type="number"
          min={0}
          max={120}
          value={data.age}
          onChange={(e) => setField("age", Number(e.target.value))}
          required
        />
        <input
          placeholder="Date de naissance"
          type="date"
          value={data.date_naissance}
          onChange={(e) => setField("date_naissance", e.target.value)}
          required
        />
        <input
          placeholder="Lieu de naissance"
          value={data.lieu_naissance}
          onChange={(e) => setField("lieu_naissance", e.target.value)}
          required
        />
        <input
          placeholder="Telephone"
          type="tel"
          inputMode="numeric"
          value={data.telephone}
          onChange={(e) => setField("telephone", onlyDigits(e.target.value))}
          required
        />
        <input
          placeholder="Contact urgence"
          value={data.contact_urgence}
          onChange={(e) => setField("contact_urgence", toUpper(e.target.value))}
          required
        />
        <input
          placeholder="Numero contact urgence"
          type="tel"
          inputMode="numeric"
          value={data.contact_urgence_numero}
          onChange={(e) => setField("contact_urgence_numero", onlyDigits(e.target.value))}
          required
        />
        <input
          placeholder="Nationalite"
          value={data.nationalite}
          onChange={(e) => setField("nationalite", e.target.value)}
          required
        />
        <input
          placeholder="Profession"
          value={data.profession}
          onChange={(e) => setField("profession", e.target.value)}
          required
        />
        <select value={data.type_travail} onChange={(e) => onWorkTypeChange(e.target.value as WorkType)}>
          <option value="individuel">Individuel</option>
          <option value="groupe">Groupe</option>
        </select>
        <input
          placeholder="Adresse domicile"
          value={data.adresse}
          onChange={(e) => setField("adresse", e.target.value)}
          required
        />
        {data.type_travail === "groupe" ? (
          <>
            <input
              placeholder="Nom employeur"
              value={data.employeur_nom ?? ""}
              onChange={(e) => setField("employeur_nom", e.target.value)}
              required
            />
            <input
              placeholder="Prenom employeur"
              value={data.employeur_prenom ?? ""}
              onChange={(e) => setField("employeur_prenom", e.target.value)}
              required
            />
          </>
        ) : null}
      </div>

      <label style={{ display: "block", marginTop: 12 }}>
        Photo
        <input type="file" accept="image/*" onChange={handlePhoto} />
      </label>

      {feedback ? <p style={{ marginBottom: 0 }}>{feedback}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        style={{ marginTop: 12 }}
      >
        {submitting ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
