import { useNavigate } from 'react-router-dom';
import { Briefcase, BookOpen, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { ApiService } from '../lib/api';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [newsCount, setNewsCount] = useState<number>(0);
  const [caseStudiesCount, setCaseStudiesCount] = useState<number>(0);
  const [servicesCount, setServicesCount] = useState<number>(0);
  
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [recentCaseStudies, setRecentCaseStudies] = useState<any[]>([]);
  const [recentServices, setRecentServices] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, caseStudiesData, servicesData] = await Promise.all([
          ApiService.getNews(),
          ApiService.getCaseStudies(),
          ApiService.getServicesDetail(),
        ]);

        // Set Counts
        setNewsCount(newsData.data?.length || 0);
        setCaseStudiesCount(caseStudiesData.data?.length || 0);
        setServicesCount(servicesData.data?.length || 0);

        // Helper to sort by date desc
        const sortByDate = (items: any[]) => {
          return [...items].sort((a, b) => {
            const dateA = new Date(a.attributes.publishedAt || a.attributes.createdAt).getTime();
            const dateB = new Date(b.attributes.publishedAt || b.attributes.createdAt).getTime();
            return dateB - dateA;
          });
        };

        // Set Recent Items (Top 3)
        setRecentNews(sortByDate(newsData.data || []).slice(0, 3));
        setRecentCaseStudies(sortByDate(caseStudiesData.data || []).slice(0, 3));
        setRecentServices(sortByDate(servicesData.data || []).slice(0, 3));

      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-dark mb-4">
              Welcome
            </h1>
            <p className="text-gray-600 text-xl">Get started by navigating to your workspace</p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-dark mb-8">Navigate to</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <button
                onClick={() => navigate('/services')}
                className="bg-white hover:shadow-lg transition-all p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-start text-left gap-6 group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Briefcase className="w-8 h-8 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                  {!loading && (
                    <div className="bg-primary/10 px-4 py-2 rounded-full">
                      <span className="text-2xl font-bold text-primary">{servicesCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">Services</h3>
                  <p className="text-gray-600 text-base">Manage your service orders and requests</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/case-studies')}
                className="bg-white hover:shadow-lg transition-all p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-6 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <BookOpen className="w-8 h-8 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                  {!loading && (
                    <div className="bg-primary/10 px-4 py-2 rounded-full">
                      <span className="text-2xl font-bold text-primary">{caseStudiesCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">Case Studies</h3>
                  <p className="text-gray-600 text-base">Explore success stories and customer insights</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/news')}
                className="bg-white hover:shadow-lg transition-all p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-6 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Newspaper className="w-8 h-8 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                  {!loading && (
                    <div className="bg-primary/10 px-4 py-2 rounded-full">
                      <span className="text-2xl font-bold text-primary">{newsCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">News</h3>
                  <p className="text-gray-600 text-base">Browse latest news and articles</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 my-16"></div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-8">Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Services */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <Briefcase className="w-5 h-5 text-gray-400" />
                 <h3 className="font-bold text-gray-900">Latest Services</h3>
               </div>
               <div className="space-y-4">
                 {recentServices.length === 0 ? (
                   <div className="text-gray-400 text-sm">No services added yet.</div>
                 ) : (
                   recentServices.map((item) => (
                     <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/services/${item.id}`)}>
                        <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
                          {item.attributes.Title}
                        </h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(item.attributes.publishedAt || item.attributes.createdAt)}
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>

            {/* Recent Case Studies */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <BookOpen className="w-5 h-5 text-gray-400" />
                 <h3 className="font-bold text-gray-900">Latest Case Studies</h3>
               </div>
               <div className="space-y-4">
                 {recentCaseStudies.length === 0 ? (
                   <div className="text-gray-400 text-sm">No case studies added yet.</div>
                 ) : (
                   recentCaseStudies.map((item) => (
                     <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/case-studies/${item.id}`)}>
                        <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
                          {item.attributes.Title}
                        </h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(item.attributes.publishedAt || item.attributes.createdAt)}
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
            
            {/* Recent News */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <Newspaper className="w-5 h-5 text-gray-400" />
                 <h3 className="font-bold text-gray-900">Latest News</h3>
               </div>
               <div className="space-y-4">
                 {recentNews.length === 0 ? (
                   <div className="text-gray-400 text-sm">No news added yet.</div>
                 ) : (
                   recentNews.map((item) => (
                     <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/news/${item.id}`)}>
                        <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
                          {item.attributes.Title}
                        </h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(item.attributes.publishedAt || item.attributes.createdAt)}
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
}
