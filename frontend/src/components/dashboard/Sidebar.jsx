export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900">Mini Docs</h2>
        <p className="mt-2 text-sm text-slate-500">Collaborative editor for notes and docs.</p>
      </div>
      <nav className="space-y-2 text-sm font-medium text-slate-700">
        <button
          onClick={() => setActiveTab('owned')}
          className={`w-full rounded-2xl px-4 py-3 text-left ${
            activeTab === 'owned' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Documents
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`w-full rounded-2xl px-4 py-3 text-left ${
            activeTab === 'shared' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Shared With Me
        </button>
      </nav>
    </aside>
  );
}
