export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

export type PhoneNumberValue = {
  countryCode: string;
  phoneNumber: string;
};

export interface PhoneNumberInputProps {
  value?: PhoneNumberValue;
  onChange?: (value: PhoneNumberValue) => void;
  defaultCountryCode?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
  readOnly?: boolean;
  disabled?: boolean;
}
