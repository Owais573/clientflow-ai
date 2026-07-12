import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw, FileText, Bot, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api, Client, Workflow, Research, Proposal } from '@/services/api';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  let client: Client | null = null;
  let workflow: Workflow | null = null;
  let research: Research | null = null;
  let proposal: Proposal | null = null;

  try {
    const clientId = Number(id);
    client = await api.getClient(clientId);
    
    const workflows = await api.getWorkflowByClientId(clientId).catch(() => []);
    workflow = workflows.length > 0 ? workflows[0] : null;
    
    research = await api.getResearch(clientId).catch(() => null);
    proposal = await api.getProposal(clientId).catch(() => null);
  } catch (err) {
    console.error("Error fetching client details:", err);
  }

  if (!client) {
    return <div style={{ padding: '2rem' }}>Client not found.</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/clients" className="icon-btn" style={{ background: 'hsl(var(--bg-tertiary))' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 className="h1" style={{ marginBottom: 0 }}>{client.company_name}</h1>
              <StatusBadge status={client.status} />
            </div>
            <p className="text-muted">{client.contact_name} • {client.email}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            <RefreshCw size={16} /> Sync Zoho
          </button>
          {proposal?.google_doc_url && (
            <a href={proposal.google_doc_url} target="_blank" rel="noreferrer" className="btn btn-primary">
              <ExternalLink size={16} /> View Proposal Doc
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card title="AI Research Insights" subtitle="Generated via Tavily & GPT-4.1" action={<Bot size={20} className="text-muted" />}>
            {research ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 className="text-sm text-muted" style={{ fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Executive Summary</h4>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>{research.ai_summary || 'No summary available.'}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ background: 'hsl(var(--accent-green) / 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--accent-green) / 0.2)' }}>
                    <h4 className="text-sm" style={{ color: 'hsl(var(--accent-green))', fontWeight: 600, marginBottom: '0.5rem' }}>Opportunities</h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {(research.ai_opportunities || []).map((opp: string, i: number) => <li key={i}>{opp}</li>)}
                    </ul>
                  </div>
                  <div style={{ background: 'hsl(var(--accent-red) / 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--accent-red) / 0.2)' }}>
                    <h4 className="text-sm" style={{ color: 'hsl(var(--accent-red))', fontWeight: 600, marginBottom: '0.5rem' }}>Pain Points</h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {(research.ai_pain_points || []).map((pain: string, i: number) => <li key={i}>{pain}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>AI Research is currently running...</p>
              </div>
            )}
          </Card>

          <Card title="Generated Proposal Draft" subtitle="Synced to Google Docs" action={<FileText size={20} className="text-muted" />}>
            {proposal ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', color: 'hsl(var(--text-secondary))' }}>
                   "{proposal.executive_summary || 'No executive summary available.'}"
                 </p>
                 
                 <div>
                   <h4 className="text-sm text-muted" style={{ fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pricing Estimate</h4>
                   <div style={{ background: 'hsl(var(--bg-tertiary) / 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                     {Object.entries(proposal.pricing_template || {}).map(([key, val]) => (
                       <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: key === 'Total' ? 'none' : '1px solid hsl(var(--border-light))', fontWeight: key === 'Total' ? 700 : 400, color: key === 'Total' ? 'hsl(var(--accent-primary))' : 'inherit' }}>
                         <span>{key}</span>
                         <span>{String(val)}</span>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Waiting for AI analysis to complete proposal draft...</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card title="Client Details" action={<Briefcase size={18} className="text-muted" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              {client.website && (
                <div>
                  <span className="text-muted">Website: </span>
                  <a href={client.website} target="_blank" rel="noreferrer" style={{ color: 'hsl(var(--accent-blue))' }}>{client.website.replace('https://', '')}</a>
                </div>
              )}
              {client.phone && (
                <div>
                  <span className="text-muted">Phone: </span>
                  <span>{client.phone}</span>
                </div>
              )}
              {client.industry && (
                <div>
                  <span className="text-muted">Industry: </span>
                  <span>{client.industry}</span>
                </div>
              )}
              {client.budget && (
                <div>
                  <span className="text-muted">Budget: </span>
                  <span style={{ color: 'hsl(var(--accent-green))', fontWeight: 600 }}>{client.budget}</span>
                </div>
              )}
              {client.service_interest && (
                <div>
                  <span className="text-muted">Service: </span>
                  <span style={{ padding: '0.2rem 0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '4px' }}>{client.service_interest}</span>
                </div>
              )}
              
              {client.zoho_lead_id && (
                <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid hsl(var(--border-light))' }}>
                  <span className="text-muted">Zoho Lead ID: </span>
                  <code>{client.zoho_lead_id}</code>
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Workflow Status">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
               {/* Simplified timeline */}
               {[
                 { step: 'Lead Created', done: !!client.zoho_lead_id },
                 { step: 'AI Research', done: !!research },
                 { step: 'Proposal Generated', done: !!proposal },
                 { step: 'n8n Pipeline', done: workflow?.status === 'completed' }
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                   {i !== 3 && <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', background: item.done ? 'hsl(var(--accent-primary))' : 'hsl(var(--border-strong))' }} />}
                   <div style={{ 
                     width: '24px', height: '24px', borderRadius: '50%', 
                     background: item.done ? 'hsl(var(--accent-primary))' : 'hsl(var(--bg-tertiary))',
                     border: item.done ? 'none' : '2px solid hsl(var(--border-strong))',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     color: 'white', zIndex: 1
                   }}>
                     {item.done && <CheckCircle size={14} />}
                   </div>
                   <div style={{ flex: 1, paddingBottom: i === 3 ? 0 : '1.5rem' }}>
                     <p style={{ fontWeight: item.done ? 600 : 400, color: item.done ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))' }}>{item.step}</p>
                   </div>
                 </div>
               ))}
             </div>
          </Card>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

// Needed because we used an icon not imported at top
import { CheckCircle } from 'lucide-react';
