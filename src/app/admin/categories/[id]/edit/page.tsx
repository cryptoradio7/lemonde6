import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CategoryForm from '../../CategoryForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Modifier une catégorie — Admin' };

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier la catégorie</h1>
      <CategoryForm category={category} />
    </div>
  );
}
