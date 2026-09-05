import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'safe' | 'review' | 'high' | 'neutral' | 'cyan';
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
