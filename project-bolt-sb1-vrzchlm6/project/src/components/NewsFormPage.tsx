import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Eye, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { ApiService } from '../lib/api';

interface Breadcrumb {
  Label: string;
  Link: string;
}

export default function NewsFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    slug: '',
    location: '',
    timePeriod: '',
    heroImageUrl: '',
    heroImageId: '',
    coverImageUrl: '',
    coverImageId: '',
    categoryChipText: '',
    categoryChipImageUrl: '',
    categoryChipId: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { Label: 'News', Link: '/news' },
    { Label: '', Link: '' },
  ]);

  const [lastAutoTitle, setLastAutoTitle] = useState('');

  const isNewNews = id === 'new' || !id;

  useEffect(() => {
    if (!isNewNews && id) {
      loadNewsArticle();
    }
  }, [id, isNewNews]);

  useEffect(() => {
    if (isNewNews && breadcrumbs.length > 0) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

      if (!lastBreadcrumb.Label || lastBreadcrumb.Label === lastAutoTitle) {
        const newBreadcrumbs = [...breadcrumbs];
        newBreadcrumbs[newBreadcrumbs.length - 1] = {
          Label: formData.title || '',
          Link: formData.slug ? `/news/${formData.slug}` : '',
        };
        setBreadcrumbs(newBreadcrumbs);
        setLastAutoTitle(formData.title);
      }
    }
  }, [formData.title, formData.slug, isNewNews]);

  const loadNewsArticle = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await ApiService.getNewsArticle(parseInt(id));
      const article = response.data;

      if (article) {
        const breadcrumbArray = article.attributes.BreadCrumb || [];
        const title = article.attributes.Title || '';
        const slug = article.attributes.Slug || '';

        let cleanedBreadcrumbs: Breadcrumb[] = [];

        if (breadcrumbArray.length > 0) {
          cleanedBreadcrumbs = breadcrumbArray.map((bc: any) => ({
            Label: bc.Label || '',
            Link: bc.Link || '',
          }));
        } else {
          cleanedBreadcrumbs = [
            { Label: 'News', Link: '/news' },
            { Label: title, Link: slug ? `/news/${slug}` : '' },
          ];
        }

        setFormData({
          title,
          shortDescription: article.attributes.ShortDescription || '',
          content: article.attributes.Content || '',
          slug,
          location: article.attributes.Location || '',
          timePeriod: article.attributes.TimePeriod || '',
          heroImageUrl: article.attributes.HeroImage?.data?.attributes?.url || '',
          heroImageId: article.attributes.HeroImage?.data?.id?.toString() || '',
          coverImageUrl: article.attributes.CoverImage?.data?.attributes?.url || '',
          coverImageId: article.attributes.CoverImage?.data?.id?.toString() || '',
          categoryChipText: article.attributes.CategoryChip?.ImageLink || '',
          categoryChipImageUrl: article.attributes.CategoryChip?.Image?.data?.attributes?.url || '',
          categoryChipId: article.attributes.CategoryChip?.data?.id?.toString() || '',
          seoTitle: article.attributes.seo?.metaTitle || '',
          seoDescription: article.attributes.seo?.metaDescription || '',
          seoKeywords: article.attributes.seo?.keywords || '',
        });

        setBreadcrumbs(cleanedBreadcrumbs);
      }
    } catch (error) {
      console.error('Error loading news article:', error);
      alert('Failed to load news article data.');
    } finally {
      setIsLoading(false);
    }
  };

  const addBreadcrumb = () => {
    setBreadcrumbs([...breadcrumbs, { Label: '', Link: '' }]);
  };

  const removeBreadcrumb = (index: number) => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.filter((_, i) => i !== index);
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  const updateBreadcrumb = (index: number, field: 'Label' | 'Link', value: string) => {
    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs[index][field] = value;
    setBreadcrumbs(newBreadcrumbs);
  };

  const moveBreadcrumb = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= breadcrumbs.length) return;

    const newBreadcrumbs = [...breadcrumbs];
    [newBreadcrumbs[index], newBreadcrumbs[newIndex]] = [newBreadcrumbs[newIndex], newBreadcrumbs[index]];
    setBreadcrumbs(newBreadcrumbs);
  };

  const handleSave = async (shouldPublish: boolean = false) => {
    setIsSaving(true);
    console.log('Publishing:', shouldPublish);
    try {
      const breadcrumbArray = breadcrumbs
        .filter(bc => bc.Label.trim() !== '' || bc.Link.trim() !== '')
        .map(bc => ({
          Label: bc.Label,
          Link: bc.Link,
        }));

      const payload = {
        Title: formData.title,
        Slug: formData.slug,
        Location: formData.location,
        TimePeriod: formData.timePeriod,
        ShortDescription: formData.shortDescription,
        Content: formData.content,
        HeroImage: formData.heroImageId ? parseInt(formData.heroImageId) : null,
        CoverImage: formData.coverImageId ? parseInt(formData.coverImageId) : null,
        BreadCrumb: breadcrumbArray,
        seo: {
          metaTitle: formData.seoTitle || formData.title,
          metaDescription: formData.seoDescription || formData.shortDescription,
          keywords: formData.seoKeywords,
        },
        CategoryChip: formData.categoryChipId ? parseInt(formData.categoryChipId) : null,
      };

      if (isNewNews) {
        await ApiService.createNewsArticle(payload);
        alert('News article created successfully!');
      } else {
        await ApiService.updateNewsArticle(parseInt(id!), payload);
        alert('News article updated successfully!');
      }

      navigate('/news');
    } catch (error) {
      console.error('Error saving news article:', error);
      alert(`Failed to save news article: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate('/news')}
                className="hover:text-gray-900 transition-colors"
              >
                News
              </button>
              {!isNewNews && id && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <button
                    onClick={() => navigate(`/news/${id}`)}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {formData.title || 'Article'}
                  </button>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {isNewNews ? 'New Article' : 'Edit'}
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
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isNewNews ? 'Create New News Article' : 'Edit News Article'}
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
                  placeholder="Enter news article title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="news-article-slug"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <input
                  id="timePeriod"
                  type="text"
                  value={formData.timePeriod}
                  onChange={(e) => setFormData({ ...formData, timePeriod: e.target.value })}
                  placeholder="e.g., January 2024 or Q1 2024"
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

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="heroImageId" className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Image ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="heroImageId"
                        type="number"
                        value={formData.heroImageId}
                        onChange={(e) => setFormData({ ...formData, heroImageId: e.target.value })}
                        placeholder="Enter image ID from media library"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Image URL (Preview)
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
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="coverImageId" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image ID
                      </label>
                      <input
                        id="coverImageId"
                        type="number"
                        value={formData.coverImageId}
                        onChange={(e) => setFormData({ ...formData, coverImageId: e.target.value })}
                        placeholder="Enter image ID from media library"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image URL (Preview)
                      </label>
                      <input
                        id="coverImageUrl"
                        type="text"
                        value={formData.coverImageUrl}
                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                        placeholder="https://example.com/cover.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category Chip</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="categoryChipId" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Chip ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="categoryChipId"
                      type="number"
                      value={formData.categoryChipId}
                      onChange={(e) => setFormData({ ...formData, categoryChipId: e.target.value })}
                      placeholder="Enter category chip ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="categoryChipText" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Text (Preview)
                    </label>
                    <input
                      id="categoryChipText"
                      type="text"
                      value={formData.categoryChipText}
                      onChange={(e) => setFormData({ ...formData, categoryChipText: e.target.value })}
                      placeholder="e.g., Technology, Business"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="categoryChipImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Icon URL (Preview)
                    </label>
                    <input
                      id="categoryChipImageUrl"
                      type="text"
                      value={formData.categoryChipImageUrl}
                      onChange={(e) => setFormData({ ...formData, categoryChipImageUrl: e.target.value })}
                      placeholder="https://example.com/icon.svg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Breadcrumb Navigation</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Define the breadcrumb trail for this article
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addBreadcrumb}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Breadcrumb
                  </button>
                </div>

                {breadcrumbs.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                      {breadcrumbs.map((bc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className={bc.Label ? 'text-gray-900' : 'text-gray-400 italic'}>
                            {bc.Label || '(empty)'}
                          </span>
                          {index < breadcrumbs.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => moveBreadcrumb(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBreadcrumb(index, 'down')}
                            disabled={index === breadcrumbs.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              value={breadcrumb.Label}
                              onChange={(e) => updateBreadcrumb(index, 'Label', e.target.value)}
                              placeholder="e.g., News"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Link
                            </label>
                            <input
                              type="text"
                              value={breadcrumb.Link}
                              onChange={(e) => updateBreadcrumb(index, 'Link', e.target.value)}
                              placeholder="e.g., /news"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeBreadcrumb(index)}
                          disabled={breadcrumbs.length === 1}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed mt-6"
                          title="Remove breadcrumb"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      id="seoTitle"
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="Leave empty to use article title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Leave empty to use short description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      id="seoKeywords"
                      type="text"
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the main content for this news article"
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
