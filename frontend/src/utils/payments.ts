import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/server`;

export interface Payment {
  id: string;
  user_id: string;
  user_name?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: 'paypal' | 'bank_transfer' | 'stripe' | 'crypto';
  reference_id?: string;
  description: string;
  task_ids?: string[];
  created_at: string;
  processed_at?: string;
  notes?: string;
}

const PAYMENTS_STORAGE_KEY = 'inferaai_admin_payments';

function getInitialPayments(): Payment[] {
  return [
    {
      id: '1',
      user_id: '1',
      user_name: 'Demo User',
      amount: 427.50,
      currency: 'USD',
      status: 'completed',
      method: 'paypal',
      reference_id: 'PAY-1234567890',
      description: 'Payment for AI Training Data Annotation',
      task_ids: ['1'],
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      user_id: '3',
      user_name: 'Michael Chen',
      amount: 825.00,
      currency: 'USD',
      status: 'completed',
      method: 'stripe',
      reference_id: 'ch_3Abc123xyz',
      description: 'Monthly payment - Multiple tasks',
      task_ids: ['3', '7', '9'],
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      user_id: '2',
      user_name: 'Sarah Johnson',
      amount: 650.00,
      currency: 'USD',
      status: 'processing',
      method: 'bank_transfer',
      description: 'Payment for Content Moderation tasks',
      task_ids: ['2', '4'],
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      user_id: '1',
      user_name: 'Demo User',
      amount: 495.00,
      currency: 'USD',
      status: 'completed',
      method: 'paypal',
      reference_id: 'PAY-9876543210',
      description: 'Payment for Market Research Analysis',
      task_ids: ['5'],
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      user_id: '4',
      user_name: 'Emily Rodriguez',
      amount: 1200.00,
      currency: 'USD',
      status: 'pending',
      method: 'crypto',
      description: 'Monthly compensation',
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      user_id: '3',
      user_name: 'Michael Chen',
      amount: 550.00,
      currency: 'USD',
      status: 'completed',
      method: 'stripe',
      reference_id: 'ch_3Def456abc',
      description: 'Payment for translation work',
      task_ids: ['6'],
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function loadPayments(): Payment[] {
  try {
    const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading payments from storage:', error);
  }
  return getInitialPayments();
}

function savePayments(payments: Payment[]): void {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving payments to storage:', error);
  }
}

export async function getPayments(userId?: string): Promise<Payment[]> {
  try {
    const url = userId 
      ? `${API_URL}/payments?user_id=${userId}`
      : `${API_URL}/payments`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.payments || [];
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  const payments = loadPayments();
  if (userId) {
    return payments.filter(p => p.user_id === userId);
  }
  return payments;
}

export async function createPayment(paymentData: {
  user_id: string;
  amount: number;
  currency: string;
  method: string;
  description: string;
  task_ids?: string[];
}): Promise<{ payment: Payment }> {
  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(paymentData),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  const payments = loadPayments();
  
  const newPayment: Payment = {
    id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: paymentData.user_id,
    amount: paymentData.amount,
    currency: paymentData.currency,
    status: 'pending',
    method: paymentData.method as any,
    description: paymentData.description,
    task_ids: paymentData.task_ids,
    created_at: new Date().toISOString(),
  };

  payments.push(newPayment);
  savePayments(payments);

  return { payment: newPayment };
}

export async function updatePaymentStatus(
  paymentId: string, 
  status: string, 
  notes?: string
): Promise<{ payment: Payment }> {
  try {
    const response = await fetch(`${API_URL}/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ status, notes }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  const payments = loadPayments();
  const paymentIndex = payments.findIndex(p => p.id === paymentId);

  if (paymentIndex === -1) {
    throw new Error('Payment not found');
  }

  payments[paymentIndex] = {
    ...payments[paymentIndex],
    status: status as any,
    notes,
  };

  if (status === 'completed' && !payments[paymentIndex].processed_at) {
    payments[paymentIndex].processed_at = new Date().toISOString();
  }

  savePayments(payments);
  return { payment: payments[paymentIndex] };
}

export function calculatePaymentStats(payments: Payment[]) {
  return {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    failed: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0),
  };
}
