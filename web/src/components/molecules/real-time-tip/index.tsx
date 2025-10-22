import AvatarWorking from '@/assets/avatarworking.png';
import { Icon } from '@/components/atoms/icon';

import { RealTimeTipProps } from './types';

/**
 * RealTimeTip component.
 *
 * Displays a panel containing real-time feedback or tips from the AI,
 * typically used as a sidebar during the simulation. It includes a title,
 * text content, and a stylized illustration/placeholder.
 * * @param {RealTimeTipProps} props The properties object.
 * @param {string} props.title The title of the tips section.
 * @param {string} props.tipText The content of the current tip.
 * @returns {JSX.Element} The rendered real-time tip panel.
 */
const RealTimeTip = ({ title, tipText }: RealTimeTipProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        {/* Icon (check) to visually indicate a tip/advice */}
        <Icon icon="check" size="md" color="primary" className="mr-2" />
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{tipText}</p>

      <div className="mt-auto w-full h-42 rounded-lg flex items-center justify-center">
        <img
          src={AvatarWorking}
          alt="AI illustration of an avatar working"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};
export default RealTimeTip;
