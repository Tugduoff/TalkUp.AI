import { Bubble } from '@/components/atoms/bubble';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { formatRelativeDate } from '@/utils/time';
import { useState } from 'react';
import { NoteCardProps } from './types';

/**
 * NoteCard
 *
 * Renders a compact, interactive card representing a single note. The card displays:
 * - a colored "bubble" indicator,
 * - the note title (clamped to two lines),
 * - an HTML preview of the note (clamped to several lines),
 * - a favorite/bookmark toggle button,
 * - and the relative "last updated" time.
 *
 * The component handles hover state to adapt the bookmark icon color and provides
 * click handlers for both the whole card (navigational/select action) and the bookmark button
 * (favorite toggle). The bookmark button prevents the card click from firing when toggled.
 *
 * Important security note:
 * - The `preview` prop is injected into the DOM using `dangerouslySetInnerHTML`. The caller
 *   must ensure the HTML is sanitized or otherwise comes from a trusted source to avoid XSS.
 *
 * @param props : NoteCardProps - The props of the Note Card component
 *
 * @remarks
 * - Visual clamps for preview are implemented using CSS line-clamp (WebKit) and overflow-hidden
 *   to ensure the card stays a fixed height.
 * - The bookmark button includes an accessible `aria-label` that updates depending on the
 *   `isFavorite` state ("Add to favorites" / "Remove from favorites").
 *
 * @returns A React functional component rendering the described note card UI.
 *
 * @example
 * <NoteCard
 *   id="note-123"
 *   title="My Note"
 *   preview="<p>Some <strong>HTML</strong> content</p>"
 *   color="blue"
 *   lastUpdatedAt={new Date()}
 *   isFavorite={false}
 *   onToggleFavorite={(id) => console.log('toggle', id)}
 *   onClick={(id) => navigateToNote(id)}
 * />
 */
export const NoteCard = ({
  id,
  title,
  preview,
  color,
  lastUpdatedAt,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: NoteCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  // Check if preview is empty or contains only empty HTML tags
  const isPreviewEmpty =
    !preview ||
    preview.trim() === '' ||
    preview.replace(/<[^>]*>/g, '').trim() === '';

  return (
    <div
      className="bg-[#ECEDF6] hover:bg-[#dfe0e9] rounded-lg p-3 transition-all duration-200 cursor-pointer h-full flex flex-col gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <Bubble size="sm" color={color} />
          <h3 className="text-h3 text-text-idle font-semibold line-clamp-2 flex-1">
            {title}
          </h3>
        </div>
        <Button
          onClick={handleBookmarkClick}
          variant="text"
          color="neutral"
          size="sm"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon
            icon={isFavorite ? 'bookmark-filled' : 'bookmark'}
            className={`transition-colors ${
              isFavorite
                ? 'text-accent'
                : isHovered
                  ? 'text-text-idle'
                  : 'text-text-weaker'
            }`}
          />
        </Button>
      </div>

      <div className="bg-white text-text-idle p-3 h-40 rounded-[10px] overflow-hidden relative">
        {isPreviewEmpty ? (
          <p className="text-text-weakest italic text-xs">
            Start writing your note...
          </p>
        ) : (
          <div
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            <div
              className="note-preview-content"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 text-body-s text-text-weakest mt-auto">
        <Icon icon="clock" className="w-3 h-3" />
        <span>Updated {formatRelativeDate(lastUpdatedAt)}</span>
      </div>
    </div>
  );
};
