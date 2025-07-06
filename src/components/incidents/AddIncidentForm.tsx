import { useState } from 'react';
import type { FormEvent } from 'react';
import { usePatients } from '../../context/PatientContext';

interface AddIncidentFormProps {
  patientId: string;
  onSuccess: () => void;
}

export default function AddIncidentForm({ patientId, onSuccess }: AddIncidentFormProps) {
  const { addIncident } = usePatients();
  const [form, setForm] = useState({
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
  });

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    await addIncident(form, patientId);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={updateField('title')}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
          Appointment Date & Time
        </label>
        <input
          id="appointmentDate"
          type="datetime-local"
          value={form.appointmentDate}
          onChange={updateField('appointmentDate')}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={updateField('description')}
          rows={3}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          Initial Comments
        </label>
        <textarea
          id="comments"
          value={form.comments}
          onChange={updateField('comments')}
          rows={2}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700"
        >
          Schedule Incident
        </button>
      </div>
    </form>
  );
}
