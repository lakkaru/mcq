import { DecoratorNode } from 'lexical';
import * as React from 'react';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem'; // Enable chemical equations with \ce{...} syntax

// Lazy load KaTeX
let katex = null;
const loadKaTeX = async () => {
  if (!katex) {
    katex = (await import('katex')).default;
  }
  return katex;
};

// Component for rendering equation with lazy-loaded KaTeX
function EquationComponent({ latex }) {
  const [renderedHtml, setRenderedHtml] = React.useState('Loading...');
  
  React.useEffect(() => {
    loadKaTeX().then(katex => {
      try {
        const html = katex.renderToString(latex, { throwOnError: false });
        setRenderedHtml(html);
      } catch (error) {
        setRenderedHtml(`Error: ${latex}`);
      }
    });
  }, [latex]);
  
  return (
    <span className="editor-equation" dangerouslySetInnerHTML={{
      __html: renderedHtml
    }} />
  );
}

export class EquationNode extends DecoratorNode {
  __latex;
  static getType() {
    return 'equation';
  }
  static clone(node) {
    return new EquationNode(node.__latex, node.__key);
  }
  constructor(latex, key) {
    super(key);
    this.__latex = latex;
  }
  createDOM() {
    const span = document.createElement('span');
    return span;
  }
  updateDOM() {
    return false;
  }
  decorate() {
    return <EquationComponent latex={this.__latex} />;
  }
  static importJSON(serializedNode) {
    const { latex } = serializedNode;
    return new EquationNode(latex);
  }
  exportJSON() {
    return {
      type: 'equation',
      version: 1,
      latex: this.__latex,
    };
  }
}

export function $createEquationNode(latex) {
  return new EquationNode(latex);
}

export function $isEquationNode(node) {
  return node instanceof EquationNode;
}
