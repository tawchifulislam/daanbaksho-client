import ManageUsersTable from '@/components/dashboard/admin/ManageUsersTable';

export default function ManageUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <ManageUsersTable />
    </div>
  );
}
