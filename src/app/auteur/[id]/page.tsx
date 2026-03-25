import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { title: 'Auteur introuvable' };
  const author = await prisma.user.findUnique({ where: { id } });
  if (!author) return { title: 'Auteur introuvable' };
  return {
    title: `${author.name} — Le Monde6`,
    description: author.bio ?? `Articles de ${author.name}`,
  };
}

export default async function AuthorPage({ params }: Props) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const author = await prisma.user.findUnique({ where: { id } });
  if (!author) notFound();

  const articles = await prisma.article.findMany({
    where: { authorId: author.id, status: 'published' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Header />
      <main className="container-lemonde py-8">
        {/* Author profile */}
        <div className="flex items-start gap-6 mb-10 pb-8 border-b border-gray-200">
          {author.avatar ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
              <Image src={author.avatar} alt={author.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#D31F1F] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {author.name[0]}
            </div>
          )}
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">{author.name}</h1>
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 mb-2">
              {author.role === 'journalist' ? 'Journaliste' : author.role === 'admin' ? 'Rédacteur en chef' : 'Auteur'}
            </span>
            {author.bio && <p className="text-gray-600 leading-relaxed mt-2">{author.bio}</p>}
            <p className="text-sm text-gray-400 mt-2">
              {articles.length} article{articles.length > 1 ? 's' : ''} publié{articles.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Articles */}
        <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6">Articles de {author.name}</h2>
        {articles.length === 0 ? (
          <p className="text-gray-500">Aucun article publié pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} className="border-b border-gray-200 pb-4">
                <Link href={`/article/${article.slug}`}>
                  {article.image && (
                    <div className="relative w-full aspect-video overflow-hidden rounded mb-3">
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    </div>
                  )}
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-2"
                    style={{ backgroundColor: article.category.color || '#D31F1F' }}
                  >
                    {article.category.name}
                  </span>
                  <h3 className="font-serif font-bold text-[#1A1A1A] hover:text-[#D31F1F] leading-tight mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500">{formatDate(article.createdAt)}</p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
