import React, { useState, useEffect, useCallback } from 'react';

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
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {/* ⚠️ Tu dois remplacer ce <select> par une vraie UI si tu ne veux pas utiliser Select */}
      <select
        value={selectedCountry}
        onChange={(e) => handleCountryChange(e.target.value)}
        className={`h-10 rounded-md border px-2 ${selectClassName || ''}`}
        disabled={disabled}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name} ({country.dialCode})
          </option>
        ))}
      </select>

      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`h-10 flex-1 rounded-md border px-3 ${inputClassName || ''}`}
        aria-label="Phone Number"
      />
    </div>
  );
};

export default PhoneNumberInput;
