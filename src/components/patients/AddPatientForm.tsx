import { useState } from 'react';
import type { FormEvent } from 'react';
import { usePatients } from '../../context/PatientContext';

interface Props {
  onSuccess: () => void;
}

export default function AddPatientForm({ onSuccess }: Props) {
  const { addPatient } = usePatients();
  const [form, setForm] = useState({
    name: '',
    dob: '',
    contact: '',
    healthInfo: '',
  });

  const handleChange = (field: keyof typeof form) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addPatient(form);
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
          onChange={handleChange('name')}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
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
          onChange={handleChange('dob')}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
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
          onChange={handleChange('contact')}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div>
        <label htmlFor="healthInfo" className="block text-sm font-medium text-gray-700">
          Health Information
        </label>
        <textarea
          id="healthInfo"
          rows={3}
          value={form.healthInfo}
          onChange={handleChange('healthInfo')}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700"
        >
          Save Patient
        </button>
      </div>
    </form>
  );
}
