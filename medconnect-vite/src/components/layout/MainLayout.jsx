import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50"> {/* Light slate background, softer on eyes */}
      <Sidebar /> {/* Fixed width sidebar */}
      <div className="flex-1 flex flex-col"> {/* Main content area */}
        <Header />
        <main className="flex-1 p-8 pt-24 overflow-auto"> {/* Extra padding, room for content */}
          <Outlet /> {/* Page content loads here */}
        </main>
      </div>
    </div>
  );
}