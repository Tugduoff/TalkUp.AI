import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', dialCode: '+81' },
  { name: 'China', code: 'CN', flag: '🇨🇳', dialCode: '+86' },
  { name: 'India', code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', dialCode: '+55' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', dialCode: '+7' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', dialCode: '+27' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', dialCode: '+52' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', dialCode: '+82' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', dialCode: '+39' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', dialCode: '+34' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', dialCode: '+31' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', dialCode: '+46' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', dialCode: '+41' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', dialCode: '+54' },
];

interface PhoneNumberInputProps {
  value?: { countryCode: string; phoneNumber: string };
  onChange?: (value: { countryCode: string; phoneNumber: string }) => void;
  defaultCountryCode?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  defaultCountryCode = 'US',
  placeholder = 'Phone Number',
  className,
  inputClassName,
  selectClassName,
  readOnly,
  disabled,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(value?.countryCode || defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState<string>(value?.phoneNumber || '');

  useEffect(() => {
    if (value) {
      setSelectedCountry(value.countryCode);
      setPhoneNumber(value.phoneNumber);
    }
  }, [value]);

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      setSelectedCountry(countryCode);
      onChange?.({ countryCode, phoneNumber });
    },
    [onChange, phoneNumber]
  );

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = e.target.value;
      setPhoneNumber(newNumber);
      onChange?.({ countryCode: selectedCountry, phoneNumber: newNumber });
    },
    [onChange, selectedCountry]
  );

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'w-[120px] h-10 flex items-center gap-2',
            'border-gray-300 dark:border-gray-700',
            'bg-white dark:bg-gray-900',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-all duration-200 rounded-md shadow-sm',
            selectClassName
          )}
          aria-label="Country Code"
        >
          <span className="text-sm">{selectedCountryData?.flag}</span>
          <SelectValue placeholder="Code" className="text-sm" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {countries.map((country) => (
            <SelectItem
              key={country.code}
              value={country.code}
              className={cn(
                'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
                'focus:bg-gray-200 dark:focus:bg-gray-600 focus:text-black dark:focus:text-white',
                'transition-colors duration-200 rounded-md'
              )}
            >
              <div className="flex items-center gap-2 text-sm">
                <span>{country.flag}</span>
                <span>{country.name} ({country.dialCode})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={cn(
          'h-10 flex-1',
          'border-gray-300 dark:border-gray-700',
          'bg-white dark:bg-gray-900',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'transition-all duration-200 rounded-md shadow-sm',
          inputClassName
        )}
        readOnly={readOnly}
        disabled={disabled}
        aria-label="Phone Number"
      />
    </div>
  );
};

export default PhoneNumberInput;
