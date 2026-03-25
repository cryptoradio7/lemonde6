import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Tableau de bord — Admin' };

export default async function AdminPage() {
  const [articleCount, categoryCount, userCount, newsletterCount] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.newsletter.count({ where: { subscribed: true } }),
  ]);

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { author: true, category: true },
  });

  const stats = [
    { label: 'Articles publiés', value: articleCount, href: '/admin/articles', color: 'bg-blue-500' },
    { label: 'Catégories', value: categoryCount, href: '/admin/categories', color: 'bg-green-500' },
    { label: 'Utilisateurs', value: userCount, href: '#', color: 'bg-purple-500' },
    { label: 'Abonnés newsletter', value: newsletterCount, href: '#', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-lg p-5 shadow hover:shadow-md transition">
            <div className={`w-10 h-10 ${s.color} rounded-lg mb-3`} />
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Articles récents</h2>
          <Link href="/admin/articles/new" className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            + Nouvel article
          </Link>
        </div>
        <div className="divide-y">
          {recentArticles.map((article) => (
            <div key={article.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 text-sm">{article.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {article.author.name} · {article.category.name} · {article.views} vues
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/article/${article.slug}`}
                  className="text-xs text-blue-600 hover:underline"
                  target="_blank"
                >
                  Voir
                </Link>
                <Link href={`/admin/articles/${article.id}/edit`} className="text-xs text-gray-600 hover:underline">
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
