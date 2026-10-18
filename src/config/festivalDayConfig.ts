
import type {LayoutConfig} from '../types/config';

export const festivalDayConfig: LayoutConfig = {
  version: 2,
  theme: {
    primary: '#873D24',
    secondary: '#FBE5C8',
    background: '#FFF8F0',
    surface: '#FFFFFF',
    textPrimary: '#49291F',
    textSecondary: '#80675B',
    accent: '#E5A12B',
    festival: {
      name: 'Diwali',
      greeting: 'Wishing you a happy and healthy Diwali!',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1606293926075-69a00dbfde81',
    },
  },
  tabs: [
    {id: 'home', label: 'Home', icon: 'home', screen: 'home'},
    {id: 'bookings', label: 'Bookings', icon: 'calendar', screen: 'bookings'},
    {
      id: 'prescriptions',
      label: 'Medicines',
      icon: 'pill',
      screen: 'prescriptions',
    },
    {id: 'profile', label: 'Profile', icon: 'user', screen: 'profile'},
  ],
  sections: [
    {
      id: 'hero',
      type: 'hero_banner',
      background: {kind: 'image', value: 'festival-banner'},
      title: 'Celebrate wellness this Diwali',
      items: [
        {
          greeting: 'Wishing you a happy and healthy Diwali!',
          subtitle: 'Give yourself and your family the gift of good health.',
          actionLabel: 'Explore festive care',
          imageUrl:
            'https://images.unsplash.com/photo-1606293926075-69a00dbfde81',
        },
      ],
    },
    {
      id: 'offer',
      type: 'offer_strip',
      background: {kind: 'color', value: '#E5A12B'},
      title: 'Festive health offers',
      items: [
        {
          message: 'Make time for your health this festive season.',
        },
      ],
    },
    {
      id: 'categories',
      type: 'category_chips',
      background: {kind: 'color', value: '#FFF8F0'},
      title: 'Festive health essentials',
      items: [
        {id: 'family-checkup', label: 'Family checkup', icon: 'users'},
        {id: 'consult', label: 'Consult', icon: 'stethoscope'},
        {id: 'lab', label: 'Lab tests', icon: 'flask-conical'},
        {id: 'pharmacy', label: 'Pharmacy', icon: 'pill'},
        {id: 'vaccines', label: 'Vaccines', icon: 'syringe'},
      ],
    },
    {
      id: 'quick-actions',
      type: 'quick_actions',
      background: {kind: 'color', value: '#FFFFFF'},
      title: 'Your care, one tap away',
      items: [
        {id: 'book', label: 'Book a visit', icon: 'calendar-plus'},
        {id: 'prescriptions', label: 'Prescriptions', icon: 'file-text'},
        {id: 'reminders', label: 'Reminders', icon: 'bell'},
        {id: 'family', label: 'My family', icon: 'users'},
      ],
    },
    {
      id: 'doctors',
      type: 'doctor_carousel',
      background: {kind: 'color', value: '#FBE5C8'},
      title: 'Care for the whole family',
      items: [
        {
          id: 'doctor-3',
          name: 'Dr. Ananya Rao',
          specialty: 'General Physician',
          photoUrl: '',
          feeInr: 400,
          nextSlot: 'Today, 5:30 PM',
        },
        {
          id: 'doctor-4',
          name: 'Dr. Kiran Reddy',
          specialty: 'Cardiologist',
          photoUrl: '',
          feeInr: 600,
          nextSlot: 'Tomorrow, 10:00 AM',
        },
      ],
    },
    {
      id: 'services',
      type: 'service_grid',
      background: {kind: 'color', value: '#FFFFFF'},
      title: 'Recommended for your family',
      items: [
        {
          id: 'family-checkup',
          name: 'Family health checkup',
          priceInr: 999,
          badge: 'Festive pick',
          imageUrl: '',
        },
        {
          id: 'blood-test',
          name: 'Complete blood count',
          priceInr: 299,
          badge: '',
          imageUrl: '',
        },
        {
          id: 'diabetes-test',
          name: 'Diabetes screening',
          priceInr: 399,
          badge: '',
          imageUrl: '',
        },
      ],
    },
  ],
};
