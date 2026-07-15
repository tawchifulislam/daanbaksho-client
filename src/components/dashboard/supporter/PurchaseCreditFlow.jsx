'use client';

import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';

import { stripePromise } from '@/lib/stripe';
import { axiosSecure } from '@/lib/axios-secure';
import { creditPackages } from '@/lib/creditPackages';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreditCheckoutForm from './CreditCheckoutForm';

export default function PurchaseCreditFlow() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const intentMutation = useMutation({
    mutationFn: async pkg => {
      const res = await axiosSecure.post('/create-payment-intent', {
        amount: pkg.price,
      });
      return res.data;
    },
    onSuccess: data => setClientSecret(data.clientSecret),
  });

  const handleSelectPackage = pkg => {
    setSelectedPackage(pkg);
    setClientSecret(null);
    intentMutation.mutate(pkg);
  };

  const reset = () => {
    setSelectedPackage(null);
    setClientSecret(null);
  };

  if (selectedPackage) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>
            Buy {selectedPackage.credits} credits — ${selectedPackage.price}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CreditCheckoutForm pkg={selectedPackage} onSuccess={reset} />
            </Elements>
          ) : (
            <p className="text-muted-foreground">Preparing checkout...</p>
          )}
          <Button variant="ghost" className="w-full" onClick={reset}>
            Choose a different package
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {creditPackages.map(pkg => (
        <Card
          key={pkg.credits}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleSelectPackage(pkg)}
        >
          <CardHeader>
            <CardTitle className="text-center">{pkg.credits} credits</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold">${pkg.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
