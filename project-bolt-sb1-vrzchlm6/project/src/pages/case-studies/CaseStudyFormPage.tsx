import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Eye, Plus, Trash2, MoveUp, MoveDown, FileText, EyeIcon } from 'lucide-react';
import { Sidebar } from '@/components/layout';
import { RichTextEditor } from '@/components/editor';
import { ApiService } from '@/lib/api';
import { marked } from 'marked';

// Configure marked to use GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface Breadcrumb {
  Label: string;
  Link: string;
}

export default function CaseStudyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    heroImageId: '',
    shortDescription: '',
    content: '',
    formTitle: '',
    formDescription: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoMetaImageId: '',
  });

  const [metaSocial, setMetaSocial] = useState<Array<{
    socialNetwork: string;
    title: string;
    description: string;
    imageId: string;
  }>>([]);

  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { Label: 'Case Studies', Link: '/case-studies' },
    { Label: '', Link: '' },
  ]);

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
        const breadcrumbArray = caseStudy.attributes.BreadCrumb || [];
        const title = caseStudy.attributes.Title || '';
        const slug = caseStudy.attributes.Slug || '';

        let cleanedBreadcrumbs: Breadcrumb[] = [];
        if (breadcrumbArray.length > 0) {
          cleanedBreadcrumbs = breadcrumbArray.map((bc: any) => ({
            Label: bc.Label || '',
            Link: bc.Link || '',
          }));
        } else {
          cleanedBreadcrumbs = [
            { Label: 'Case Studies', Link: '/case-studies' },
            { Label: title, Link: slug ? `/case-studies/${slug}` : '' },
          ];
        }

        setFormData({
          title,
          slug,
          heroImageId: caseStudy.attributes.HeroImage?.data?.id?.toString() || '',
          shortDescription: caseStudy.attributes.ShortDescription || '',
          content: caseStudy.attributes.Content || '',
          formTitle: caseStudy.attributes.FormTitle || '',
          formDescription: caseStudy.attributes.FormDescription || '',
          seoTitle: caseStudy.attributes.seo?.metaTitle || '',
          seoDescription: caseStudy.attributes.seo?.metaDescription || '',
          seoKeywords: caseStudy.attributes.seo?.keywords || '',
          seoMetaImageId: caseStudy.attributes.seo?.metaImage?.data?.id?.toString() || '',
        });

        // Load metaSocial data
        const metaSocialData = caseStudy.attributes.seo?.metaSocial || [];
        setMetaSocial(
          metaSocialData.map((social: any) => ({
            socialNetwork: social.socialNetwork || '',
            title: social.title || '',
            description: social.description || '',
            imageId: social.image?.data?.id?.toString() || '',
          }))
        );

        setBreadcrumbs(cleanedBreadcrumbs);
      }
    } catch (error) {
      console.error('Error loading case study:', error);
      alert('Failed to load case study data.');
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
        ShortDescription: formData.shortDescription,
        Content: formData.content,
        FormTitle: formData.formTitle,
        FormDescription: formData.formDescription,
      };

      // Add HeroImage if set
      if (formData.heroImageId && formData.heroImageId !== '') {
        payload.HeroImage = parseInt(formData.heroImageId);
      }

      // Add breadcrumbs if not empty
      if (breadcrumbArray.length > 0) {
        payload.BreadCrumb = breadcrumbArray;
      }

      // Add SEO
      const seoPayload: any = {
        metaTitle: formData.seoTitle || formData.title,
        metaDescription: formData.seoDescription || formData.shortDescription,
        keywords: formData.seoKeywords,
      };

      // Add metaImage if set
      if (formData.seoMetaImageId && formData.seoMetaImageId !== '') {
        seoPayload.metaImage = parseInt(formData.seoMetaImageId);
      }

      // Add metaSocial if set
      if (metaSocial.length > 0) {
        seoPayload.metaSocial = metaSocial
          .filter(social => social.socialNetwork && social.title)
          .map(social => ({
            socialNetwork: social.socialNetwork,
            title: social.title,
            description: social.description,
            image: social.imageId ? parseInt(social.imageId) : undefined,
          }));
      }

      payload.seo = seoPayload;

      console.log('Payload:', payload);
      alert(`Case study ${shouldPublish ? 'published' : 'saved as draft'} successfully!`);
      navigate('/case-studies');
    } catch (error) {
      console.error('Error saving case study:', error);
      alert(`Failed to save case study: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isNewCaseStudy ? 'Create New Case Study' : 'Edit Case Study'}
            </h2>

            <div className="space-y-6">
              {/* 1. Breadcrumb Navigation */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">BreadCrumb (2)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Define the breadcrumb trail for this case study
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
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBreadcrumb(index, 'down')}
                            disabled={index === breadcrumbs.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
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
                              placeholder="e.g., Case Studies"
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
                              placeholder="e.g., /case-studies"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeBreadcrumb(index)}
                          disabled={breadcrumbs.length === 1}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed mt-6"
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
                    placeholder="Enter case study title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
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
              </div>

              {/* 3. HeroImage */}
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

              {/* 5. Content with Preview Toggle */}
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
                      Preview mode
                    </button>
                  </div>
                </div>

                {!isPreviewMode ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      placeholder="Enter the main content for this case study"
                    />
                  </div>
                ) : (
                  <div className="w-full min-h-[300px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
                    <div className="prose prose-slate max-w-none">
                      {formData.content ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(formData.content) as string
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

              {/* 6. Form Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Form Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      FormTitle
                    </label>
                    <input
                      id="formTitle"
                      type="text"
                      value={formData.formTitle}
                      onChange={(e) => setFormData({ ...formData, formTitle: e.target.value })}
                      placeholder="Think your idea makes lives simpler?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      FormDescription
                    </label>
                    <input
                      id="formDescription"
                      type="text"
                      value={formData.formDescription}
                      onChange={(e) => setFormData({ ...formData, formDescription: e.target.value })}
                      placeholder="We can help you transform your business."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 7. SEO Section */}
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
                        placeholder="Leave empty to use case study title"
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
                    <label htmlFor="seoMetaImageId" className="block text-sm font-medium text-gray-700 mb-2">
                      metaImage
                    </label>
                    <input
                      id="seoMetaImageId"
                      type="number"
                      value={formData.seoMetaImageId}
                      onChange={(e) => setFormData({ ...formData, seoMetaImageId: e.target.value })}
                      placeholder="Enter meta image ID from media library"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Image ID from Strapi media library</p>
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

                  {/* metaSocial Section */}
                  <div className="col-span-2 border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">metaSocial ({metaSocial.length})</h4>
                        <p className="text-sm text-gray-500 mt-1">Social media metadata for sharing</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMetaSocial([...metaSocial, { socialNetwork: 'Facebook', title: '', description: '', imageId: '' }])}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add an entry
                      </button>
                    </div>

                    <div className="space-y-4">
                      {metaSocial.map((social, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    socialNetwork <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={social.socialNetwork}
                                    onChange={(e) => {
                                      const updated = [...metaSocial];
                                      updated[index].socialNetwork = e.target.value;
                                      setMetaSocial(updated);
                                    }}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                  >
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    title <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={social.title}
                                    onChange={(e) => {
                                      const updated = [...metaSocial];
                                      updated[index].title = e.target.value;
                                      setMetaSocial(updated);
                                    }}
                                    placeholder="max. 60 characters"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  value={social.description}
                                  onChange={(e) => {
                                    const updated = [...metaSocial];
                                    updated[index].description = e.target.value;
                                    setMetaSocial(updated);
                                  }}
                                  placeholder="max. 65 characters"
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none resize-none"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  image
                                </label>
                                <input
                                  type="number"
                                  value={social.imageId}
                                  onChange={(e) => {
                                    const updated = [...metaSocial];
                                    updated[index].imageId = e.target.value;
                                    setMetaSocial(updated);
                                  }}
                                  placeholder="Image ID from media library"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = metaSocial.filter((_, i) => i !== index);
                                setMetaSocial(updated);
                              }}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              title="Remove entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
