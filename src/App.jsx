import { useState } from "react";
import useFlowmeter from "./hooks/useFlowmeter";
import { BATAS_HARIAN, JAM_RESET } from "./config";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Alarm from "./pages/Alarm";

const HALAMAN = { dashboard: Dashboard, report: Report, alarm: Alarm };

export default function App() {
  const [halaman, setHalaman] = useState("dashboard");
  const f = useFlowmeter(); 
  const Isi = HALAMAN[halaman];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 lg:h-screen lg:overflow-hidden">
      <Sidebar halaman={halaman} setHalaman={setHalaman} alarm={f.alarm} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar pompaNyala={f.pompaNyala} alarm={f.alarm} />

        {f.alarm && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-red-700 px-4 py-2 text-white">
            <p className="animate-pulse font-semibold">
              ALARM: Daily limit {BATAS_HARIAN} m³ reached out ({f.pemakaian.toFixed(2)}{" "}
              m³). Pump OFF automatically and locked until{" "}
              {String(JAM_RESET).padStart(2, "0")}:00
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => f.setSenyap(true)}
                disabled={f.senyap}
                className="rounded bg-white/20 px-3 py-1 text-sm font-semibold disabled:opacity-50"
              >
                {f.senyap ? "Suara dimatikan" : "Matikan suara"}
              </button>
            </div>
          </div>
        )}

        <main className="min-h-0 flex-1 p-3">
          <Isi f={f} />
        </main>
      </div>
    </div>
  );
}
