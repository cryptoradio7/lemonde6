import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'published' };
    if (category) where.category = { slug: category };
    if (featured === 'true') where.featured = true;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: { author: { select: { id: true, name: true, avatar: true } }, category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['admin', 'journalist'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const data = await req.json();
    const { title, slug, excerpt, content, image, badge, categoryId, featured } = data;

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const authorId = parseInt(session.user.id, 10);
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image: image || null,
        badge: badge || null,
        featured: featured ?? false,
        status: 'published',
        readingTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200),
        categoryId: parseInt(categoryId, 10),
        authorId,
      },
      include: { author: { select: { id: true, name: true } }, category: true },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
