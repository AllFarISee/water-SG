// aksen = warna garis kiri & ikon: "blue" | "green" | "amber" | "red"
const AKSEN = {
  blue: ["border-blue-600", "bg-blue-50 text-blue-600"],
  green: ["border-emerald-500", "bg-emerald-50 text-emerald-600"],
  amber: ["border-amber-500", "bg-amber-50 text-amber-600"],
  red: ["border-red-600", "bg-red-50 text-red-600"],
};

// Kartu satu parameter: ikon, judul, angka besar, keterangan, footer
export default function ParameterCard({
  ikon: Ikon,
  judul,
  nilai,
  satuan,
  keterangan,
  footer,
  aksen = "green",
}) {
  const [garis, ikonWarna] = AKSEN[aksen];
  return (
    <div
      className={`flex flex-col justify-start w-45 h-50 rounded-xl border border-l-4 border-slate-100 bg-white p-4 shadow-sm ${garis}`}
    >
      <div className="flex gap-2 items-center">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${ikonWarna}`}
        >
          <Ikon size={16} />
        </span>
        <p className="text-lg font-semibold text-slate-800">{judul}</p>
      </div>
      <p className="mt-6 text-3xl font-bold tabular-nums text-slate-900 xl:text-4xl">
        {nilai}
        <span className="text-base font-medium text-slate-600">{satuan}</span>
      </p>
      <p className="text-sm mt-6 text-slate-500">{keterangan}</p>
      <div className="mt-4">{footer}</div>
    </div>
  );
}
