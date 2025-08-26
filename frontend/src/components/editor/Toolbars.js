import React, { useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, createCommand } from 'lexical';
import { $getSelection, $isRangeSelection } from 'lexical';
import EquationModal from './mathsEquation/EquationModal';
import ChemicalEquationModal from './chemicalEquation/ChemicalEquationModal';
import TableModal from './tableTool/TableModalWithStyles';
import { INSERT_TABLE_COMMAND } from './tableTool/TablePlugin';

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE');
export const INSERT_EQUATION_COMMAND = createCommand('INSERT_EQUATION');
export const INSERT_CHEMICAL_EQUATION_COMMAND = createCommand('INSERT_CHEMICAL_EQUATION');

export default function Toolbars() {
    const [editor] = useLexicalComposerContext();
    const [formats, setFormats] = useState({ 
        bold: false, 
        italic: false, 
        underline: false,
        superscript: false,
        subscript: false
    });
    const [equationModalOpen, setEquationModalOpen] = useState(false);
    const [chemicalModalOpen, setChemicalModalOpen] = useState(false);
    const [tableModalOpen, setTableModalOpen] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    setFormats({
                        bold: selection.hasFormat('bold'),
                        italic: selection.hasFormat('italic'),
                        underline: selection.hasFormat('underline'),
                        superscript: selection.hasFormat('superscript'),
                        subscript: selection.hasFormat('subscript'),
                    });
                } else {
                    setFormats({ 
                        bold: false, 
                        italic: false, 
                        underline: false,
                        superscript: false,
                        subscript: false
                    });
                }
            });
        });
    }, [editor]);

    const handleAlign = (type) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type);
    };

    const handleInsertImage = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
            alert('Only PNG and JPEG images are allowed.');
            e.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            const src = event.target.result;
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src });
        };
        reader.readAsDataURL(file);
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    return (
        <div style={{marginBottom: 8, paddingBottom: 4, display: 'flex', gap: 8}}>
            <button
                type="button"
                style={{ background: formats.bold ? '#1976d2' : '', color: formats.bold ? '#fff' : '' }}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            >
                <b>B</b>
            </button>
            <button
                type="button"
                style={{ background: formats.italic ? '#1976d2' : '', color: formats.italic ? '#fff' : '' }}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            >
                <i>I</i>
            </button>
            <button
                type="button"
                style={{ background: formats.underline ? '#1976d2' : '', color: formats.underline ? '#fff' : '' }}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
            >
                <u>U</u>
            </button>
            <button
                type="button"
                style={{ background: formats.superscript ? '#1976d2' : '', color: formats.superscript ? '#fff' : '' }}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
                title="Superscript"
            >
                <span style={{fontSize: '0.8em', verticalAlign: 'super'}}>X²</span>
            </button>
            <button
                type="button"
                style={{ background: formats.subscript ? '#1976d2' : '', color: formats.subscript ? '#fff' : '' }}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
                title="Subscript"
            >
                <span style={{fontSize: '0.8em', verticalAlign: 'sub'}}>X₂</span>
            </button>
            <button
                type="button"
                onClick={() => handleAlign('left')}
                title="Align Left"
            >
                <span style={{display:'inline-block', width:16, fontSize: '1.2em', lineHeight: '1'}}>
                  <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="3" width="12" height="2" fill="currentColor"/><rect x="2" y="7" width="8" height="2" fill="currentColor"/><rect x="2" y="11" width="12" height="2" fill="currentColor"/></svg>
                </span>
            </button>
            <button
                type="button"
                onClick={() => handleAlign('center')}
                title="Align Center"
            >
                <span style={{display:'inline-block', width:16, fontSize: '1.2em', lineHeight: '1'}}>
                  <svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="3" width="12" height="2" fill="currentColor"/><rect x="5" y="7" width="8" height="2" fill="currentColor"/><rect x="3" y="11" width="12" height="2" fill="currentColor"/></svg>
                </span>
            </button>
            <button
                type="button"
                onClick={() => handleAlign('right')}
                title="Align Right"
            >
                <span style={{display:'inline-block', width:16, fontSize: '1.2em', lineHeight: '1'}}>
                  <svg width="18" height="18" viewBox="0 0 18 18"><rect x="4" y="3" width="12" height="2" fill="currentColor"/><rect x="8" y="7" width="8" height="2" fill="currentColor"/><rect x="4" y="11" width="12" height="2" fill="currentColor"/></svg>
                </span>
            </button>
            <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="Insert Image"
            >
                <span role="img" aria-label="Insert Image" style={{fontSize: '1.2em'}}>🖼️</span>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={handleInsertImage}
            />
            <button
                type="button"
                onClick={() => setEquationModalOpen(true)}
                title="Insert Equation"
            >
                <span style={{display:'inline-block', width:18, fontSize: '1.2em', lineHeight: '1'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="2" height="2"/><rect x="15" y="7" width="2" height="2"/><rect x="7" y="15" width="2" height="2"/><rect x="15" y="15" width="2" height="2"/><rect x="11" y="11" width="2" height="2"/></svg>
                </span>
            </button>
            <button
                type="button"
                onClick={() => setChemicalModalOpen(true)}
                title="Insert Chemical Equation"
            >
                <span style={{display:'inline-block', width:18, fontSize: '1.2em', lineHeight: '1'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 3v2.5M19.5 8V5.5M19.5 8l-7 13.5M4.5 3v2.5M4.5 8V5.5M4.5 8l7 13.5"/><circle cx="12" cy="12" r="2.5"/></svg>
                </span>
            </button>
            <button
                type="button"
                onClick={() => {
                    setTableModalOpen(true);
                }}
                title="Insert Table"
            >
                <span style={{display:'inline-block', width:18, fontSize: '1.2em', lineHeight: '1'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM12 3v18M3 9h18M3 15h18"/></svg>
                </span>
            </button>
            <EquationModal
                open={equationModalOpen}
                onClose={() => setEquationModalOpen(false)}
                onInsert={latex => {
                    setEquationModalOpen(false);
                    editor.dispatchCommand(INSERT_EQUATION_COMMAND, { latex });
                }}
            />
            <ChemicalEquationModal
                open={chemicalModalOpen}
                onClose={() => setChemicalModalOpen(false)}
                onInsert={latex => {
                    setChemicalModalOpen(false);
                    editor.dispatchCommand(INSERT_CHEMICAL_EQUATION_COMMAND, { latex });
                }}
            />
            <TableModal
                open={tableModalOpen}
                onClose={() => setTableModalOpen(false)}
                onInsert={({ rows, columns }) => {
                    setTableModalOpen(false);
                    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns });
                }}
            />
        </div>
    );
}
