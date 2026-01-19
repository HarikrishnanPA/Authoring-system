import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Eye, Plus, Trash } from 'lucide-react';
import Sidebar from './Sidebar';
import { ApiService } from '../lib/api';

interface HeroCardItem {
  Title: string;
  Description: string;
}

interface SectionOneCardItem {
  Title: string;
  Description: string;
  Tag: string;
}

interface SectionTwoCardItem {
  PrimaryTitle: string;
  PrimaryDescription: string;
  SecondaryTitle: string;
  SecondaryDescription: string;
}

interface SectionThreeCardItem {
  Title: string;
  SubTitle: string;
}

interface SectionFourCardItem {
  Metric: string;
  Description: string;
}

interface SectionSixCardOneItem {
  Title: string;
  Description: string;
  Tag: string;
}

interface SectionSixCardTwoItem {
  Title: string;
}

interface SectionSevenCardItem {
  Metric: string;
  PrimaryTitle: string;
  Description: string;
  SecondaryTitle: string;
}

interface ListItem {
  PrimaryTag: string;
  Title: string;
  Description: string;
  SecondaryTag: string;
  AlignImageToLeft: boolean;
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
    
    // Using number for image IDs as requested
    Image: 0,
    SectionThreeImage: 0,

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

  // Load existing service data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadService = async () => {
        setIsLoading(true);
        try {
          const service = await ApiService.getServiceDetailById(parseInt(id));
          if (service) {
            // Populate form with existing data
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
              Image: (service.attributes.Image?.data as any)?.id || 0,
              SectionThreeImage: (service.attributes.SectionThreeImage?.data as any)?.id || 0,
              
              HeroCard: service.attributes.HeroCard || [],
              SectionOneCard: service.attributes.SectionOneCard || [],
              SectionTwoCard: service.attributes.SectionTwoCard || [],
              SectionThreeCard: service.attributes.SectionThreeCard || [],
              SectionFourCard: service.attributes.SectionFourCard || [],
              SectionSixCardOne: service.attributes.SectionSixCardOne || [],
              SectionSixCardTwo: service.attributes.SectionSixCardTwo || [],
              SectionSevenCard: service.attributes.SectionSevenCard || [],
              ListItems: service.attributes.ListItems || [],
              
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

  const handleSave = async (shouldPublish: boolean = false) => {
    setIsSaving(true);
    setError(null);

    try {
      // In a real implementation, we would handle 'publishedAt' based on shouldPublish
      console.log('Publishing:', shouldPublish);
      
      if (isEditMode && id) {
        // Update existing service
        await ApiService.updateService(parseInt(id), formData);
      } else {
        // Create new service
        await ApiService.createService(formData);
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
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {isEditMode ? 'Edit Service' : 'New Service'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input type="text" name="Slug" value={formData.Slug} onChange={handleChange} required className={inputClass} placeholder="service-slug" />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input type="text" name="Title" value={formData.Title} onChange={handleChange} required className={inputClass} placeholder="Service Title" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description (Markdown)</label>
                    <textarea name="Description" rows={4} value={formData.Description} onChange={handleChange} className={inputClass} placeholder="Service description..." />
                  </div>
                  <div>
                    <label className={labelClass}>CTA Text</label>
                    <input type="text" name="CTAText" value={formData.CTAText} onChange={handleChange} className={inputClass} placeholder="Call to Action" />
                  </div>
                  <div>
                    <label className={labelClass}>CTA Link</label>
                    <input type="text" name="CTALink" value={formData.CTALink} onChange={handleChange} className={inputClass} placeholder="/contact" />
                  </div>
                  <div>
                    <label className={labelClass}>Main Image ID</label>
                    <input type="number" name="Image" value={formData.Image} onChange={handleChange} className={inputClass} placeholder="0" />
                  </div>
                </div>

                {/* Breadcrumbs */}
                {renderSectionHeader("Breadcrumbs", () => addArrayItem('BreadCrumb', { Label: '', Link: '', isMegamenu: false }), "Add Breadcrumb")}
                <div className="space-y-4">
                  {formData.BreadCrumb.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <input placeholder="Label" value={item.Label} onChange={(e) => updateArrayItem('BreadCrumb', index, 'Label', e.target.value)} className={inputClass} />
                        <input placeholder="Link" value={item.Link} onChange={(e) => updateArrayItem('BreadCrumb', index, 'Link', e.target.value)} className={inputClass} />
                        <label className="flex items-center space-x-2 mt-3">
                          <input type="checkbox" checked={item.isMegamenu} onChange={(e) => updateArrayItem('BreadCrumb', index, 'isMegamenu', e.target.checked)} className="rounded text-gray-900 focus:ring-gray-900 h-4 w-4" />
                          <span className="text-sm text-gray-700">Is Megamenu</span>
                        </label>
                      </div>
                      <button type="button" onClick={() => removeArrayItem('BreadCrumb', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
                      <button type="button" onClick={() => removeArrayItem('HeroCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
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
                  <button type="button" onClick={() => addArrayItem('SectionOneCard', { Title: '', Description: '', Tag: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.SectionOneCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionOneCard', index, 'Title', e.target.value)} className={inputClass} />
                        <input placeholder="Tag" value={item.Tag} onChange={(e) => updateArrayItem('SectionOneCard', index, 'Tag', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('SectionOneCard', index, 'Description', e.target.value)} className={`${inputClass} md:col-span-2`} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionOneCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
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
                  <button type="button" onClick={() => addArrayItem('SectionTwoCard', { PrimaryTitle: '', PrimaryDescription: '', SecondaryTitle: '', SecondaryDescription: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.SectionTwoCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Primary Title" value={item.PrimaryTitle} onChange={(e) => updateArrayItem('SectionTwoCard', index, 'PrimaryTitle', e.target.value)} className={inputClass} />
                        <textarea placeholder="Primary Description" value={item.PrimaryDescription} onChange={(e) => updateArrayItem('SectionTwoCard', index, 'PrimaryDescription', e.target.value)} className={inputClass} />
                        <input placeholder="Secondary Title" value={item.SecondaryTitle} onChange={(e) => updateArrayItem('SectionTwoCard', index, 'SecondaryTitle', e.target.value)} className={inputClass} />
                        <textarea placeholder="Secondary Description" value={item.SecondaryDescription} onChange={(e) => updateArrayItem('SectionTwoCard', index, 'SecondaryDescription', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionTwoCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Section Three */}
                {renderSectionHeader("Section Three")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input placeholder="Title" name="SectionThreeTitle" value={formData.SectionThreeTitle} onChange={handleChange} className={inputClass} />
                  <div>
                    <input type="number" name="SectionThreeImage" value={formData.SectionThreeImage} onChange={handleChange} className={inputClass} placeholder="Image ID" />
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Three Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionThreeCard', { Title: '', SubTitle: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.SectionThreeCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionThreeCard', index, 'Title', e.target.value)} className={inputClass} />
                        <input placeholder="Subtitle" value={item.SubTitle} onChange={(e) => updateArrayItem('SectionThreeCard', index, 'SubTitle', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionThreeCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Section Four */}
                {renderSectionHeader("Section Four")}
                <div className="mb-6">
                  <input placeholder="Title" name="SectionFourTitle" value={formData.SectionFourTitle} onChange={handleChange} className={inputClass} />
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Four Cards</h4>
                  <button type="button" onClick={() => addArrayItem('SectionFourCard', { Metric: '', Description: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.SectionFourCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Metric" value={item.Metric} onChange={(e) => updateArrayItem('SectionFourCard', index, 'Metric', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('SectionFourCard', index, 'Description', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionFourCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
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
                  <button type="button" onClick={() => addArrayItem('SectionSixCardOne', { Title: '', Description: '', Tag: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4 mb-8">
                  {formData.SectionSixCardOne.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionSixCardOne', index, 'Title', e.target.value)} className={inputClass} />
                        <input placeholder="Tag" value={item.Tag} onChange={(e) => updateArrayItem('SectionSixCardOne', index, 'Tag', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('SectionSixCardOne', index, 'Description', e.target.value)} className={`${inputClass} md:col-span-3`} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionSixCardOne', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4 border-t pt-4 border-gray-100">
                  <h4 className="text-md font-medium text-gray-700">Section Six Cards Type 2</h4>
                  <button type="button" onClick={() => addArrayItem('SectionSixCardTwo', { Title: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.SectionSixCardTwo.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="flex-1">
                        <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('SectionSixCardTwo', index, 'Title', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionSixCardTwo', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
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
                  <button type="button" onClick={() => addArrayItem('SectionSevenCard', { Metric: '', PrimaryTitle: '', Description: '', SecondaryTitle: '' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.SectionSevenCard.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Metric" value={item.Metric} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'Metric', e.target.value)} className={inputClass} />
                        <input placeholder="Primary Title" value={item.PrimaryTitle} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'PrimaryTitle', e.target.value)} className={inputClass} />
                        <input placeholder="Secondary Title" value={item.SecondaryTitle} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'SecondaryTitle', e.target.value)} className={inputClass} />
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('SectionSevenCard', index, 'Description', e.target.value)} className={inputClass} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('SectionSevenCard', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* CTA Form */}
                {renderSectionHeader("CTA Form Details")}
                <div className="grid grid-cols-1 gap-6">
                  <input placeholder="Title" value={formData.CTAForm.Title} onChange={(e) => handleNestedChange('CTAForm', 'Title', e.target.value)} className={inputClass} />
                  <textarea placeholder="Description" value={formData.CTAForm.Description} onChange={(e) => handleNestedChange('CTAForm', 'Description', e.target.value)} className={inputClass} />
                </div>

                {/* List Items */}
                {renderSectionHeader("List Items", () => addArrayItem('ListItems', { PrimaryTag: '', Title: '', Description: '', SecondaryTag: '', AlignImageToLeft: false }), "Add List Item")}
                <div className="space-y-4">
                  {formData.ListItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input placeholder="Primary Tag" value={item.PrimaryTag} onChange={(e) => updateArrayItem('ListItems', index, 'PrimaryTag', e.target.value)} className={inputClass} />
                        <input placeholder="Secondary Tag" value={item.SecondaryTag} onChange={(e) => updateArrayItem('ListItems', index, 'SecondaryTag', e.target.value)} className={inputClass} />
                        <input placeholder="Title" value={item.Title} onChange={(e) => updateArrayItem('ListItems', index, 'Title', e.target.value)} className={inputClass} />
                        <label className="flex items-center space-x-2 mt-3">
                          <input type="checkbox" checked={item.AlignImageToLeft} onChange={(e) => updateArrayItem('ListItems', index, 'AlignImageToLeft', e.target.checked)} className="rounded text-gray-900 focus:ring-gray-900 h-4 w-4" />
                          <span className="text-sm text-gray-700">Align Image Left</span>
                        </label>
                        <textarea placeholder="Description" value={item.Description} onChange={(e) => updateArrayItem('ListItems', index, 'Description', e.target.value)} className={`${inputClass} md:col-span-2`} />
                      </div>
                      <button type="button" onClick={() => removeArrayItem('ListItems', index)} className="text-red-600 hover:text-red-800 p-2 mt-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
