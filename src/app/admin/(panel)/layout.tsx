import { AdminShell, type NavItem } from '@/components/admin/AdminShell';
import { can, requireAdminPage, type Permission } from '@/lib/server/admin-auth';
import { signOut } from '../login/actions';

const NAV: (NavItem & { permission: Permission })[] = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard', section: 'Overview', permission: 'dashboard.view' },
  { href: '/admin/orders', label: 'Orders & Bookings', icon: 'orders', section: 'Overview', permission: 'orders.view' },
  { href: '/admin/customers', label: 'Customers', icon: 'customers', section: 'Overview', permission: 'customers.view' },
  { href: '/admin/products', label: 'Products', icon: 'products', section: 'Catalog', permission: 'catalog.manage' },
  { href: '/admin/services', label: 'Services & Pricing', icon: 'services', section: 'Catalog', permission: 'catalog.manage' },
  { href: '/admin/banners', label: 'Banners', icon: 'banners', section: 'Website', permission: 'content.manage' },
  { href: '/admin/videos', label: 'Videos', icon: 'videos', section: 'Website', permission: 'content.manage' },
  { href: '/admin/gallery', label: 'Gallery', icon: 'gallery', section: 'Website', permission: 'content.manage' },
  { href: '/admin/reviews', label: 'Testimonials & FAQs', icon: 'reviews', section: 'Website', permission: 'content.manage' },
  { href: '/admin/content', label: 'Page Content', icon: 'content', section: 'Website', permission: 'content.manage' },
  { href: '/admin/media', label: 'Media Library', icon: 'media', section: 'Website', permission: 'media.manage' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings', section: 'Administration', permission: 'settings.manage' },
  { href: '/admin/team', label: 'Team & Roles', icon: 'team', section: 'Administration', permission: 'admins.manage' },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage('dashboard.view');
  const nav = NAV.filter((n) => can(admin, n.permission)).map(({ permission: _p, ...n }) => n);

  return (
    <AdminShell nav={nav} admin={{ email: admin.email, role: admin.role, displayName: admin.displayName }} signOutAction={signOut}>
      {children}
    </AdminShell>
  );
}
