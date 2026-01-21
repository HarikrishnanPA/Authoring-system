import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Eye, Plus, Trash, MoveUp, MoveDown } from 'lucide-react';
import { Sidebar } from '@/components/layout';
import MarkdownEditorWithPreview from '@/components/editor/MarkdownEditorWithPreview';
import { ApiService, MediaFile } from '@/lib/api';
import MediaPicker from '@/components/media/MediaPicker';

interface HeroCardItem {
  Title: string;
  Description: string;
}

interface SectionOneCardItem {
  Title: string;
  Description: string;
  Tag: string;
  Icon: MediaFile | null;
}

interface SectionTwoCardItem {
  PrimaryTitle: string;
  PrimaryDescription: string;
  SecondaryTitle: string;
  SecondaryDescription: string;
  PrimaryIcon: MediaFile | null;
  SecondaryIcon: MediaFile | null;
}

interface SectionThreeCardItem {
  Title: string;
  SubTitle: string;
  Image: MediaFile | null;
}

interface SectionFourCardItem {
  Metric: string;
  Description: string;
}

interface SectionSixCardOneItem {
  Title: string;
  Description: string;
  Tag: string;
  Icon: MediaFile | null;
}

interface TextItem {
  Text: string;
}

interface SectionSixCardTwoItem {
  Title: string;
  Text: TextItem[];
}

interface SectionSevenCardItem {
  Metric: string;
  PrimaryTitle: string;
  Description: string;
  SecondaryTitle: string;
  TagList: TextItem[];
}

interface ListItem {
  PrimaryTag: string;
  Title: string;
  Description: string;
  SecondaryTag: string;
  AlignImageToLeft: boolean;
  Image: MediaFile | null;
}

interface BreadCrumbItem {
  Label: string;
  Link: string;
  isMegamenu: boolean;
}

