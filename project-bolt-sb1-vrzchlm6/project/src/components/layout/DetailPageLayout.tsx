import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Layers } from 'lucide-react';
import Sidebar from './Sidebar';

interface DetailPageLayoutProps {
  isLoading?: boolean;
  error?: boolean;
  notFoundMessage?: string;
  onBack?: () => void;
  backLabel?: string;
  onEdit?: () => void;
  showEdit?: boolean;
  children: ReactNode;
  headerContent?: ReactNode;
}

export default function DetailPageLayout({
  isLoading,
  error,
  notFoundMessage = 'Item not found',
  onBack,
  backLabel = 'Back',
  onEdit,
  showEdit = true,
  children,
  headerContent,
}: DetailPageLayoutProps) {
  const navigate = useNavigate();

  // Determine back action
  const handleBack = onBack || (() => navigate(-1));

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Layers className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-dark mb-2">{notFoundMessage}</h2>
          <button
            onClick={handleBack}
            className="flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>{backLabel}</span>
            </button>
            <div className="flex items-center gap-4">
               {headerContent}
               {showEdit && onEdit && (
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-sm font-medium"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                </button>
               )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
