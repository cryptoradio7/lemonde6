// Shared TypeScript types for lemonde6

export type ArticleStatus = 'draft' | 'published' | 'archived';
export type ArticleBadge = 'normal' | 'analyse' | 'reportage' | 'enquete' | 'chronique' | 'video' | 'podcast';
export type UserRole = 'reader' | 'journalist' | 'admin';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
}

export interface Author {
  id: string;
  name: string;
  bio?: string | null;
  avatar?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleWithRelations {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  status: string;
  featured: boolean;
  views: number;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string;
  author: Author;
  category: Category;
  tags?: { tag: Tag }[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Extend NextAuth session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
    id?: string;
  }
}
