import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Props {
  params: { id: string };
}

export async function POST(_req: NextRequest, { params }: Props) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });

    const article = await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
