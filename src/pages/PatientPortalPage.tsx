import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePatients } from '../context/PatientContext';
import type { Patient, Incident } from '../types';

export default function PatientPortalPage() {
  const { user, logout } = useAuth(); 
  const { getPatientById, getIncidentsByPatientId } = usePatients();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.patientId) {
      setIsLoading(false);
      return;
    };

    const fetchData = async () => {
      setIsLoading(true);
      const patientData = await getPatientById(user.patientId!);
      const incidentsData = await getIncidentsByPatientId(user.patientId!);
      setPatient(patientData);
      setIncidents(incidentsData);
      setIsLoading(false);
    };

    fetchData();
  }, [user, getPatientById, getIncidentsByPatientId]);
  
  if (isLoading) return <div className="p-6">Loading your portal...</div>;
  if (!patient) return <div className="p-6">Could not find your patient record.</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
       <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-sky-700">Dental Care Centre Patient Portal</h1>
          <button onClick={logout} className="px-4 py-2 font-bold text-white bg-sky-600 rounded-md hover:bg-sky-700">
            Log Out
          </button>
        </nav>
      </header>
      
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {patient.name}</h2>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Appointments and history</h3>
        <div className="space-y-4">
          {incidents.length > 0 ? (
            incidents.map(incident => (
              <div key={incident.id} className="p-4 bg-white rounded-lg shadow-md">
                 <h4 className="font-bold text-lg">{incident.title}</h4>
                 <p className="text-sm text-gray-500">Appointment: {new Date(incident.appointmentDate).toLocaleString()}</p>
                 <p className="text-sm text-gray-600 mt-1">Status: <span className={`font-medium ${incident.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{incident.status}</span></p>
                 {incident.status === 'Completed' && (
                   <div className="mt-4 pt-4 border-t">
                     <p><strong>Treatment Notes:</strong> {incident.treatment || 'N/A'}</p>
                     <p><strong>Cost:</strong> ${Number(incident.cost)?.toFixed(2) || 'N/A'}</p>
                     {incident.files.length > 0 && (
                       <div className="mt-2">
                         <strong>Attachments:</strong>
                         <ul className="list-disc list-inside ml-4">
                           {incident.files.map(file => (
                             <li key={file.name}>
                               <a href={file.url} download={file.name} className="text-sky-600 hover:underline">
                                 {file.name}
                               </a>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}
                   </div>
                 )}
              </div>
            ))
          ) : (
            <p className="p-4 bg-white rounded-lg shadow-md">You have no scheduled appointments.</p>
          )}
        </div>
      </main>
    </div>
  );
}