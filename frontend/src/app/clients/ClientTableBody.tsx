"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api, Client } from '@/services/api';

export default function ClientTableBody({ initialClients }: { initialClients: Client[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const confirmDelete = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation();
    setClientToDelete(client);
  };

  const executeDelete = async () => {
    if (!clientToDelete) return;
    const id = clientToDelete.id;
    
    try {
      setDeletingId(id);
      await api.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Failed to delete client. Check console for details.");
    } finally {
      setDeletingId(null);
      setClientToDelete(null);
    }
  };

  if (clients.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
            No clients found. Add one to get started.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <>
      <tbody>
      {clients.map((client) => (
        <tr 
          key={client.id} 
          onClick={() => router.push(`/clients/${client.id}`)}
          style={{ 
            borderBottom: '1px solid hsl(var(--border-light))',
            transition: 'background 0.2s ease',
            cursor: 'pointer'
          }} 
          className="client-row"
        >
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
            <button 
              onClick={(e) => confirmDelete(e, client)}
              className="btn btn-ghost" 
              style={{ padding: '0.5rem', color: 'hsl(var(--accent-red))' }}
              disabled={deletingId === client.id}
            >
              {deletingId === client.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
      {clientToDelete && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50
        }} onClick={() => setClientToDelete(null)}>
          <div style={{
            background: 'hsl(var(--bg-secondary))',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '450px',
            border: '1px solid hsl(var(--border-light))',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--accent-red))' }}>
                <AlertTriangle size={24} />
                <h3 className="h3" style={{ margin: 0 }}>Delete Client?</h3>
              </div>
              <button onClick={() => setClientToDelete(null)} className="icon-btn text-muted">
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Are you sure you want to permanently delete <strong>{clientToDelete.company_name}</strong>? 
              This will cascade and delete all associated workflows, research, proposals, and permanently wipe the Lead from Zoho CRM.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn btn-ghost" onClick={() => setClientToDelete(null)} disabled={deletingId !== null}>
                Cancel
              </button>
              <button className="btn" style={{ background: 'hsl(var(--accent-red))', color: 'white' }} onClick={executeDelete} disabled={deletingId !== null}>
                {deletingId !== null ? (
                  <><Loader2 size={16} className="animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 size={16} /> Yes, Delete</>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
