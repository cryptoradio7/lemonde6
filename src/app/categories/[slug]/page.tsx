import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

const PAGE_SIZE = 20;

async function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug);
  if (!category) return { title: 'Rubrique introuvable' };
  return {
    title: `${category.name} — Le Monde6`,
    description: category.description ?? `Tous les articles de la rubrique ${category.name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(searchParams.page ?? '1'));
  const skip = (page - 1) * PAGE_SIZE;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { categoryId: category.id, status: 'published' },
      include: { author: true, category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where: { categoryId: category.id, status: 'published' } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hero = page === 1 && articles[0] ? articles[0] : null;
  const rest = hero ? articles.slice(1) : articles;

  return (
    <>
      <Header />
      <main className="container-lemonde py-8">
        {/* Category header */}
        <div className="mb-8 pb-4 border-b-4" style={{ borderColor: category.color || '#D31F1F' }}>
          <h1 className="font-serif text-4xl font-bold text-[#1A1A1A]">{category.name}</h1>
          {category.description && <p className="text-gray-500 mt-1">{category.description}</p>}
          <p className="text-sm text-gray-400 mt-1">{total} article{total > 1 ? 's' : ''}</p>
        </div>

        {/* Hero article */}
        {hero && (
          <article className="mb-10">
            <Link href={`/article/${hero.slug}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hero.image && (
                  <div className="relative w-full aspect-video overflow-hidden rounded">
                    <Image src={hero.image} alt={hero.title} fill className="object-cover" priority />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  {hero.badge && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D31F1F] mb-2">
                      {hero.badge}
                    </span>
                  )}
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded text-white mb-3 w-fit"
                    style={{ backgroundColor: category.color || '#D31F1F' }}
                  >
                    {category.name}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight mb-3">
                    {hero.title}
                  </h2>
                  <p className="text-gray-600 mb-3 line-clamp-3">{hero.excerpt}</p>
                  <p className="text-sm text-gray-500">{hero.author.name} · {formatDate(hero.createdAt)}</p>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* Articles grid */}
        {rest.length === 0 && !hero ? (
          <p className="text-gray-500 py-12 text-center">Aucun article dans cette rubrique.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {rest.map((article) => (
              <article key={article.id} className="border-b border-gray-200 pb-4">
                <Link href={`/article/${article.slug}`}>
                  {article.image && (
                    <div className="relative w-full aspect-video overflow-hidden rounded mb-3">
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    </div>
                  )}
                  {article.badge && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D31F1F] mb-1 block">
                      {article.badge}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.excerpt}</p>
                  <p className="text-xs text-gray-500">{article.author.name} · {formatDate(article.createdAt)}</p>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/categories/${params.slug}?page=${page - 1}`}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                ← Précédent
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/categories/${params.slug}?page=${page + 1}`}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Suivant →
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
