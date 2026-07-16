import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-3xl px-5 py-4 text-sm font-medium shadow-lg ${type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
      {message}
    </div>
  );
}
