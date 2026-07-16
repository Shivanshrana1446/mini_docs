import DocumentCard from './DocumentCard';

export default function DocumentList({ title, documents, onShare, onOpen, onCreate }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <span className="text-sm text-slate-500">{documents.length} docs</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            <p className="text-sm">No documents yet. Create your first document to start writing and formatting content in the browser.</p>
            {onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="mt-6 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Document
              </button>
            )}
          </div>
        ) : (
          documents.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              onShare={onShare}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </section>
  );
}
