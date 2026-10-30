import { Truck, Flame, Sparkles } from 'lucide-react';
import type { Announcement } from '@/__types__';
import { ANNOUNCEMENT } from '@/__data__/navLinks';
import { BUTTON_ICON_PROPS } from '@/components/ui/Button';

const ANNOUNCEMENT_ICON = {
  truck: Truck,
  flame: Flame,
  sparkles: Sparkles,
} as const;

interface AnnouncementBarProps {
  readonly announcement?: Announcement;
}

export function AnnouncementBar({
  announcement = ANNOUNCEMENT,
}: AnnouncementBarProps) {
  const Icon = ANNOUNCEMENT_ICON[announcement.icon];

  return (
    <div
      role="region"
      aria-label="Anuncio promocional"
      className="w-full bg-gradient-to-r from-accent-green to-accent-green-pressed text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-center gap-2 text-sm sm:text-[15px] font-medium tracking-wide">
        <Icon {...BUTTON_ICON_PROPS} aria-hidden="true" />
        <span className="truncate">{announcement.message}</span>
      </div>
    </div>
  );
}
