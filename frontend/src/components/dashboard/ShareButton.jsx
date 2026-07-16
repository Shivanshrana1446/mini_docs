export default function ShareButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Share
    </button>
  );
}
