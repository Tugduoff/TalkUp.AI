import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { BaseInput } from '@components/atoms/base-input';

export const Route = createFileRoute('/diary')({
  component: Diary,
});

function Diary() {
  const [value, setValue] = useState('');

  return (
    <div className="p-2">
      <h3 className="text-primary">Diary</h3>
      <p>Agenda</p>
      <BaseInput
        type="text"
        placeholder="Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={false}
        readOnly={false}
        required={true}
      />
    </div>
  );
}
