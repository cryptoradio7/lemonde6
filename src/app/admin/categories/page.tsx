import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import DeleteCategoryButton from './DeleteButton';

export const metadata: Metadata = { title: 'Gestion des catégories — Admin' };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catégories ({categories.length})</h1>
        <Link href="/admin/categories/new" className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 text-sm">
          + Nouvelle catégorie
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Nom</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Slug</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Couleur</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Articles</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-gray-500 font-mono">{cat.color}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{cat._count.articles}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <Link href={`/categories/${cat.slug}`} className="text-blue-600 hover:underline text-sm" target="_blank">
                      Voir
                    </Link>
                    <Link href={`/admin/categories/${cat.id}/edit`} className="text-gray-700 hover:underline text-sm">
                      Modifier
                    </Link>
                    {cat._count.articles === 0 && <DeleteCategoryButton id={cat.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
