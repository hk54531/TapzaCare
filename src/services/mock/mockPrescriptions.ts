import type { Prescription } from '../../types/prescription';
import { mockSettings, simulateRequest } from './mockSettings';

const prescriptions: Prescription[] = [
  {
    id: 'rx-001',
    doctorName: 'Dr. Ananya Rao',
    diagnosis: 'Seasonal allergies',
    issuedAt: '2026-10-15',
    validUntil: '2026-11-15',
    medicines: [
      {
        id: 'med-001',
        name: 'Example medicine A',
        dosage: 'As prescribed',
        instructions: 'Follow the directions on your prescription.',
        doses: [
          { period: 'morning', time: '08:00', taken: false },
          { period: 'afternoon', time: '13:00', taken: false },
          { period: 'night', time: '20:00', taken: false },
        ],
      },
    ],
  },
];

export async function getMockPrescriptions(): Promise<Prescription[]> {
  await simulateRequest();
  return mockSettings.returnEmpty ? [] : prescriptions;
}

export async function getMockPrescriptionById(
  id: string,
): Promise<Prescription | undefined> {
  await simulateRequest();
  return prescriptions.find((item) => item.id === id);
}

export async function markMockDoseTaken(
  prescriptionId: string,
  medicineId: string,
  period: 'morning' | 'afternoon' | 'night',
): Promise<boolean> {
  await simulateRequest();

  const prescription = prescriptions.find((item) => item.id === prescriptionId);
  const medicine = prescription?.medicines.find((item) => item.id === medicineId);
  const dose = medicine?.doses.find((item) => item.period === period);

  if (!dose) return false;
  dose.taken = !dose.taken;
  return dose.taken;
}
