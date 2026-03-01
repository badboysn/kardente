import BadgeRecto from "@/components/BadgeRecto";
import BadgeVerso from "@/components/BadgeVerso";
import { BadgePayload } from "@/services/api";

interface Props {
  data: BadgePayload;
}

export default function BadgePreview({ data }: Props) {
  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Previsualisation</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Recto</div>
          <BadgeRecto data={data} />
        </div>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Verso</div>
          <BadgeVerso data={data} />
        </div>
      </div>
    </section>
  );
}
