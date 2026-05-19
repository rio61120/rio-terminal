import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware Link, redirect, and router — use instead of next/navigation in UI.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
