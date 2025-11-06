import { Icon } from '@/components/atoms/icon';

import { InfoBoxProps } from './types';

const InfoBox = ({ title, text, icon }: InfoBoxProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon={icon} size="md" color="accent" />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default InfoBox;
