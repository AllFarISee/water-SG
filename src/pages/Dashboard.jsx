import {
  Fan,
  Gauge,
  Droplet,
  Activity,
  Square,
  Play,
  Timer,
  Lock,
} from "lucide-react";
import {
  BATAS_HARIAN,
  BATAS_PERINGATAN,
  JAM_RESET,
  QN,
  TEKANAN_MIN,
  TEKANAN_MAX,
} from "../config";
import Card from "../components/Card";
import ParameterCard from "../components/ParameterCard";
import Odometer from "../components/Odometer";
import PumpSimulation from "../components/PumpSimulation";

const NADA = {
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-700",
};

export default function Dashboard({ f }) {
  const persen = Math.min((f.pemakaian / BATAS_HARIAN) * 100, 100);
  const sisa = Math.max(BATAS_HARIAN - f.pemakaian, 0);
  const waspada = f.waspada;
  const tekananRendah = f.statusTekanan === "rendah";
  const tekananTinggi = f.statusTekanan === "tinggi";
  const tekananBuruk = tekananRendah || tekananTinggi;

  return (
    <div className="grid h-full gap-3 lg:grid-cols-12">
      {/* KIRI: pompa */}
      <div className="flex min-h-0 flex-col gap-3 lg:col-span-5">
        <Card ikon={Fan} judul="Pump Status" className="flex-1">
          <div className="min-h-64 flex-1">
            <PumpSimulation
              nyala={f.pompaNyala}
              alarm={f.alarm}
              tekanan={f.tekanan}
            />
          </div>
          <div className="mt-2">
            {f.pompaNyala ? (
              <button
                onClick={f.matikan}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <Square size={18} fill="currentColor" /> Stop
              </button>
            ) : f.alarm ? (
              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 py-3 font-semibold text-slate-500"
              >
                <Lock size={18} /> Locked until system reset at{" "}
                {String(JAM_RESET).padStart(2, "0")}:00
              </button>
            ) : (
              <button
                onClick={f.nyalakan}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                <Play size={18} fill="currentColor" /> Start
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* KANAN: meteran, pemakaian, parameter, grafik */}
      <div className="flex min-h-0 flex-col gap-3 lg:col-span-7">
        <Card ikon={Timer} judul="Flowmeter" className="flex-1">
          <div className="flex flex-1 items-center overflow-x-auto">
            <Odometer nilai={f.totalizer} />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Daily reset counter ({String(JAM_RESET).padStart(2, "0")}:00) AM
          </p>
        </Card>

        <Card
          ikon={Droplet}
          judul="Today Usage"
          className="flex-1 justify-center"
          aksi={
            <p className="text-2xl font-bold tabular-nums">
              {f.pemakaian.toFixed(2)}
              <span className="text-sm font-medium text-slate-500">
                {" "}
                / {BATAS_HARIAN} m³
              </span>
            </p>
          }
        >
          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${f.alarm ? "bg-red-600" : waspada ? "bg-amber-500" : "bg-blue-600"}`}
              style={{ width: `${persen}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-600">
            <span className="font-medium">{persen.toFixed(1)}% used</span>
          </div>
        </Card>

        <div className="flex justify-between">
          <ParameterCard
            ikon={Droplet}
            aksen={f.debit > QN ? "red" : "blue"}
            judul="FlowRate"
            nilai={f.debit.toFixed(2)}
            satuan="m³/jam"
          />
          <ParameterCard
            ikon={Gauge}
            aksen={tekananBuruk ? "red" : "green"}
            judul="Pressure"
            nilai={f.tekanan.toFixed(2)}
            satuan="bar"
            keterangan={
              tekananTinggi
                ? "Too High"
                : tekananRendah
                  ? "Too Low"
                  : `Spec ${TEKANAN_MIN} – ${TEKANAN_MAX} bar`
            }
          />
          <ParameterCard
            ikon={Gauge}
            aksen={f.alarm ? "red" : waspada ? "amber" : "green"}
            judul="Remaining "
            nilai={sisa.toFixed(1)}
            satuan="m³"
          />
          <ParameterCard
            ikon={Activity}
            aksen={f.alarm ? "red" : waspada ? "amber" : "green"}
            judul="Status"
            nilai={f.alarm ? "Danger" : waspada ? "Warning" : "Normal"}
            footer={
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${f.pompaNyala ? "bg-emerald-500" : "bg-slate-400"}`}
                />
                {f.pompaNyala ? "Running" : "Stop"}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
