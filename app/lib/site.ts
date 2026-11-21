import type { WritingStatus } from '@/app/types';

export const SITE_URL = 'https://www.charlymicolas.com';
export const SITE_NAME = 'Charly Micolas Butarbutar';
export const SITE_ALTERNATE_NAMES = [
  'Charly Butarbutar',
  'Charly Micolas',
] as const;
export const SITE_LAST_MODIFIED = new Date('2026-08-16T00:00:00.000Z');

export function formatWritingStatus(status: WritingStatus): string {
  return status === 'Draft' ? 'Draft note' : status;
}
