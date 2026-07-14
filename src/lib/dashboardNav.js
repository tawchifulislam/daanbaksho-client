import {
  Home,
  Search,
  Wallet,
  CreditCard,
  History,
  PlusCircle,
  Layers,
  Users,
  ClipboardList,
  Flag,
} from 'lucide-react';

export const navByRole = {
  supporter: [
    { href: '/dashboard/supporter-home', label: 'Home', icon: Home },
    {
      href: '/dashboard/explore-campaigns',
      label: 'Explore Campaigns',
      icon: Search,
    },
    {
      href: '/dashboard/my-contributions',
      label: 'My Contributions',
      icon: Wallet,
    },
    {
      href: '/dashboard/purchase-credit',
      label: 'Purchase Credit',
      icon: CreditCard,
    },
    {
      href: '/dashboard/payment-history',
      label: 'Payment History',
      icon: History,
    },
  ],
  creator: [
    { href: '/dashboard/creator-home', label: 'Home', icon: Home },
    {
      href: '/dashboard/add-campaign',
      label: 'Add New Campaign',
      icon: PlusCircle,
    },
    { href: '/dashboard/my-campaigns', label: 'My Campaigns', icon: Layers },
    { href: '/dashboard/withdrawals', label: 'Withdrawals', icon: Wallet },
    {
      href: '/dashboard/payment-history',
      label: 'Payment History',
      icon: History,
    },
  ],
  admin: [
    { href: '/dashboard/admin-home', label: 'Home', icon: Home },
    { href: '/dashboard/manage-users', label: 'Manage Users', icon: Users },
    {
      href: '/dashboard/manage-campaigns',
      label: 'Manage Campaigns',
      icon: Layers,
    },
    {
      href: '/dashboard/withdrawal-requests',
      label: 'Withdrawal Requests',
      icon: ClipboardList,
    },
    { href: '/dashboard/reports', label: 'Reports', icon: Flag },
  ],
};
