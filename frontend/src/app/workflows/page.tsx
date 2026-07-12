import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Activity } from 'lucide-react';
import Link from 'next/link';

export default async function WorkflowsPage() {
  let workflows: any[] = [];

  try {
    // Mock data for UI layout
    workflows = [
      { id: 101, client_id: 1, company_name: "Acme Corp", status: "completed", current_step: "n8n_pipeline_completed", started_at: new Date(Date.now() - 3600000).toISOString(), n8n_execution_id: "12345" },
      { id: 102, client_id: 2, company_name: "Globex Inc", status: "running", current_step: "generating_proposal", started_at: new Date(Date.now() - 1800000).toISOString(), n8n_execution_id: null },
      { id: 103, client_id: 3, company_name: "Initech", status: "failed", current_step: "zoho_sync", started_at: new Date(Date.now() - 7200000).toISOString(), n8n_execution_id: null },
    ];
  } catch (error) {
    console.error("Failed to load workflows:", error);
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="h1" style={{ marginBottom: '0.25rem' }}>Workflow History</h1>
        <p className="text-muted">Monitor all active and past onboarding pipelines.</p>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border-strong))' }}>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>ID</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Client</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Current Step</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Started</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>n8n</th>
              </tr>
            </thead>
            <tbody>
              {workflows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                    No workflows found.
                  </td>
                </tr>
              ) : (
                workflows.map((wf) => (
                  <tr key={wf.id} style={{ 
                    borderBottom: '1px solid hsl(var(--border-light))',
                    transition: 'background 0.2s ease',
                  }} className="workflow-row">
                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'hsl(var(--text-tertiary))' }}>
                      #{wf.id}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Link href={`/clients/${wf.client_id}`} style={{ fontWeight: 600, color: 'hsl(var(--accent-blue))' }}>
                        {wf.company_name}
                      </Link>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {wf.status === 'running' && <Activity size={14} className="animate-pulse" style={{ color: 'hsl(var(--accent-blue))' }} />}
                        <span style={{ fontSize: '0.875rem' }}>{wf.current_step.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={wf.status} />
                    </td>
                    <td style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
                      {new Date(wf.started_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {wf.n8n_execution_id ? (
                         <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '4px', color: 'hsl(var(--text-secondary))' }}>
                           Exec: {wf.n8n_execution_id}
                         </span>
                      ) : (
                        <span className="text-muted text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        .workflow-row:hover {
          background: hsl(var(--bg-tertiary) / 0.3);
        }
      `}} />
    </div>
  );
}
