import { BadgePayload } from "@/services/api";

interface Props {
  data: BadgePayload;
}

export default function BadgeRecto({ data }: Props) {
  return (
    <div
      className="
          w-[340px]
          h-[514px]
          bg-gradient-to-br 
        from-blue-950 
        via-blue-950 
        to-lime-600
          rounded-[14px]
          p-3
          text-white
          relative
          overflow-hidden
          shadow-[0_8px_20px_rgba(0,0,0,0.15)]
          border-0
        "
    >
      <div className="w-full h-full flex flex-col gap-6">
        <div className="p-2 gap-4 flex flex-col">

          <h2 className="uppercase text-center font-bold text-sm my-2">badge identification</h2>

          <div className="flex flex-col justify-center items-center text-center gap-2">
            
            <div className="h-40 w-40 mb-4">
              {data.photo_base64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photo_base64} alt="previex" className="w-full h-full object-cover rounded-2xl shadow" />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#e2e8f0" }} />
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-2xl italic font-semibold">{data.prenom} {data.nom}</div>
              <div className="text-xl font-extralight">{data.profession || "..."}</div>
              <div className="text-lg font-thin">{data.nationalite || "..."}</div>
            </div>

          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Date de Naissance :</span>
            <span className="font-semibold text-md">{data.date_naissance || "..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Lieu de Naissance :</span>
            <span className="font-semibold text-md">{data.lieu_naissance || "..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Téléphone :</span>
            <span className="font-semibold text-md">{data.telephone || "..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Adresse domicille :</span>
            <span className="font-semibold text-md">{data.adresse || "..."}</span>
          </div>
        </div>
      </div>

     
    </div>
  );
}
