const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface Client {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  budget?: string;
  service_interest?: string;
  status: string;
  zoho_lead_id?: string;
  created_at: string;
}

export interface ClientCreate {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  budget?: string;
  service_interest?: string;
}

export interface Workflow {
  id: number;
  client_id: number;
  status: string;
  current_step: string;
  started_at: string;
  completed_at?: string;
  n8n_execution_id?: string;
}

export interface DashboardStats {
  total_clients: number;
  active_workflows: number;
  completed_workflows: number;
  failed_workflows: number;
}

export interface Research {
  id: number;
  client_id: number;
  ai_summary?: string;
  ai_opportunities?: string[];
  ai_pain_points?: string[];
  ai_recommendations?: string[];
}

export interface Proposal {
  id: number;
  client_id: number;
  executive_summary?: string;
  pricing_template?: Record<string, string>;
  google_doc_url?: string;
}

export interface Activity {
  id: number;
  client_id: number;
  workflow_id: number;
  event_type: string;
  message: string;
  level: string;
  created_at: string;
}

// Fetch helper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }

  // Next.js returns 204 for some empty responses, handle gracefully
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboardStats: () => fetchAPI<DashboardStats>('/dashboard/stats'),
  getRecentActivity: () => fetchAPI<any>('/dashboard/activities'),
  
  // Clients
  getClients: () => fetchAPI<Client[]>('/clients'),
  getClient: (id: number) => fetchAPI<Client>(`/clients/${id}`),
  createClient: (data: ClientCreate) => fetchAPI<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Workflows
  getWorkflows: () => fetchAPI<any>('/workflows'),
  getWorkflowByClientId: (clientId: number) => fetchAPI<Workflow[]>(`/workflows/client/${clientId}`),
  
  // Research & Proposals
  getResearch: (clientId: number) => fetchAPI<Research>(`/research/client/${clientId}`),
  getProposal: (clientId: number) => fetchAPI<Proposal>(`/proposal/client/${clientId}`),
};
