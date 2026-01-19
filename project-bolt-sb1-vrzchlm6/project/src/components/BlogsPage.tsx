import { Layers } from 'lucide-react';
import PageLayout from './common/PageLayout';

export default function BlogsPage() {
  const emptyState = (
    <div className="text-center py-20">
      <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-xl font-bold text-dark mb-2">
        No blog posts found.
      </p>
    </div>
  );

  return (
    <PageLayout
      title="Blogs"
      description="Manage your blog posts"
      actionLabel="Add Blog"
      onAction={() => {}}
      emptyState={emptyState}
    >
      <div />
    </PageLayout>
  );
}
