export interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password?: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string; 
  contact: string;
  healthInfo: string;
}

export interface IncidentFile {
  name: string;
  url: string; 
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string; 
  cost: number | null;
  treatment: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  files: IncidentFile[];
}


export type IncidentCreationData = Pick<Incident, 'title' | 'description' | 'comments' | 'appointmentDate'>;