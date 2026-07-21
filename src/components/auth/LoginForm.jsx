'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HandCoins } from 'lucide-react';

import { loginSchema } from '@/lib/validations/auth';
import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const redirectByRole = role => {
    if (role === 'admin') router.push('/dashboard/admin-home');
    else if (role === 'creator') router.push('/dashboard/creator-home');
    else router.push('/dashboard/supporter-home');
  };

  const onSubmit = async values => {
    setSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password');
        setSubmitting(false);
        return;
      }

      const tokenRes = await fetch('/api/token');
      const tokenData = await tokenRes.json();
      if (tokenData?.token) {
        localStorage.setItem('access-token', tokenData.token);
      }

      toast.success('Logged in successfully');
      redirectByRole(data?.user?.role);
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/auth/callback',
      });
    } catch (err) {
      toast.error('Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-none shadow-xl shadow-black/5 py-0 overflow-hidden">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(90deg, var(--primary), var(--accent-brand))',
        }}
      />
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background:
                'linear-gradient(135deg, var(--primary), var(--accent-brand))',
            }}
          >
            <HandCoins className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Log in to continue supporting or launching campaigns.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </Button>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
