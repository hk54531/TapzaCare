export type RootTabName =
  | 'Home'
  | 'Booking'
  | 'Prescriptions'
  | 'Profile';

export type RootStackName =
  | RootTabName
  | 'PrescriptionDetail'
  | 'DeveloperSettings';

export type RootStackParams = {
  Home: undefined;
  Booking: { doctorId?: string } | undefined;
  Prescriptions: undefined;
  Profile: undefined;
  PrescriptionDetail: { prescriptionId: string };
  DeveloperSettings: undefined;
};
