import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing && existing.subscribed) {
      return NextResponse.json({ message: 'Vous êtes déjà abonné(e) à notre newsletter !' });
    }

    await prisma.newsletter.upsert({
      where: { email },
      create: { email, subscribed: true, token: crypto.randomUUID() },
      update: { subscribed: true },
    });

    return NextResponse.json({ message: 'Merci ! Votre inscription est confirmée.' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
