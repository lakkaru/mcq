import { useEffect, useRef, lazy, Suspense } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import './editor-theme.css'; // Make sure this CSS file exists and defines your editor styles

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ParagraphNode, TextNode } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'; // <-- New: for controlled component behavior

// Lexical HTML conversion utilities
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode } from 'lexical'; // <-- New: for manipulating editor state

// Import nodes normally (they're lightweight)
import { ImageNode } from './editor/imageTool/ImageNode';
import { EquationNode } from './editor/mathsEquation/EquationNode';

// Lazy load heavy components
const Toolbars = lazy(() => import('./editor/Toolbars'));
const ImagesPlugin = lazy(() => import('./editor/imageTool/ImagesPlugin'));
const EquationPlugin = lazy(() => import('./editor/mathsEquation/EquationPlugin'));
const ChemicalEquationPlugin = lazy(() => import('./editor/chemicalEquation/ChemicalEquationPlugin'));
const TablePlugin = lazy(() => import('./editor/tableTool/TablePlugin'));
const TableActionMenuPlugin = lazy(() => import('./editor/tableTool/TableActionMenuPlugin'));

// (imports already declared at the top)

// Define your Lexical theme here. These classes should be defined in editor-theme.css
const editorTheme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
    h3: 'editor-h3',
    h4: 'editor-h4',
    h5: 'editor-h5',
    h6: 'editor-h6',
  },
  list: {
    ul: 'editor-ul',
    ol: 'editor-ol',
    listItem: 'editor-listitem',
  },
  quote: 'editor-quote',
  link: 'editor-link',
  text: {
    bold: 'editor-textBold',
    italic: 'editor-textItalic',
    underline: 'editor-textUnderline',
    strikethrough: 'editor-textStrikethrough',
    superscript: 'editor-textSuperscript',
    subscript: 'editor-textSubscript',
    code: 'editor-textCode',
  },
  // Add other styles for your custom nodes or elements as needed
  image: 'editor-image',
  equation: 'editor-equation',
  'chemical-equation': 'editor-chemical-equation',
  table: 'editor-table',
  tableCell: 'editor-tableCell',
  tableCellHeader: 'editor-tableCellHeader',
  tableRow: 'editor-tableRow',
  // Add table style modifiers
  'table-bordered': 'table-bordered',
  'table-minimal': 'table-minimal',
  'table-compact': 'table-compact',
  'table-spacious': 'table-spacious',
};

function onError(error) {
  console.error(error);
}

/**
 * A controlled Lexical editor component.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The current HTML string value of the editor.
 * @param {(htmlString: string) => void} props.onChange - Callback fired when the editor's content changes, providing the new HTML string.
 * @param {string} [props.placeholder] - Placeholder text for the editor.
 * @param {boolean} [props.autoFocus=false] - Whether this editor should automatically receive focus on load.
 * @param {string} [props.variant] - Visual variant: 'default', 'feedback', 'general-feedback'. Affects background color.
 */




// --- ControlledValuePlugin: keeps editor in sync with value prop ---
// (moved imports to top of file to fix ESLint import/first error)
function sanitizeHtmlForLexical(html) {
  // Remove any writing-mode or direction from style attributes
  let sanitized = html.replace(/writing-mode\s*:\s*[^;"']+;?/gi, '')
                      .replace(/direction\s*:\s*[^;"']+;?/gi, '');
  // Optionally, add enforced style to all <p> and <div> tags
  sanitized = sanitized.replace(/<(p|div)([^>]*)>/gi, (match, tag, attrs) => {
    // If style already exists, append to it
    if (/style\s*=/.test(attrs)) {
      return `<${tag}${attrs.replace(/style\s*=\s*"([^"]*)"/, (m, s) => `style="${s} writing-mode: horizontal-tb; direction: ltr;"`)}>`;
    } else {
      return `<${tag}${attrs} style="writing-mode: horizontal-tb; direction: ltr;">`;
    }
  });
  return sanitized;
}

function ControlledValuePlugin({ value, lastEmittedValueRef }) {
  const [editor] = useLexicalComposerContext();
  const didHydrateRef = useRef(false);
  useEffect(() => {
    // Always hydrate on first mount, or if value changes from last emitted
    if (!didHydrateRef.current || value !== lastEmittedValueRef.current) {
      editor.update(() => {
        const root = $getRoot();
        if (value) {
          const sanitized = sanitizeHtmlForLexical(value);
          const parser = new window.DOMParser();
          const dom = parser.parseFromString(sanitized, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          root.clear();
          nodes.forEach(node => root.append(node));
        } else {
          root.clear();
          root.append($createParagraphNode());
        }
      });
      didHydrateRef.current = true;
    }
  }, [value, editor, lastEmittedValueRef]);
  return null;
}

function Editor({ value, onChange, placeholder, autoFocus = false, variant = 'default' }) {
  const lastEmittedValueRef = useRef(value);
  
  // Define background colors for different variants
  const getContainerStyle = (variant) => {
    const baseStyle = {
      position: 'relative',
      borderRadius: '4px',
      minHeight: '100px',
      maxHeight: '300px',
      overflowY: 'auto'
    };

    switch (variant) {
      case 'feedback':
        return {
          ...baseStyle,
          backgroundColor: '#fff3e0' // Light orange background for answer feedback
        };
      case 'general-feedback':
        return {
          ...baseStyle,
          backgroundColor: '#e8f5e8' // Light green background for general feedback
        };
      default:
        return baseStyle;
    }
  };

  const getContentEditableStyle = (variant) => {
    const baseStyle = {
      minHeight: 80,
      writingMode: 'horizontal-tb',
      direction: 'ltr',
      textAlign: 'left',
      padding: '8px'
    };

    switch (variant) {
      case 'feedback':
        return {
          ...baseStyle,
          backgroundColor: 'transparent'
        };
      case 'general-feedback':
        return {
          ...baseStyle,
          backgroundColor: 'transparent'
        };
      default:
        return baseStyle;
    }
  };
  const initialConfig = {
    namespace: 'MyEditor',
    theme: editorTheme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      ParagraphNode,
      TextNode,
      ImageNode,
      EquationNode,
    ],
  };

  const handleEditorChange = (editorState, editor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      // Only call onChange if the value is different to prevent infinite loop
      if (typeof value !== 'string' || htmlString !== value) {
        lastEmittedValueRef.current = htmlString;
        onChange(htmlString);
      }
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Suspense fallback={<div style={{ padding: '8px', color: '#666' }}>Loading toolbar...</div>}>
        <Toolbars />
      </Suspense>
      <ControlledValuePlugin value={value} lastEmittedValueRef={lastEmittedValueRef} />
      <div className="editor-container" style={getContainerStyle(variant)} data-variant={variant}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-content-editable"
              aria-placeholder={placeholder || 'Enter some text...'}
              style={getContentEditableStyle(variant)}
              dir="ltr"
            />
          }
          placeholder={placeholder && <div className="editor-placeholder" style={{ position: 'absolute', top: '10px', left: '10px', color: '#aaa', pointerEvents: 'none' }}>{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <TabIndentationPlugin />
        {autoFocus && <AutoFocusPlugin />}
        <Suspense fallback={null}>
          <ImagesPlugin />
          <EquationPlugin />
          <ChemicalEquationPlugin />
          <TablePlugin />
          <TableActionMenuPlugin />
        </Suspense>
        <OnChangePlugin onChange={handleEditorChange} ignoreHistoryMergeTagChange={true} />
      </div>
    </LexicalComposer>
  );
}

export default Editor;