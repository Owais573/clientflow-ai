"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    budget: '',
    service_interest: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to create client');
      }

      const client = await res.json();
      router.push(`/clients/${client.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/clients" className="icon-btn" style={{ background: 'hsl(var(--bg-tertiary))' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="h2" style={{ marginBottom: 0 }}>Onboard New Client</h1>
          <p className="text-muted text-sm">Enter client details to trigger the AI onboarding pipeline.</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'hsl(var(--accent-red) / 0.1)', color: 'hsl(var(--accent-red))', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--accent-red) / 0.3)' }}>
          {error}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input required type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="form-input" placeholder="e.g. Acme Corp" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input required type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} className="form-input" placeholder="e.g. Jane Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="jane@acme.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+1 (555) 123-4567" />
              </div>
            </div>

            {/* Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="form-input" placeholder="https://acme.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="form-input" placeholder="e.g. Healthcare, Tech" />
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Budget</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="form-input">
                  <option value="">Select a range...</option>
                  <option value="<$10k">Less than $10,000</option>
                  <option value="$10k-$50k">$10,000 - $50,000</option>
                  <option value="$50k-$100k">$50,000 - $100,000</option>
                  <option value=">$100k">More than $100,000</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Service Interest</label>
                <select name="service_interest" value={formData.service_interest} onChange={handleChange} className="form-input">
                  <option value="">Select a service...</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI Integration">AI Integration</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid hsl(var(--border-light))', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/clients" className="btn btn-ghost">Cancel</Link>
            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ minWidth: '150px' }}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <Save size={18} />
                  <span>Start Onboarding</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: hsl(var(--text-secondary));
        }
        .form-input {
          background: hsl(var(--bg-primary) / 0.5);
          border: 1px solid hsl(var(--border-strong));
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: hsl(var(--text-primary));
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: hsl(var(--accent-primary));
          box-shadow: 0 0 0 2px hsl(var(--accent-primary) / 0.2);
        }
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
