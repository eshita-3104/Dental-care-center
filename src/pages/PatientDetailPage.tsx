import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import type { Patient, Incident } from '../types';
import Modal from '../components/common/Modal';
import AddIncidentForm from '../components/incidents/AddIncidentForm';
import EditIncidentForm from '../components/incidents/EditIncidentForm';

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { getPatientById, getIncidentsByPatientId } = usePatients();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    setIsLoading(true);
    const patientData = await getPatientById(patientId);
    const incidentsData = await getIncidentsByPatientId(patientId);
    setPatient(patientData);
    setIncidents(incidentsData);
    setIsLoading(false);
  }, [patientId, getPatientById, getIncidentsByPatientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddIncidentSuccess = () => {
    setIsModalOpen(false); 
    fetchData(); 
  };

  const handleEditIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsEditModalOpen(true);
  };

  const handleEditIncidentSuccess = () => {
    setIsEditModalOpen(false);
    fetchData(); 
  };

  if (isLoading) {
    return <div>Loading patient details...</div>;
  }

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/patients" className="text-sky-600 hover:underline">&larr; Back to All Patients</Link>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
        <div className="mt-2 text-gray-600 space-y-1">
          <p><strong>Date of Birth:</strong> {patient.dob}</p>
          <p><strong>Contact:</strong> {patient.contact}</p>
          <p><strong>Health Info:</strong> {patient.healthInfo}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments / Incidents</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 font-bold text-white bg-sky-600 rounded-md hover:bg-sky-700"
        >
          + Add Incident
        </button>
      </div>

      <div className="space-y-4">
        {incidents.length > 0 ? (
          incidents.map(incident => (
            <div key={incident.id} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{incident.title}</h3>
                  <p className="text-sm text-gray-500">Appointment: {new Date(incident.appointmentDate).toLocaleString()}</p>
                </div>
                <button onClick={() => handleEditIncident(incident)} className="text-sm text-sky-600 hover:underline">Edit</button>
              </div>
              <p className="mt-2">{incident.description}</p>
              <p className="text-sm text-gray-600 mt-1">Status: <span className={`font-medium ${incident.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{incident.status}</span></p>
              {incident.cost && <p className="text-sm text-gray-600">Cost: ${incident.cost}</p>}
              {incident.files.length > 0 && <p className="text-sm text-gray-600">{incident.files.length} file(s) attached.</p>}
            </div>
          ))
        ) : ( 
            <p>No incidents found for this patient.</p>
         )}
      </div>
      <Modal
        title="Schedule New Incident"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <AddIncidentForm 
          patientId={patient.id} 
          onSuccess={handleAddIncidentSuccess} 
        />
      </Modal>

      {selectedIncident && (
        <Modal
          title="Edit Incident"
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <EditIncidentForm
            incident={selectedIncident}
            onSuccess={handleEditIncidentSuccess}
          />
        </Modal>
      )}
    </div>
  );
}