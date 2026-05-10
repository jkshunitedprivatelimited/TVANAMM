import { AuthProvider } from '@/context/AuthContext';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Admin Dashboard | T VANAMM',
  description: 'Manage orders, customers, and analytics for T VANAMM.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
