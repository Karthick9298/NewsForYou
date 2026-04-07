/**
 * Shared category/interest constants — single source of truth used by
 * RegisterPage, DashboardPage, and any future components that need
 * per-category metadata (icon, colour, label).
 */
import {
  Briefcase,
  Trophy,
  Clapperboard,
  Cpu,
  HeartPulse,
  FlaskConical,
  Newspaper,
  Sun,
  Moon,
} from 'lucide-react';

/**
 * Ordered list used in the registration interest-picker.
 * Includes gradient colours, icon colours, and border colours for selected states.
 */
export const ALL_INTERESTS = [
  {
    id: 'business',
    label: 'Business',
    icon: Briefcase,
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/40',
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: Trophy,
    color: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-400',
    border: 'border-green-500/40',
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: Clapperboard,
    color: 'from-pink-500/20 to-pink-500/5',
    iconColor: 'text-pink-400',
    border: 'border-pink-500/40',
  },
  {
    id: 'technology',
    label: 'Technology',
    icon: Cpu,
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/40',
  },
  {
    id: 'health',
    label: 'Health',
    icon: HeartPulse,
    color: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-400',
    border: 'border-red-500/40',
  },
  {
    id: 'science',
    label: 'Science',
    icon: FlaskConical,
    color: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/40',
  },
  {
    id: 'general',
    label: 'General',
    icon: Newspaper,
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/40',
  },
];

/**
 * Keyed map used in the dashboard feed for chip + section-header rendering.
 * Falls back gracefully for unknown category keys.
 */
export const INTEREST_META = {
  business: {
    icon: Briefcase,
    label: 'Business',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  sports: {
    icon: Trophy,
    label: 'Sports',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  entertainment: {
    icon: Clapperboard,
    label: 'Entertainment',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  technology: {
    icon: Cpu,
    label: 'Technology',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  health: {
    icon: HeartPulse,
    label: 'Health',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  science: {
    icon: FlaskConical,
    label: 'Science',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  general: {
    icon: Newspaper,
    label: 'General',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
};

/** Default meta for unknown/future categories */
export const DEFAULT_INTEREST_META = {
  icon: Newspaper,
  label: 'News',
  color: 'text-primary',
  bg: 'bg-primary/10',
  border: 'border-primary/20',
};

export const NOTIFICATION_OPTIONS = [
  {
    id: 'morning',
    label: 'Morning Digest',
    time: '6:00 AM',
    description: 'Start your day informed — fresh stories delivered at dawn.',
    icon: Sun,
    activeBg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/5',
    activeBorder: 'border-amber-500/50',
    activeIcon: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    glow: 'shadow-amber-500/10',
  },
  {
    id: 'night',
    label: 'Night Recap',
    time: '9:00 PM',
    description: "Wind down with the day's biggest stories before bed.",
    icon: Moon,
    activeBg: 'bg-gradient-to-br from-indigo-500/15 to-purple-500/5',
    activeBorder: 'border-indigo-500/50',
    activeIcon: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15',
    glow: 'shadow-indigo-500/10',
  },
];
