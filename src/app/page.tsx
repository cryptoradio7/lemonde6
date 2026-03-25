import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getHomePageData() {
  try {
    const [featuredArticles, latestArticles, categories] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'published', featured: true },
        include: { author: true, category: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        include: { author: true, category: true },
        orderBy: { publishedAt: 'desc' },
        take: 12,
      }),
      prisma.category.findMany({
        include: { _count: { select: { articles: true } } },
        orderBy: { name: 'asc' },
      }),
    ]);

    return { featuredArticles, latestArticles, categories };
  } catch {
    return { featuredArticles: [], latestArticles: [], categories: [] };
  }
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default async function HomePage() {
  const { featuredArticles, latestArticles, categories } = await getHomePageData();

  return (
    <div className="min-h-screen bg-white">
      {/* Breaking news bar */}
      <div className="breaking-news-bar">
        <div className="container-lemonde flex items-center gap-3">
          <span className="font-bold uppercase tracking-wider text-xs bg-white text-red-600 px-2 py-0.5 rounded">
            EN DIRECT
          </span>
          <span>Suivez toute l&apos;actualite en temps reel sur Le Monde6</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="container-lemonde">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-serif font-bold text-lemonde-blue">
              Le Monde6
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-lemonde-blue">
                Se connecter
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                S&apos;abonner
              </Link>
            </nav>
          </div>
          {/* Category nav */}
          <nav className="mt-4 flex gap-1 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorie/${cat.slug}`}
                className="text-sm font-medium whitespace-nowrap px-3 py-1 rounded hover:bg-gray-100 text-gray-700 hover:text-lemonde-blue"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container-lemonde py-8">
        {/* Featured articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <article
                  key={article.id}
                  className={index === 0 ? 'md:col-span-2' : ''}
                >
                  <Link href={`/article/${article.slug}`}>
                    <div className="relative overflow-hidden rounded bg-gray-100 mb-3" style={{ paddingBottom: index === 0 ? '56.25%' : '66.66%' }}>
                      {article.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <span
                        className="category-badge text-white mb-2 inline-block"
                        style={{ backgroundColor: article.category.color || '#003f8a' }}
                      >
                        {article.category.name}
                      </span>
                      <h2 className={`article-title ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'} mb-2`}>
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        <span>{article.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Separator */}
        <hr className="border-lemonde-blue border-t-2 mb-8" />

        {/* Latest articles grid */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6 text-lemonde-blue">
            Derniers articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <article key={article.id} className="article-card">
                <Link href={`/article/${article.slug}`}>
                  <span
                    className="category-badge text-white mb-2 inline-block"
                    style={{ backgroundColor: article.category.color || '#003f8a' }}
                  >
                    {article.category.name}
                  </span>
                  <h3 className="article-title text-lg mb-2">{article.title}</h3>
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    <span>{article.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(article.publishedAt)}</span>
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
            <p className="text-sm">Lancez le seed pour charger les articles de demonstration.</p>
            <code className="text-xs bg-gray-100 px-3 py-2 rounded mt-4 inline-block">
              npm run seed
            </code>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-lemonde-blue text-white mt-16 py-10">
        <div className="container-lemonde">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">Le Monde6</h3>
              <p className="text-sm text-blue-200">
                Toute l&apos;actualite en France et dans le monde.
              </p>
            </div>
            {categories.slice(0, 3).map((cat) => (
              <div key={cat.id}>
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">{cat.name}</h4>
              </div>
            ))}
          </div>
          <div className="border-t border-blue-700 pt-6 text-sm text-blue-300 flex flex-wrap gap-4">
            <Link href="/mentions-legales" className="hover:text-white">Mentions legales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white">Confidentialite</Link>
            <Link href="/newsletter" className="hover:text-white">Newsletter</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
