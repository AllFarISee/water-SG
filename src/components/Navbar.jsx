import { useState, useEffect } from "react";
import { Calendar, Bell, User } from "lucide-react";

// Header atas: judul, status pompa, tanggal & jam, notifikasi
export default function Navbar({ pompaNyala, alarm }) {
  const [jam, setJam] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setJam(new Date()));
    return () => clearInterval(t);
  }, []);
  return (
    <header className="flex h-19 shrink-0 items-center gap-4 bg-linear-to-r from-[#14264f] to-[#2b4170] px-5 text-white">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold">Softgel Water Control</h1>
        <p className="truncate text-sm text-sky-200">
          NAGEN LXSG-50 · Qn 15 m³ · PN 16 bar
        </p>
      </div>

      <div className="ml-auto flex items-center gap-4 text-sm">
        <span
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-semibold ${pompaNyala ? "bg-emerald-500" : "bg-slate-500"}`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
          Pump {pompaNyala ? "On" : "Off"}
        </span>
        <span className="hidden items-center gap-2 text-sky-100 sm:flex">
          <Calendar size={16} />
          {jam.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          <span className="font-mono tabular-nums">
            {jam.toLocaleTimeString("en-GB")}
          </span>
        </span>
        <span className="relative">
          <Bell size={20} />
          {alarm && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          )}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400/60">
          <User size={18} />
        </span>
      </div>
    </header>
  );
}
