import type { DoctorSlot } from '../../types/doctor';
import { mockSettings, simulateRequest } from './mockSettings';

const times = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];

export async function getMockSlots(
  doctorId: string,
  date: string,
): Promise<DoctorSlot[]> {
  await simulateRequest();

  if (mockSettings.returnEmpty) return [];

  return times.map((startTime, index) => ({
    id: `${doctorId}-${date}-${index}`,
    doctorId,
    date,
    startTime,
    available: true,
  }));
}
