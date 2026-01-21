import { useState, useRef } from 'react';
import { ImageIcon, Upload, Loader2 } from 'lucide-react';
import { MediaFile, getImageUrl, ApiService } from '@/lib/api';
import MediaLibraryPage from '@/pages/media/MediaLibraryPage';

interface MediaPickerProps {
  label: string;
  value: MediaFile | null;
  onChange: (file: MediaFile | null) => void;
  error?: string;
}

export default function MediaPicker({ label, value, onChange, error }: MediaPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (file: MediaFile) => {
    onChange(file);
    setIsModalOpen(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedFiles = await ApiService.uploadMediaFile(Array.from(files));
      if (uploadedFiles.length > 0) {
        onChange(uploadedFiles[0]);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Get preview URL
  const getPreviewUrl = (file: MediaFile) => {
    if (file.formats?.small?.url) {
      return getImageUrl(file.formats.small.url);
    }
    if (file.formats?.thumbnail?.url) {
      return getImageUrl(file.formats.thumbnail.url);
    }
    return getImageUrl(file.url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {value ? (
        // Preview with Change/Remove buttons
        <div className="relative group w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={getPreviewUrl(value) || ''}
            alt={value.alternativeText || value.name}
            className="w-full h-full object-cover"
          />
          {/* Hover overlay with buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
          {/* File info badge */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="px-2 py-1 bg-black/60 text-white text-xs rounded truncate max-w-[70%]">
              {value.name}
            </span>
            <span className="px-2 py-1 bg-black/60 text-white text-xs rounded">
              ID: {value.id}
            </span>
          </div>
        </div>
      ) : (
        // Empty state - with upload and select options
        <div className={`w-full h-48 bg-gray-50 border-2 border-dashed rounded-lg transition-colors ${
          isUploading ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        }`}>
          {isUploading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Select from library
                </button>
                <span className="text-gray-400 text-sm">or</span>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload new
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-sm text-red-600">{error || uploadError}</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full h-full md:w-[90vw] md:h-[85vh] md:max-w-6xl md:rounded-xl overflow-hidden flex flex-col shadow-2xl">
            <MediaLibraryPage
              isSelectionMode={true}
              onSelect={handleSelect}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
