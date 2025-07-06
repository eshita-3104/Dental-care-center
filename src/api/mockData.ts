import type { User, Patient, Incident } from '../types';

interface AppData {
  users: User[];
  patients: Patient[];
  incidents: Incident[];
}

export const initialData: AppData = {
  users: [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" }
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "123-456-7890",
      healthInfo: "No known allergies. Prefers morning appointments."
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-08-22",
      contact: "987-654-3210",
      healthInfo: "Slight anxiety about dental procedures."
    }
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Annual Check-up & Cleaning",
      description: "Routine examination and scaling.",
      comments: "Patient reported no issues.",
      appointmentDate: "2025-07-10T10:00:00",
      cost: 150,
      treatment: "Scaling and Polishing",
      status: "Completed",
      files: []
    },
    {
      id: "i2",
      patientId: "p2",
      title: "Wisdom Tooth Consultation",
      description: "Pain in the lower right jaw.",
      comments: "Needs an X-ray to determine impaction.",
      appointmentDate: "2025-07-15T14:30:00",
      cost: null,
      treatment: null,
      status: "Scheduled",
      files: []
    },
    {
        id: "i3",
        patientId: "p1",
        title: "Filling for Cavity",
        description: "Sensitivity in upper left molar.",
        comments: "X-ray confirmed a small cavity.",
        appointmentDate: "2025-08-01T11:00:00",
        cost: null,
        treatment: null,
        status: "Scheduled",
        files: []
      }
  ]
};