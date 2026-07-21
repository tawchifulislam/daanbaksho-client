'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const roleAccent = {
  admin: 'bg-accent-brand/10 text-accent-brand',
  creator: 'bg-primary/10 text-primary',
  supporter: 'bg-muted text-muted-foreground',
};

export default function ManageUsersTable() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: () => toast.error('Failed to update role'),
  });

  const removeMutation = useMutation({
    mutationFn: async id => axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success('User removed');
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: () => toast.error('Failed to remove user'),
  });

  if (isLoading)
    return <p className="text-muted-foreground">Loading users...</p>;

  return (
    <div className="space-y-3">
      {users.map(user => (
        <Card key={user._id} className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4 flex-wrap">
            <Avatar className="w-10 h-10 border shrink-0">
              <AvatarFallback className={roleAccent[user.role]}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            </div>

            <Badge variant="outline" className="capitalize shrink-0">
              {user.credits} credits
            </Badge>

            <Select
              value={user.role}
              onValueChange={role => {
                if (role === user.role) return;
                roleMutation.mutate({ id: user._id, role });
              }}
            >
              <SelectTrigger className="w-32 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supporter">Supporter</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove {user.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this user from the platform.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeMutation.mutate(user._id)}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
