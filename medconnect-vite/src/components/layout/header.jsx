import { useAuth } from '../../login/AuthContext';

export default function Header({ title }) {
  const { user, logout } = useAuth();
  const username = user?.username || "User";

  return (
    <header className="h-16 bg-white shadow-md flex items-center px-6 fixed left-64 right-0 top-0 z-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="ml-auto flex items-center">
        <span className="mr-4">{username}</span>
        <button onClick={logout} className="bg-[#c9302c] text-white px-3 py-1 rounded-full">
          Logout
        </button>
      </div>
    </header>
  );
}