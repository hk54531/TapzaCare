export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'failed'
  | 'cancelled';

export type Booking = {
  id: string;
  doctorId: string;
  slotId: string;
  date: string;
  startTime: string;
  status: BookingStatus;
  createdAt: string;
};

export type CreateBookingInput = {
  doctorId: string;
  slotId: string;
};

export type BookingResult =
  | { success: true; booking: Booking }
  | {
      success: false;
      code: 'SLOT_CONFLICT' | 'NETWORK_ERROR' | 'UNKNOWN';
      message: string;
    };
