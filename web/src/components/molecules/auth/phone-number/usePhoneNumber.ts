import { useCallback, useEffect, useState } from 'react';

import type { PhoneNumberValue } from './types';

interface UsePhoneNumberParams {
  value?: PhoneNumberValue;
  onChange?: (value: PhoneNumberValue) => void;
  defaultCountryCode?: string;
}

export function usePhoneNumber({
  value,
  onChange,
  defaultCountryCode = 'US',
}: UsePhoneNumberParams) {
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
    (newNumber: string) => {
      setPhoneNumber(newNumber);
      onChange?.({ countryCode: selectedCountry, phoneNumber: newNumber });
    },
    [onChange, selectedCountry],
  );

  return {
    selectedCountry,
    phoneNumber,
    handleCountryChange,
    handlePhoneNumberChange,
  };
}
