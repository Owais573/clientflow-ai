import Link from 'next/link';
import { Home, Users, CheckSquare, Settings, Activity } from 'lucide-react';
import './layout.css'; // We will create this for layout-specific styles

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Workflows', href: '/workflows', icon: CheckSquare },
  { name: 'Activity Log', href: '/activities', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">C</div>
        <span className="logo-text">ClientFlow AI</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="nav-item">
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">O</div>
          <div className="user-info">
            <span className="user-name">Owais Ansari</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
