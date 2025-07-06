import { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import type { Patient } from '../types';
import PatientTable from '../components/patients/patientTable';
import Modal from '../components/common/Modal';
import AddPatientForm from '../components/patients/AddPatientForm';

const EditPatientForm = ({
  patient,
  onSuccess,
}: {
  patient: Patient;
  onSuccess: () => void;
}) => {
  const { updatePatient } = usePatients();
  const [form, setForm] = useState(patient);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePatient(form);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
          Contact Number
        </label>
        <input
          id="contact"
          type="tel"
          value={form.contact}
          onChange={handleChange}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="healthInfo" className="block text-sm font-medium text-gray-700">
          Health Information
        </label>
        <textarea
          id="healthInfo"
          value={form.healthInfo}
          onChange={handleChange}
          rows={3}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default function PatientsListPage() {
  const { patients, isLoading, deletePatient } = usePatients();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);

  const handleEdit = (patient: Patient) => {
    setSelected(patient);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Delete this patient? This cannot be undone.');
    if (confirmed) deletePatient(id);
  };

  if (isLoading) return <p>Loading patients...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700"
        >
          + Add Patient
        </button>
      </div>

      {patients.length ? (
        <PatientTable patients={patients} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <div className="bg-white p-4 rounded-lg shadow text-center">
          No patients found. Click "Add Patient" to create one.
        </div>
      )}

      <Modal
        title="Add New Patient"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      >
        <AddPatientForm onSuccess={() => setShowAddModal(false)} />
      </Modal>

      {selected && (
        <Modal
          title="Edit Patient"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        >
          <EditPatientForm patient={selected} onSuccess={() => setShowEditModal(false)} />
        </Modal>
      )}
    </div>
  );
}
