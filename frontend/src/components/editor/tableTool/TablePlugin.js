import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTableNodeWithDimensions,
  TableNode,
} from '@lexical/table';
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  createCommand,
} from 'lexical';

export const INSERT_TABLE_COMMAND = createCommand('INSERT_TABLE');

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      throw new Error('TablePlugin: TableNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      (payload) => {
        editor.update(() => {
          const { rows, columns } = payload;
          const selection = $getSelection();
          
          try {
            const tableNode = $createTableNodeWithDimensions(rows, columns, false);
            
            if ($isRangeSelection(selection)) {
              selection.insertNodes([tableNode]);
            } else {
              const root = $getRoot();
              root.append(tableNode);
            }
            
          } catch (error) {
            console.error('Error creating table:', error);
          }
        });

        return true;
      },
      1 // COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
