import { Button } from '@/components/atoms/button';
import { ButtonColor, ButtonVariant } from '@/components/atoms/button/types';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import { FaSquareArrowUpRight } from 'react-icons/fa6';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  const [variant, setVariant] = useState<ButtonVariant>('contained');
  const [roundness, setRoundness] = useState('rounded-sm');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const colors: ButtonColor[] = [
    'primary',
    'accent',
    'black',
    'white',
    'success',
    'warning',
    'neutral',
    'error',
  ];

  const nextVariant = (current: ButtonVariant): ButtonVariant => {
    switch (current) {
      case 'contained':
        return 'outlined';
      case 'outlined':
        return 'text';
      case 'text':
        return 'contained';
      default:
        return 'contained';
    }
  };

  const nextRoundness = (current: string): string => {
    switch (current) {
      case 'rounded-sm':
        return 'rounded-md';
      case 'rounded-md':
        return 'rounded-lg';
      case 'rounded-lg':
        return 'rounded-xl';
      case 'rounded-xl':
        return 'rounded-full';
      case 'rounded-full':
        return 'rounded-sm';
      default:
        return 'rounded-sm';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold text-primary font-display">About</h3>
        <FaCircleInfo size={28} className="fill-primary" />
      </div>
      <p className="text-gray-600">
        Explore and customize button styles dynamically below.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {colors.map((color) => (
          <Button
            key={color + roundness}
            color={color}
            variant={variant}
            loading={loading}
            className={`${roundness} w-full font-display font-semibold flex items-center justify-center gap-2`}
            disabled={disabled}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
            <FaSquareArrowUpRight size={20} className="ml-2" />
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-semibold rounded-sm font-display"
          onClick={() => setVariant(nextVariant(variant))}
        >
          Change Variant
        </Button>
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-semibold rounded-sm font-display"
          onClick={() => setRoundness(nextRoundness(roundness))}
        >
          Change Roundness
        </Button>
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-semibold rounded-sm font-display"
          onClick={() => setDisabled(!disabled)}
        >
          {disabled ? 'Enable Buttons' : 'Disable Buttons'}
        </Button>
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-semibold rounded-sm font-display"
          onClick={() => setLoading(!loading)}
        >
          {loading ? 'Remove Loading' : 'Set Loading'}
        </Button>
      </div>
    </div>
  );
}
