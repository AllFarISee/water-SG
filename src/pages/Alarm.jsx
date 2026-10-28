import {
  BellRing,
  ShieldAlert,
  Gauge,
  TriangleAlert,
  Lock,
  VolumeX,
} from "lucide-react";
import {
  BATAS_HARIAN,
  BATAS_PERINGATAN,
  JAM_RESET,
  TEKANAN_MIN,
  TEKANAN_MAX,
} from "../config";
import Card from "../components/Card";

function Lencana({ aktif, teks, warna = "red" }) {
  const w = aktif
    ? { red: "bg-red-100 text-red-700", amber: "bg-amber-100 text-amber-700" }[
        warna
      ]
    : "bg-emerald-100 text-emerald-700";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${w}`}>
      {aktif ? teks : "NORMAL"}
    </span>
  );
}

const JENIS = {
  danger: ["Danger", "bg-red-100 text-red-700"],
  warning: ["Warning", "bg-amber-100 text-amber-700"],
  info: ["Info", "bg-blue-100 text-blue-700"],
};

export default function Alarm({ f }) {
  const tekananBuruk = f.statusTekanan !== "normal";
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-3">
        <Card
          ikon={ShieldAlert}
          judul="Daily Limit"
          subjudul={`${f.pemakaian.toFixed(2)} / ${BATAS_HARIAN} m³`}
          aksi={<Lencana aktif={f.alarm} teks="ALARM" />}
        >
          {f.alarm ? (
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-sm text-red-700">
                <Lock size={16} /> Pump locked until daily reset time{" "}
                {String(JAM_RESET).padStart(2, "0")}:00.
              </p>
              <button
                onClick={() => f.setSenyap(true)}
                disabled={f.senyap}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                <VolumeX size={16} /> {f.senyap ? "Alarm Off" : "Alarm On"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Pump off automatically at {BATAS_HARIAN} m³. Daily Reset{" "}
              {String(JAM_RESET).padStart(2, "0")}:00
            </p>
          )}
        </Card>

        <Card
          ikon={Gauge}
          judul="Pressure"
          subjudul={`${f.tekanan.toFixed(2)} bar · ( ${TEKANAN_MIN}–${TEKANAN_MAX} bar)`}
          aksi={
            <Lencana
              aktif={tekananBuruk}
              teks={f.statusTekanan.toUpperCase()}
              warna="amber"
            />
          }
        >
          <p className="text-sm text-slate-500">
            {tekananBuruk
              ? `Low Pressure ${f.statusTekanan}, Check Pump and Pipe Condition`
              : "Pressure range is Normal"}
          </p>
        </Card>

        <Card
          ikon={TriangleAlert}
          judul="Live Usage"
          subjudul={`Start ${BATAS_PERINGATAN} m³`}
          aksi={<Lencana aktif={f.waspada} teks="WASPADA" warna="amber" />}
        >
          <p className="text-sm text-slate-500">
            {f.waspada
              ? "Usage nearing the daily limit"
              : "Usage still well below the limit"}
          </p>
        </Card>
      </div>

      <Card
        ikon={BellRing}
        judul="Alarm History"
        subjudul={`${f.logAlarm.length} Incident`}
        className="flex-1"
      >
        <div className="min-h-0 flex-1 overflow-auto">
          {f.logAlarm.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Data not Found
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-2">Time</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Information</th>
                </tr>
              </thead>
              <tbody>
                {f.logAlarm.map((r) => (
                  <tr key={r.t + r.pesan} className="border-t border-slate-100">
                    <td className="whitespace-nowrap p-2 font-mono">
                      {new Date(r.t).toLocaleString("id-ID", { hour12: false })}
                    </td>
                    <td className="p-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${JENIS[r.jenis][1]}`}
                      >
                        {JENIS[r.jenis][0]}
                      </span>
                    </td>
                    <td className="p-2">{r.pesan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
