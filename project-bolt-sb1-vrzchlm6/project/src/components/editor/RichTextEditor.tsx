import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code, 
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ChevronDown,
} from 'lucide-react';
import { MediaFile, getImageUrl } from '@/lib/api';
import MediaLibraryPage from '@/pages/media/MediaLibraryPage';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ToolbarButton {
  icon: React.ReactNode;
  tooltip: string;
  action: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter content...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHeadingDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.heading-dropdown')) {
          setShowHeadingDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHeadingDropdown]);

  // Helper function to insert text at cursor position
  const insertAtCursor = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = 
      value.substring(0, start) + 
      before + 
      textToInsert + 
      after + 
      value.substring(end);
    
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Insert image markdown at cursor position
  const insertImageMarkdown = (file: MediaFile) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const imageUrl = getImageUrl(file.url);
    const altText = file.alternativeText || file.name;
    const markdown = `![${altText}](${imageUrl})`;

    const start = textarea.selectionStart;
    const newText = 
      value.substring(0, start) + 
      markdown + 
      value.substring(start);
    
    onChange(newText);

    // Set cursor position after the inserted markdown
    setTimeout(() => {
      const newCursorPos = start + markdown.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle image selection from media picker
  const handleImageSelect = (file: MediaFile) => {
    insertImageMarkdown(file);
    setShowImagePicker(false);
  };

  // Helper function to insert text at start of line
  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    
    const newText = 
      value.substring(0, lineStart) + 
      prefix + 
      value.substring(lineStart);
    
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  // Handle Enter key for list continuation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);
      const currentLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
      const currentLine = textBeforeCursor.substring(currentLineStart);

      // Check for ordered list (e.g., "1. ", "2. ")
      const orderedListMatch = currentLine.match(/^(\d+)\.\s/);
      if (orderedListMatch) {
        e.preventDefault();
        const currentNumber = parseInt(orderedListMatch[1]);
        
        // If the line only contains the list marker, exit the list
        if (currentLine.trim() === `${currentNumber}.`) {
          // Remove the list marker and just add a newline
          const newText = 
            value.substring(0, currentLineStart) + 
            '\n' + 
            value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(currentLineStart + 1, currentLineStart + 1);
          }, 0);
        } else {
          // Continue the list with next number
          const nextNumber = currentNumber + 1;
          const newText = 
            value.substring(0, cursorPos) + 
            `\n${nextNumber}. ` + 
            value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => {
            const newPos = cursorPos + `\n${nextNumber}. `.length;
            textarea.focus();
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }

      // Check for unordered list (e.g., "- ", "* ")
      const unorderedListMatch = currentLine.match(/^([-*])\s/);
      if (unorderedListMatch) {
        e.preventDefault();
        const marker = unorderedListMatch[1];
        
        // If the line only contains the list marker, exit the list
        if (currentLine.trim() === marker) {
          // Remove the list marker and just add a newline
          const newText = 
            value.substring(0, currentLineStart) + 
            '\n' + 
            value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(currentLineStart + 1, currentLineStart + 1);
          }, 0);
        } else {
          // Continue the list
          const newText = 
            value.substring(0, cursorPos) + 
            `\n${marker} ` + 
            value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => {
            const newPos = cursorPos + `\n${marker} `.length;
            textarea.focus();
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }
    }
  };

  // Toolbar actions
  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      tooltip: 'Bold',
      action: () => insertAtCursor('**', '**', 'bold text'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      tooltip: 'Italic',
      action: () => insertAtCursor('_', '_', 'italic text'),
    },
    {
      icon: <Underline className="w-4 h-4" />,
      tooltip: 'Underline',
      action: () => insertAtCursor('<u>', '</u>', 'underlined text'),
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      tooltip: 'Strikethrough',
      action: () => insertAtCursor('~~', '~~', 'strikethrough text'),
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      tooltip: 'Numbered List',
      action: () => insertAtLineStart('1. '),
    },
    {
      icon: <List className="w-4 h-4" />,
      tooltip: 'Bulleted List',
      action: () => insertAtLineStart('- '),
    },
    {
      icon: <Link className="w-4 h-4" />,
      tooltip: 'Insert Link',
      action: () => insertAtCursor('[', '](url)', 'link text'),
    },
    {
      icon: <Image className="w-4 h-4" />,
      tooltip: 'Insert Image',
      action: () => setShowImagePicker(true),
    },
    {
      icon: <Code className="w-4 h-4" />,
      tooltip: 'Code Block',
      action: () => insertAtCursor('```\n', '\n```', 'code'),
    },
    {
      icon: <Quote className="w-4 h-4" />,
      tooltip: 'Blockquote',
      action: () => insertAtLineStart('> '),
    },
  ];

  return (
    <div className="markdown-editor">
      {/* Toolbar */}
      <div className="toolbar bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {/* Heading Dropdown - First tool */}
        <div className="relative heading-dropdown">
          <button
            type="button"
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            onMouseEnter={() => setHoveredButton('Add a title')}
            onMouseLeave={() => setHoveredButton(null)}
            className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-primary flex items-center gap-1 text-sm"
            title="Add a title"
          >
            <span>Add a title</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Tooltip */}
          {hoveredButton === 'Add a title' && !showHeadingDropdown && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              Add a title
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}

          {/* Dropdown Menu */}
          {showHeadingDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    insertAtLineStart('#'.repeat(level) + ' ');
                    setShowHeadingDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-2"
                >
                  {level === 1 && <Heading1 className="w-4 h-4" />}
                  {level === 2 && <Heading2 className="w-4 h-4" />}
                  {level === 3 && <Heading3 className="w-4 h-4" />}
                  {level === 4 && <Heading4 className="w-4 h-4" />}
                  {level === 5 && <Heading5 className="w-4 h-4" />}
                  {level === 6 && <Heading6 className="w-4 h-4" />}
                  <span>Heading {level}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Regular toolbar buttons */}
        {toolbarButtons.map((button, index) => (
          <div key={index} className="relative">
            <button
              type="button"
              onClick={button.action}
              onMouseEnter={() => setHoveredButton(button.tooltip)}
              onMouseLeave={() => setHoveredButton(null)}
              className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-primary"
              title={button.tooltip}
            >
              {button.icon}
            </button>
            
            {/* Tooltip */}
            {hoveredButton === button.tooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                {button.tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full min-h-[300px] p-4 border-none outline-none resize-none font-mono text-sm"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
      />

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full h-full md:w-[90vw] md:h-[85vh] md:max-w-6xl md:rounded-xl overflow-hidden flex flex-col shadow-2xl">
            <MediaLibraryPage
              isSelectionMode={true}
              onSelect={handleImageSelect}
              onCancel={() => setShowImagePicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
