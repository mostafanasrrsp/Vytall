import Sidebar from './sidebar';
import Header from './Header';

export default function MainLayout({ children, title }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64"> {/* ensure sidebar width matches left offset */}
        <Header title={title} />
        <main className="flex-1 p-6 bg-gray-100 pt-20 overflow-auto"> {/* pt-16 matches header height */}
          {children}
        </main>
      </div>
    </div>
  );
}