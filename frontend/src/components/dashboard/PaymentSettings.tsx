import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Check, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { updatePaymentMethod, PaymentMethod } from '../../utils/users';
import { useAuth } from '../../utils/auth';

export function PaymentSettings() {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'paypal' as 'paypal' | 'bank_transfer' | 'stripe' | 'crypto',
    email: '',
    account_number: '',
    routing_number: '',
    account_holder: '',
    wallet_address: '',
  });

  const handleSavePaymentMethod = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const method: PaymentMethod = {
        type: formData.type,
        details: {},
        verified: false,
        added_at: new Date().toISOString(),
      };

      // Add relevant details based on type
      if (formData.type === 'paypal') {
        if (!formData.email) {
          toast.error('PayPal email is required');
          return;
        }
        method.details.email = formData.email;
      } else if (formData.type === 'bank_transfer') {
        if (!formData.account_number || !formData.routing_number || !formData.account_holder) {
          toast.error('All bank details are required');
          return;
        }
        method.details.account_number = formData.account_number;
        method.details.routing_number = formData.routing_number;
        method.details.account_holder = formData.account_holder;
      } else if (formData.type === 'crypto') {
        if (!formData.wallet_address) {
          toast.error('Wallet address is required');
          return;
        }
        method.details.wallet_address = formData.wallet_address;
      }

      await updatePaymentMethod(user.id, method);
      setPaymentMethod(method);
      setShowAddDialog(false);
      toast.success('Payment method saved successfully');
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'paypal',
      email: '',
      account_number: '',
      routing_number: '',
      account_holder: '',
      wallet_address: '',
    });
  };

  const getPaymentMethodIcon = () => {
    return <CreditCard className="h-5 w-5 text-blue-600" />;
  };

  const getPaymentMethodDisplay = () => {
    if (!paymentMethod) return null;

    switch (paymentMethod.type) {
      case 'paypal':
        return (
          <div className="space-y-2">
            <p className="text-gray-600"><strong>PayPal Email:</strong> {paymentMethod.details.email}</p>
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Account Holder:</strong> {paymentMethod.details.account_holder}</p>
            <p className="text-gray-600"><strong>Account Number:</strong> ****{paymentMethod.details.account_number?.slice(-4)}</p>
            <p className="text-gray-600"><strong>Routing Number:</strong> {paymentMethod.details.routing_number}</p>
          </div>
        );
      case 'crypto':
        return (
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Wallet Address:</strong></p>
            <code className="text-xs bg-gray-100 p-2 rounded block break-all">
              {paymentMethod.details.wallet_address}
            </code>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>
          Configure how you want to receive payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Payment Schedule Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Payment Schedule</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Monthly Processing:</strong> All payments processed on the 29th of each month</li>
                <li>• <strong>Processing Time:</strong> 1-2 business days to complete and reflect in your account</li>
                <li>• <strong>Minimum Payout:</strong> $50 minimum balance required for payment</li>
              </ul>
            </div>
          </div>
        </div>
        {paymentMethod ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPaymentMethodIcon()}
                <div>
                  <p className="text-gray-900 capitalize">{paymentMethod.type.replace('_', ' ')}</p>
                  <p className="text-gray-500">
                    Added {new Date(paymentMethod.added_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {paymentMethod.verified && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {getPaymentMethodDisplay()}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No payment method configured</p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {paymentMethod ? 'Edit' : 'Add'} Payment Method
              </DialogTitle>
              <DialogDescription>
                Choose how you'd like to receive your payments
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Payment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
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

              {formData.type === 'paypal' && (
                <div>
                  <Label>PayPal Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              )}

              {formData.type === 'bank_transfer' && (
                <>
                  <div>
                    <Label>Account Holder Name</Label>
                    <Input
                      value={formData.account_holder}
                      onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      placeholder="123456789"
                    />
                  </div>
                  <div>
                    <Label>Routing Number</Label>
                    <Input
                      value={formData.routing_number}
                      onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                      placeholder="987654321"
                    />
                  </div>
                </>
              )}

              {formData.type === 'crypto' && (
                <div>
                  <Label>Wallet Address</Label>
                  <Input
                    value={formData.wallet_address}
                    onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                    placeholder="0x..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your cryptocurrency wallet address
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSavePaymentMethod} disabled={loading}>
                {loading ? 'Saving...' : 'Save Payment Method'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
