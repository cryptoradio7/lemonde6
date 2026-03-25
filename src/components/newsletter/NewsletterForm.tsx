'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Inscription confirmée !');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <p className="text-green-400 text-sm">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            className="flex-1 px-3 py-2 text-sm text-[#1A1A1A] bg-white border border-gray-600 rounded focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm font-medium bg-white text-[#1A1A1A] rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : "S'abonner"}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-1">{message}</p>
      )}
      <p className="text-gray-500 text-xs mt-2">
        En vous abonnant, vous acceptez notre{' '}
        <a href="/confidentialite" className="underline hover:text-gray-300">politique de confidentialité</a>.
        Désabonnement possible à tout moment.
      </p>
    </div>
  );
}
