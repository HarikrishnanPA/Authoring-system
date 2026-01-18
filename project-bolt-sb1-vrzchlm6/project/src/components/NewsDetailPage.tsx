import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Share2 } from 'lucide-react';
import { marked } from 'marked';
import { ApiService, NewsDetailItem, getImageUrl } from '../lib/api';
import DetailPageLayout from './common/DetailPageLayout';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNewsItem();
    }
  }, [id]);

  const loadNewsItem = async () => {
    try {
      if (id) {
        const response = await ApiService.getNewsArticle(parseInt(id));
        setNewsItem(response.data);
      }
    } catch (error) {
      console.error('Error loading news item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!newsItem && !isLoading) {
    return (
      <DetailPageLayout
        isLoading={false}
        error={true}
        notFoundMessage="Article not found"
        onBack={() => navigate('/news')}
        backLabel="Back to News"
        showEdit={false}
      >
        <></>
      </DetailPageLayout>
    );
  }

  const attributes = newsItem?.attributes;

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
      onBack={() => navigate('/news')}
      backLabel="Back to News"
      onEdit={() => navigate(`/news/${id}/edit`)}
    >
      {attributes && (
        <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
          {/* Header Info */}
          <div className="space-y-6">
            {attributes.CategoryChip && (
              <div className="flex items-center gap-2">
                {attributes.CategoryChip.Image?.data && (
                  <img
                    src={getImageUrl(attributes.CategoryChip.Image.data.attributes.url)}
                    alt={attributes.CategoryChip.ImageLink}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-primary font-semibold tracking-wide uppercase text-sm">
                  {attributes.CategoryChip.ImageLink}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {attributes.Title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{attributes.TimePeriod || formatDate(attributes.publishedAt)}</span>
              </div>
              {attributes.Location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{attributes.Location}</span>
                </div>
              )}
              <button className="ml-auto flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
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

          {/* Intro / Highlight */}
          <div className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed font-serif">
            {attributes.ShortDescription}
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(attributes.Content || '') as string }} />
          </div>

          {/* Navigation/Tags Footer could go here if needed */}
        </div>
      )}
    </DetailPageLayout>
  );
}
