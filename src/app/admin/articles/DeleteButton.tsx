'use client';

export default function DeleteArticleButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <button type="button" onClick={handleDelete} className="text-red-600 hover:underline text-sm">
      Supprimer
    </button>
  );
}
