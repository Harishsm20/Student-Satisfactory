import { INavData } from '@coreui/angular';

export const navItems: (INavData & { roles?: string[] })[] = [
  {
    name: 'Student Survey',
    url: '/dashboard',
    iconComponent: { name: 'cil-user' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    roles: ['faculty']
  },
  {
    title: true,
    name: 'Theme',
    roles: ['faculty']
  },
  {
    name: 'Questions',
    url: '/questions',
    iconComponent: { name: 'cil-paperclip' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    roles: ['student']
  },
  {
    name: 'Create-Survey',
    url: '/survey',
    iconComponent: { name: 'cil-paperclip' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    roles: ['faculty']
  },
];
