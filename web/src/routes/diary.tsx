import { InputMolecule } from '@/components/molecules/input-molecule';
// Import the new component
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/diary')({
  component: Diary,
});

function Diary() {
  const [baseValue, setBaseValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectorValue, setSelectorValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-primary text-2xl font-bold font-display">
        Input Molecule Showcase
      </h3>
      <p className="text-gray-600">
        This page demonstrates the versatile `InputMolecule` component, capable
        of rendering various input types with labels and helper text.
      </p>

      {/* Base Input Example */}
      <InputMolecule
        type="base"
        id="baseInputExample"
        label="Your Name"
        helperText="Please enter your full name."
        placeholder="John Doe"
        value={baseValue}
        onChange={(e) => setBaseValue((e.target as HTMLInputElement).value)}
        required
      />

      {/* Textarea Input Example */}
      <InputMolecule
        type="textarea"
        id="descriptionInput"
        label="Project Description"
        helperText="Provide a brief description of your project (max 200 characters)."
        placeholder="Start typing here..."
        value={textareaValue}
        onChange={(e) =>
          setTextareaValue((e.target as HTMLTextAreaElement).value)
        }
        rows={5}
        resize={true}
        maxLength={200}
      />

      {/* Selector Input Example */}
      <InputMolecule
        type="selector"
        id="favoriteFruitSelector"
        label="Choose Your Favorite Fruit"
        helperText="Select one option from the dropdown list."
        value={selectorValue}
        onChange={(e) =>
          setSelectorValue((e.target as HTMLSelectElement).value)
        }
        options={[
          { value: 'option1', label: 'Apple' },
          { value: 'option2', label: 'Banana' },
          { value: 'option3', label: 'Cherry' },
        ]}
      />

      {/* Checkbox Input Example */}
      <InputMolecule
        type="checkbox"
        id="newsletterSubscription"
        label="Subscribe to our Newsletter"
        helperText="Tick this box to receive email updates and promotions."
        value={checkboxValue}
        onChange={(e) =>
          setCheckboxValue((e.target as HTMLInputElement).checked)
        }
      />

      {/* Example with only helper text */}
      <InputMolecule
        type="base"
        id="phoneInput"
        helperText="Your phone number, including country code (e.g., +1234567890)."
        placeholder="+1234567890"
      />

      {/* Example with only label */}
      <InputMolecule
        type="textarea"
        id="feedbackInput"
        label="Your Feedback"
        placeholder="Share your thoughts..."
      />

      {/* Disabled Input Example */}
      <InputMolecule
        type="base"
        id="disabledInput"
        label="Disabled Field"
        helperText="This field is disabled and cannot be edited."
        value="You cannot edit this"
        disabled
      />

      {/* ReadOnly Input Example */}
      <InputMolecule
        type="base"
        id="readOnlyInput"
        label="Read-Only Field"
        helperText="This field can be selected but not edited."
        value="This text is read-only"
        readOnly
      />
    </div>
  );
}
