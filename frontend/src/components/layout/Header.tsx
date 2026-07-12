import { Search, Bell } from 'lucide-react';
import Link from 'next/link';
import './layout.css';

export default function Header() {
  return (
    <header className="header glass-panel">
      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search clients, workflows..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <Link href="/clients/new" className="btn btn-primary animate-fade-in">
          + New Client
        </Link>
      </div>
    </header>
  );
}
