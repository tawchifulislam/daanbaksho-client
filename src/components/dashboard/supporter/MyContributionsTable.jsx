'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const LIMIT = 10;

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
};

export default function MyContributionsTable() {
  const { session } = useUserRole();
  const email = session?.user?.email;
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-contributions', email, page],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/contributions/supporter/${email}`, {
        params: { page, limit: LIMIT },
      });
      return res.data;
    },
  });

  const contributions = data?.contributions ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / LIMIT));

  if (isLoading)
    return (
      <p className="text-muted-foreground">Loading your contributions...</p>
    );

  if (contributions.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-10 text-center text-muted-foreground">
          You haven&apos;t contributed to any campaign yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {contributions.map(c => (
          <Card key={c._id} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <p className="font-medium truncate">{c.campaign_title}</p>
                <p className="text-sm text-muted-foreground">
                  by {c.creator_name} · {new Date(c.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-semibold text-primary">
                  {c.contribution_amount} credits
                </span>
                <Badge
                  variant={statusVariant[c.status] || 'outline'}
                  className="capitalize"
                >
                  {c.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => setPage(p)}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
