import Link from 'next/link';
import { Plus, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api, Client } from '@/services/api';

export default async function ClientsPage() {
  let clients: Client[] = [];

  try {
    // In production, uncomment:
    // clients = await api.getClients();
    
    // Mock data for UI development
    clients = [
      { id: 1, company_name: "Acme Corp", contact_name: "Jane Doe", email: "jane@acme.com", status: "onboarded", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 2, company_name: "Globex Inc", contact_name: "John Smith", email: "john@globex.com", status: "running", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 3, company_name: "Initech", contact_name: "Peter Gibbons", email: "peter@initech.com", status: "pending", created_at: new Date().toISOString() },
    ];
  } catch (error) {
    console.error("Failed to load clients:", error);
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="h1" style={{ marginBottom: '0.25rem' }}>Clients</h1>
          <p className="text-muted">Manage your client onboarding pipeline.</p>
        </div>
        <Link href="/clients/new" className="btn btn-primary">
          <Plus size={18} />
          <span>New Client</span>
        </Link>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border-strong))' }}>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Company</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Contact</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Added</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                    No clients found. Add one to get started.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} style={{ 
                    borderBottom: '1px solid hsl(var(--border-light))',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }} className="client-row">
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{client.company_name}</div>
                      <div className="text-muted text-sm">{client.industry || 'Unknown Industry'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{client.contact_name}</div>
                      <div className="text-muted text-sm">{client.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={client.status} />
                    </td>
                    <td style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Link href={`/clients/${client.id}`} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                        <MoreVertical size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Adding a small inline style for the row hover effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .client-row:hover {
          background: hsl(var(--bg-tertiary) / 0.3);
        }
      `}} />
    </div>
  );
}
