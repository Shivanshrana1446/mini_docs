import { useEffect, useState } from 'react';
import { fetchDocuments, createDocument } from '../api/documents';

export default function useDocuments() {
  const [documents, setDocuments] = useState({ owned: [], shared: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const addDocument = async (title = 'New Document', content = '') => {
    const newDoc = await createDocument(title, content);
    setDocuments((prev) => ({
      ...prev,
      owned: [newDoc, ...prev.owned]
    }));
    return newDoc;
  };

  return { documents, loading, error, addDocument, refresh: loadDocuments };
}
