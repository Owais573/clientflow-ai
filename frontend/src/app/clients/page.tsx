import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api, Client } from '@/services/api';
import ClientTableBody from './ClientTableBody';

export default async function ClientsPage() {
  let clients: Client[] = [];

  try {
    const response = await api.getClients() as any;
    clients = response.items || response;
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
            <ClientTableBody initialClients={clients} />
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
