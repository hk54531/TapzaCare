import type { LayoutConfig } from '../types/config';

export const normalConfig: LayoutConfig = {
  version: '1.0.0',
  theme: {
    primary: '#087F8C',
    secondary: '#DDF5F0',
    background: '#F7FAFA',
    surface: '#FFFFFF',
    textPrimary: '#173B3F',
    textSecondary: '#637779',
    accent: '#E7A23B',
    success: '#21865B',
    error: '#C43D45',
    warning: '#A96112',
    border: '#DCE5E5',
    disabled: '#E7ECEC',
  },
  festival: { enabled: false },
  tabs: [
    { id: 'Home', label: 'Home', icon: 'home' },
    { id: 'Booking', label: 'Appointments', icon: 'calendar' },
    { id: 'Prescriptions', label: 'Medicines', icon: 'pill' },
    { id: 'Profile', label: 'Profile', icon: 'user' },
  ],
  sections: [
    {
      id: 'hero',
      type: 'hero_banner',
      title: 'Your health, our priority',
      background: { kind: 'token', value: 'secondary' },
      items: [
        {
          id: 'hero-main',
          title: 'Care made simple',
          subtitle: 'Book trusted doctors in a few taps.',
          action: 'Booking',
        },
      ],
    },
    {
      id: 'quick-actions',
      type: 'quick_actions',
      title: 'What do you need today?',
      items: [
        { id: 'book', title: 'Book a doctor', icon: 'calendar', action: 'Booking' },
        { id: 'medicines', title: 'My medicines', icon: 'pill', action: 'Prescriptions' },
      ],
    },
    {
      id: 'categories',
      type: 'category_chips',
      title: 'Browse specialties',
      items: [
        { id: 'general', title: 'General physician', icon: 'stethoscope' },
        { id: 'heart', title: 'Heart', icon: 'heart-pulse' },
        { id: 'skin', title: 'Skin', icon: 'hand' },
        { id: 'child', title: 'Child care', icon: 'baby' },
      ],
    },
    {
      id: 'services',
      type: 'service_grid',
      title: 'Our services',
      items: [
        { id: 'consult', title: 'Doctor consultation', icon: 'stethoscope' },
        { id: 'lab', title: 'Lab tests', icon: 'test-tube' },
        { id: 'pharmacy', title: 'Medicines', icon: 'pill' },
        { id: 'records', title: 'Health records', icon: 'file-text' },
      ],
    },
    {
      id: 'doctors',
      type: 'doctor_carousel',
      title: 'Doctors you can trust',
      items: [],
    },
    {
      id: 'offers',
      type: 'offer_strip',
      title: 'Your wellness matters',
      items: [
        {
          id: 'wellness',
          title: 'Make time for your health',
          subtitle: 'Schedule your next check-up.',
          action: 'Booking',
        },
      ],
    },
  ],
};
