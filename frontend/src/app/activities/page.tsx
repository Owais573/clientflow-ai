import { Card } from '@/components/ui/Card';
import { Activity, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/services/api';

export default async function ActivitiesPage() {
  let activities: any[] = [];
  let clientsMap = new Map();

  try {
    const [activitiesRes, clientsRes] = await Promise.all([
      api.getRecentActivity(), // This fetches from /dashboard/activities
      api.getClients() as any
    ]);
    
    const clients = clientsRes.items || clientsRes;
    clientsMap = new Map(clients.map((c: any) => [c.id, c]));

    activities = activitiesRes.items || activitiesRes;
  } catch (error) {
    console.error("Failed to load activities:", error);
  }

  const getIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle size={18} color="hsl(var(--accent-red))" />;
      case 'warning': return <AlertTriangle size={18} color="hsl(var(--accent-primary))" />;
      case 'info': return <Info size={18} color="hsl(var(--accent-blue))" />;
      default: return <Activity size={18} color="hsl(var(--text-muted))" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="h1" style={{ marginBottom: '0.25rem' }}>Activity Log</h1>
        <p className="text-muted">A complete history of system events and workflow operations.</p>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border-strong))' }}>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500, width: '40px' }}></th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Message</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Client</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Event Type</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                    No activities recorded yet.
                  </td>
                </tr>
              ) : (
                activities.map((act) => {
                  const client = clientsMap.get(act.client_id);
                  return (
                    <tr key={act.id} style={{ 
                      borderBottom: '1px solid hsl(var(--border-light))',
                      transition: 'background 0.2s ease',
                    }} className="activity-row">
                      <td style={{ padding: '1rem' }}>
                        {getIcon(act.level)}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>
                        <div style={{ marginBottom: act.metadata_info ? '0.5rem' : '0' }}>{act.message}</div>
                        {act.metadata_info && Object.keys(act.metadata_info).length > 0 && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            background: 'hsl(var(--bg-tertiary) / 0.5)', 
                            padding: '0.75rem', 
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid hsl(var(--border-light))',
                            color: 'hsl(var(--text-secondary))',
                            marginTop: '0.5rem',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                          }}>
                            {JSON.stringify(act.metadata_info, null, 2)}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {client ? (
                          <Link href={`/clients/${client.id}`} style={{ color: 'hsl(var(--accent-blue))' }}>
                            {client.company_name}
                          </Link>
                        ) : (
                          <span className="text-muted">Unknown Client</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {act.event_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
                        {new Date(act.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        .activity-row:hover {
          background: hsl(var(--bg-tertiary) / 0.3);
        }
      `}} />
    </div>
  );
}
