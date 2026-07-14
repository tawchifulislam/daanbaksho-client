'use client';

import { useQuery } from '@tanstack/react-query';
import { useUserRole } from '@/hooks/useUserRole';
import { axiosSecure } from '@/lib/axios-secure';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function SupporterHomePage() {
  const { session, credits } = useUserRole();
  const email = session?.user?.email;

  const { data: stats } = useQuery({
    queryKey: ['supporter-stats', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/supporter-stats/${email}`);
      return res.data;
    },
  });

  const { data: approvedContributions = [] } = useQuery({
    queryKey: ['approved-contributions', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/contributions/supporter/${email}/approved`,
      );
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <p className="text-muted-foreground mt-1">
          You currently have {credits} credits.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats?.totalContributions ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Pending Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats?.pendingContributions ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Contributed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalContributed ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Approved Contributions</h2>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedContributions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No approved contributions yet.
                  </TableCell>
                </TableRow>
              ) : (
                approvedContributions.map(c => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">
                      {c.campaign_title}
                    </TableCell>
                    <TableCell>{c.contribution_amount}</TableCell>
                    <TableCell>{c.creator_name}</TableCell>
                    <TableCell>
                      <Badge className="capitalize">{c.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
