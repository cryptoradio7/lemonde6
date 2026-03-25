import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token manquant.' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.findUnique({ where: { token } });
    if (!subscriber) {
      return NextResponse.json({ error: 'Abonnement introuvable.' }, { status: 404 });
    }

    await prisma.newsletter.update({
      where: { token },
      data: { subscribed: false },
    });

    return NextResponse.redirect(
      new URL('/?unsubscribed=1', req.url)
    );
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
