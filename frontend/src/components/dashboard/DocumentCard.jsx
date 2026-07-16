import ShareButton from './ShareButton';

export default function DocumentCard({ document, onShare, onOpen }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{document.title}</h3>
          <p className="mt-1 text-sm text-slate-500">Last updated {new Date(document.updatedAt).toLocaleDateString()}</p>
          {document.owner && <p className="mt-2 text-sm text-slate-500">Owner: {document.owner.name || 'You'}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpen?.(document._id)}
            className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open
          </button>
          <ShareButton
            onClick={(event) => {
              event.stopPropagation();
              onShare?.(document);
            }}
          />
        </div>
      </div>
    </div>
  );
}
