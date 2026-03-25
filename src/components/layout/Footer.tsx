import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="bg-[#1A1A1A] text-white mt-16">
      {/* Newsletter section */}
      <div className="border-b border-gray-700">
        <div className="container-lemonde py-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-xl font-bold mb-2">Recevez nos newsletters</h3>
            <p className="text-gray-400 text-sm mb-4">
              Chaque matin, l&apos;essentiel de l&apos;actualité dans votre boîte mail.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-lemonde py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-xl font-bold mb-4">Le Monde6</h3>
            <p className="text-sm text-gray-400 mb-4">
              Toute l&apos;actualité en France et dans le monde.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">Twitter/X</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">Instagram</a>
            </div>
          </div>

          {/* Rubriques */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Rubriques</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More rubriques */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Plus de rubriques</h4>
            <ul className="space-y-2">
              {categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-sm text-gray-400 hover:text-white">Recherche</Link></li>
              <li><Link href="/auth/register" className="text-sm text-gray-400 hover:text-white">S&apos;abonner</Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white">Se connecter</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/mentions-legales" className="text-sm text-gray-400 hover:text-white">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="text-sm text-gray-400 hover:text-white">Confidentialité</Link></li>
              <li><Link href="/cgu" className="text-sm text-gray-400 hover:text-white">CGU</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-sm text-gray-500">
          <p>© Le Monde6 2026 — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
