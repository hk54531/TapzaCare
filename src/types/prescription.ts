export type DosePeriod = 'morning' | 'afternoon' | 'night';

export type MedicineDose = {
  period: DosePeriod;
  time: string;
  taken: boolean;
};

export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  instructions?: string;
  doses: MedicineDose[];
};

export type Prescription = {
  id: string;
  doctorName: string;
  diagnosis: string;
  issuedAt: string;
  validUntil?: string;
  medicines: Medicine[];
};
