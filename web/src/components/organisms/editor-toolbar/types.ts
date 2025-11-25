import { IconName } from '@/components/atoms/icon/icon-map';
import { Editor } from '@tiptap/react';

export interface EditorToolbarProps {
  editor: Editor;
  fontSize: number;
  fontFamily: string | null;
  fontFamilyOptions: Array<{ label: string; value: string }>;
  fontSizeOptions: Array<{ label: string; value: string }>;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onDecreaseFontSize: () => void;
  onIncreaseFontSize: () => void;
  toggleCase: () => void;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onStrikeClick: () => void;
  onTextColorChange: (color: string) => void;
  onHighlightColorChange: (color: string) => void;
  onRemoveFormat: () => void;
  onOrderedListClick: () => void;
  onTaskListClick: () => void;
  onBulletListClick: () => void;
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  onAlignJustifyClick: () => void;
  onUndoClick: () => void;
  onRedoClick: () => void;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  icon: IconName;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
}
