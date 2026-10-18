export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  consultationFee: number;
  image?: string;
  languages: string[];
  available?: boolean;
};

export type DoctorSlot = {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime?: string;
  available: boolean;
};
