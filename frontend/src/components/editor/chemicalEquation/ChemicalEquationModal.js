import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';

export default function ChemicalEquationModal({ open, onClose, onInsert }) {
  const [latex, setLatex] = useState('');

  React.useEffect(() => {
    if (open) setLatex('');
  }, [open]);

  if (!open) return null;

  let previewHtml = '';
  let previewError = '';
  try {
    previewHtml = katex.renderToString(latex, { throwOnError: false });
  } catch (e) {
    previewError = e.message;
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
        <h3>Insert Chemical Equation</h3>
        <textarea
          value={latex}
          onChange={e => setLatex(e.target.value)}
          placeholder={'Enter chemical equation, e.g. \\ce{H2O + CO2 -> H2CO3}'}
          style={{ width: '100%', fontSize: '1.1em', minHeight: 48, marginBottom: 8 }}
        />
        <div style={{ fontSize: '0.95em', color: '#666', marginBottom: 8 }}>
          Use <code>\\ce&#123;...&#125;</code> for chemical equations (mhchem/KaTeX syntax)
        </div>
        <div style={{ minHeight: 32, marginBottom: 8 }}>
          {latex && !previewError && (
            <span dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
          {previewError && (
            <span style={{ color: 'red' }}>Invalid equation</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => { onInsert(latex); setLatex(''); }}>Insert</button>
        </div>
      </div>
    </div>
  );
}
