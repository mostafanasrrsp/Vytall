// src/components/layout/Header.jsx
export default function Header({ title }) {
  return (
    <header className="h-16 bg-white shadow-md flex items-center px-6 fixed left-64 right-0 top-0 z-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="ml-auto flex items-center">
        <span className="mr-4">John Doe</span>
        <button className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
}