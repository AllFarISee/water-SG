import { BATAS_HARIAN, BATAS_PERINGATAN } from "../config";

const YMAX = 80;
const TICKS = [0, 20, 40, 60, 80];
const WARNA = {
  normal: "bg-blue-600",
  waspada: "bg-amber-500",
  limit: "bg-red-600",
};
const persen = (v) => `${(v / YMAX) * 100}%`;

export default function BarChartHarian({ data }) {
  return (
    <div className="flex min-h-0 flex-1 gap-2">
      <div className="flex flex-col-reverse justify-between pb-6 text-right text-xs text-slate-500">
        {TICKS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative min-h-40 flex-1 border-b border-l border-slate-300">
          {/* garis bantu */}
          {TICKS.slice(1).map((t) => (
            <div
              key={t}
              className="absolute inset-x-0 border-t border-slate-100"
              style={{ bottom: persen(t) }}
            />
          ))}
          {/* garis batas */}
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-red-500"
            style={{ bottom: persen(BATAS_HARIAN) }}
          >
            <span className="absolute right-1 -top-4 text-[10px] font-semibold text-red-600">
              Pump Off {BATAS_HARIAN}
            </span>
          </div>
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-amber-500"
            style={{ bottom: persen(BATAS_PERINGATAN) }}
          >
            <span className="absolute left-1 top-0.5 text-[10px] font-semibold text-amber-600">
              Alert {BATAS_PERINGATAN}
            </span>
          </div>

          {/* batang */}
          <div className="absolute inset-0 flex items-end gap-1 px-1">
            {data.map((d) => (
              <div
                key={d.tanggal.getTime()}
                className="flex h-full flex-1 flex-col justify-end"
                title={`${d.tanggal.toLocaleDateString("id-ID")}: ${d.pemakaian.toFixed(2)} m³`}
              >
                <span className="mb-0.5 text-center text-[10px] font-semibold text-slate-700">
                  {d.pemakaian.toFixed(1)}
                </span>
                <div
                  className={`w-full rounded-t ${WARNA[d.status]} ${d.hariIni ? "opacity-70" : ""}`}
                  style={{ height: persen(d.pemakaian) }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* label tanggal */}
        <div className="mt-1 flex gap-1 px-1 text-[10px] text-slate-500">
          {data.map((d) => (
            <span
              key={d.tanggal.getTime()}
              className={`flex-1 text-center ${d.hariIni ? "font-bold text-slate-900" : ""}`}
            >
              {d.hariIni
                ? "Today"
                : d.tanggal.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
