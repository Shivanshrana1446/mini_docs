import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import Sidebar from '../components/dashboard/Sidebar';
import DocumentList from '../components/dashboard/DocumentList';
import ShareModal from '../components/dashboard/ShareModal';
import FileUpload from '../components/editor/FileUpload';
import useDocuments from '../hooks/useDocuments';
import { importFile } from '../api/files';
import { shareDocument } from '../api/share';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { documents, loading, error, addDocument, refresh } = useDocuments();
  const [activeTab, setActiveTab] = useState('owned');
  const [sharingDoc, setSharingDoc] = useState(null);
  const [shareError, setShareError] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  const handleShare = async (email) => {
    if (!sharingDoc) return;

    setShareError('');
    setShareSuccess('');
    setShareLoading(true);

    try {
      await shareDocument(sharingDoc._id, email);
      setShareSuccess('Document shared successfully.');
      refresh();
    } catch (err) {
      setShareError(err.response?.data?.message || 'Unable to share document');
    } finally {
      setShareLoading(false);
    }
  };

  const [importError, setImportError] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  const handleNewDocument = async () => {
    const name = window.prompt('Enter a name for your new document:');
    if (name === null) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      window.alert('Document name cannot be empty.');
      return;
    }

    const newDoc = await addDocument(trimmedName);
    if (newDoc?._id) {
      navigate(`/documents/${newDoc._id}`);
    }
  };

  const handleImportDocument = async (file) => {
    setImportError('');
    setImportLoading(true);

    if (!file.name.match(/\.(txt|md)$/i)) {
      setImportError('Only .txt and .md files are supported.');
      setImportLoading(false);
      return;
    }

    try {
      const response = await importFile(file);
      const content = response.content || '';
      const title = response.fileName.replace(/\.(txt|md)$/i, '') || 'Imported Document';
      const newDoc = await addDocument(title, content);
      if (newDoc?._id) {
        navigate(`/documents/${newDoc._id}`);
      }
    } catch (err) {
      setImportError(err.response?.data?.message || 'Unable to import file.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleOpenDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AuthHeader />
      <div className="flex min-h-[calc(100vh-72px)] flex-col lg:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">My documents</h1>
              <p className="mt-2 text-sm text-slate-500">
                Create, rename, and edit documents in the browser. Import a .txt or .md file to turn it into a new editable document.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleNewDocument}
                className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Document
              </button>
              <FileUpload onImport={handleImportDocument} disabled={importLoading} />
            </div>
          </div>

          {importError && (
            <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {importError}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading documents...</div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
          ) : (
            <>
              {activeTab === 'owned' ? (
                <DocumentList
                  title="My Documents"
                  documents={documents.owned}
                  onShare={setSharingDoc}
                  onOpen={handleOpenDocument}
                  onCreate={handleNewDocument}
                />
              ) : (
                <DocumentList
                  title="Shared With Me"
                  documents={documents.shared}
                  onOpen={handleOpenDocument}
                />
              )}
            </>
          )}
        </main>
      </div>

      <ShareModal
        isOpen={Boolean(sharingDoc)}
        onClose={() => {
          setSharingDoc(null);
          setShareError('');
          setShareSuccess('');
        }}
        onShare={handleShare}
        loading={shareLoading}
        error={shareError}
        success={shareSuccess}
      />
    </div>
  );
}
