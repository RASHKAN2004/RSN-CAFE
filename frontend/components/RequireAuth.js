'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';

/** Client-side route guard. (The API enforces the same rules server-side.) */
export default function RequireAuth({ roles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (roles && !roles.includes(user.role)) router.replace('/');
  }, [loading, user, roles, router, pathname]);

  if (loading || !user || (roles && !roles.includes(user.role)))
    return <div className="grid min-h-[50vh] place-items-center text-soft">Loading…</div>;
  return children;
}
