import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { ApiService, getImageUrl } from '@/lib/api';
import { PageLayout, CardGrid } from '@/components/layout';
import type { ViewMode } from '@/components/layout';

interface CaseStudy {
  id: number;
  attributes: {
    Title: string;
    ShortDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Slug: string;
    HeroImage?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
  };
}

export default function CaseStudiesPage() {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.getCaseStudies();
      setCaseStudies(response.data || []);
    } catch (error) {
      console.error('Error loading case studies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCaseStudies = caseStudies.filter((study) => {
    // Search filter
    const matchesSearch =
      study.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.attributes.ShortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Draft filter
    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && study.attributes.publishedAt !== null) ||
      (filter === 'drafts' && study.attributes.publishedAt === null);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const emptyState = (
    <div className="text-center py-20">
      <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-xl font-bold text-dark mb-2">
        {searchTerm ? 'No case studies found.' : 'No case studies yet'}
      </h3>
      <p className="text-base text-gray-600">
        {searchTerm ? 'Try adjusting your search.' : 'Case studies will appear here once they are published.'}
      </p>
    </div>
  );

  const renderGrid = () => (
    <CardGrid>
      {filteredCaseStudies.map((caseStudy) => {
        const imageUrl = caseStudy.attributes.HeroImage?.data?.attributes?.url;
        const fullImageUrl = getImageUrl(imageUrl);

        return (
          <div
            key={caseStudy.id}
            onClick={() => navigate(`/case-studies/${caseStudy.id}`)}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
          >
            {fullImageUrl ? (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={fullImageUrl}
                  alt={caseStudy.attributes.HeroImage?.data?.attributes?.alternativeText || caseStudy.attributes.Title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.className = 'aspect-video bg-gradient-to-br from-gray-100 to-gray-200';
                  }}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {caseStudy.attributes.Title}
              </h3>
              <p className="text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                {caseStudy.attributes.ShortDescription}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-auto">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(caseStudy.attributes.publishedAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </CardGrid>
  );

  const renderList = () => (
    <div className="flex flex-col gap-4">
      {filteredCaseStudies.map((caseStudy) => {
        const imageUrl = caseStudy.attributes.HeroImage?.data?.attributes?.url;
        const fullImageUrl = getImageUrl(imageUrl);

        return (
          <div
            key={caseStudy.id}
            onClick={() => navigate(`/case-studies/${caseStudy.id}`)}
            className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-6"
          >
            <div className="w-32 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
              {fullImageUrl ? (
                <img
                  src={fullImageUrl}
                  alt={caseStudy.attributes.HeroImage?.data?.attributes?.alternativeText || caseStudy.attributes.Title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.className = 'w-full h-full bg-gradient-to-br from-gray-100 to-gray-200';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
            </div>

            <div className="flex-1 min-w-0">
               <h3 className="text-lg font-bold text-dark mb-1 group-hover:text-primary transition-colors truncate">
                {caseStudy.attributes.Title}
               </h3>
               <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                 {caseStudy.attributes.ShortDescription}
               </p>
               <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  <span>{formatDate(caseStudy.attributes.publishedAt)}</span>
               </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        );
      })}
    </div>
  );

  return (
    <PageLayout
      title="Case Studies"
      description="Success stories and customer insights"
      actionLabel="Create new entry"
      onAction={() => navigate('/case-studies/new')}
      isLoading={isLoading}
      emptyState={filteredCaseStudies.length === 0 ? emptyState : undefined}
      
      searchQuery={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search case studies..."
      
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
