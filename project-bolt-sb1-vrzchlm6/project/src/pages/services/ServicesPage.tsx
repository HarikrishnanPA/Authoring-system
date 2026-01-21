import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { marked } from 'marked';
import { ApiService, ServicesDetailResponse, getImageUrl } from '@/lib/api';
import { PageLayout, CardGrid } from '@/components/layout';
import type { ViewMode } from '@/components/layout';

type ServiceItem = ServicesDetailResponse['data'][0];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.getServicesDetail();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    // Search filter
    const matchesSearch =
      service.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.attributes.Description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Draft filter
    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && service.attributes.publishedAt !== null) ||
      (filter === 'drafts' && service.attributes.publishedAt === null);
    
    return matchesSearch && matchesFilter;
  });

  const emptyState = (
    <div className="text-center py-20">
      <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-xl font-bold text-dark mb-2">
        {searchTerm ? 'No services found matching your search.' : 'No services yet.'}
      </p>
    </div>
  );

  const renderGrid = () => (
    <CardGrid>
      {filteredServices.map((service) => {
        const imageUrl = service.attributes.Image?.data?.attributes?.url;
        const fullImageUrl = getImageUrl(imageUrl);

        return (
          <div
            key={service.id}
            onClick={() => navigate(`/services/${service.id}`)}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
          >
            <div className="aspect-video bg-gray-100 overflow-hidden relative">
              {fullImageUrl ? (
                <img
                  src={fullImageUrl}
                  alt={service.attributes.Title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-300"><svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                  }}
                />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    <Layers className="w-12 h-12" />
                  </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {service.attributes.Title || 'Untitled Service'}
              </h3>
              {service.attributes.Description && (
                <div 
                  className="text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1 prose prose-sm max-w-none [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: marked.parse(service.attributes.Description) as string }}
                />
              )}
            </div>
          </div>
        );
      })}
    </CardGrid>
  );

  const renderList = () => (
    <div className="flex flex-col gap-4">
      {filteredServices.map((service) => {
        const imageUrl = service.attributes.Image?.data?.attributes?.url;
        const fullImageUrl = getImageUrl(imageUrl);

        return (
          <div
            key={service.id}
            onClick={() => navigate(`/services/${service.id}`)}
            className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-6"
          >
            <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
               {fullImageUrl ? (
                <img
                  src={fullImageUrl}
                  alt={service.attributes.Title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.className = 'w-full h-full flex items-center justify-center bg-gray-50';
                    e.currentTarget.parentElement!.innerHTML = '<svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Layers className="w-8 h-8" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
               <h3 className="text-lg font-bold text-dark mb-1 group-hover:text-primary transition-colors truncate">
                {service.attributes.Title || 'Untitled Service'}
               </h3>
               {service.attributes.Description && (
                  <div 
                    className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: marked.parse(service.attributes.Description) as string }}
                  />
               )}
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        );
      })}
    </div>
  );

  return (
    <PageLayout
      title="Services"
      description="Manage your service orders and requests"
      actionLabel="Create new entry"
      onAction={() => navigate('/services/new')}
      isLoading={isLoading}
      emptyState={filteredServices.length === 0 ? emptyState : undefined}
      
      searchQuery={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search services..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      headerContent={
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'published'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('drafts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'drafts'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts
          </button>
        </div>
      }
    >
      {viewMode === 'grid' ? renderGrid() : renderList()}
    </PageLayout>
  );
}
