import React from 'react';
import { Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface PaymentReminderProps {
  variant?: 'default' | 'compact' | 'banner';
  className?: string;
}

export function PaymentReminder({ variant = 'default', className = '' }: PaymentReminderProps) {
  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  const getNextPaymentDate = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // If we're past the 29th of current month, next payment is 29th of next month
    if (now.getDate() > 29) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      return new Date(nextYear, nextMonth, 29);
    } else {
      // Next payment is 29th of current month
      return new Date(currentYear, currentMonth, 29);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilPayment = () => {
    const nextPayment = getNextPaymentDate();
    const today = new Date();
    const diffTime = nextPayment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-green-900">Payment Schedule</h4>
              <Badge className="bg-green-100 text-green-800 text-xs">
                {getDaysUntilPayment()} days until next payment
              </Badge>
            </div>
            <p className="text-sm text-green-800">
              Next payment: <strong>{formatDate(getNextPaymentDate())}</strong> • Processing takes 1-2 business days • $50 minimum
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
        <Calendar className="h-4 w-4" />
        <span>Next payment: {formatDate(getNextPaymentDate())}</span>
        <Badge variant="outline" className="text-xs">
          {getDaysUntilPayment()}d
        </Badge>
      </div>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              Payment Information
              <Badge className="bg-blue-100 text-blue-800">
                {getDaysUntilPayment()} days left
              </Badge>
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span><strong>Next Payment:</strong> {formatDate(getNextPaymentDate())}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span><strong>Processing Time:</strong> 1-2 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <span><strong>Minimum Payout:</strong> $50 required</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              All payments are processed automatically on the 29th of each month. 
              If the 29th falls on a weekend or holiday, payments will be processed on the next business day.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}