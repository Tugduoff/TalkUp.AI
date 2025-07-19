import React, { useCallback, useEffect, useState } from 'react';

import { Country, PhoneNumberInputProps } from './type';

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

/**
 * A reusable input component for phone numbers with country code selection.
 *
 * This component provides a combined input for phone numbers,
 * allowing users to select a country from a dropdown to automatically apply the dial code,
 * and then enter the rest of their phone number.
 *
 * @param {PhoneNumberInputProps} props - The properties for the component.
 * @param {object} [props.value] - The current value of the phone number, including countryCode and phoneNumber.
 * @param {string} [props.value.countryCode] - The ISO 2-letter country code (e.g., 'US', 'FR').
 * @param {string} [props.value.phoneNumber] - The phone number part without the dial code.
 * @param {(value: { countryCode: string; phoneNumber: string }) => void} [props.onChange] - Callback for when the value changes.
 * @param {string} [props.defaultCountryCode='US'] - The default country code to pre-select.
 * @param {string} [props.placeholder='Phone Number'] - The placeholder text for the phone number input.
 * @param {string} [props.className=''] - Additional CSS classes for the main container div.
 * @param {string} [props.inputClassName=''] - Additional CSS classes for the phone number input field.
 * @param {string} [props.selectClassName=''] - Additional CSS classes for the country selector dropdown.
 * @param {boolean} [props.readOnly=false] - If true, the input fields are read-only.
 * @param {boolean} [props.disabled=false] - If true, the input fields are disabled.
 * @returns {JSX.Element} The phone number input component.
 */
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  defaultCountryCode = 'US',
  placeholder = 'Phone Number',
  className = '',
  inputClassName = '',
  selectClassName = '',
  readOnly = false,
  disabled = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(
    value?.countryCode || defaultCountryCode,
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    value?.phoneNumber || '',
  );

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
    [onChange, phoneNumber],
  );

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = e.target.value;
      setPhoneNumber(newNumber);
      onChange?.({ countryCode: selectedCountry, phoneNumber: newNumber });
    },
    [onChange, selectedCountry],
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        value={selectedCountry}
        onChange={(e) => handleCountryChange(e.target.value)}
        className={`h-10 rounded-md border px-2 ${selectClassName}`}
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
        className={`h-10 flex-1 rounded-md border px-3 ${inputClassName}`}
        aria-label="Phone Number"
      />
    </div>
  );
};

export default PhoneNumberInput;
