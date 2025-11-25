import { Bubble } from '@/components/atoms/bubble';
import { BubbleProps } from '@/components/atoms/bubble/types';
import { Button } from '@/components/atoms/button';
import { useEffect, useRef } from 'react';

export interface ColorPickerProps {
  currentColor: BubbleProps['color'];
  onColorSelect: (color: BubbleProps['color']) => void;
  onClose: () => void;
  isOpen: boolean;
}

const AVAILABLE_COLORS: BubbleProps['color'][] = [
  'blue',
  'green',
  'red',
  'yellow',
];

/** ColorPicker component */
export const ColorPicker = ({
  currentColor,
  onColorSelect,
  onClose,
  isOpen,
}: ColorPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-50 animate-fadeIn"
    >
      <p className="text-body-s text-text-weaker mb-2">Select color</p>
      <div className="flex gap-2">
        {AVAILABLE_COLORS.map((color) => (
          <Button
            key={color}
            variant="text"
            color="neutral"
            onClick={() => onColorSelect(color)}
            className={`p-2 rounded-lg hover:bg-neutral-weaker transition-colors ${
              currentColor === color ? 'bg-accent/10 ring-2 ring-accent' : ''
            }`}
            title={`Select ${color} color`}
          >
            <Bubble size="sm" color={color} />
          </Button>
        ))}
      </div>
    </div>
  );
};
