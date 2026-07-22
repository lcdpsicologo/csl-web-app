export default function AttendanceCartLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8dc] px-6">
      <div className="rounded-3xl border border-amber-200 bg-white px-8 py-7 text-center shadow-xl shadow-amber-900/10">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-blue-900" />
        <p className="mt-4 font-bold text-blue-950">Preparando el carrito…</p>
      </div>
    </main>
  );
}
