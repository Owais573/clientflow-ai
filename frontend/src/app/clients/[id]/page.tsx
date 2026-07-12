import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw, FileText, Bot, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api, Client, Workflow } from '@/services/api';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Mock data for UI layout
  const client = {
    id: Number(id),
    company_name: "Acme Corp",
    contact_name: "Jane Doe",
    email: "jane@acme.com",
    phone: "+1 555-1234",
    website: "https://acme.com",
    industry: "SaaS",
    budget: "$50k-$100k",
    service_interest: "Web Development",
    status: "onboarded",
    zoho_lead_id: "49281739210",
    created_at: new Date().toISOString()
  };

  const workflow = {
    id: 1,
    status: "completed",
    current_step: "n8n_pipeline_completed",
    started_at: new Date(Date.now() - 3600000).toISOString(),
    n8n_execution_id: "12345"
  };

  const research = {
    ai_summary: "Acme Corp is a leading SaaS provider in the cloud infrastructure space. They recently secured Series B funding and are rapidly expanding their product line. Their main focus is on enterprise clients seeking reliable, scalable storage solutions.",
    ai_opportunities: [
      "Website redesign needed for new product launches",
      "Integration of AI support chatbots",
      "Migration to edge computing architecture"
    ],
    ai_pain_points: [
      "High customer acquisition cost",
      "Outdated UX/UI on their main platform",
      "Slow load times in APAC region"
    ]
  };

  const proposal = {
    executive_summary: "Based on our research, ClientFlow AI proposes a comprehensive web platform overhaul targeting Acme Corp's expansion goals.",
    pricing_template: {
      "Phase 1: Discovery": "$5,000",
      "Phase 2: UI/UX Design": "$15,000",
      "Phase 3: Development": "$35,000",
      "Total": "$55,000"
    },
    google_doc_url: "https://docs.google.com/document/d/mock-doc-id/edit"
  };

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
          <a href={proposal.google_doc_url} target="_blank" rel="noreferrer" className="btn btn-primary">
            <ExternalLink size={16} /> View Proposal Doc
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card title="AI Research Insights" subtitle="Generated via Tavily & GPT-4.1" action={<Bot size={20} className="text-muted" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 className="text-sm text-muted" style={{ fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Executive Summary</h4>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>{research.ai_summary}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'hsl(var(--accent-green) / 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--accent-green) / 0.2)' }}>
                  <h4 className="text-sm" style={{ color: 'hsl(var(--accent-green))', fontWeight: 600, marginBottom: '0.5rem' }}>Opportunities</h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {research.ai_opportunities.map((opp, i) => <li key={i}>{opp}</li>)}
                  </ul>
                </div>
                <div style={{ background: 'hsl(var(--accent-red) / 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--accent-red) / 0.2)' }}>
                  <h4 className="text-sm" style={{ color: 'hsl(var(--accent-red))', fontWeight: 600, marginBottom: '0.5rem' }}>Pain Points</h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {research.ai_pain_points.map((pain, i) => <li key={i}>{pain}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Generated Proposal Draft" subtitle="Synced to Google Docs" action={<FileText size={20} className="text-muted" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', color: 'hsl(var(--text-secondary))' }}>
                 "{proposal.executive_summary}"
               </p>
               
               <div>
                 <h4 className="text-sm text-muted" style={{ fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pricing Estimate</h4>
                 <div style={{ background: 'hsl(var(--bg-tertiary) / 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                   {Object.entries(proposal.pricing_template).map(([key, val]) => (
                     <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: key === 'Total' ? 'none' : '1px solid hsl(var(--border-light))', fontWeight: key === 'Total' ? 700 : 400, color: key === 'Total' ? 'hsl(var(--accent-primary))' : 'inherit' }}>
                       <span>{key}</span>
                       <span>{val}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card title="Client Details" action={<Briefcase size={18} className="text-muted" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <span className="text-muted">Website: </span>
                <a href={client.website} target="_blank" rel="noreferrer" style={{ color: 'hsl(var(--accent-blue))' }}>{client.website.replace('https://', '')}</a>
              </div>
              <div>
                <span className="text-muted">Phone: </span>
                <span>{client.phone}</span>
              </div>
              <div>
                <span className="text-muted">Industry: </span>
                <span>{client.industry}</span>
              </div>
              <div>
                <span className="text-muted">Budget: </span>
                <span style={{ color: 'hsl(var(--accent-green))', fontWeight: 600 }}>{client.budget}</span>
              </div>
              <div>
                <span className="text-muted">Service: </span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '4px' }}>{client.service_interest}</span>
              </div>
              
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
                 { step: 'Lead Created', done: true },
                 { step: 'AI Research', done: true },
                 { step: 'Proposal Generated', done: true },
                 { step: 'n8n Pipeline', done: workflow.status === 'completed' }
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
    </div>
  );
}

// Needed because we used an icon not imported at top
import { CheckCircle } from 'lucide-react';
