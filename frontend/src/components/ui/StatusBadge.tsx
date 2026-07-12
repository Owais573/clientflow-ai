import React from 'react';

type StatusType = 'pending' | 'running' | 'completed' | 'failed' | 'new' | 'qualified' | 'proposal_sent' | 'onboarded';

interface StatusBadgeProps {
  status: StatusType | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let color = '';
  let bg = '';
  
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case 'completed':
    case 'onboarded':
      color = 'hsl(var(--accent-green))';
      bg = 'hsl(var(--accent-green) / 0.15)';
      break;
    case 'failed':
      color = 'hsl(var(--accent-red))';
      bg = 'hsl(var(--accent-red) / 0.15)';
      break;
    case 'running':
    case 'qualified':
    case 'proposal_sent':
      color = 'hsl(var(--accent-blue))';
      bg = 'hsl(var(--accent-blue) / 0.15)';
      break;
    case 'pending':
    case 'new':
    default:
      color = 'hsl(var(--accent-amber))';
      bg = 'hsl(var(--accent-amber) / 0.15)';
      break;
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'capitalize',
      color: color,
      backgroundColor: bg,
      border: `1px solid ${color.replace(')', ' / 0.3)')}`
    }}>
      {status.replace('_', ' ')}
    </span>
  );
}
