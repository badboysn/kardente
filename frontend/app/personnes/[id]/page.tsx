"use client";

import { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { BadgePayload, BadgeResponse, getBadgeById, updateBadgeById } from "@/services/api";

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

export default function PersonneDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [personne, setPersonne] = useState<BadgeResponse | null>(null);
  const [formData, setFormData] = useState<BadgePayload | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const id = Number(params.id);
      if (!Number.isFinite(id)) {
        setError("Identifiant invalide.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await getBadgeById(id, token);
        setPersonne(data);
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          age: data.age,
          date_naissance: data.date_naissance,
          lieu_naissance: data.lieu_naissance,
          telephone: data.telephone,
          contact_urgence: data.contact_urgence,
          contact_urgence_numero: data.contact_urgence_numero,
          nationalite: data.nationalite,
          profession: data.profession,
          type_travail: data.type_travail,
          employeur_nom: data.employeur_nom,
          employeur_prenom: data.employeur_prenom,
          photo_base64: data.photo_base64,
          adresse: data.adresse
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger cette personne.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id, router]);

  const setField = (key: keyof BadgePayload, value: string | number | null) => {
    if (!formData) {
      return;
    }
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const onPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const encoded = await parseFileAsBase64(file);
    setField("photo_base64", encoded);
  };

  const saveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("auth_token");
    const id = Number(params.id);
    if (!token || !formData || !Number.isFinite(id)) {
      return;
    }

    setSaving(true);
    setFeedback("");
    setError("");
    try {
      const updated = await updateBadgeById(id, formData, token);
      setPersonne(updated);
      setFormData({
        nom: updated.nom,
        prenom: updated.prenom,
        age: updated.age,
        date_naissance: updated.date_naissance,
        lieu_naissance: updated.lieu_naissance,
        telephone: updated.telephone,
        contact_urgence: updated.contact_urgence,
        contact_urgence_numero: updated.contact_urgence_numero,
        nationalite: updated.nationalite,
        profession: updated.profession,
        type_travail: updated.type_travail,
        employeur_nom: updated.employeur_nom,
        employeur_prenom: updated.employeur_prenom,
        photo_base64: updated.photo_base64,
        adresse: updated.adresse
      });
      setFeedback("Informations mises a jour.");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Echec de mise a jour.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-main fade-in">
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Details personne</h1>
        <div className="page-actions">
          {!isEditing ? (
            <button className="button-secondary" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          ) : null}
          <button className="button-secondary" onClick={() => router.push("/personnes")}>
            Retour liste
          </button>
        </div>
      </div>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {feedback ? <p style={{ color: "#166534" }}>{feedback}</p> : null}

      {personne && !isEditing ? (
        <section className="card slide-up" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 140,
                height: 170,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                overflow: "hidden",
                background: "#e2e8f0"
              }}
            >
              {personne.photo_base64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={personne.photo_base64}
                  alt={`${personne.prenom} ${personne.nom}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <h2 style={{ marginTop: 0 }}>
                {personne.prenom} {personne.nom}
              </h2>
              <p style={{ margin: "4px 0" }}>
                <strong>Age:</strong> {personne.age}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Date de naissance:</strong> {personne.date_naissance}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Lieu de naissance:</strong> {personne.lieu_naissance}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Telephone:</strong> {personne.telephone}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Contact urgence:</strong> {personne.contact_urgence}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Numero contact urgence:</strong> {personne.contact_urgence_numero}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Nationalite:</strong> {personne.nationalite}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Profession:</strong> {personne.profession}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Type de travail:</strong> {personne.type_travail}
              </p>
              {personne.type_travail === "groupe" ? (
                <p style={{ margin: "4px 0" }}>
                  <strong>Employeur:</strong> {personne.employeur_prenom || "-"} {personne.employeur_nom || "-"}
                </p>
              ) : null}
              <p style={{ margin: "4px 0" }}>
                <strong>Adresse:</strong> {personne.adresse}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Enregistre le:</strong> {new Date(personne.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {isEditing && formData ? (
        <section className="card slide-up" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Modifier les informations</h2>
          <form onSubmit={saveEdit}>
            <div className="form-grid">
              <input value={formData.nom} onChange={(e) => setField("nom", toUpper(e.target.value))} placeholder="Nom" required />
              <input
                value={formData.prenom}
                onChange={(e) => setField("prenom", toUpper(e.target.value))}
                placeholder="Prenom"
                required
              />
              <input
                type="number"
                min={0}
                max={120}
                value={formData.age}
                onChange={(e) => setField("age", Number(e.target.value))}
                placeholder="Age"
                required
              />
              <input
                type="date"
                value={formData.date_naissance}
                onChange={(e) => setField("date_naissance", e.target.value)}
                placeholder="Date de naissance"
                required
              />
              <input
                value={formData.lieu_naissance}
                onChange={(e) => setField("lieu_naissance", e.target.value)}
                placeholder="Lieu de naissance"
                required
              />
              <input
                type="tel"
                inputMode="numeric"
                value={formData.telephone}
                onChange={(e) => setField("telephone", onlyDigits(e.target.value))}
                placeholder="Telephone"
                required
              />
              <input
                value={formData.contact_urgence}
                onChange={(e) => setField("contact_urgence", toUpper(e.target.value))}
                placeholder="Contact urgence"
                required
              />
              <input
                type="tel"
                inputMode="numeric"
                value={formData.contact_urgence_numero}
                onChange={(e) => setField("contact_urgence_numero", onlyDigits(e.target.value))}
                placeholder="Numero contact urgence"
                required
              />
              <input
                value={formData.nationalite}
                onChange={(e) => setField("nationalite", e.target.value)}
                placeholder="Nationalite"
                required
              />
              <input
                value={formData.profession}
                onChange={(e) => setField("profession", e.target.value)}
                placeholder="Profession"
                required
              />
              <select
                value={formData.type_travail}
                onChange={(e) => {
                  const value = e.target.value as BadgePayload["type_travail"];
                  setFormData({
                    ...formData,
                    type_travail: value,
                    employeur_nom: value === "groupe" ? formData.employeur_nom ?? "" : null,
                    employeur_prenom: value === "groupe" ? formData.employeur_prenom ?? "" : null
                  });
                }}
              >
                <option value="individuel">Individuel</option>
                <option value="groupe">Groupe</option>
              </select>
              <input
                value={formData.adresse}
                onChange={(e) => setField("adresse", e.target.value)}
                placeholder="Adresse"
                required
              />
              {formData.type_travail === "groupe" ? (
                <>
                  <input
                    value={formData.employeur_nom ?? ""}
                    onChange={(e) => setField("employeur_nom", e.target.value)}
                    placeholder="Nom employeur"
                    required
                  />
                  <input
                    value={formData.employeur_prenom ?? ""}
                    onChange={(e) => setField("employeur_prenom", e.target.value)}
                    placeholder="Prenom employeur"
                    required
                  />
                </>
              ) : null}
            </div>

            <div style={{ marginTop: 10 }}>
              <label>
                Photo
                <input type="file" accept="image/*" onChange={onPhotoChange} />
              </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </main>
  );
}
