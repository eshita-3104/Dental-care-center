import { useState} from 'react';
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PatientProvider } from '../../context/PatientContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const linkStyle = "block px-4 py-2 text-gray-200 rounded-md hover:bg-sky-700 hover:text-white transition-colors";
  const activeLinkStyle = { backgroundColor: '#0284c7', color: 'white' };

  return (
    <div className="relative min-h-screen lg:flex">
      <div className="bg-gray-800 text-gray-100 flex justify-between lg:hidden">
        <span className="block p-4 text-white font-bold">Dental Care Centre Admin</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-4 focus:outline-none focus:bg-gray-700">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className={`flex flex-col w-64 bg-gray-800 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-20`}>
        <div className="hidden lg:flex items-center justify-center h-16 bg-gray-900">
          <span className="text-2xl font-bold text-white">Dental Care Centre Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <NavLink to="/dashboard" className={linkStyle} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
          <NavLink to="/patients" className={linkStyle} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Patients</NavLink>
          <NavLink to="/calendar" className={linkStyle} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Calendar</NavLink>
        </nav>
        <div className="px-2 py-4">
          <button onClick={handleLogout} className="w-full px-4 py-2 font-bold text-left text-gray-200 rounded-md hover:bg-red-600">Log Out</button>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        <PatientProvider>{children}</PatientProvider>
      </main>
    </div>
  );
}