import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { Payment, createPayment, updatePaymentStatus, calculatePaymentStats } from '../../utils/payments';
import { User } from '../../utils/users';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface PaymentTrackingProps {
  payments: Payment[];
  users: User[];
  onRefresh: () => void;
}

export function PaymentTracking({ payments, users, onRefresh }: PaymentTrackingProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    currency: 'USD',
    method: 'paypal',
    description: '',
  });

  const stats = calculatePaymentStats(payments);

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesUser = userFilter === 'all' || payment.user_id === userFilter;
    return matchesStatus && matchesUser;
  });

  const handleCreatePayment = async () => {
    try {
      await createPayment({
        user_id: formData.user_id,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        method: formData.method,
        description: formData.description,
      });

      toast.success('Payment created successfully');
      onRefresh();
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment');
    }
  };

  const handleUpdateStatus = async (paymentId: string, status: string, notes?: string) => {
    try {
      await updatePaymentStatus(paymentId, status, notes);
      toast.success('Payment status updated');
      onRefresh();
      setSelectedPayment(null);
    } catch (error: any) {
      toast.error('Failed to update payment status');
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      amount: '',
      currency: 'USD',
      method: 'paypal',
      description: '',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-blue-900">Total Paid</span>
          </div>
          <p className="text-blue-900">${stats.total.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-900">Completed</span>
          </div>
          <p className="text-green-900">${stats.completed.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-900">Pending</span>
          </div>
          <p className="text-yellow-900">${stats.pending.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-900">Failed</span>
          </div>
          <p className="text-red-900">${stats.failed.toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Payment
        </Button>
      </div>

      {/* Payments List */}
      <div className="grid gap-4">
        {filteredPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPayment(payment)}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-gray-900">
                    ${payment.amount.toFixed(2)} {payment.currency}
                  </h3>
                  <Badge className={getStatusColor(payment.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </div>
                  </Badge>
                  <Badge variant="outline">{payment.method}</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                  <p>👤 {payment.user_name}</p>
                  <p>📝 {payment.description}</p>
                  <p>📅 {new Date(payment.created_at).toLocaleDateString()}</p>
                  {payment.reference_id && <p>🔖 Ref: {payment.reference_id}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Payment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Payment</DialogTitle>
            <DialogDescription>
              Process a payment to a user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>User</Label>
              <Select value={formData.user_id} onValueChange={(value) => setFormData({ ...formData, user_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.isActive).map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="100.00"
                />
              </div>

              <div>
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Payment for tasks completed in October..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePayment}>
              Create Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>
                  ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedPayment.status)}
                      {selectedPayment.status}
                    </div>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p><strong>User:</strong> {selectedPayment.user_name}</p>
                  <p><strong>Method:</strong> {selectedPayment.method}</p>
                  <p><strong>Description:</strong> {selectedPayment.description}</p>
                  <p><strong>Created:</strong> {new Date(selectedPayment.created_at).toLocaleString()}</p>
                  {selectedPayment.processed_at && (
                    <p><strong>Processed:</strong> {new Date(selectedPayment.processed_at).toLocaleString()}</p>
                  )}
                  {selectedPayment.reference_id && (
                    <p><strong>Reference ID:</strong> {selectedPayment.reference_id}</p>
                  )}
                  {selectedPayment.notes && (
                    <div className="bg-gray-50 p-3 rounded border">
                      <strong>Notes:</strong> {selectedPayment.notes}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Update Status</Label>
                  <Select
                    value={selectedPayment.status}
                    onValueChange={(value) => handleUpdateStatus(selectedPayment.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
