import { BubbleProps } from './types';
import { BubbleVariants } from './variants';

/**
 * Bubble — a presentational component that renders a decorative bubble element.
 *
 * Computes a CSS class name via BubbleVariants from the provided variant props
 * and returns a div with that class. This component is intended for purely
 * visual use and does not render children or manage state.
 *
 * @param color - The color variant for the bubble. Defaults to `'blue'`.
 *                Accepted values are determined by the BubbleVariants implementation.
 * @param size  - The size variant for the bubble. Defaults to `'md'`.
 *                Accepted values are determined by the BubbleVariants implementation.
 *
 * @returns A JSX.Element representing the styled bubble (an empty div with the computed className).
 *
 * @example
 * <Bubble color="blue" size="md" />
 *
 * @remarks
 * The component delegates all class generation to BubbleVariants, so ensure that
 * the variant keys you pass are supported by that utility.
 */
export const Bubble = ({ color = 'blue', size = 'md' }: BubbleProps) => {
  const className = BubbleVariants({ color, size });
  return <div className={className}></div>;
};
