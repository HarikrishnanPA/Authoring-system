import { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import { marked } from 'marked';
import { RichTextEditor } from '@/components/editor';

interface MarkdownEditorWithPreviewProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
}

export default function MarkdownEditorWithPreview({
  value,
  onChange,
  placeholder = 'Enter content...',
  label,
  minHeight = '200px',
}: MarkdownEditorWithPreviewProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              !isPreviewMode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3 h-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              isPreviewMode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>
      </div>

      {!isPreviewMode ? (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <RichTextEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <div 
          className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 overflow-auto"
          style={{ minHeight }}
        >
          <div className="prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900">
            {value ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(value) as string
                }}
              />
            ) : (
              <p className="text-gray-400 italic">No content to preview</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
