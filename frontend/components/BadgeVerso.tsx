import { BadgePayload } from "@/services/api";

interface Props {
  data: BadgePayload;
}

export default function BadgeVerso({ data }: Props) {
  const employeur =
    data.type_travail === "groupe"
      ? `${data.employeur_prenom ?? ""} ${data.employeur_nom ?? ""}`.trim() || "-"
      : "N/A";

  return (
    <div
      style={{
        width: 340,
        height: 214,
        background: "linear-gradient(180deg, #fefefe 0%, #f8fbff 100%)",
        borderRadius: 14,
        padding: 14,
        color: "#0f172a",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        border: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 132,
          height: 214,
          background: "linear-gradient(180deg, #163b6d 0%, #0f2f59 100%)",
          clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0 100%)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 200,
          height: 95,
          background: "linear-gradient(140deg, #eaf2fb 0%, #d8e8fa 70%, rgba(216,232,250,0) 100%)",
          clipPath: "polygon(0 28%, 100% 100%, 0 100%)"
        }}
      />
      <div style={{ position: "relative", zIndex: 1, fontSize: 14, fontWeight: 800, marginBottom: 10, color: "#1a3e6f" }}>
        Infos complementaires
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: 12,
          lineHeight: 1.55,
          fontWeight: 600,
          background: "rgba(255,255,255,0.86)",
          border: "none",
          borderRadius: 10,
          padding: "9px 10px",
          width: 278
        }}
      >
        <div>Age: {data.age || "-"}</div>
        <div>Contact urgence: {data.contact_urgence || "-"}</div>
        <div>Numero urgence: {data.contact_urgence_numero || "-"}</div>
        <div>Type de travail: {data.type_travail}</div>
        <div>Employeur: {employeur}</div>
      </div>

      <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 10, color: "#2d4a6d", zIndex: 1 }}>
        Carte strictement personnelle
      </div>
    </div>
  );
}
