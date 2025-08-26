import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import {
  $getTableCellNodeFromLexicalNode,
} from '@lexical/table';
import {
  $getSelection,
  $isRangeSelection,
  KEY_TAB_COMMAND,
  COMMAND_PRIORITY_HIGH,
} from 'lexical';

export default function TableActionMenuPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Handle tab navigation in tables
    const unregisterTab = editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const anchor = selection.anchor.getNode();
        const tableCellNode = $getTableCellNodeFromLexicalNode(anchor);
        
        if (tableCellNode) {
          event.preventDefault();
          // Move to next cell or create new row
          return true;
        }
        
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      unregisterTab();
    };
  }, [editor]);

  return <LexicalTablePlugin />;
}
