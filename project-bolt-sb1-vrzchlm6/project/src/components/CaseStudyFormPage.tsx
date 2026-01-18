import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import { ApiService } from '../lib/api';

export default function CaseStudyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    slug: '',
    heroImageUrl: '',
  });

  const isNewCaseStudy = id === 'new' || !id;

  useEffect(() => {
    if (!isNewCaseStudy && id) {
      loadCaseStudy();
    }
  }, [id, isNewCaseStudy]);

  const loadCaseStudy = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await ApiService.getCaseStudy(parseInt(id));
      const caseStudy = response.data;

      if (caseStudy) {
        setFormData({
          title: caseStudy.attributes.Title || '',
          shortDescription: caseStudy.attributes.ShortDescription || '',
          content: caseStudy.attributes.Content || '',
          slug: caseStudy.attributes.Slug || '',
          heroImageUrl: caseStudy.attributes.HeroImage?.data?.attributes?.url || '',
        });
      }
    } catch (error) {
      console.error('Error loading case study:', error);
      alert('Failed to load case study data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (shouldPublish: boolean = false) => {
    setIsSaving(true);
    try {
      console.log('Saving case study:', { ...formData, publish: shouldPublish });
      alert(`Case study ${shouldPublish ? 'published' : 'saved as draft'} successfully!`);
      navigate('/case-studies');
    } catch (error) {
      console.error('Error saving case study:', error);
      alert('Failed to save case study. API will be integrated later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => handleSave(true);
  const handleDraft = () => handleSave(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate('/case-studies')}
                className="hover:text-gray-900 transition-colors"
              >
                Case Studies
              </button>
              {!isNewCaseStudy && id && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <button
                    onClick={() => navigate(`/case-studies/${id}`)}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {formData.title || 'Case Study'}
                  </button>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {isNewCaseStudy ? 'New Case Study' : 'Edit'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDraft}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save as Draft</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-sm font-medium disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isNewCaseStudy ? 'Create New Case Study' : 'Edit Case Study'}
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter case study title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="case-study-slug"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Enter a brief description"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL
                </label>
                <input
                  id="heroImageUrl"
                  type="text"
                  value={formData.heroImageUrl}
                  onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the main content for this case study"
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
