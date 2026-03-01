import { BadgePayload } from "@/services/api";

interface Props {
  data: BadgePayload;
}

export default function BadgeRecto({ data }: Props) {
  return (
    <div
      style={{
        width: 340,
        height: 214,
        background: "linear-gradient(145deg, #0e2f58 0%, #174a84 52%, #2f6fb3 100%)",
        borderRadius: 14,
        padding: 14,
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        border: "none"
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#ffffff",
              marginTop: 2,
              letterSpacing: 0.6
            }}
          >
            BADGE IDENTIFICATION
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              width: 68,
              height: 82,
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              border: "none",
              boxShadow: "0 4px 12px rgba(15,47,89,0.2)",
              flexShrink: 0
            }}
          >
            {data.photo_base64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photo_base64} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#e2e8f0" }} />
            )}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              borderRadius: 8,
              padding: "6px 8px"
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1.1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                color: "#ffffff"
              }}
            >
              {data.prenom} {data.nom}
            </div>
            <div style={{ fontSize: 12.5, color: "#e4efff", marginTop: 3 }}>Profession: {data.profession || "-"}</div>
            <div style={{ fontSize: 12.5, color: "#e4efff" }}>Nationalite: {data.nationalite || "-"}</div>
          </div>
        </div>
        </div>

        <div
          style={{
            marginTop: 8,
            marginBottom: 10,
            color: "#ffffff",
            padding: "7px 10px",
            borderRadius: 10,
            fontSize: 12,
            lineHeight: 1.2,
            border: "none"
          }}
        >
          <div>Ne(e) le: {data.date_naissance || "-"}</div>
          <div>Lieu: {data.lieu_naissance || "-"}</div>
          <div>Tel: {data.telephone || "-"}</div>
          <div>Adresse: {data.adresse || "-"}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 22,
          background: "linear-gradient(90deg, #0b2748 0%, #123f71 50%, #2b69ad 100%)",
          opacity: 0.95,
          zIndex: 0
        }}
      />
    </div>
  );
}
