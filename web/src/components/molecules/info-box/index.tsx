import { Icon } from '@/components/atoms/icon';

import { InfoBoxProps } from './types';

/**
 * InfoBox - a small, reusable information card that displays an icon, a title, and descriptive text.
 *
 * @param props - Component props.
 * @param props.title - The heading text shown prominently next to the icon. Rendered as an <h3> for semantic structure.
 * @param props.text - The descriptive body text displayed below the title. Should be plain text or already formatted markup.
 * @param props.icon - Identifier or component used by the Icon component (type defined by InfoBoxProps). Rendered to the left of the title.
 *
 * @returns A JSX element rendering a padded, bordered, rounded card with a header row (icon + title) and a description paragraph.
 *
 * @example
 * <InfoBox title="Account verified" text="Your account is now verified." icon="check-circle" />
 *
 * @remarks
 * - Visual styling relies on utility classes (padding, background, border, shadow, rounded corners).
 * - The title is an <h3> to preserve document outline; adjust if different semantics are required.
 * - Ensure the provided icon is accessible: either provide an accessible name or mark it decorative (aria-hidden) as appropriate.
 */
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
