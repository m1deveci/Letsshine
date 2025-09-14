import React, { useMemo, useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

// Dynamic import to avoid SSR issues
let ReactQuill: any = null;
let isQuillLoaded = false;

const loadQuill = async () => {
  if (typeof window !== 'undefined' && !isQuillLoaded) {
    try {
      const { default: Quill } = await import('react-quill');
      ReactQuill = Quill;
      isQuillLoaded = true;
    } catch (error) {
      console.error('Failed to load ReactQuill:', error);
    }
  }
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'İçerik yazın...',
  className = '',
  height = 200
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeQuill = async () => {
      try {
        await loadQuill();
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing Quill:', error);
        setIsLoaded(false);
      }
    };
    
    initializeQuill();
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ];

  if (!isLoaded || !ReactQuill) {
    return (
      <div className={className}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          style={{ height: `${height}px` }}
        />
        <p className="text-xs text-gray-500 mt-2">Zengin editör yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: `${height}px` }}
        className="bg-white rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      />
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: ${height - 50}px;
          font-size: 14px;
          line-height: 1.6;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #2563eb;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: #2563eb;
        }
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #2563eb;
        }
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
