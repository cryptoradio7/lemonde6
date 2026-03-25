import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import DeleteArticleButton from './DeleteButton';

export const metadata: Metadata = { title: 'Gestion des articles — Admin' };

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true, category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles ({articles.length})</h1>
        <Link href="/admin/articles/new" className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 text-sm">
          + Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Titre</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Catégorie</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Auteur</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Vues</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                  <div className="text-xs text-gray-400">{new Date(article.createdAt).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs text-white font-medium"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{article.author.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : article.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {article.status === 'published' ? 'Publié' : article.status === 'draft' ? 'Brouillon' : 'Archivé'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{article.views.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <Link href={`/article/${article.slug}`} className="text-blue-600 hover:underline text-sm" target="_blank">
                      Voir
                    </Link>
                    <Link href={`/admin/articles/${article.id}/edit`} className="text-gray-700 hover:underline text-sm">
                      Modifier
                    </Link>
                    <DeleteArticleButton id={article.id} />
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
