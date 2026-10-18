
import type {LayoutConfig} from '../types/config';

export const normalDayConfig: LayoutConfig = {
  version: 1,
  theme: {
    primary: '#176B52',
    secondary: '#DFF3E8',
    background: '#F7F9F7',
    surface: '#FFFFFF',
    textPrimary: '#19352C',
    textSecondary: '#65756D',
    accent: '#E6A23C',
    festival: {
      name: '',
      greeting: 'Your health, made simple.',
      bannerImageUrl: '',
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
      background: {kind: 'gradient', value: '#176B52,#2F9D78'},
      title: 'Good health starts here',
      items: [
        {
          greeting: 'Your health, made simple.',
          subtitle: 'Care for you and your family, all in one place.',
          actionLabel: 'Explore services',
          imageUrl: '',
        },
      ],
    },
    {
      id: 'categories',
      type: 'category_chips',
      background: {kind: 'color', value: '#F7F9F7'},
      title: 'What do you need today?',
      items: [
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
      title: 'Quick actions',
      items: [
        {id: 'book', label: 'Book a visit', icon: 'calendar-plus'},
        {id: 'prescriptions', label: 'Prescriptions', icon: 'file-text'},
        {id: 'reminders', label: 'Reminders', icon: 'bell'},
        {id: 'family', label: 'My family', icon: 'users'},
      ],
    },
    {
      id: 'services',
      type: 'service_grid',
      background: {kind: 'color', value: '#F0F7F3'},
      title: 'Popular services',
      items: [
        {
          id: 'general-checkup',
          name: 'General health checkup',
          priceInr: 499,
          badge: 'Popular',
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
        {
          id: 'consultation',
          name: 'Doctor consultation',
          priceInr: 300,
          badge: 'Recommended',
          imageUrl: '',
        },
      ],
    },
    {
      id: 'doctors',
      type: 'doctor_carousel',
      background: {kind: 'color', value: '#FFFFFF'},
      title: 'Doctors near you',
      items: [
        {
          id: 'doctor-1',
          name: 'Dr. Ananya Rao',
          specialty: 'General Physician',
          photoUrl: '',
          feeInr: 400,
          nextSlot: 'Today, 5:30 PM',
        },
        {
          id: 'doctor-2',
          name: 'Dr. Kiran Reddy',
          specialty: 'Cardiologist',
          photoUrl: '',
          feeInr: 600,
          nextSlot: 'Tomorrow, 10:00 AM',
        },
      ],
    },
    {
      id: 'offer',
      type: 'offer_strip',
      background: {kind: 'color', value: '#E6A23C'},
      title: 'A little care goes a long way',
      items: [
        {
          message: 'Stay on top of your health with regular checkups.',
        },
      ],
    },
  ],
};
