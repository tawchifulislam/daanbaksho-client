'use client';

import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { Coins } from 'lucide-react';

import { stripePromise } from '@/lib/stripe';
import { axiosSecure } from '@/lib/axios-secure';
import { creditPackages } from '@/lib/creditPackages';

import { Card, CardContent } from '@/components/ui/card';
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
      <Card className="max-w-md border-none shadow-sm overflow-hidden py-0">
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--accent-brand))',
          }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">
              {selectedPackage.credits} credits
            </h2>
            <p className="text-sm text-white/80">${selectedPackage.price}</p>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CreditCheckoutForm pkg={selectedPackage} onSuccess={reset} />
            </Elements>
          ) : (
            <p className="text-muted-foreground text-sm">
              Preparing checkout...
            </p>
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
      {creditPackages.map((pkg, i) => (
        <Card
          key={pkg.credits}
          className="cursor-pointer border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          onClick={() => handleSelectPackage(pkg)}
        >
          <CardContent className="p-6 text-center space-y-3">
            <div
              className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center ${
                i % 2 === 0 ? 'bg-primary/10' : 'bg-accent-brand/10'
              }`}
            >
              <Coins
                className={`w-6 h-6 ${i % 2 === 0 ? 'text-primary' : 'text-accent-brand'}`}
              />
            </div>
            <p className="text-2xl font-bold">{pkg.credits}</p>
            <p className="text-xs text-muted-foreground -mt-2">credits</p>
            <p className="text-lg font-semibold text-primary group-hover:scale-110 transition-transform inline-block">
              ${pkg.price}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
