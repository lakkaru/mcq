import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {INSERT_CHEMICAL_EQUATION_COMMAND} from '../Toolbars';
import {$createEquationNode} from '../mathsEquation/EquationNode';
import {COMMAND_PRIORITY_EDITOR, $getSelection, $isRangeSelection, $insertNodes } from 'lexical';

export default function ChemicalEquationPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      INSERT_CHEMICAL_EQUATION_COMMAND,
      (payload) => {
        const { latex } = payload;
        editor.update(() => {
          const eqNode = $createEquationNode(latex);
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $insertNodes([eqNode]);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  return null;
}
