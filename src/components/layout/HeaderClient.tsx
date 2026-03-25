'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Session } from 'next-auth';

interface HeaderClientProps {
  session: Session | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-[#1A1A1A] hover:text-[#D31F1F] font-medium"
        >
          <span className="hidden sm:block">{session.user.name || session.user.email}</span>
          <span className="w-8 h-8 rounded-full bg-[#D31F1F] text-white flex items-center justify-center text-xs font-bold">
            {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
          </span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-10 bg-white border border-[#E8E8E8] shadow-lg rounded w-48 z-50">
            <div className="px-4 py-3 border-b border-[#E8E8E8]">
              <p className="text-sm font-medium text-[#1A1A1A] truncate">{session.user.name}</p>
              <p className="text-xs text-[#666666] truncate">{session.user.email}</p>
            </div>
            {session.user.role === 'admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F4F4F4]"
                onClick={() => setMenuOpen(false)}
              >
                Administration
              </Link>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#D31F1F] hover:bg-[#F4F4F4]"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="text-sm text-[#1A1A1A] hover:text-[#D31F1F] font-medium hidden sm:block"
      >
        Se connecter
      </Link>
      <Link
        href="/auth/register"
        className="text-sm bg-[#D31F1F] text-white px-3 py-1.5 rounded hover:bg-[#b01818] transition-colors font-medium"
      >
        S&apos;abonner
      </Link>
    </div>
  );
}
