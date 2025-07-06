// src/context/PatientContext.tsx
import { createContext, useReducer, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { getAllData, updateDatabase } from '../api/db';
import type { Patient,Incident, IncidentCreationData} from '../types';

interface PatientState {
  patients: Patient[];
  incidents: Incident[];
  isLoading: boolean;
}

type Action =
  | { type: 'SET_DATA'; payload: { patients: Patient[]; incidents: Incident[] } }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: string }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_INCIDENT'; payload: Incident };

const reducer = (state: PatientState, action: Action): PatientState => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        patients: action.payload.patients,
        incidents: action.payload.incidents,
        isLoading: false,
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: [...state.patients, action.payload],
      };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(p => p.id !== action.payload),
      };
    case 'ADD_INCIDENT':
      return {
        ...state,
        incidents: [...state.incidents, action.payload],
      };
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    default:
      return state;
  }
};

interface PatientContextType extends PatientState {
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  getPatientById: (id: string) => Promise<Patient | null>;
  getIncidentsByPatientId: (patientId: string) => Promise<Incident[]>;
  addIncident: (data: IncidentCreationData, patientId: string) => Promise<void>;
  updateIncident: (incident: Incident) => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    patients: [],
    incidents: [],
    isLoading: true,
  });

  useEffect(() => {
    const load = async () => {
      const data = await getAllData();
      if (data) {
        dispatch({
          type: 'SET_DATA',
          payload: {
            patients: data.patients,
            incidents: data.incidents,
          },
        });
      }
    };
    load();
  }, []);

  const addPatient = async (data: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...data, id: `p${Date.now()}` };
    const db = await getAllData();
    if (!db) return;

    const updated = { ...db, patients: [...db.patients, newPatient] };
    await updateDatabase(updated);
    dispatch({ type: 'ADD_PATIENT', payload: newPatient });
  };

  const updatePatient = async (patient: Patient) => {
    const db = await getAllData();
    if (!db) return;

    const updated = {
      ...db,
      patients: db.patients.map(p => (p.id === patient.id ? patient : p)),
    };
    await updateDatabase(updated);
    dispatch({ type: 'UPDATE_PATIENT', payload: patient });
  };

  const deletePatient = async (id: string) => {
    const db = await getAllData();
    if (!db) return;

    const updated = {
      ...db,
      patients: db.patients.filter(p => p.id !== id),
    };
    await updateDatabase(updated);
    dispatch({ type: 'DELETE_PATIENT', payload: id });
  };

  const addIncident = async (
    data: IncidentCreationData,
    patientId: string
  ) => {
    const newIncident: Incident = {
      ...data,
      id: `i${Date.now()}`,
      patientId,
      cost: null,
      treatment: null,
      status: 'Scheduled',
      files: [],
    };

    const db = await getAllData();
    if (!db) return;

    const updated = {
      ...db,
      incidents: [...db.incidents, newIncident],
    };
    await updateDatabase(updated);
    dispatch({ type: 'ADD_INCIDENT', payload: newIncident });
  };

  const updateIncident = async (incident: Incident) => {
    const db = await getAllData();
    if (!db) return;

    const updated = {
      ...db,
      incidents: db.incidents.map(i =>
        i.id === incident.id ? incident : i
      ),
    };
    await updateDatabase(updated);
    dispatch({ type: 'UPDATE_INCIDENT', payload: incident });
  };

  const getPatientById = async (id: string) => {
    const db = await getAllData();
    return db?.patients.find(p => p.id === id) || null;
  };

  const getIncidentsByPatientId = async (id: string) => {
    const db = await getAllData();
    return db?.incidents.filter(i => i.patientId === id) || [];
  };

  return (
    <PatientContext.Provider
      value={{
        ...state,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        getIncidentsByPatientId,
        addIncident,
        updateIncident,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};
