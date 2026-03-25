// Utility functions

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatDateRelative(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Il y a ${diffMinutes} min`;
  }
  if (diffHours < 24) {
    return `Il y a ${Math.floor(diffHours)}h`;
  }
  return formatDate(d);
}

export function formatDateFull(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    normal: '',
    analyse: 'ANALYSE',
    reportage: 'REPORTAGE',
    enquete: 'ENQUÊTE',
    chronique: 'CHRONIQUE',
    video: 'VIDÉO',
    podcast: 'PODCAST',
  };
  return labels[badge] ?? '';
}

export function getBadgeColor(badge: string): string {
  const colors: Record<string, string> = {
    normal: '',
    analyse: '#003189',
    reportage: '#666666',
    enquete: '#8B4513',
    chronique: '#2E7D32',
    video: '#1A1A1A',
    podcast: '#6A1B9A',
  };
  return colors[badge] ?? '#003189';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
