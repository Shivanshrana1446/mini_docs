import { useAuth } from '../../contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="rounded-full bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
