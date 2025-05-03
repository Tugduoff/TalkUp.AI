import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import { FaSquareArrowUpRight } from 'react-icons/fa6';

import { Button } from '@components/atoms/button';
import {
  ButtonColor,
  ButtonVariant,
} from '@components/atoms/button/types';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  const [variant, setVariant] = useState<ButtonVariant>('contained');
  const [roundiness, setRoundiness] = useState('rounded-sm');
  const [disabled, setDisabled] = useState(false);

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

  const nextRoundiness = (current: string): string => {
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
        <h3 className="text-primary text-2xl font-display font-bold">About</h3>
        <FaCircleInfo size={28} className="fill-primary" />
      </div>
      <p className="text-gray-600">
        Explore and customize button styles dynamically below.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colors.map((color) => (
          <Button
            key={color + roundiness}
            color={color}
            variant={variant}
            className={`${roundiness} w-full font-display font-semibold flex items-center justify-center gap-2`}
            disabled={disabled}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
            <FaSquareArrowUpRight size={20} className="ml-2" />
          </Button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-display font-semibold rounded-sm"
          onClick={() => setVariant(nextVariant(variant))}
        >
          Change Variant
        </Button>
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-display font-semibold rounded-sm"
          onClick={() => setRoundiness(nextRoundiness(roundiness))}
        >
          Change Roundness
        </Button>
        <Button
          color="neutral"
          variant="contained"
          className="w-1/5 font-display font-semibold rounded-sm"
          onClick={() => setDisabled(!disabled)}
        >
          {disabled ? 'Enable Buttons' : 'Disable Buttons'}
        </Button>
      </div>
    </div>
  );
}
