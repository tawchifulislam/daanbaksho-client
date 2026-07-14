'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

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

  const role = watch('role');

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

      // Fetch our custom access token (JWT) via the /api/token route
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your DaanBaksho account</CardTitle>
        <CardDescription>
          Join as a Supporter to fund causes, or a Creator to launch your own
          campaign.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supporter">Supporter</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
