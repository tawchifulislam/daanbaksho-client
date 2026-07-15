'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';

export default function CreditCheckoutForm({ pkg, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { session } = useUserRole();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const savePaymentMutation = useMutation({
    mutationFn: async paymentIntent => {
      return axiosSecure.post('/payments', {
        supporter_email: session.user.email,
        supporter_name: session.user.name,
        credits_purchased: pkg.credits,
        amount_paid: pkg.price,
        transaction_id: paymentIntent.id,
      });
    },
    onSuccess: () => {
      toast.success(`${pkg.credits} credits added to your account`);
      queryClient.invalidateQueries({
        queryKey: ['user-info', session.user.email],
      });
      onSuccess();
    },
    onError: () =>
      toast.error('Payment succeeded but failed to update credits'),
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      savePaymentMutation.mutate(paymentIntent);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${pkg.price}`}
      </Button>
    </form>
  );
}
