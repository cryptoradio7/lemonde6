'use client';

export default function DeleteCategoryButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <button type="button" onClick={handleDelete} className="text-red-600 hover:underline text-sm">
      Supprimer
    </button>
  );
}
