import { Waves, LayoutDashboard, FileText, BellRing } from "lucide-react";

const MENU = [
  { id: "dashboard", label: "Dashboard", ikon: LayoutDashboard },
  { id: "report", label: "Report", ikon: FileText },
  { id: "alarm", label: "Alarm", ikon: BellRing },
];

// Menu samping (gelap). Di layar kecil hanya tampil ikon.
export default function Sidebar({ halaman, setHalaman, alarm }) {
  return (
    <aside className="flex w-16 shrink-0 flex-col bg-[#0c1b3d] md:w-44">
      <div className="flex h-19 items-center justify-center text-sky-300">
        <Waves size={40} />
      </div>
      <div className="flex flex-col gap-1 px-2 pt-2">
        {MENU.map(({ id, label, ikon: Ikon }) => (
          <button
            key={id}
            onClick={() => setHalaman(id)}
            className={`flex items-center justify-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium md:justify-start ${
              halaman === id
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            <Ikon size={18} />
            <span className="hidden md:inline">{label}</span>
            {id === "alarm" && alarm && (
              <span className="ml-auto h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
