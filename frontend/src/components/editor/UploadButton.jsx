export default function UploadButton({ onSelect }) {
  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onSelect(file);
    event.target.value = null;
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
      <span>Upload .txt / .md</span>
      <input
        type="file"
        accept=".txt,.md"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={handleChange}
      />
    </label>
  );
}
