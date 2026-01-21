import { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, X, Check } from 'lucide-react';
import { Sidebar } from '@/components/layout';
import { ApiService, MediaFile, getImageUrl } from '@/lib/api';
import MediaDetailModal from './MediaDetailModal';

interface MediaLibraryPageProps {
  isSelectionMode?: boolean;
  onSelect?: (file: MediaFile) => void;
  onCancel?: () => void;
}

export default function MediaLibraryPage({ 
  isSelectionMode = false, 
  onSelect, 
  onCancel 
}: MediaLibraryPageProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    setIsLoading(true);
    try {
      const mediaFiles = await ApiService.getMediaFiles();
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error loading media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (file.alternativeText && file.alternativeText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFileClick = (file: MediaFile) => {
    if (isSelectionMode && onSelect) {
      onSelect(file);
    } else {
      setSelectedFile(file);
    }
  };



  // If in selection mode, render without sidebar
  if (isSelectionMode) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Select Media</h1>
              <p className="text-sm text-gray-500">Choose an image to insert</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search media..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Cancel button */}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className="group relative aspect-square bg-white rounded-xl overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  {file.mime.startsWith('image/') ? (
                    <img
                      src={getImageUrl(file.formats?.thumbnail?.url || file.url)}
                      alt={file.alternativeText || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-xs">{file.mime.split('/')[1].toUpperCase()}</span>
                    </div>
                  )}
                  {/* Hover overlay with select button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-900">
                      <Check className="w-4 h-4" />
                      Select
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {filteredFiles.map((file, index) => (
                <div
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    index !== filteredFiles.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {file.mime.startsWith('image/') ? (
                      <img
                        src={getImageUrl(file.formats?.thumbnail?.url || file.url)}
                        alt={file.alternativeText || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">{file.mime.split('/')[1].toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.width}×{file.height}</p>
                  </div>
                  <button className="px-3 py-1 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors">
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular Media Library Page with Sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Media Library</h1>
                <p className="text-base text-gray-600">Manage and organize your media files</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search media..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base bg-gray-50"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className="group relative aspect-square bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  {file.mime.startsWith('image/') ? (
                    <img
                      src={getImageUrl(file.formats?.thumbnail?.url || file.url)}
                      alt={file.alternativeText || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-sm">{file.mime.split('/')[1].toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 w-20">Preview</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 w-32">Dimensions</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 w-24">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 w-28">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {file.mime.startsWith('image/') ? (
                            <img
                              src={getImageUrl(file.formats?.thumbnail?.url || file.url)}
                              alt={file.alternativeText || file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">{file.mime.split('/')[1].toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        {file.alternativeText && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{file.alternativeText}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{file.width} × {file.height}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 uppercase">{file.mime.split('/')[1]}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFile && (
        <MediaDetailModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onUpdate={loadMediaFiles}
        />
      )}
    </div>
  );
}
