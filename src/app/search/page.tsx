import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Props {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q?.trim();
  return {
    title: q ? `Recherche : "${q}" — Le Monde6` : 'Recherche — Le Monde6',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? '';

  const articles = q.length >= 2
    ? await prisma.article.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { content: { contains: q } },
          ],
        },
        include: { author: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
    : [];

  return (
    <>
      <Header />
      <main className="container-lemonde py-8">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">Recherche</h1>

        {/* Search form */}
        <form action="/search" method="GET" className="mb-6">
          <div className="flex gap-2 max-w-xl">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher un article..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D31F1F]"
            />
            <button
              type="submit"
              className="bg-[#D31F1F] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#b01818]"
            >
              Rechercher
            </button>
          </div>
        </form>

        {q && (
          <p className="text-gray-500 mb-6">
            {articles.length > 0
              ? `${articles.length} résultat${articles.length > 1 ? 's' : ''} pour «\u00A0${q}\u00A0»`
              : `Aucun article trouvé pour «\u00A0${q}\u00A0»`}
          </p>
        )}

        {!q && <p className="text-gray-500 mb-6">Entrez au moins 2 caractères pour lancer une recherche.</p>}

        <div className="space-y-6">
          {articles.map((article) => (
            <article key={article.id} className="border-b border-gray-200 pb-6">
              <Link href={`/article/${article.slug}`} className="group">
                <div className="flex gap-4">
                  {article.image && (
                    <div className="hidden sm:block relative w-32 h-20 overflow-hidden rounded flex-shrink-0">
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-1"
                      style={{ backgroundColor: article.category.color || '#D31F1F' }}
                    >
                      {article.category.name}
                    </span>
                    <h2 className="font-serif font-bold text-[#1A1A1A] group-hover:text-[#D31F1F] leading-tight mb-1">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">{article.excerpt}</p>
                    <p className="text-xs text-gray-500">
                      {article.author.name} · {formatDate(article.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
