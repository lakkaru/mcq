// (removed stray static importDOM)
import { DecoratorNode } from 'lexical';
import * as React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function ResizableImage({ src, width, height, nodeKey }) {
  const [editor] = useLexicalComposerContext();
  const imgRef = React.useRef();
  const [isResizing, setIsResizing] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [startWidth, setStartWidth] = React.useState(width || 300);
  const [startHeight, setStartHeight] = React.useState(height || 200);
  const aspectRatio = (width && height) ? width / height : 1.5;

  React.useEffect(() => {
    setStartWidth(width || 300);
    setStartHeight(height || 200);
  }, [width, height]);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(width || 300);
    setStartHeight(height || 200);
    e.preventDefault();
    e.stopPropagation();
  };

  React.useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e) => {
      const dx = e.clientX - startX;
      // Calculate new width and height, keeping aspect ratio
      let newWidth = Math.max(50, startWidth + dx);
      let newHeight = Math.max(30, newWidth / aspectRatio);
      editor.update(() => {
        const imageNode = editor.getEditorState()._nodeMap.get(nodeKey);
        if (imageNode && imageNode.getWritable) {
          const writable = imageNode.getWritable();
          writable.__width = newWidth;
          writable.__height = newHeight;
        }
      });
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startWidth, startX, aspectRatio, editor, nodeKey]);

  // Handlers for direct input
  const handleInputChange = (e, type) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 10) value = 10;
    if (type === 'width') {
      const newHeight = Math.round(value / aspectRatio);
      editor.update(() => {
        const imageNode = editor.getEditorState()._nodeMap.get(nodeKey);
        if (imageNode && imageNode.getWritable) {
          const writable = imageNode.getWritable();
          writable.__width = value;
          writable.__height = newHeight;
        }
      });
    } else if (type === 'height') {
      const newWidth = Math.round(value * aspectRatio);
      editor.update(() => {
        const imageNode = editor.getEditorState()._nodeMap.get(nodeKey);
        if (imageNode && imageNode.getWritable) {
          const writable = imageNode.getWritable();
          writable.__height = value;
          writable.__width = newWidth;
        }
      });
    }
  };

  return (
    <span style={{ display: 'inline-block', position: 'relative', maxWidth: '100%' }}>
      <img
        ref={imgRef}
        src={src}
        alt=""
        style={{ width: width || 300, height: height || (width ? width / aspectRatio : 200), maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
        draggable={false}
      />
      <span
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 16,
          height: 16,
          background: '#1976d2',
          borderRadius: '50%',
          cursor: 'nwse-resize',
          zIndex: 2,
        }}
        onMouseDown={handleMouseDown}
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ fontSize: 12 }}>
          W:
          <input
            type="number"
            min={10}
            value={Math.round(width) || 300}
            onChange={e => handleInputChange(e, 'width')}
            style={{ width: 50, marginLeft: 4 }}
          />
        </label>
        <label style={{ fontSize: 12 }}>
          H:
          <input
            type="number"
            min={10}
            value={Math.round(height) || 200}
            onChange={e => handleInputChange(e, 'height')}
            style={{ width: 50, marginLeft: 4 }}
          />
        </label>
      </div>
    </span>
  );
}

export class ImageNode extends DecoratorNode {
  static importDOM() {
    return {
      img: (domNode) => ({
        conversion: (element) => {
          const src = element.getAttribute('src');
          const width = element.getAttribute('width');
          const height = element.getAttribute('height');
          return {
            node: new ImageNode(
              src,
              width ? parseInt(width) : undefined,
              height ? parseInt(height) : undefined
            ),
          };
        },
        priority: 1,
      }),
    };
  }
  __src;
  __width;
  __height;
  static getType() {
    return 'image';
  }
  static clone(node) {
    return new ImageNode(node.__src, node.__width, node.__height, node.__key);
  }
  constructor(src, width, height, key) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
  }
  createDOM() {
    const span = document.createElement('span');
    return span;
  }
  updateDOM() {
    return false;
  }
  decorate() {
    // Only pass nodeKey, editor is obtained via hook in ResizableImage
    return (
      <ResizableImage
        src={this.__src}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
  setWidth(width) {
    const self = this.getWritable();
    self.__width = width;
  }
  setHeight(height) {
    const self = this.getWritable();
    self.__height = height;
  }
  static importJSON(serializedNode) {
    const { src, width, height } = serializedNode;
    return new ImageNode(src, width, height);
  }
  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      width: this.__width,
      height: this.__height,
    };
  }

  /**
   * Required for $generateHtmlFromNodes to output <img> tags in HTML.
   */
  exportDOM() {
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    if (this.__width) img.setAttribute('width', this.__width);
    if (this.__height) img.setAttribute('height', this.__height);
    img.setAttribute('alt', '');
    return { element: img };
  }
}

export function $createImageNode(src, width, height) {
  return new ImageNode(src, width, height);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
