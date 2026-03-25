import CategoryForm from '../CategoryForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nouvelle catégorie — Admin' };

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle catégorie</h1>
      <CategoryForm />
    </div>
  );
}
