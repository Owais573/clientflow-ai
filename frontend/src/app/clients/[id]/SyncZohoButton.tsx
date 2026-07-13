"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Loader2 } from 'lucide-react';

export default function SyncZohoButton({ clientId, hasZohoId }: { clientId: number, hasZohoId: boolean }) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:8000/api/clients/${clientId}/sync-zoho`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync with Zoho');
      }
      
      alert("Successfully synced with Zoho CRM!");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error syncing with Zoho CRM. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button 
      className="btn btn-secondary" 
      onClick={handleSync} 
      disabled={isSyncing || hasZohoId}
      title={hasZohoId ? "Already synced with Zoho" : "Push lead to Zoho CRM"}
    >
      {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
      {hasZohoId ? "Synced" : "Sync Zoho"}
    </button>
  );
}
