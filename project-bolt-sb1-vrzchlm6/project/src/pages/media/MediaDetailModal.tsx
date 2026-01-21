import { MediaFile, getImageUrl, ApiService } from '@/lib/api';
import { X, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

interface MediaDetailModalProps {
  file: MediaFile;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function MediaDetailModal({ file, onClose, onUpdate }: MediaDetailModalProps) {
  const [fileName, setFileName] = useState(file.name);
  const [altText, setAltText] = useState(file.alternativeText || '');
  const [caption, setCaption] = useState(file.caption || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track the last saved values as baseline for change detection
  const [savedBaseline, setSavedBaseline] = useState({
    name: file.name,
    alternativeText: file.alternativeText || '',
    caption: file.caption || '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getFileExtension = (mime: string) => {
    return mime.split('/')[1];
  };

  const imageUrl = getImageUrl(file.url);

  const hasChanges = 
    fileName !== savedBaseline.name ||
    altText !== savedBaseline.alternativeText ||
    caption !== savedBaseline.caption;

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await ApiService.updateMediaFile(file.id, {
        name: fileName,
        alternativeText: altText || null,
        caption: caption || null,
      });
      
      // Update baseline to current values so hasChanges becomes false
      setSavedBaseline({
        name: fileName,
        alternativeText: altText,
        caption: caption,
      });
      
      setSaveSuccess(true);
      onUpdate?.();
      
      // Reset success indicator after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-dark">Media Details</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                saveSuccess
                  ? 'bg-green-500 text-white'
                  : hasChanges
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Column - Image Preview */}
            <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100 min-h-[400px]">
               <div className="relative w-full h-full flex items-center justify-center">
                 {file.mime.startsWith('image/') ? (
                    <img 
                      src={imageUrl} 
                      alt={file.alternativeText || file.name}
                      className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm"
                      style={{ 
                        backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', 
                        backgroundSize: '20px 20px', 
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' 
                      }}
                    />
                 ) : (
                    <div className="text-gray-400">Preview not available</div>
                 )}
               </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full lg:w-[350px] bg-white p-8 overflow-y-auto">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 border-b border-gray-100 pb-8">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Dimensions</label>
                  <span className="text-sm font-semibold text-dark">{file.width} × {file.height}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Date</label>
                  <span className="text-sm font-semibold text-dark">{formatDate(file.createdAt)}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Extension</label>
                  <span className="text-sm font-semibold text-dark uppercase">{getFileExtension(file.mime)}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Asset ID</label>
                  <span className="text-sm font-semibold text-dark">{file.id}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">File name</label>
                  <input 
                    type="text" 
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:bg-white hover:border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alternative text</label>
                  <input 
                    type="text" 
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:bg-white hover:border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Caption</label>
                  <input 
                    type="text" 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:bg-white hover:border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
