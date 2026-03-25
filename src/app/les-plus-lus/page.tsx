import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Les plus lus — Le Monde6',
  description: 'Découvrez les 20 articles les plus lus sur Le Monde6.',
};

export default async function LesPlusLusPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    include: { author: true, category: true },
    orderBy: { views: 'desc' },
    take: 20,
  });

  return (
    <>
      <Header />
      <main className="container-lemonde py-8">
        <div className="mb-8 pb-4 border-b-4 border-[#D31F1F]">
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Les plus lus</h1>
          <p className="text-gray-500 mt-1">Les 20 articles les plus consultés sur Le Monde6</p>
        </div>

        <div className="space-y-0">
          {articles.map((article, index) => (
            <article key={article.id} className="flex gap-4 py-5 border-b border-gray-200">
              <div className="text-5xl font-serif font-bold text-gray-200 flex-shrink-0 w-12 text-right leading-none mt-1">
                {index + 1}
              </div>
              <div className="flex-1">
                <Link href={`/article/${article.slug}`} className="group">
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-2"
                    style={{ backgroundColor: article.category.color || '#D31F1F' }}
                  >
                    {article.category.name}
                  </span>
                  <h2 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#D31F1F] leading-tight mb-1">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.excerpt}</p>
                  <p className="text-xs text-gray-500">
                    {article.author.name} · {formatDate(article.createdAt)} ·{' '}
                    <span className="font-medium">{article.views.toLocaleString('fr-FR')} vues</span>
                  </p>
                </Link>
              </div>
              {article.image && (
                <div className="hidden sm:block flex-shrink-0">
                  <div className="relative w-28 h-20 overflow-hidden rounded">
                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-gray-500 py-12 text-center">Aucun article disponible.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
