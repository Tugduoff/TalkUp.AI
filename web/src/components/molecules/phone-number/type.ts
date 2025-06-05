export interface Country {
    name: string;
    code: string;
    flag: string;
    dialCode: string;
  }
  
  export interface PhoneNumberInputProps {
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