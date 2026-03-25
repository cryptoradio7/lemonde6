import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDateFull, formatDate } from '@/lib/utils';
import ShareButtons from '@/components/article/ShareButtons';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Props {
  params: { slug: string };
}

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: 'published' },
    include: { author: true, category: true },
  });
}

async function getRelatedArticles(categoryId: number, excludeId: number) {
  return prisma.article.findMany({
    where: { categoryId, status: 'published', id: { not: excludeId } },
    include: { author: true, category: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article introuvable' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [{ url: article.image }] : [],
      type: 'article',
      publishedTime: article.createdAt.toISOString(),
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  // Increment views
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const related = await getRelatedArticles(article.category.id, article.id);
  const articleUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/article/${article.slug}`;

  return (
    <>
      <Header />
      <main className="container-lemonde py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#D31F1F]">Accueil</Link>
          <span>/</span>
          <Link href={`/categories/${article.category.slug}`} className="hover:text-[#D31F1F]">
            {article.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          {article.badge && (
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#D31F1F] mb-2">
              {article.badge}
            </span>
          )}

          {/* Category badge */}
          <span
            className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded text-white mb-4 ml-2"
            style={{ backgroundColor: article.category.color || '#D31F1F' }}
          >
            {article.category.name}
          </span>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-4">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 font-serif italic mb-6 leading-relaxed border-l-4 border-[#D31F1F] pl-4">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
            <Link href={`/auteur/${article.author.id}`} className="font-medium text-[#1A1A1A] hover:text-[#D31F1F]">
              {article.author.name}
            </Link>
            <span>{formatDateFull(article.createdAt)}</span>
            <span>{article.readingTime} min de lecture</span>
            <span>{article.views.toLocaleString('fr-FR')} vues</span>
          </div>

          {/* Main image */}
          {article.image && (
            <figure className="mb-8">
              <div className="relative w-full aspect-video overflow-hidden rounded">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {article.imageCaption && (
                <figcaption className="text-xs text-gray-500 mt-2">
                  {article.imageCaption}
                  {article.imageCredit && (
                    <span className="ml-2 text-gray-400">© {article.imageCredit}</span>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none font-serif leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-[#1A1A1A] [&_p]:mb-4 [&_p]:text-gray-800 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Partager cet article</p>
            <ShareButtons url={articleUrl} title={article.title} />
          </div>

          {/* Author box */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-start gap-4 bg-gray-50 rounded p-4">
            <div className="w-12 h-12 rounded-full bg-[#D31F1F] text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              {article.author.name[0]}
            </div>
            <div>
              <Link href={`/auteur/${article.author.id}`} className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F]">
                {article.author.name}
              </Link>
              {article.author.bio && (
                <p className="text-sm text-gray-600 mt-1">{article.author.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 max-w-3xl mx-auto">
            <h2 className="font-serif text-xl font-bold mb-6 text-[#1A1A1A]">À lire aussi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <article key={rel.id} className="border-b border-gray-200 pb-4">
                  <Link href={`/article/${rel.slug}`}>
                    {rel.image && (
                      <div className="relative w-full aspect-video overflow-hidden rounded mb-3">
                        <Image src={rel.image} alt={rel.title} fill className="object-cover" />
                      </div>
                    )}
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-2"
                      style={{ backgroundColor: rel.category.color || '#D31F1F' }}
                    >
                      {rel.category.name}
                    </span>
                    <h3 className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight text-sm">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{rel.author.name} • {formatDate(rel.createdAt)}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
