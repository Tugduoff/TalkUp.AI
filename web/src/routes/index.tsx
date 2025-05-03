import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { LogoColor } from '@components/atoms/logo-svg/types';
import { Logo } from '@components/molecules/logo';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [color, setColor] = useState<LogoColor>('primary');
  const [color2, setColor2] = useState<LogoColor>('primary');
  const [color3, setColor3] = useState<LogoColor>('primary');

  return (
    <div className="p-2">
      <h3 className="text-primary">Home</h3>
      <p>Page vitrine</p>
      <p className="text-text font-display">
        Change Logo color by clicking on it ^^
      </p>
      <div className="flex items-center justify-between w-full p-4">
        <Logo
          variant="line"
          color={color}
          onClick={() => setColor(color === 'accent' ? 'primary' : 'accent')}
          className="cursor-pointer"
        />
        <Logo
          variant="column"
          color={color2}
          onClick={() => setColor2(color2 === 'accent' ? 'primary' : 'accent')}
          className="cursor-pointer"
        />
        <Logo
          variant="no-text"
          color={color3}
          onClick={() => setColor3(color3 === 'accent' ? 'primary' : 'accent')}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className={`text-${color}`}>Logo Line: {color}</span>
        <span className={`text-${color2}`}>Logo Column: {color2}</span>
        <span className={`text-${color3}`}>Logo No Text: {color3}</span>
      </div>
    </div>
  );
}
