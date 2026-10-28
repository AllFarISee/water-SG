export default function Card({
  ikon: Ikon,
  judul,
  subjudul,
  aksi,
  className = "",
  children,
}) {
  return (
    <section
      className={`flex min-h-0 flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}
    >
      {judul && (
        <div className="mb-3 flex items-center gap-3">
          {Ikon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900 text-white">
              <Ikon size={18} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-bold leading-tight text-slate-900">{judul}</h2>
            {subjudul && <p className="text-xs text-slate-500">{subjudul}</p>}
          </div>
          {aksi && <div className="ml-auto">{aksi}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
