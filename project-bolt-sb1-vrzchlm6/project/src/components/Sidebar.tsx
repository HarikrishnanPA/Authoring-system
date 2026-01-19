import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Grid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { ApiService } from '../lib/api';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
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
  const totalPages = 3;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [newsData, caseStudiesData, servicesData] = await Promise.all([
          ApiService.getNews(),
          ApiService.getCaseStudies(),
          ApiService.getServicesDetail(),
        ]);

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
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isOverviewActive = location.pathname === '/overview';
  const isServicesActive = location.pathname.startsWith('/services');
  const isCaseStudiesActive = location.pathname.startsWith('/case-studies');
  const isNewsActive = location.pathname.startsWith('/news');

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-3xl flex items-center justify-center">
            <Grid className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Authoring System</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 py-8">
        <nav className="px-4 space-y-2">
          <button
            onClick={() => navigate('/overview')}
            className={`w-full text-left px-4 py-3 text-base font-semibold rounded-2xl transition-all ${
              isOverviewActive
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
            }`}
          >
            Overview
          </button>

          <div className="pt-6">
            <div className="px-4 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</span>
              <span className="text-xs font-bold text-gray-400">{totalPages}</span>
            </div>
            <button
              onClick={() => navigate('/services')}
              className={`w-full px-4 py-3 text-base font-semibold rounded-2xl transition-all flex items-center justify-between ${
                isServicesActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              <span>Services</span>
              <span className={`text-sm font-semibold ${isServicesActive ? 'text-primary' : 'text-gray-400'}`}>
                {servicesCount}
              </span>
            </button>
            <button
              onClick={() => navigate('/case-studies')}
              className={`w-full px-4 py-3 text-base font-semibold rounded-2xl transition-all flex items-center justify-between ${
                isCaseStudiesActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              <span>Case Studies</span>
              <span className={`text-sm font-semibold ${isCaseStudiesActive ? 'text-primary' : 'text-gray-400'}`}>
                {caseStudiesCount}
              </span>
            </button>
            <button
              onClick={() => navigate('/news')}
              className={`w-full px-4 py-3 text-base font-semibold rounded-2xl transition-all flex items-center justify-between ${
                isNewsActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              <span>News</span>
              <span className={`text-sm font-semibold ${isNewsActive ? 'text-primary' : 'text-gray-400'}`}>
                {newsCount}
              </span>
            </button>
            <button
              onClick={() => navigate('/articles')}
              className={`w-full px-4 py-3 text-base font-semibold rounded-2xl transition-all flex items-center justify-between ${
                location.pathname.startsWith('/articles')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              <span>Articles</span>
            </button>
            <button
              onClick={() => navigate('/portfolios')}
              className={`w-full px-4 py-3 text-base font-semibold rounded-2xl transition-all flex items-center justify-between ${
                location.pathname.startsWith('/portfolios')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              <span>Portfolios</span>
            </button>
            <button
              onClick={() => navigate('/blogs')}
              className={`w-full px-4 py-3 text-base font-semibold rounded-2xl transition-all flex items-center justify-between ${
                location.pathname.startsWith('/blogs')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              <span>Blogs</span>
            </button>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
