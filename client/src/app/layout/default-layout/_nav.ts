import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Student Survey',
    url: '/dashboard',
    iconComponent: { name: 'cil-user' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Questions',
    url: '/questions',
    iconComponent: { name: 'cil-paperclip' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Create-Survey',
    url: '/survey',
    iconComponent: { name: 'cil-paperclip' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
];
