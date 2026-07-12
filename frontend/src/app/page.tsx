import { Users, Activity as ActivityIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/services/api';

// This is a Server Component, it fetches data securely on the server
export default async function DashboardPage() {
  let stats = { total_clients: 0, active_workflows: 0, completed_workflows: 0, failed_workflows: 0 };
  let activities: any[] = [];

  try {
    stats = await api.getDashboardStats();
    const activitiesResponse = await api.getRecentActivity();
    activities = activitiesResponse.items || [];
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="h1">Dashboard Overview</h1>
        <p className="text-muted">Welcome back! Here's what's happening with your clients today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="Total Clients" 
          value={stats.total_clients} 
          icon={Users} 
          trend="+2" 
          trendUp={true} 
        />
        <StatCard 
          title="Active Pipelines" 
          value={stats.active_workflows} 
          icon={ActivityIcon} 
        />
        <StatCard 
          title="Completed Onboardings" 
          value={stats.completed_workflows} 
          icon={CheckCircle} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          title="Action Required" 
          value={stats.failed_workflows} 
          icon={AlertTriangle} 
          trend="-1" 
          trendUp={true} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card title="Recent Activity" subtitle="Real-time events from your workflows">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.length === 0 ? (
              <p className="text-muted text-sm">No recent activity.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} style={{ 
                  display: 'flex', gap: '1rem', padding: '1rem', 
                  background: 'hsl(var(--bg-tertiary) / 0.3)', 
                  borderRadius: 'var(--radius-md)',
                  borderLeft: act.level === 'error' ? '3px solid hsl(var(--accent-red))' : '3px solid hsl(var(--accent-blue))'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{act.message}</p>
                    <p className="text-muted text-xs">{new Date(act.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <StatusBadge status={act.level === 'error' ? 'failed' : 'completed'} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Active Workflows" subtitle="Pipelines currently running" action={<button className="btn btn-ghost text-sm">View All</button>}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem 0' }}>
             <ActivityIcon size={48} color="hsl(var(--text-tertiary))" />
             <p className="text-muted text-sm">All workflows are running smoothly.</p>
           </div>
        </Card>
      </div>
    </div>
  );
}
