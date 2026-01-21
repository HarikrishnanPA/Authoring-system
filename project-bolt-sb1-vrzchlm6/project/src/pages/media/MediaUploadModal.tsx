import { X, Upload, Link, Image, Loader2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { ApiService, MediaFile } from '@/lib/api';

interface MediaUploadModalProps {
  onClose: () => void;
  onUploadComplete?: (files: MediaFile[]) => void;
}

type UploadTab = 'computer' | 'url';

export default function MediaUploadModal({ onClose, onUploadComplete }: MediaUploadModalProps) {
  const [activeTab, setActiveTab] = useState<UploadTab>('computer');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);

    try {
      if (activeTab === 'computer' && selectedFiles.length > 0) {
        const uploadedFiles = await ApiService.uploadMediaFile(selectedFiles);
        onUploadComplete?.(uploadedFiles);
        onClose();
      } else if (activeTab === 'url' && urlInput.trim()) {
        // For URL upload, fetch the image and upload it
        const response = await fetch(urlInput.trim());
        if (!response.ok) {
          throw new Error('Failed to fetch image from URL');
        }
        const blob = await response.blob();
        const fileName = urlInput.split('/').pop() || 'image';
        const file = new File([blob], fileName, { type: blob.type });
        const uploadedFiles = await ApiService.uploadMediaFile([file]);
        onUploadComplete?.(uploadedFiles);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-dark">Add new assets</h2>
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="px-8 pt-4 border-b border-gray-100">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('computer')}
              disabled={isUploading}
              className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'computer'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              From Computer
            </button>
            <button
              onClick={() => setActiveTab('url')}
              disabled={isUploading}
              className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'url'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              From URL
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'computer' ? (
            <div className="space-y-6">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`p-4 rounded-full mb-4 ${
                    isDragging ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Image className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Drag & Drop here or
                  </p>
                  <button
                    onClick={handleBrowseClick}
                    disabled={isUploading}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Browse files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Selected files ({selectedFiles.length})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs uppercase">
                                {file.type.split('/')[1]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      disabled={isUploading}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-gray-50 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Enter the URL of an image you want to add to the media library.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || (activeTab === 'computer' ? selectedFiles.length === 0 : !urlInput.trim())}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              (activeTab === 'computer' ? selectedFiles.length > 0 : urlInput.trim()) && !isUploading
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {activeTab === 'computer' && selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
