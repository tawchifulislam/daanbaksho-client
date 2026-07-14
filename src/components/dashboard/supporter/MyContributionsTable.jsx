'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  You haven&apos;t contributed to any campaign yet.
                </TableCell>
              </TableRow>
            ) : (
              contributions.map(c => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">
                    {c.campaign_title}
                  </TableCell>
                  <TableCell>{c.creator_name}</TableCell>
                  <TableCell>{c.contribution_amount}</TableCell>
                  <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[c.status] || 'outline'}
                      className="capitalize"
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
