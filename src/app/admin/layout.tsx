import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center gap-8">
        <Link href="/" className="font-bold text-lg tracking-wide">
          Le Monde6
        </Link>
        <span className="text-gray-400 text-sm">Administration</span>
        <div className="flex gap-6 ml-auto">
          <Link href="/admin" className="text-sm hover:text-gray-300">
            Tableau de bord
          </Link>
          <Link href="/admin/articles" className="text-sm hover:text-gray-300">
            Articles
          </Link>
          <Link href="/admin/categories" className="text-sm hover:text-gray-300">
            Catégories
          </Link>
          <Link href="/" className="text-sm hover:text-gray-300 text-gray-400">
            ← Site
          </Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
