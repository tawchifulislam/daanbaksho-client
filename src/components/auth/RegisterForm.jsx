'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Sprout } from 'lucide-react';

import { registerSchema } from '@/lib/validations/auth';
import { uploadImageToImgbb } from '@/lib/imgbb';
import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterForm() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'supporter' },
  });

  const role = 'role';

  const onSubmit = async values => {
    if (!imageFile) {
      toast.error('Please select a profile picture');
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImageToImgbb(imageFile);

      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: imageUrl,
        role: values.role,
      });

      if (error) {
        toast.error(
          error.message || 'Registration failed. Try a different email.',
        );
        setSubmitting(false);
        return;
      }

      const tokenRes = await fetch('/api/token');
      const tokenData = await tokenRes.json();
      if (tokenData?.token) {
        localStorage.setItem('access-token', tokenData.token);
      }

      toast.success('Account created successfully');
      router.push(
        values.role === 'creator'
          ? '/dashboard/creator-home'
          : '/dashboard/supporter-home',
      );
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
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
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join as a Supporter to fund causes, or a Creator to launch your own
            campaign.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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
            <Label htmlFor="picture">Profile Picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
            />
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

          <div className="space-y-1.5">
            <Label>I want to join as</Label>
            <Select
              value={role}
              onValueChange={value => setValue('role', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supporter">Supporter</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-medium hover:underline">
            Login
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
