import { EditorContent } from '@tiptap/react';

export default function DocumentEditor({ editor }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="prose prose-slate max-w-full">
        <EditorContent editor={editor} className="min-h-[60vh] focus:outline-none" />
      </div>
    </div>
  );
}
