import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleForm from '../../ArticleForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Modifier un article — Admin' };

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [article, categories, authors] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.user.findMany({
      where: { role: { in: ['admin', 'journalist'] } },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier l&apos;article</h1>
      <ArticleForm categories={categories} authors={authors} article={article} />
    </div>
  );
}
