'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    const data = await res.json();
    if (res.ok) {
      router.push('/auth/login?registered=1');
    } else {
      setError(data.error || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded shadow-md w-full max-w-md p-8">
        <Link href="/" className="block text-center font-serif text-2xl font-bold text-[#003189] mb-8">
          Le Monde6
        </Link>
        <h1 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6 text-center">Créer un compte</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#003189]" placeholder="Jean Dupont" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#003189]" placeholder="votre@email.fr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#003189]" placeholder="Minimum 8 caractères" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#003189]" placeholder="••••••••" />
          </div>
          <p className="text-xs text-gray-500">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/cgu" className="text-[#003189] hover:underline">CGU</Link>{' '}et notre{' '}
            <Link href="/confidentialite" className="text-[#003189] hover:underline">politique de confidentialité</Link>.
          </p>
          <button type="submit" disabled={loading} className="w-full bg-[#003189] text-white py-2.5 rounded text-sm font-medium hover:bg-[#002d6b] transition-colors disabled:opacity-50">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#003189] hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
