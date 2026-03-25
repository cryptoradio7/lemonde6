import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatDate } from '@/lib/utils';

async function getHomePageData() {
  try {
    const [featuredArticles, latestArticles, categories] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'published', featured: true },
        include: { author: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        include: { author: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.category.findMany({
        where: { active: true },
        include: { _count: { select: { articles: true } } },
        orderBy: { name: 'asc' },
      }),
    ]);

    return { featuredArticles, latestArticles, categories };
  } catch {
    return { featuredArticles: [], latestArticles: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featuredArticles, latestArticles, categories } = await getHomePageData();

  const hero = featuredArticles[0] ?? null;
  const secondaryFeatured = featuredArticles.slice(1, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breaking news bar */}
      <div className="bg-[#D31F1F] text-white text-sm py-2">
        <div className="container-lemonde flex items-center gap-3">
          <span className="font-bold uppercase tracking-wider text-xs bg-white text-[#D31F1F] px-2 py-0.5 rounded">
            EN DIRECT
          </span>
          <span>Suivez toute l&apos;actualité en temps réel sur Le Monde6</span>
        </div>
      </div>

      <main className="container-lemonde py-8">
        {/* Hero section */}
        {hero && (
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main hero */}
              <article className="md:col-span-2">
                <Link href={`/article/${hero.slug}`}>
                  <div className="relative w-full aspect-video overflow-hidden rounded bg-gray-100 mb-3">
                    {hero.image ? (
                      <Image
                        src={hero.image}
                        alt={hero.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}
                    {hero.badge && (
                      <span className="absolute top-3 left-3 bg-[#D31F1F] text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {hero.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded text-white mb-2 inline-block"
                      style={{ backgroundColor: hero.category.color || '#D31F1F' }}
                    >
                      {hero.category.name}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight mb-2">
                      {hero.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{hero.excerpt}</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{hero.author.name}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(hero.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{hero.readingTime} min de lecture</span>
                    </div>
                  </div>
                </Link>
              </article>

              {/* Secondary featured */}
              <div className="space-y-6">
                {secondaryFeatured.map((article) => (
                  <article key={article.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <Link href={`/article/${article.slug}`}>
                      {article.image && (
                        <div className="relative w-full aspect-video overflow-hidden rounded bg-gray-100 mb-2">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-1 inline-block"
                        style={{ backgroundColor: article.category.color || '#D31F1F' }}
                      >
                        {article.category.name}
                      </span>
                      <h3 className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight text-base mb-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {article.author.name} • {formatDate(article.createdAt)}
                      </p>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Separator */}
        <hr className="border-[#D31F1F] border-t-2 mb-8" />

        {/* Latest articles grid */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-6 text-[#1A1A1A] border-b border-gray-200 pb-3">
            Derniers articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
              <article key={article.id} className="border-b border-gray-200 pb-4">
                <Link href={`/article/${article.slug}`}>
                  {article.image && (
                    <div className="relative w-full aspect-video overflow-hidden rounded bg-gray-100 mb-3">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {article.badge && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D31F1F] mb-1 block">
                      {article.badge}
                    </span>
                  )}
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-2 inline-block"
                    style={{ backgroundColor: article.category.color || '#D31F1F' }}
                  >
                    {article.category.name}
                  </span>
                  <h3 className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-2">{article.excerpt}</p>
                  <div className="text-xs text-gray-500">
                    <span>{article.author.name}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Empty state */}
        {latestArticles.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-serif mb-4">Aucun article disponible</p>
            <p className="text-sm">Lancez le seed pour charger les articles de démonstration.</p>
            <code className="text-xs bg-gray-100 px-3 py-2 rounded mt-4 inline-block">
              npm run seed
            </code>
          </div>
        )}

        {/* Category sections */}
        {categories.slice(0, 4).map(async (cat) => {
          const catArticles = await prisma.article.findMany({
            where: { categoryId: cat.id, status: 'published' },
            include: { author: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 3,
          });
          if (catArticles.length === 0) return null;

          return (
            <section key={cat.id} className="mt-10">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2" style={{ borderColor: cat.color || '#D31F1F' }}>
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">{cat.name}</h2>
                <Link href={`/categories/${cat.slug}`} className="text-xs font-medium text-gray-500 hover:text-[#D31F1F] uppercase tracking-wider">
                  Tout voir →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {catArticles.map((article) => (
                  <article key={article.id} className="border-b border-gray-200 pb-4">
                    <Link href={`/article/${article.slug}`}>
                      {article.image && (
                        <div className="relative w-full aspect-video overflow-hidden rounded bg-gray-100 mb-2">
                          <Image src={article.image} alt={article.title} fill className="object-cover" />
                        </div>
                      )}
                      <h3 className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight mb-1 text-sm">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500">{article.author.name} • {formatDate(article.createdAt)}</p>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
