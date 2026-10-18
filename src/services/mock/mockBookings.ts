import type { Booking, CreateBookingInput } from '../../types/booking';
import { mockSettings, simulateRequest } from './mockSettings';
import { getMockSlots } from './mockSlots';

const bookedSlotIds = new Set<string>();
let bookingCounter = 1;

export async function createMockBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  await simulateRequest();

  if (mockSettings.bookingConflict || bookedSlotIds.has(input.slotId)) {
    throw new Error('409: This time slot is no longer available.');
  }

  const slotDate = input.slotId.split('-').slice(2, 5).join('-');
  const slots = await getMockSlots(input.doctorId, slotDate);
  const slot = slots.find((item) => item.id === input.slotId);

  if (!slot) {
    throw new Error('Selected time slot was not found.');
  }

  bookedSlotIds.add(input.slotId);

  return {
    id: `booking-${bookingCounter++}`,
    doctorId: input.doctorId,
    slotId: input.slotId,
    date: slot.date,
    startTime: slot.startTime,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
}

export function resetMockBookings(): void {
  bookedSlotIds.clear();
  bookingCounter = 1;
}
