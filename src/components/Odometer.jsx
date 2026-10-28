// Angka meteran seperti di flowmeter: 00098.0246 (kotak merah = desimal)
export default function Odometer({ nilai }) {
  const teks = nilai.toFixed(4).padStart(10, "0");
  return (
    <div className="flex items-center gap-1.5 font-mono sm:gap-2">
      {teks.split("").map((c, i) =>
        c === "." ? (
          <span key={i} className="text-2xl font-bold text-slate-800">
            ·
          </span>
        ) : (
          <span
            key={i}
            className={`flex w-9 items-center justify-center rounded-md py-2 text-3xl font-bold text-white shadow-md sm:w-12 xl:w-14 xl:py-3 xl:text-5xl ${
              i > 5 ? "bg-red-600" : "bg-slate-900"
            }`}
          >
            {c}
          </span>
        ),
      )}
      <span className="pl-1 text-xl font-semibold text-slate-700">m³</span>
    </div>
  );
}
