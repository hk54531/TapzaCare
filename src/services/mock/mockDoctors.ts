import type { Doctor } from '../../types/doctor';
import { mockSettings, simulateRequest } from './mockSettings';

const doctors: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Ananya Rao',
    specialty: 'General Physician',
    experienceYears: 12,
    rating: 4.8,
    consultationFee: 500,
    languages: ['English', 'Telugu', 'Hindi'],
    available: true,
  },
  {
    id: 'doc-002',
    name: 'Dr. Rahul Sharma',
    specialty: 'Cardiologist',
    experienceYears: 15,
    rating: 4.9,
    consultationFee: 800,
    languages: ['English', 'Hindi'],
    available: true,
  },
  {
    id: 'doc-003',
    name: 'Dr. Meera Reddy',
    specialty: 'Dermatologist',
    experienceYears: 9,
    rating: 4.7,
    consultationFee: 600,
    languages: ['English', 'Telugu'],
    available: true,
  },
];

export async function getMockDoctors(): Promise<Doctor[]> {
  await simulateRequest();
  return mockSettings.returnEmpty ? [] : doctors;
}
