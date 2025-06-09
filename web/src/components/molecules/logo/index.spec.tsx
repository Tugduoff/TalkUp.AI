import { beforeEach, describe, expect, it, vi } from "vitest";
import Logo from './index';
import { render } from "@testing-library/react";

describe('Logo (Integration Test)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('Variant Rendering', () => {
    it('renders default variant (line)', () => {
      const { getByTestId } = render(<Logo />);
      const lineLogo = getByTestId('line-logo');
      expect(lineLogo).toBeInTheDocument();
      expect(lineLogo).toHaveClass('flex items-center justify-center gap-3 h-10');
    })

    it('renders line variant', () => {
      const { getByTestId } = render(<Logo variant="line" />);
      const lineLogo = getByTestId('line-logo');
      expect(lineLogo).toBeInTheDocument();
      expect(lineLogo).toHaveClass('flex items-center justify-center gap-3 h-10');
    })

    it('renders column variant', () => {
      const { getByTestId } = render(<Logo variant="column" />);
      const columnLogo = getByTestId('column-logo');
      expect(columnLogo).toBeInTheDocument();
      expect(columnLogo).toHaveClass('flex flex-col items-center justify-center gap-2 h-20');
    })

    it('renders no-text variant', () => {
      const { getByTestId } = render(<Logo variant="no-text" />);
      const noTextLogo = getByTestId('no-text-logo');
      expect(noTextLogo).toBeInTheDocument();
      expect(noTextLogo).toHaveClass('flex items-center justify-center h-10');
    })
  });

  describe('Color Prop handling', () => {
    it('applies default color to line variant', () => {
      const { getByTestId } = render(<Logo variant="line" />);
      const logoText = getByTestId('line-logo').querySelector('h1');
      const logoSvg = getByTestId('line-logo').querySelector('svg');
      expect(logoText).toHaveClass('text-primary');
      expect(logoSvg).toHaveClass('fill-primary');
    });

    it('applies primary color to column variant', () => {
      const { getByTestId } = render(<Logo variant="column" />);
      const logoText = getByTestId('column-logo').querySelector('h1');
      const logoSvg = getByTestId('column-logo').querySelector('svg');
      expect(logoText).toHaveClass('text-primary');
      expect(logoSvg).toHaveClass('fill-primary');
    });

    it('applies accent color to no-text variant', () => {
      const { getByTestId } = render(<Logo variant="no-text" color="accent" />);
      const logoSvg = getByTestId('no-text-logo').querySelector('svg');
      expect(logoSvg).toHaveClass('fill-accent');
    });
  });

  describe('Additional HTML', () => {
    it('passes additional props to the container', () => {
      const { getByTestId } = render(<Logo variant="line" className="custom-class" />);
      const logoContainer = getByTestId('line-logo');
      expect(logoContainer).toHaveClass('custom-class');
      expect(logoContainer).toHaveClass('flex items-center justify-center gap-3 h-10');
    });
  });
})
