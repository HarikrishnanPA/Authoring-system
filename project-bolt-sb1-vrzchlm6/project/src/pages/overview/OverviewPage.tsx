import { useNavigate } from 'react-router-dom';
import { Briefcase, BookOpen, Newspaper, FileText, Image, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout';
import { ApiService } from '@/lib/api';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [newsCount, setNewsCount] = useState<number>(() => {
    const cached = localStorage.getItem('sidebar_news_count');
    return cached ? parseInt(cached, 10) : 0;
  });
  const [caseStudiesCount, setCaseStudiesCount] = useState<number>(() => {
    const cached = localStorage.getItem('sidebar_case_studies_count');
    return cached ? parseInt(cached, 10) : 0;
  });
  const [servicesCount, setServicesCount] = useState<number>(() => {
    const cached = localStorage.getItem('sidebar_services_count');
    return cached ? parseInt(cached, 10) : 0;
  });
  
  const [recentNews, setRecentNews] = useState<any[]>(() => {
    const cached = localStorage.getItem('overview_recent_news');
    return cached ? JSON.parse(cached) : [];
  });
  const [recentCaseStudies, setRecentCaseStudies] = useState<any[]>(() => {
    const cached = localStorage.getItem('overview_recent_case_studies');
    return cached ? JSON.parse(cached) : [];
  });
  const [recentServices, setRecentServices] = useState<any[]>(() => {
    const cached = localStorage.getItem('overview_recent_services');
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, caseStudiesData, servicesData] = await Promise.all([
          ApiService.getNews(),
          ApiService.getCaseStudies(),
          ApiService.getServicesDetail(),
        ]);

        // Set Counts
        const newNewsCount = newsData.data?.length || 0;
        const newCaseStudiesCount = caseStudiesData.data?.length || 0;
        const newServicesCount = servicesData.data?.length || 0;

        setNewsCount(newNewsCount);
        setCaseStudiesCount(newCaseStudiesCount);
        setServicesCount(newServicesCount);

        // Cache the counts
        localStorage.setItem('sidebar_news_count', newNewsCount.toString());
        localStorage.setItem('sidebar_case_studies_count', newCaseStudiesCount.toString());
        localStorage.setItem('sidebar_services_count', newServicesCount.toString());

        // Helper to sort by date desc
        const sortByDate = (items: any[]) => {
          return [...items].sort((a, b) => {
            const dateA = new Date(a.attributes.publishedAt || a.attributes.createdAt).getTime();
            const dateB = new Date(b.attributes.publishedAt || b.attributes.createdAt).getTime();
            return dateB - dateA;
          });
        };

        // Set Recent Items (Top 3)
        const newRecentNews = sortByDate(newsData.data || []).slice(0, 3);
        const newRecentCaseStudies = sortByDate(caseStudiesData.data || []).slice(0, 3);
        const newRecentServices = sortByDate(servicesData.data || []).slice(0, 3);

        setRecentNews(newRecentNews);
        setRecentCaseStudies(newRecentCaseStudies);
        setRecentServices(newRecentServices);

        // Cache recent items
        localStorage.setItem('overview_recent_news', JSON.stringify(newRecentNews));
        localStorage.setItem('overview_recent_case_studies', JSON.stringify(newRecentCaseStudies));
        localStorage.setItem('overview_recent_services', JSON.stringify(newRecentServices));

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold text-dark mb-1">
              Welcome
            </h1>
            <p className="text-base text-gray-600">Get started by navigating to your workspace</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Navigate to</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/services')}
                className="bg-white hover:shadow-lg transition-all p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-start text-left gap-4 group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Briefcase className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                  {!loading && (
                    <div className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <span className="text-xl font-bold text-primary">{servicesCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Services</h3>
                  <p className="text-gray-600 text-base">Manage your service orders and requests</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/case-studies')}
                className="bg-white hover:shadow-lg transition-all p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-4 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <BookOpen className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                  {!loading && (
                    <div className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <span className="text-xl font-bold text-primary">{caseStudiesCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Case Studies</h3>
                  <p className="text-gray-600 text-base">Explore success stories and customer insights</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/news')}
                className="bg-white hover:shadow-lg transition-all p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-4 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Newspaper className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                  {!loading && (
                    <div className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <span className="text-xl font-bold text-primary">{newsCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">News</h3>
                  <p className="text-gray-600 text-base">Browse latest news and articles</p>
                </div>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <button
                onClick={() => navigate('/articles')}
                className="bg-white hover:shadow-lg transition-all p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-4 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Articles</h3>
                  <p className="text-gray-600 text-base">Manage your articles</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/portfolios')}
                className="bg-white hover:shadow-lg transition-all p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-4 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Image className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Portfolios</h3>
                  <p className="text-gray-600 text-base">Showcase your work</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/blogs')}
                className="bg-white hover:shadow-lg transition-all p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col text-left gap-4 group relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <PenTool className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Blogs</h3>
                  <p className="text-gray-600 text-base">Manage your blog posts</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
