import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';
import { marked } from 'marked';
import { ApiService, CaseStudyDetailItem, getImageUrl } from '../lib/api';
import DetailPageLayout from './common/DetailPageLayout';

export default function CaseStudyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<CaseStudyDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCaseStudy();
    }
  }, [id]);

  const loadCaseStudy = async () => {
    try {
      if (id) {
        const response = await ApiService.getCaseStudy(parseInt(id));
        setCaseStudy(response.data);
      }
    } catch (error) {
      console.error('Error loading case study:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!caseStudy && !isLoading) {
    return (
      <DetailPageLayout
        isLoading={false}
        error={true}
        notFoundMessage="Case Study not found"
        onBack={() => navigate('/case-studies')}
        backLabel="Back to Case Studies"
        showEdit={false}
      >
        <></>
      </DetailPageLayout>
    );
  }

  const attributes = caseStudy?.attributes;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DetailPageLayout
      isLoading={isLoading}
      onBack={() => navigate('/case-studies')}
      backLabel="Back to Case Studies"
      onEdit={() => navigate(`/case-studies/${id}/edit`)}
    >
      {attributes && (
        <div className="max-w-5xl mx-auto px-8 py-12 space-y-12">
          {/* Header */}
          <div className="space-y-6">
             <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4" />
                   <span>{formatDate(attributes.publishedAt)}</span>
                </div>
                {attributes.Author && (
                   <div className="flex items-center gap-2">
                     <User className="w-4 h-4" />
                     <span>{attributes.Author}</span>
                   </div>
                )}
             </div>
             
             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
               {attributes.Title}
             </h1>

             {attributes.Tags && attributes.Tags.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {attributes.Tags.map((tag, index) => (
                   <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                     <Tag className="w-3.5 h-3.5" />
                     <span>{tag.Name}</span>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Hero Image */}
          {attributes.HeroImage?.data && (
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-gray-100">
              <img
                src={getImageUrl(attributes.HeroImage.data.attributes.url)}
                alt={attributes.HeroImage.data.attributes.alternativeText || attributes.Title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-img:rounded-xl">
             <div dangerouslySetInnerHTML={{ __html: marked.parse(attributes.Content || '') as string }} />
          </div>

          {/* Quote/Highlight */}
          {attributes.Quote && (
             <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-2xl text-gray-700 my-8 bg-gray-50 p-6 rounded-r-xl">
                "{attributes.Quote}"
                {attributes.QuoteAuthor && (
                   <footer className="text-base text-gray-500 mt-4 not-italic font-medium">
                      — {attributes.QuoteAuthor}
                   </footer>
                )}
             </blockquote>
          )}

          {/* Results/Metrics */}
          {attributes.Results && attributes.Results.length > 0 && (
             <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-8">Key Results</h2>
                <div className="grid md:grid-cols-3 gap-8">
                   {attributes.Results.map((result, index) => (
                      <div key={index} className="space-y-2">
                         <div className="text-4xl font-bold text-primary">{result.Value}</div>
                         <div className="text-lg font-medium text-gray-300">{result.Label}</div>
                         {result.Description && (
                            <p className="text-sm text-gray-400">{result.Description}</p>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      )}
    </DetailPageLayout>
  );
}
