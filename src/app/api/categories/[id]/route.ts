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
    const { name, slug, description, color, active } = await request.json();

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description: description || null, color, active },
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
