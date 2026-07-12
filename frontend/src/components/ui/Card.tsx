import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            {title && <h3 className="h3" style={{ marginBottom: '0.25rem' }}>{title}</h3>}
            {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: { 
  title: string; 
  value: string | number; 
  icon: any;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="text-muted text-sm" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{title}</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{value}</h2>
        </div>
        <div style={{ 
          padding: '0.75rem', 
          background: 'hsl(var(--bg-tertiary) / 0.5)', 
          borderRadius: 'var(--radius-lg)',
          color: 'hsl(var(--accent-primary))'
        }}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: trendUp ? 'hsl(var(--accent-green))' : 'hsl(var(--accent-red))', fontWeight: 500 }}>
            {trend}
          </span>
          <span className="text-muted">vs last month</span>
        </div>
      )}
    </div>
  );
}
