import { useAuth } from '../../contexts/AuthContext';

export default function AuthHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="text-lg font-semibold text-slate-900">{user.name}</p>
      </div>
      <button
        onClick={logout}
        className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
      >
        Logout
      </button>
    </header>
  );
}
