import { Layers } from 'lucide-react';
import { PageLayout } from '@/components/layout';

export default function ArticlesPage() {
  const emptyState = (
    <div className="text-center py-20">
      <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-xl font-bold text-dark mb-2">
        No articles found.
      </p>
    </div>
  );

  return (
    <PageLayout
      title="Articles"
      description="Manage your articles"
      actionLabel="Add Article"
      onAction={() => {}}
      emptyState={emptyState}
    >
      <div />
    </PageLayout>
  );
}
