import React, { useRef } from 'react';
import 'mathlive';

export default function EquationModal({ open, onClose, onInsert }) {
  const mathfieldRef = useRef();

  React.useEffect(() => {
    if (open && mathfieldRef.current) {
      mathfieldRef.current.value = '';
      mathfieldRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  // Use a callback ref for the web component
  const setMathfieldRef = node => {
    mathfieldRef.current = node;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
        <h3>Insert Math Equation</h3>
        <math-field ref={setMathfieldRef} style={{ width: '100%', fontSize: '1.2em', marginBottom: 16 }} />
        <div style={{ fontSize: '0.95em', color: '#666', marginBottom: 8 }}>
          Enter math visually or with LaTeX (no chemical syntax)
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button type="button" onClick={() => {
            if (mathfieldRef.current) {
              mathfieldRef.current.insert('\\infty');
              mathfieldRef.current.focus();
            }
          }} title="Insert Infinity Symbol (\\infty)">
            ∞
          </button>
          <button type="button" onClick={() => { if (mathfieldRef.current) { mathfieldRef.current.insert('%'); mathfieldRef.current.focus(); } }} title="Insert %">%</button>
          <button type="button" onClick={() => { if (mathfieldRef.current) { mathfieldRef.current.insert('+'); mathfieldRef.current.focus(); } }} title="Insert +">+</button>
          <button type="button" onClick={() => { if (mathfieldRef.current) { mathfieldRef.current.insert('-'); mathfieldRef.current.focus(); } }} title="Insert -">-</button>
          <button type="button" onClick={() => { if (mathfieldRef.current) { mathfieldRef.current.insert('/'); mathfieldRef.current.focus(); } }} title="Insert /">/</button>
          <button type="button" onClick={() => { if (mathfieldRef.current) { mathfieldRef.current.insert('*'); mathfieldRef.current.focus(); } }} title="Insert *">*</button>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onInsert(mathfieldRef.current.getValue('latex'))}>Insert</button>
        </div>
      </div>
    </div>
  );
}
