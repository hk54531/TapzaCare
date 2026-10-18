import type { LayoutConfig } from '../types/config';

export const festivalConfig: LayoutConfig = {
  version: '1.0.1',
  theme: {
    primary: '#8B285D',
    secondary: '#FBE4EF',
    background: '#FFF8FB',
    surface: '#FFFFFF',
    textPrimary: '#482238',
    textSecondary: '#806477',
    accent: '#D99127',
    success: '#21865B',
    error: '#C43D45',
    warning: '#A96112',
    border: '#EEDAE5',
    disabled: '#F0E8ED',
  },
  festival: {
    enabled: true,
    name: 'Festival of Wellness',
    bannerText: 'Celebrate wellness. Give your health some love!',
  },
  tabs: [
    { id: 'Home', label: 'Home', icon: 'home' },
    { id: 'Booking', label: 'Appointments', icon: 'calendar' },
    { id: 'Prescriptions', label: 'Medicines', icon: 'pill' },
    { id: 'Profile', label: 'Profile', icon: 'user' },
  ],
  sections: [
    {
      id: 'festival-hero',
      type: 'hero_banner',
      title: 'A healthier celebration starts here',
      background: { kind: 'token', value: 'secondary' },
      items: [
        {
          id: 'festival-main',
          title: 'Celebrate the gift of health',
          subtitle: 'Find the right care for you and your family.',
          action: 'Booking',
        },
      ],
    },
    {
      id: 'festival-offers',
      type: 'offer_strip',
      title: 'Festival wellness',
      items: [
        {
          id: 'festival-wellness',
          title: 'Your health deserves a celebration',
          subtitle: 'Plan a check-up with a trusted doctor.',
          action: 'Booking',
        },
      ],
    },
    {
      id: 'festival-actions',
      type: 'quick_actions',
      title: 'Care at your fingertips',
      items: [
        { id: 'book', title: 'Book a doctor', icon: 'calendar', action: 'Booking' },
        { id: 'medicines', title: 'My medicines', icon: 'pill', action: 'Prescriptions' },
      ],
    },
    {
      id: 'festival-services',
      type: 'service_grid',
      title: 'Explore care services',
      items: [
        { id: 'consult', title: 'Consult a doctor', icon: 'stethoscope' },
        { id: 'lab', title: 'Lab tests', icon: 'test-tube' },
        { id: 'pharmacy', title: 'Medicines', icon: 'pill' },
        { id: 'records', title: 'Health records', icon: 'file-text' },
      ],
    },
    {
      id: 'festival-categories',
      type: 'category_chips',
      title: 'Care for every need',
      items: [
        { id: 'general', title: 'General physician' },
        { id: 'heart', title: 'Heart' },
        { id: 'skin', title: 'Skin' },
        { id: 'child', title: 'Child care' },
      ],
    },
    {
      id: 'festival-doctors',
      type: 'doctor_carousel',
      title: 'Meet our doctors',
      items: [],
    },
  ],
};
