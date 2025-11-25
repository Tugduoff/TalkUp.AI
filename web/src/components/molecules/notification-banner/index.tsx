import { Badge } from '@/components/atoms/badge';
import { IconAction } from '@/components/atoms/icon-action';
import LinkButton from '@/components/atoms/link-button';

import { NotificationBannerProps } from './types';

/**
 * NotificationBanner molecule component
 *
 * A dismissible notification banner that displays promotional or informational content
 *
 * Composed of:
 * - Badge atom (status indicator)
 * - IconAction atom (close button)
 * - LinkButton atom (call-to-action)
 *
 * @component
 * @example
 * ```tsx
 * <NotificationBanner
 *   badge="New"
 *   title="TalkUp new AI content"
 *   description="Explore the new AI content we have prepared for you in 2026"
 *   ctaText="Try it out"
 *   onCtaClick={() => console.log('CTA clicked')}
 *   onDismiss={() => console.log('Dismissed')}
 * />
 * ```
 */
export const NotificationBanner = ({
  badge,
  title,
  description,
  ctaText,
  ctaIcon = 'arrow-right-up',
  onCtaClick,
  onDismiss,
}: NotificationBannerProps) => {
  return (
    <div className="w-full p-3 bg-[#F8F9FF] rounded-lg border border-accent-weak flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Badge>{badge}</Badge>

        {onDismiss && (
          <IconAction
            icon="times"
            size="xs"
            onClick={onDismiss}
            ariaLabel="Dismiss notification"
          />
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-body-m font-medium text-text-idle">{title}</h4>
        <p className="text-body-s text-text-weakest whitespace-pre-line">
          {description}
        </p>
      </div>

      {ctaText && (
        <LinkButton variant="light" onClick={onCtaClick} icon={ctaIcon}>
          {ctaText}
        </LinkButton>
      )}
    </div>
  );
};

export default NotificationBanner;
