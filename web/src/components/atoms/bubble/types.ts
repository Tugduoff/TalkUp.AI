const BubbleColors = ['blue', 'green', 'red', 'yellow'] as const;

const BubbleSizes = ['sm', 'md', 'lg'] as const;

export interface BubbleProps {
  color?: (typeof BubbleColors)[number];
  size?: (typeof BubbleSizes)[number];
}
