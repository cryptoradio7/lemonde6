import { prisma } from '@/lib/prisma';
import ArticleForm from '../ArticleForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nouvel article — Admin' };

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    prisma.category.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.user.findMany({
      where: { role: { in: ['admin', 'journalist'] } },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvel article</h1>
      <ArticleForm categories={categories} authors={authors} />
    </div>
  );
}
