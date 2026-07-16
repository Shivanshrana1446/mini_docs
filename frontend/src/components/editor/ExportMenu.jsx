import { useEffect, useRef, useState } from 'react';

export default function ExportMenu({ onExportPdf, onExportMd, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-200"
      >
        {loading ? 'Exporting...' : 'Export ▼'}
      </button>

      {open && !loading && (
        <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExportPdf();
            }}
            className="w-full rounded-t-3xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
          >
            Export as PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExportMd();
            }}
            className="w-full rounded-b-3xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
          >
            Export as Markdown
          </button>
        </div>
      )}
    </div>
  );
}
