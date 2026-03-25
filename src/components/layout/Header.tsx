import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import SearchBar from '@/components/search/SearchBar';
import HeaderClient from '@/components/layout/HeaderClient';

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  } catch {
    return [];
  }
}

function getCurrentDate(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export default async function Header() {
  const [categories, session] = await Promise.all([
    getCategories(),
    auth(),
  ]);

  const currentDate = getCurrentDate();

  return (
    <header className="bg-white border-b border-[#E8E8E8]">
      {/* Top bar */}
      <div className="border-b border-[#E8E8E8]">
        <div className="container-lemonde">
          <div className="flex items-center justify-between h-14">
            {/* Left: date */}
            <div className="hidden md:block text-sm text-[#666666] capitalize">
              {currentDate}
            </div>

            {/* Center: Logo */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-center">
              <Link
                href="/"
                className="font-serif text-3xl font-bold text-[#1A1A1A] hover:text-[#D31F1F] transition-colors"
              >
                Le Monde6
              </Link>
            </div>

            {/* Right: auth + search */}
            <div className="flex items-center gap-3">
              <SearchBar />
              <HeaderClient session={session} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation rubriques */}
      <nav className="bg-white">
        <div className="container-lemonde">
          <div className="flex items-center gap-0 overflow-x-auto py-0 scrollbar-hide">
            <Link
              href="/les-plus-lus"
              className="text-sm font-bold whitespace-nowrap px-3 py-3 text-[#D31F1F] hover:border-b-2 hover:border-[#D31F1F] transition-all border-b-2 border-transparent"
            >
              Les plus lus
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-sm font-medium whitespace-nowrap px-3 py-3 text-[#1A1A1A] hover:text-[#D31F1F] hover:border-b-2 hover:border-[#D31F1F] transition-all border-b-2 border-transparent"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
