import { BadgePayload } from "@/services/api";

interface Props {
  data: BadgePayload;
}

export default function BadgeVerso({ data }: Props) {
  const employeur =
    data.type_travail === "groupe"
      ? `${data.employeur_prenom ?? ""} ${data.employeur_nom ?? ""}`.trim() || "..."
      : "...";

  return (
    <div
      style={{
        width: 340,
        height: 514,
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
          width: 10,
          height: 514,
          background: "linear-gradient(180deg, #163b6d 0%, #0f2f59 100%)",
          clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0 100%)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 250,
          height: 160,
          background: "linear-gradient(140deg, #eaf2fb 0%, #d8e8fa 70%, rgba(216,232,250,0) 100%)",
          clipPath: "polygon(0 28%, 100% 100%, 0 100%)"
        }}
      />
      <h3 className="font-semibold text-md text-blue-900">Informations complementaires</h3>
      <div
        className="
          relative
          z-1
          text-[12px]
          leading-[1.55]
          font-semibold
          border-0
          rounded-[10px]
          px-2
          py-2
          w-70
          h-[90%]
          flex flex-col justify-center items-center gap-3
        "
      >
        {/* <div>Age: {data.age || "-"}</div> */}
        <div className="flex flex-col items-center">
          <span className="font-extralight text-lg">Ami proche</span>
          <span className="text-lg">{data.contact_urgence || "..."}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extralight text-lg">Contact ami proche</span>
          <span className="text-lg">{data.contact_urgence_numero || "..."}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extralight text-lg">Membre de famille</span>
          <span className="text-lg">{data.contact_membre_urgence || "..."}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extralight text-lg">Contact Membre de famille</span>
          <span className="text-lg">{data.contact_membre_urgence_numero || "..."}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extralight text-lg">Type de travail</span>
          <span className="text-lg">{data.type_travail || "..."}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extralight text-lg">Employeur</span>
          <span className="text-lg">{employeur || "..."}</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 10, color: "#2d4a6d", zIndex: 1 }}>
        Carte strictement personnelle
      </div>
    </div>
  );
}