export default function ServiceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    Slug: '',
    Title: '',
    Description: '',
    CTAText: '',
    CTALink: '',

    SectionOneTag: '',
    SectionOneStrongText: '',
    SectionOneTitle: '',
    SectionOnePrimaryDescription: '',
    SectionOneSecondaryDescription: '',

    SectionTwoTag: '',
    SectionTwoTitle: '',
    SectionTwoDescription: '',

    SectionThreeTitle: '',
    SectionFourTitle: '',

    SectionSixTag: '',
    SectionSixTitle: '',

    SectionSevenTag: '',
    SectionSevenTitle: '',

    BreadCrumb: [] as BreadCrumbItem[],
    
    // Using MediaFile for images
    Image: null as MediaFile | null,
    SectionThreeImage: null as MediaFile | null,

    HeroCard: [] as HeroCardItem[],
    SectionOneCard: [] as SectionOneCardItem[],
    SectionTwoCard: [] as SectionTwoCardItem[],
    SectionThreeCard: [] as SectionThreeCardItem[],
    SectionFourCard: [] as SectionFourCardItem[],
    SectionSixCardOne: [] as SectionSixCardOneItem[],
    SectionSixCardTwo: [] as SectionSixCardTwoItem[],
    SectionSevenCard: [] as SectionSevenCardItem[],
    ListItems: [] as ListItem[],

    CTAForm: {
      Title: '',
      Description: ''
    }
  });

  // Helper to extract MediaFile from API response
  const extractMediaFile = (data: any): MediaFile | null => {
    if (!data?.data) return null;
    return {
      id: data.data.id,
      ...data.data.attributes,
    };
  };

  // Load existing service data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadService = async () => {
        setIsLoading(true);
        try {
          const service = await ApiService.getServiceDetailById(parseInt(id));
          if (service) {
            // Process cards with images
            const sectionOneCards = (service.attributes.SectionOneCard || []).map((card: any) => ({
              ...card,
              Icon: extractMediaFile(card.Icon),
            }));
            
            const sectionTwoCards = (service.attributes.SectionTwoCard || []).map((card: any) => ({
              ...card,
              PrimaryIcon: extractMediaFile(card.PrimaryIcon),
              SecondaryIcon: extractMediaFile(card.SecondaryIcon),
            }));
            
            const sectionThreeCards = (service.attributes.SectionThreeCard || []).map((card: any) => ({
              ...card,
              Image: extractMediaFile(card.Image),
            }));
            
            const sectionSixCardOne = (service.attributes.SectionSixCardOne || []).map((card: any) => ({
              ...card,
              Icon: extractMediaFile(card.Icon),
            }));
            
            const sectionSixCardTwo = (service.attributes.SectionSixCardTwo || []).map((card: any) => ({
              Title: card.Title || '',
              Text: card.Text || [],
            }));
            
            const sectionSevenCards = (service.attributes.SectionSevenCard || []).map((card: any) => ({
              ...card,
              TagList: card.TagList || [],
            }));
            
            const listItems = (service.attributes.ListItems || []).map((item: any) => ({
              ...item,
              Image: extractMediaFile(item.Image),
            }));

            setFormData({
              Slug: service.attributes.Slug || '',
              Title: service.attributes.Title || '',
              Description: service.attributes.Description || '',
              CTAText: service.attributes.CTAText || '',
              CTALink: service.attributes.CTALink || '',
              
              SectionOneTag: service.attributes.SectionOneTag || '',
              SectionOneStrongText: service.attributes.SectionOneStrongText || '',
              SectionOneTitle: service.attributes.SectionOneTitle || '',
              SectionOnePrimaryDescription: service.attributes.SectionOnePrimaryDescription || '',
              SectionOneSecondaryDescription: service.attributes.SectionOneSecondaryDescription || '',
              
              SectionTwoTag: service.attributes.SectionTwoTag || '',
              SectionTwoTitle: service.attributes.SectionTwoTitle || '',
              SectionTwoDescription: service.attributes.SectionTwoDescription || '',
              
              SectionThreeTitle: service.attributes.SectionThreeTitle || '',
              SectionFourTitle: service.attributes.SectionFourTitle || '',
              
              SectionSixTag: service.attributes.SectionSixTag || '',
              SectionSixTitle: service.attributes.SectionSixTitle || '',
              
              SectionSevenTag: service.attributes.SectionSevenTag || '',
              SectionSevenTitle: service.attributes.SectionSevenTitle || '',
              
              BreadCrumb: service.attributes.BreadCrumb || [],
              Image: extractMediaFile(service.attributes.Image),
              SectionThreeImage: extractMediaFile(service.attributes.SectionThreeImage),
              
              HeroCard: service.attributes.HeroCard || [],
              SectionOneCard: sectionOneCards,
              SectionTwoCard: sectionTwoCards,
              SectionThreeCard: sectionThreeCards,
              SectionFourCard: service.attributes.SectionFourCard || [],
              SectionSixCardOne: sectionSixCardOne,
              SectionSixCardTwo: sectionSixCardTwo,
              SectionSevenCard: sectionSevenCards,
              ListItems: listItems,
              
              CTAForm: service.attributes.CTAForm || { Title: '', Description: '' }
            });
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load service');
        } finally {
          setIsLoading(false);
        }
      };
      loadService();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent]),
        [field]: value
      }
    }));
  };

  // Helper for array fields
  const addArrayItem = <T,>(field: keyof typeof formData, emptyItem: T) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as T[]), emptyItem]
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof typeof formData, index: number, subField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => {
        if (i === index) {
          return { ...item, [subField]: value };
        }
        return item;
      })
    }));
  };

  // Helper for nested array in card items (like Text array in SectionSixCardTwo)
  const addNestedArrayItem = (field: keyof typeof formData, cardIndex: number, nestedField: string, emptyItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => {
        if (i === cardIndex) {
          return { ...item, [nestedField]: [...(item[nestedField] || []), emptyItem] };
        }
        return item;
      })
    }));
  };

  const removeNestedArrayItem = (field: keyof typeof formData, cardIndex: number, nestedField: string, nestedIndex: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => {
        if (i === cardIndex) {
          return { ...item, [nestedField]: item[nestedField].filter((_: any, j: number) => j !== nestedIndex) };
        }
        return item;
      })
    }));
  };

  const updateNestedArrayItem = (field: keyof typeof formData, cardIndex: number, nestedField: string, nestedIndex: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => {
        if (i === cardIndex) {
          return {
            ...item,
            [nestedField]: item[nestedField].map((nested: any, j: number) => {
              if (j === nestedIndex) {
                return { Text: value };
              }
              return nested;
            })
          };
        }
        return item;
      })
    }));
  };

  const moveBreadcrumb = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.BreadCrumb.length) return;

    const newBreadcrumbs = [...formData.BreadCrumb];
    [newBreadcrumbs[index], newBreadcrumbs[newIndex]] = [newBreadcrumbs[newIndex], newBreadcrumbs[index]];
    setFormData({ ...formData, BreadCrumb: newBreadcrumbs });
  };

  // Helper to extract image ID from MediaFile for API payload
  const extractImageId = (file: MediaFile | null): number | undefined => {
    return file?.id;
  };

  const handleSave = async (shouldPublish: boolean = false) => {
    setIsSaving(true);
    setError(null);

    try {
      // Prepare payload
      const payload: any = { 
        Slug: formData.Slug,
        Title: formData.Title,
        Description: formData.Description,
        CTAText: formData.CTAText,
        CTALink: formData.CTALink,
        SectionOneTag: formData.SectionOneTag,
        SectionOneStrongText: formData.SectionOneStrongText,
        SectionOneTitle: formData.SectionOneTitle,
        SectionOnePrimaryDescription: formData.SectionOnePrimaryDescription,
        SectionOneSecondaryDescription: formData.SectionOneSecondaryDescription,
        SectionTwoTag: formData.SectionTwoTag,
        SectionTwoTitle: formData.SectionTwoTitle,
        SectionTwoDescription: formData.SectionTwoDescription,
        SectionThreeTitle: formData.SectionThreeTitle,
        SectionFourTitle: formData.SectionFourTitle,
        SectionSixTag: formData.SectionSixTag,
        SectionSixTitle: formData.SectionSixTitle,
        SectionSevenTag: formData.SectionSevenTag,
        SectionSevenTitle: formData.SectionSevenTitle,
        BreadCrumb: formData.BreadCrumb,
        HeroCard: formData.HeroCard,
        SectionFourCard: formData.SectionFourCard,
        CTAForm: formData.CTAForm,
      };
      
      // Handle main images
      if (formData.Image) {
        payload.Image = formData.Image.id;
      }
      if (formData.SectionThreeImage) {
        payload.SectionThreeImage = formData.SectionThreeImage.id;
      }

      // Handle SectionOneCard with icons
      payload.SectionOneCard = formData.SectionOneCard.map(card => ({
        Title: card.Title,
        Description: card.Description,
        Tag: card.Tag,
        Icon: extractImageId(card.Icon),
      }));

      // Handle SectionTwoCard with icons
      payload.SectionTwoCard = formData.SectionTwoCard.map(card => ({
        PrimaryTitle: card.PrimaryTitle,
        PrimaryDescription: card.PrimaryDescription,
        SecondaryTitle: card.SecondaryTitle,
        SecondaryDescription: card.SecondaryDescription,
        PrimaryIcon: extractImageId(card.PrimaryIcon),
        SecondaryIcon: extractImageId(card.SecondaryIcon),
      }));

      // Handle SectionThreeCard with images
      payload.SectionThreeCard = formData.SectionThreeCard.map(card => ({
        Title: card.Title,
        SubTitle: card.SubTitle,
        Image: extractImageId(card.Image),
      }));

      // Handle SectionSixCardOne with icons
      payload.SectionSixCardOne = formData.SectionSixCardOne.map(card => ({
        Title: card.Title,
        Description: card.Description,
        Tag: card.Tag,
        Icon: extractImageId(card.Icon),
      }));

      // Handle SectionSixCardTwo with Text array
      payload.SectionSixCardTwo = formData.SectionSixCardTwo.map(card => ({
        Title: card.Title,
        Text: card.Text,
      }));

      // Handle SectionSevenCard with TagList
      payload.SectionSevenCard = formData.SectionSevenCard.map(card => ({
        Metric: card.Metric,
        PrimaryTitle: card.PrimaryTitle,
        Description: card.Description,
        SecondaryTitle: card.SecondaryTitle,
        TagList: card.TagList,
      }));

      // Handle ListItems with images
      payload.ListItems = formData.ListItems.map(item => ({
        PrimaryTag: item.PrimaryTag,
        Title: item.Title,
        Description: item.Description,
        SecondaryTag: item.SecondaryTag,
        AlignImageToLeft: item.AlignImageToLeft,
        Image: extractImageId(item.Image),
      }));
      
      // Set publishedAt based on draft or publish
      if (shouldPublish) {
        payload.publishedAt = new Date().toISOString();
      } else {
        payload.publishedAt = null;
      }
      
      if (isEditMode && id) {
        await ApiService.updateService(parseInt(id), payload);
        alert(shouldPublish ? 'Service published successfully!' : 'Draft saved successfully!');
      } else {
        await ApiService.createService(payload);
        alert(shouldPublish ? 'Service published successfully!' : 'Draft created successfully!');
      }
      navigate('/services');
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} service`);
      setIsSaving(false);
    }
  };

  const handlePublish = () => handleSave(true);
  const handleDraft = () => handleSave(false);

  const renderSectionHeader = (title: string, onAdd?: () => void, addLabel?: string) => (
    <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4 mt-8">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {onAdd && addLabel && (
        <button type="button" onClick={onAdd} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <Plus className="w-4 h-4 mr-1" /> {addLabel}
        </button>
      )}
    </div>
  );

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate('/services')}
                className="hover:text-gray-900 transition-colors"
              >
                Services
              </button>
              {isEditMode && id && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <button
                    onClick={() => navigate(`/services/${id}`)}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {formData.Title || 'Service'}
                  </button>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {isEditMode ? 'Edit' : 'New Service'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDraft}
                disabled={isSaving || isLoading}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save as Draft</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isSaving || isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-sm font-medium disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isEditMode ? 'Edit Service' : 'Create New Service'}
            </h2>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
              </div>
            )}

            {!isLoading && (

              <div className="space-y-6">
                {/* Breadcrumbs - FIRST */}
                {renderSectionHeader("Breadcrumbs", () => addArrayItem('BreadCrumb', { Label: '', Link: '', isMegamenu: false }), "Add Breadcrumb")}
                <div className="space-y-4">
                  {formData.BreadCrumb.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex gap-4 items-start">
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={() => moveBreadcrumb(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveUp className="w-4 h-4" /></button>
                        <button type="button" onClick={() => moveBreadcrumb(index, 'down')} disabled={index === formData.BreadCrumb.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveDown className="w-4 h-4" /></button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Label</label><input type="text" value={item.Label} onChange={(e) => updateArrayItem('BreadCrumb', index, 'Label', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" /></div>
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Link</label><input type="text" value={item.Link} onChange={(e) => updateArrayItem('BreadCrumb', index, 'Link', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" /></div>
                      </div>
                      <button type="button" onClick={() => removeArrayItem('BreadCrumb', index)} className="p-2 text-red-600 hover:text-red-800"><Trash className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6 mt-8">
                  <div><label className={labelClass}>Slug</label><input type="text" name="Slug" value={formData.Slug} onChange={handleChange} required className={inputClass} placeholder="service-slug" /></div>
                  <div><label className={labelClass}>Title</label><input type="text" name="Title" value={formData.Title} onChange={handleChange} required className={inputClass} placeholder="Service Title" /></div>
                  <div className="md:col-span-2">
                    <MarkdownEditorWithPreview
                      label="Description (Markdown)"
                      value={formData.Description}
                      onChange={(value) => setFormData({ ...formData, Description: value })}
                      placeholder="Enter service description..."
                      minHeight="300px"
                    />
                  </div>
                  <div><label className={labelClass}>CTA Text</label><input type="text" name="CTAText" value={formData.CTAText} onChange={handleChange} className={inputClass} placeholder="Call to Action" /></div>
                  <div><label className={labelClass}>CTA Link</label><input type="text" name="CTALink" value={formData.CTALink} onChange={handleChange} className={inputClass} placeholder="/contact" /></div>
                  <div><MediaPicker label="Main Image" value={formData.Image} onChange={(file) => setFormData({ ...formData, Image: file })} /></div>
                </div>

                {/* Hero Cards */}
                {renderSectionHeader("Hero Cards", () => addArrayItem('HeroCard', { Title: '', Description: '' }), "Add Hero Card")}
                <div className="space-y-4">
                  {formData.HeroCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 gap-4 flex-1">
                        <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('HeroCard', index, 'Title', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('HeroCard', index, 'Description', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('HeroCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2"><Trash className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                {/* Section One */}
                {renderSectionHeader("Section One")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input placeholder="Tag" name="SectionOneTag" value={formData.SectionOneTag} onChange={handleChange} className={inputClass} />
                  <input placeholder="Strong Text" name="SectionOneStrongText" value={formData.SectionOneStrongText} onChange={handleChange} className={inputClass} />
                  <input placeholder="Title" name="SectionOneTitle" value={formData.SectionOneTitle} onChange={handleChange} className={inputClass} />
                  <textarea placeholder="Primary Description" name="SectionOnePrimaryDescription" value={formData.SectionOnePrimaryDescription} onChange={handleChange} className={inputClass} />
                  <textarea placeholder="Secondary Description" name="SectionOneSecondaryDescription" value={formData.SectionOneSecondaryDescription} onChange={handleChange} className={inputClass} />
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section One Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionOneCard', { Title: '', Description: '', Tag: '', Icon: null })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4">
                  {formData.SectionOneCard.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">Card {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('SectionOneCard', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1"><MediaPicker label="Icon" value={item.Icon} onChange={(file) => updateArrayItem('SectionOneCard', index, 'Icon', file)} /></div>
                        <div className="md:col-span-2 space-y-4">
                          <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionOneCard', index, 'Title', e.target.value)} className={inputClass} />
                          <input placeholder="Tag" value={item.Tag} onChange={(e) => updateArrayItem('SectionOneCard', index, 'Tag', e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <MarkdownEditorWithPreview
                          label="Description (Markdown)"
                          value={item.Description}
                          onChange={(value) => updateArrayItem('SectionOneCard', index, 'Description', value)}
                          placeholder="Enter description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Two */}
                {renderSectionHeader("Section Two")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input placeholder="Tag" name="SectionTwoTag" value={formData.SectionTwoTag} onChange={handleChange} className={inputClass} />
                  <input placeholder="Title" name="SectionTwoTitle" value={formData.SectionTwoTitle} onChange={handleChange} className={inputClass} />
                  <textarea placeholder="Description" name="SectionTwoDescription" value={formData.SectionTwoDescription} onChange={handleChange} className={`${inputClass} md:col-span-2`} />
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Two Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionTwoCard', { PrimaryTitle: '', PrimaryDescription: '', SecondaryTitle: '', SecondaryDescription: '', PrimaryIcon: null, SecondaryIcon: null })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4">
                  {formData.SectionTwoCard.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">Card {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('SectionTwoCard', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                          <h6 className="text-xs font-semibold text-blue-700 uppercase">Primary</h6>
                          <MediaPicker label="Primary Icon" value={item.PrimaryIcon} onChange={(file) => updateArrayItem('SectionTwoCard', index, 'PrimaryIcon', file)} />
                          <input placeholder="Primary Title" value={item.PrimaryTitle} onChange={(e) => updateArrayItem('SectionTwoCard', index, 'PrimaryTitle', e.target.value)} className={inputClass} />
                          <div className="bg-white rounded-lg">
                            <MarkdownEditorWithPreview
                              label="Primary Description (Markdown)"
                              value={item.PrimaryDescription}
                              onChange={(value) => updateArrayItem('SectionTwoCard', index, 'PrimaryDescription', value)}
                              placeholder="Primary description..."
                            />
                          </div>
                        </div>
                        <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                          <h6 className="text-xs font-semibold text-green-700 uppercase">Secondary</h6>
                          <MediaPicker label="Secondary Icon" value={item.SecondaryIcon} onChange={(file) => updateArrayItem('SectionTwoCard', index, 'SecondaryIcon', file)} />
                          <input placeholder="Secondary Title" value={item.SecondaryTitle} onChange={(e) => updateArrayItem('SectionTwoCard', index, 'SecondaryTitle', e.target.value)} className={inputClass} />
                          <div className="bg-white rounded-lg">
                            <MarkdownEditorWithPreview
                              label="Secondary Description (Markdown)"
                              value={item.SecondaryDescription}
                              onChange={(value) => updateArrayItem('SectionTwoCard', index, 'SecondaryDescription', value)}
                              placeholder="Secondary description..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Three */}
                {renderSectionHeader("Section Three")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input placeholder="Title" name="SectionThreeTitle" value={formData.SectionThreeTitle} onChange={handleChange} className={inputClass} />
                  <MediaPicker label="Section Three Image" value={formData.SectionThreeImage} onChange={(file) => setFormData({ ...formData, SectionThreeImage: file })} />
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Three Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionThreeCard', { Title: '', SubTitle: '', Image: null })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4">
                  {formData.SectionThreeCard.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">Card {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('SectionThreeCard', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><MediaPicker label="Image" value={item.Image} onChange={(file) => updateArrayItem('SectionThreeCard', index, 'Image', file)} /></div>
                        <div className="md:col-span-2 space-y-4">
                          <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionThreeCard', index, 'Title', e.target.value)} className={inputClass} />
                          <input placeholder="SubTitle" value={item.SubTitle} onChange={(e) => updateArrayItem('SectionThreeCard', index, 'SubTitle', e.target.value)} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Four */}
                {renderSectionHeader("Section Four")}
                <div className="mb-6"><input placeholder="Title" name="SectionFourTitle" value={formData.SectionFourTitle} onChange={handleChange} className={inputClass} /></div>
                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Four Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionFourCard', { Metric: '', Description: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4">
                  {formData.SectionFourCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Metric" value={item.Metric} onChange={(e) => updateArrayItem('SectionFourCard', index, 'Metric', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('SectionFourCard', index, 'Description', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionFourCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2"><Trash className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                {/* List Items */}
                {renderSectionHeader("List Items", () => addArrayItem('ListItems', { PrimaryTag: '', Title: '', Description: '', SecondaryTag: '', AlignImageToLeft: false, Image: null }), "Add List Item")}
                <div className="space-y-4">
                  {formData.ListItems.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">List Item {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('ListItems', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><MediaPicker label="Image" value={item.Image} onChange={(file) => updateArrayItem('ListItems', index, 'Image', file)} /></div>
                        <div className="md:col-span-2 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Primary Tag" value={item.PrimaryTag} onChange={(e) => updateArrayItem('ListItems', index, 'PrimaryTag', e.target.value)} className={inputClass} />
                            <input placeholder="Secondary Tag" value={item.SecondaryTag} onChange={(e) => updateArrayItem('ListItems', index, 'SecondaryTag', e.target.value)} className={inputClass} />
                          </div>
                          <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('ListItems', index, 'Title', e.target.value)} className={inputClass} />
                          <label className="flex items-center space-x-2"><input type="checkbox" checked={item.AlignImageToLeft} onChange={(e) => updateArrayItem('ListItems', index, 'AlignImageToLeft', e.target.checked)} className="rounded text-gray-900 h-4 w-4" /><span className="text-sm text-gray-700">Align Image Left</span></label>
                          <MarkdownEditorWithPreview
                            label="Description (Markdown)"
                            value={item.Description}
                            onChange={(value) => updateArrayItem('ListItems', index, 'Description', value)}
                            placeholder="Enter description..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Six */}
                {renderSectionHeader("Section Six")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input placeholder="Tag" name="SectionSixTag" value={formData.SectionSixTag} onChange={handleChange} className={inputClass} />
                  <input placeholder="Title" name="SectionSixTitle" value={formData.SectionSixTitle} onChange={handleChange} className={inputClass} />
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Six Cards Type 1</h4>
                  <button type="button" onClick={() => addArrayItem('SectionSixCardOne', { Title: '', Description: '', Tag: '', Icon: null })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4 mb-8">
                  {formData.SectionSixCardOne.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">Card {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('SectionSixCardOne', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><MediaPicker label="Icon" value={item.Icon} onChange={(file) => updateArrayItem('SectionSixCardOne', index, 'Icon', file)} /></div>
                        <div className="md:col-span-2 space-y-4">
                          <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionSixCardOne', index, 'Title', e.target.value)} className={inputClass} />
                          <input placeholder="Tag" value={item.Tag} onChange={(e) => updateArrayItem('SectionSixCardOne', index, 'Tag', e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <MarkdownEditorWithPreview
                          label="Description (Markdown)"
                          value={item.Description}
                          onChange={(value) => updateArrayItem('SectionSixCardOne', index, 'Description', value)}
                          placeholder="Enter description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Six Cards Type 2</h4>
                  <button type="button" onClick={() => addArrayItem('SectionSixCardTwo', { Title: '', Text: [] })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4">
                  {formData.SectionSixCardTwo.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">Card {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('SectionSixCardTwo', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionSixCardTwo', index, 'Title', e.target.value)} className={inputClass} />
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-medium text-gray-700">Text Items</label>
                          <button type="button" onClick={() => addNestedArrayItem('SectionSixCardTwo', index, 'Text', { Text: '' })} className="flex items-center text-xs text-primary hover:text-primary/80"><Plus className="w-3 h-3 mr-1" /> Add Text</button>
                        </div>
                        <div className="space-y-2">
                          {(item.Text || []).map((textItem, textIndex) => (
                            <div key={textIndex} className="flex gap-2 items-center">
                              <input placeholder="Text item" value={textItem.Text} onChange={(e) => updateNestedArrayItem('SectionSixCardTwo', index, 'Text', textIndex, e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                              <button type="button" onClick={() => removeNestedArrayItem('SectionSixCardTwo', index, 'Text', textIndex)} className="text-red-600 hover:text-red-800 p-1"><Trash className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Seven */}
                {renderSectionHeader("Section Seven")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input placeholder="Tag" name="SectionSevenTag" value={formData.SectionSevenTag} onChange={handleChange} className={inputClass} />
                  <input placeholder="Title" name="SectionSevenTitle" value={formData.SectionSevenTitle} onChange={handleChange} className={inputClass} />
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Seven Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionSevenCard', { Metric: '', PrimaryTitle: '', Description: '', SecondaryTitle: '', TagList: [] })} className="flex items-center text-sm text-gray-600 hover:text-gray-900"><Plus className="w-4 h-4 mr-1" /> Add Card</button>
                </div>
                <div className="space-y-4">
                  {formData.SectionSevenCard.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md bg-gray-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-700">Card {index + 1}</h5>
                        <button type="button" onClick={() => removeArrayItem('SectionSevenCard', index)} className="text-red-600 hover:text-red-800 p-2"><Trash className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Metric" value={item.Metric} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'Metric', e.target.value)} className={inputClass} />
                        <input placeholder="Primary Title" value={item.PrimaryTitle} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'PrimaryTitle', e.target.value)} className={inputClass} />
                        <input placeholder="Secondary Title" value={item.SecondaryTitle} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'SecondaryTitle', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description (plain text)" value={item.Description} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'Description', e.target.value)} className={inputClass} />
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-medium text-gray-700">Tag List</label>
                          <button type="button" onClick={() => addNestedArrayItem('SectionSevenCard', index, 'TagList', { Text: '' })} className="flex items-center text-xs text-primary hover:text-primary/80"><Plus className="w-3 h-3 mr-1" /> Add Tag</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(item.TagList || []).map((tag, tagIndex) => (
                            <div key={tagIndex} className="flex gap-1 items-center bg-gray-100 rounded-full px-3 py-1">
                              <input placeholder="Tag" value={tag.Text} onChange={(e) => updateNestedArrayItem('SectionSevenCard', index, 'TagList', tagIndex, e.target.value)} className="bg-transparent border-none text-sm w-24 focus:outline-none" />
                              <button type="button" onClick={() => removeNestedArrayItem('SectionSevenCard', index, 'TagList', tagIndex)} className="text-gray-500 hover:text-red-600"><Trash className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {renderSectionHeader("CTA Form Details")}
                <div className="grid grid-cols-1 gap-6">
                  <div><label className={labelClass}>Title</label><input placeholder="CTA Form Title" value={formData.CTAForm.Title} onChange={(e) => handleNestedChange('CTAForm', 'Title', e.target.value)} className={inputClass} /></div>
                  <div>
                    <MarkdownEditorWithPreview
                      label="Description (Markdown)"
                      value={formData.CTAForm.Description}
                      onChange={(value) => handleNestedChange('CTAForm', 'Description', value)}
                      placeholder="Enter CTA form description..."
                    />
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
