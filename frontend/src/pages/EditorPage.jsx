import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import History from '@tiptap/extension-history';
import AuthHeader from '../components/auth/AuthHeader';
import EditorToolbar from '../components/editor/EditorToolbar';
import ExportMenu from '../components/editor/ExportMenu';
import DocumentEditor from '../components/editor/DocumentEditor';
import UploadButton from '../components/editor/UploadButton';
import Toast from '../components/ui/Toast';
import { fetchDocument, updateDocument } from '../api/documents';
import { importFile } from '../api/files';
import { exportMarkdown, exportPdf } from '../utils/exportDocument';
import { getDraft, removeDraft, saveDraft } from '../utils/draftStorage';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentTitle, setDocumentTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [status, setStatus] = useState('Loading document...');
  const [saving, setSaving] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const autosaveTimer = useRef(null);
  const titleInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2] }),
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      History
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setInitialContent(html);
      setStatus('Unsaved changes…');
      saveDraft(id, { title: documentTitle, content: html });
    },
    editable: true
  });

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const data = await fetchDocument(id);
        const draft = getDraft(id);
        const content = draft?.content ?? data.content ?? '';
        const title = draft?.title ?? data.title ?? '';

        setDocumentTitle(title);
        setInitialContent(content);
        setStatus('Document loaded');
        setDocumentLoaded(true);

        if (editor) {
          editor.commands.setContent(content);
        }

        if (draft) {
          setToast({ message: 'Loaded saved draft', type: 'success' });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load document');
      }
    };

    loadDocument();
  }, [id, editor]);

  useEffect(() => {
    if (!editor || error || !documentLoaded) return;

    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      if (!documentTitle && !initialContent) return;
      setSaving(true);
      try {
        const updated = await updateDocument(id, { title: documentTitle, content: initialContent });
        setStatus('Saved ✓');
        setDocumentTitle(updated.title);
        removeDraft(id);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to save document');
        setStatus('Save failed');
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(autosaveTimer.current);
  }, [documentTitle, initialContent, id, editor, error, documentLoaded]);

  const handleExport = async (type) => {
    if (!editor) return;

    setExportLoading(true);
    try {
      const contentElement = document.querySelector('.ProseMirror');
      const title = documentTitle || 'Untitled document';

      if (!contentElement) {
        throw new Error('Editor content not ready');
      }

      if (type === 'pdf') {
        await exportPdf(contentElement, title);
      } else {
        await exportMarkdown(contentElement, title);
      }

      setToast({ message: `Exported ${type === 'pdf' ? 'PDF' : 'Markdown'} successfully`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Export failed', type: 'error' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleManualSave = async () => {
    if (!editor) return;

    setSaving(true);
    try {
      const updated = await updateDocument(id, { title: documentTitle, content: initialContent });
      setStatus('Saved ✓');
      setDocumentTitle(updated.title);
      removeDraft(id);
      setToast({ message: 'Document saved successfully.', type: 'success' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save document');
      setStatus('Save failed');
      setToast({ message: 'Unable to save document.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const focusTitle = () => {
    titleInputRef.current?.focus();
  };

  const handleUpload = async (file) => {
    console.log('handleUpload start', file);
    setUploadError('');
    if (!file.name.match(/\.(txt|md)$/i)) {
      const message = 'Only .txt and .md files are supported.';
      setUploadError(message);
      setToast({ message, type: 'error' });
      console.log('handleUpload unsupported file', file.name);
      return;
    }

    try {
      const data = await importFile(file);
      console.log('importFile response', data);
      const importedContent = data.content || '';
      const currentContent = editor?.getHTML() ?? '';
      const shouldAppend = currentContent.trim() !== '' && importedContent.trim() !== '';
      let finalContent = importedContent;

      if (editor) {
        if (shouldAppend) {
          const append = window.confirm(
            'Append imported document content to the existing content? Click Cancel to replace existing content.'
          );
          console.log('confirm append', append);
          if (append) {
            finalContent = `${currentContent}\n\n${importedContent}`;
          }
        }

        editor.chain().focus().setContent(finalContent).run();
      }

      setDocumentTitle((prev) => prev || data.fileName.replace(/\.(txt|md)$/i, ''));
      setInitialContent(finalContent);
      setStatus('Imported file content');
      setToast({ message: 'File imported successfully', type: 'success' });
      console.log('handleUpload finished success');

      if (id) {
        try {
          await updateDocument(id, {
            title: documentTitle || data.fileName.replace(/\.(txt|md)$/i, ''),
            content: finalContent
          });
          setStatus('Imported file saved');
        } catch (saveErr) {
          console.error('handleUpload save error', saveErr);
          setUploadError('Imported content saved locally but failed to save immediately.');
          setToast({ message: 'Import saved locally but not to server.', type: 'warning' });
        }
      }
    } catch (err) {
      console.error('handleUpload error', err);
      const message = err?.response?.data?.message || err?.message || 'Unable to import file';
      setUploadError(message);
      setToast({ message, type: 'error' });
    }
  };

  const toolbar = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-3">
        <EditorToolbar editor={editor} />
        <ExportMenu
          onExportPdf={() => handleExport('pdf')}
          onExportMd={() => handleExport('md')}
          disabled={exportLoading || !editor}
          loading={exportLoading}
        />
      </div>
    ),
    [editor, exportLoading]
  );

  const renderToast = () => {
    if (!toast.message) return null;
    return <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100">
        <AuthHeader />
        <div className="p-6 text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AuthHeader />
      <div className="p-6">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={titleInputRef}
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Untitled document"
                  className="w-full max-w-2xl bg-transparent text-3xl font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={focusTitle}
                  className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">{status}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {toolbar}
          <div className="flex flex-wrap items-center gap-3">
            <UploadButton onSelect={handleUpload} />
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {uploadError}
          </div>
        )}

        <DocumentEditor editor={editor} />
      </div>
      {renderToast()}
    </div>
  );
}
