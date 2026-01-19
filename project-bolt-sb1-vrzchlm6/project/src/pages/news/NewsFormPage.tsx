import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Eye, Plus, Trash2, MoveUp, MoveDown, FileText, EyeIcon } from 'lucide-react';
import { Sidebar } from '@/components/layout';
import { ApiService } from '@/lib/api';

interface Breadcrumb {
  Label: string;
  Link: string;
}

export default function NewsFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
    setError(null);
    console.log('Publishing:', shouldPublish);
    
    try {
      const breadcrumbArray = breadcrumbs
        .filter(bc => bc.Label.trim() !== '' || bc.Link.trim() !== '')
        .map(bc => ({
          Label: bc.Label,
          Link: bc.Link,
        }));

      const payload: any = {
        Title: formData.title,
        Slug: formData.slug,
        Location: formData.location,
        TimePeriod: formData.timePeriod,
        ShortDescription: formData.shortDescription,
        Content: formData.content,
      };

      // Add images if set
      if (formData.heroImageId && formData.heroImageId !== '') {
        payload.HeroImage = parseInt(formData.heroImageId);
      }
      
      if (formData.coverImageId && formData.coverImageId !== '') {
        payload.CoverImage = parseInt(formData.coverImageId);
      }

      // Add CategoryChip properly formatted if set
      if (formData.categoryChipId && formData.categoryChipId !== '') {
        payload.CategoryChip = {
          ImageLink: formData.categoryChipText || '',
          Image: parseInt(formData.categoryChipId),
        };
      }

      // Add breadcrumbs if not empty
      if (breadcrumbArray.length > 0) {
        payload.BreadCrumb = breadcrumbArray;
      }

      // Add SEO
      payload.seo = {
        metaTitle: formData.seoTitle || formData.title,
        metaDescription: formData.seoDescription || formData.shortDescription,
        keywords: formData.seoKeywords,
      };

      console.log('Payload:', payload);

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
              {/* 1. Breadcrumb Navigation - First as per Strapi */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Breadcrumb (2)</h3>
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
                    Add an entry
                  </button>
                </div>

                <div className="space-y-3">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
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

              {/* 2. Title & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
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
              </div>

              {/* 3. HeroImage & CoverImage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="heroImageId" className="block text-sm font-medium text-gray-700 mb-2">
                    HeroImage <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="heroImageId"
                    type="number"
                    value={formData.heroImageId}
                    onChange={(e) => setFormData({ ...formData, heroImageId: e.target.value })}
                    placeholder="Enter image ID from media library"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Image ID from Strapi media library</p>
                </div>

                <div>
                  <label htmlFor="coverImageId" className="block text-sm font-medium text-gray-700 mb-2">
                    CoverImage
                  </label>
                  <input
                    id="coverImageId"
                    type="number"
                    value={formData.coverImageId}
                    onChange={(e) => setFormData({ ...formData, coverImageId: e.target.value })}
                    placeholder="Enter image ID from media library"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Image ID from Strapi media library</p>
                </div>
              </div>

              {/* 4. ShortDescription */}
              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  ShortDescription <span className="text-red-500">*</span>
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

              {/* 5. Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(false)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        !isPreviewMode
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(true)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        isPreviewMode
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <EyeIcon className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>

                {!isPreviewMode ? (
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter the main content for this news article"
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none font-mono text-sm"
                  />
                ) : (
                  <div className="w-full min-h-[300px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="prose prose-sm max-w-none">
                      {formData.content ? (
                        <div
                          className="whitespace-pre-wrap break-words"
                          dangerouslySetInnerHTML={{
                            __html: formData.content
                              // Images: ![alt](url)
                              .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />')
                              // Links: [text](url)
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
                              // Bold: **text**
                              .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
                              // Italic: *text*
                              .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
                              // Headings
                              .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
                              .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
                              .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
                              // Line breaks
                              .replace(/\n\n/g, '</p><p class="mb-2">')
                              .replace(/^(.+)$/gm, '<p class="mb-2">$1</p>')
                          }}
                        />
                      ) : (
                        <p className="text-gray-400 italic">No content to preview</p>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Supports markdown formatting</p>
              </div>

              {/* 6. SEO Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">seo</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        metaTitle
                      </label>
                      <input
                        id="seoTitle"
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                        placeholder="Leave empty to use article title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">max. 60 characters</p>
                    </div>

                    <div>
                      <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        metaDescription
                      </label>
                      <textarea
                        id="seoDescription"
                        value={formData.seoDescription}
                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                        placeholder="Leave empty to use short description"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">min. 50 / max. 160 characters</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                      keywords
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

              {/* 7. CategoryChip - Last as per Strapi */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">CategoryChip</h3>
                <p className="text-sm text-gray-500 mb-4">Category badge with icon and text label</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="categoryChipId" className="block text-sm font-medium text-gray-700 mb-2">
                      Image ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="categoryChipId"
                      type="number"
                      value={formData.categoryChipId}
                      onChange={(e) => setFormData({ ...formData, categoryChipId: e.target.value })}
                      placeholder="Enter category icon ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Icon/image ID from Strapi media library</p>
                  </div>

                  <div>
                    <label htmlFor="categoryChipText" className="block text-sm font-medium text-gray-700 mb-2">
                      ImageLink (Text Label)
                    </label>
                    <input
                      id="categoryChipText"
                      type="text"
                      value={formData.categoryChipText}
                      onChange={(e) => setFormData({ ...formData, categoryChipText: e.target.value })}
                      placeholder="e.g., Technology, Business"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Category label text</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
