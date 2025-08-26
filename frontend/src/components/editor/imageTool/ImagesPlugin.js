import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {INSERT_IMAGE_COMMAND} from '../Toolbars';
import {$createImageNode} from './ImageNode';
import {COMMAND_PRIORITY_EDITOR, $getSelection, $isRangeSelection, $insertNodes } from 'lexical';

export default function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        // Accept width and height for resizable images
        const { src, width, height } = payload;
        editor.update(() => {
          const imageNode = $createImageNode(src, width, height);
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $insertNodes([imageNode]);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  return null;
}
