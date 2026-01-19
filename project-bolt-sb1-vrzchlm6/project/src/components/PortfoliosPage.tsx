import { Layers } from 'lucide-react';
import PageLayout from './common/PageLayout';

export default function PortfoliosPage() {
  const emptyState = (
    <div className="text-center py-20">
      <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-xl font-bold text-dark mb-2">
        No portfolios found.
      </p>
    </div>
  );

  return (
    <PageLayout
      title="Portfolios"
      description="Showcase your work"
      actionLabel="Add Portfolio"
      onAction={() => {}}
      emptyState={emptyState}
    >
      <div />
    </PageLayout>
  );
}
