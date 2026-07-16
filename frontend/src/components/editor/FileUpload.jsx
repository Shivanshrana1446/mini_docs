export default function FileUpload({ onImport, disabled = false }) {
  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onImport(file);
    event.target.value = null;
  };

  return (
    <div className={`relative inline-flex items-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${disabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}>
      Import .txt / .md
      <input
        type="file"
        accept=".txt,.md"
        disabled={disabled}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={handleChange}
      />
    </div>
  );
}
