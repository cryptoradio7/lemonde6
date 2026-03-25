import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface Props {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });

    const article = await prisma.article.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, bio: true, avatar: true } }, category: true },
    });

    if (!article) return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || !['admin', 'journalist'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });

    const data = await req.json();
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.excerpt && { excerpt: data.excerpt }),
        ...(data.content && {
          content: data.content,
          readingTime: Math.ceil(data.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200),
        }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.status && { status: data.status }),
        ...(data.categoryId && { categoryId: parseInt(data.categoryId, 10) }),
      },
      include: { author: { select: { id: true, name: true } }, category: true },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });

    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
