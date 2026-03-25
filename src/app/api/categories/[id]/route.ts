import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
    }

    const id = Number(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
    }

    const { name, slug, description, color, active } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'Nom requis.' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug invalide (lettres minuscules, chiffres et tirets uniquement).' }, { status: 400 });
    }
    if (color && typeof color === 'string' && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return NextResponse.json({ error: 'Couleur invalide (format #RRGGBB attendu).' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim(), slug, description: description || null, color: color || '#D31F1F', active: active ?? true },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
    }

    const id = Number(params.id);
    const count = await prisma.article.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json({ error: 'Catégorie non vide.' }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
