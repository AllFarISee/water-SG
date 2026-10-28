import {
  FileText,
  CalendarDays,
  Download,
  Droplet,
  TrendingUp,
  ShieldAlert,
  Gauge,
} from "lucide-react";
import { BATAS_HARIAN, JAM_RESET } from "../config";
import {
  ambilRiwayatHarian,
  tanggalOperasional,
  statusPemakaian,
} from "../services/laporan";
import Card from "../components/Card";
import ParameterCard from "../components/ParameterCard";
import BarChartHarian from "../components/BarChartHarian";

const STATUS = {
  normal: ["Normal", "bg-emerald-100 text-emerald-700"],
  waspada: ["warning", "bg-amber-100 text-amber-700"],
  limit: ["Danger", "bg-red-100 text-red-700"],
};
const jam = String(JAM_RESET).padStart(2, "0");

function unduhCSV(baris) {
  const isi = [
    "Date, Used (m3), % From Limit, Status",
    ...baris.map(
      (r) =>
        `${r.tanggal.toISOString().slice(0, 10)},${r.pemakaian.toFixed(2)},${((r.pemakaian / BATAS_HARIAN) * 100).toFixed(1)}%,${STATUS[r.status][0]}`,
    ),
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([isi], { type: "text/csv" }));
  a.download = "daily-report.csv";
  a.click();
}

export default function Report({ f }) {
  const data = [
    ...ambilRiwayatHarian(13),
    {
      tanggal: tanggalOperasional(),
      pemakaian: Math.max(f.pemakaian, 0),
      hariIni: true,
    },
  ].map((r) => ({ ...r, status: statusPemakaian(r.pemakaian) }));

  const total = data.reduce((s, r) => s + r.pemakaian, 0);
  const rata = total / data.length;
  const tertinggi = data.reduce((a, b) => (b.pemakaian > a.pemakaian ? b : a));
  const jumlahLimit = data.filter((r) => r.status === "limit").length;
  const tgl = (d) =>
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center gap-30 mb-4">
        <ParameterCard
          ikon={Droplet}
          aksen="blue"
          judul="Today Used"
          nilai={f.pemakaian.toFixed(2)}
          satuan="m³"
          keterangan={`${((f.pemakaian / BATAS_HARIAN) * 100).toFixed(1)}% from limit ${BATAS_HARIAN} m³`}
        />
        <ParameterCard
          ikon={Gauge}
          aksen="green"
          judul="Average"
          nilai={rata.toFixed(1)}
          satuan="m³"
          keterangan={`Last ${data.length} day`}
        />
        <ParameterCard
          ikon={TrendingUp}
          aksen="amber"
          judul="Peak Used"
          nilai={tertinggi.pemakaian.toFixed(1)}
          satuan="m³"
          keterangan={tertinggi.hariIni ? "Hari ini" : tgl(tertinggi.tanggal)}
        />
        <ParameterCard
          ikon={ShieldAlert}
          aksen={jumlahLimit ? "red" : "green"}
          judul="Limit days"
          nilai={jumlahLimit}
          satuan="day"
          keterangan={`Usage Reaches ${BATAS_HARIAN} m³`}
        />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-12">
        <Card
          ikon={CalendarDays}
          judul="Daily Usage"
          subjudul={`Operational Hour: ${jam}:00 AM – ${jam}:00 PM`}
          className="lg:col-span-7 text-xl"
        >
          <BarChartHarian data={data} />
        </Card>

        <Card
          ikon={FileText}
          judul="Daily Report"
          className="lg:col-span-5 text-xl"
          aksi={
            <button
              onClick={() => unduhCSV(data)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <Download size={14} /> CSV
            </button>
          }
        >
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2 text-right">Usage</th>
                  <th className="p-2 text-right">% Percentage</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((r) => (
                  <tr
                    key={r.tanggal.getTime()}
                    className="border-t border-slate-100"
                  >
                    <td className="whitespace-nowrap p-2">
                      {r.tanggal.toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      {r.hariIni && (
                        <span className="ml-1 text-xs font-semibold text-blue-600">
                          (running)
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-right tabular-nums">
                      {r.pemakaian.toFixed(2)} m³
                    </td>
                    <td className="p-2 text-right tabular-nums">
                      {((r.pemakaian / BATAS_HARIAN) * 100).toFixed(0)}%
                    </td>
                    <td className="p-2">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS[r.status][1]}`}
                      >
                        {STATUS[r.status][0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
