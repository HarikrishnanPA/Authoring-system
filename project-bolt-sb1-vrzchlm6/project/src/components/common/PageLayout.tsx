import { ReactNode } from 'react';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import Sidebar from '../Sidebar';

export type ViewMode = 'grid' | 'list';

interface PageLayoutProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
  children: ReactNode;
  headerContent?: ReactNode;
  isLoading?: boolean;
  emptyState?: ReactNode;
  
  // Search Props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // View Mode Props
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export default function PageLayout({
  title,
  description,
  actionLabel,
  onAction,
  action,
  children,
  headerContent,
  isLoading,
  emptyState,
  
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  
  viewMode,
  onViewModeChange,
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-dark mb-1">{title}</h1>
                <p className="text-base text-gray-600">{description}</p>
              </div>
              {action && action}
              {!action && actionLabel && onAction && (
                <button
                  onClick={onAction}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-semibold shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>{actionLabel}</span>
                </button>
              )}
            </div>

            {/* Controls Bar: Search & View Toggle */}
            {(onSearchChange || onViewModeChange) && (
              <div className="flex items-center justify-between gap-4">
                {/* Search Bar */}
                {onSearchChange && (
                  <div className="relative max-w-md flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery || ''}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base bg-gray-50"
                    />
                  </div>
                )}

                {/* View Toggle */}
                {onViewModeChange && viewMode && (
                  <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button
                      onClick={() => onViewModeChange('grid')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onViewModeChange('list')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'list'
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {headerContent && <div>{headerContent}</div>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : emptyState ? (
             emptyState
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
