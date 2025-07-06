import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { usePatients } from '../../context/PatientContext';
import type { Incident, IncidentFile } from '../../types';

interface Props {
  incident: Incident;
  onSuccess: () => void;
}

export default function EditIncidentForm({ incident, onSuccess }: Props) {
  const { updateIncident } = usePatients();
  const [form, setForm] = useState<Incident>(incident);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const parsed = type === 'number' ? (value === '' ? null : Number(value)) : value;
    setForm(prev => ({ ...prev, [id]: parsed }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: IncidentFile = {
          name: file.name,
          url: reader.result as string,
        };
        setForm(prev => ({
          ...prev,
          files: [...prev.files, newFile],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateIncident(form);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Cost ($)
          </label>
          <input
            id="cost"
            type="number"
            value={form.cost ?? ''}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
          Treatment Notes
        </label>
        <textarea
          id="treatment"
          value={form.treatment ?? ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Files (Invoices, X-Rays)
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
      </div>

      {form.files.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-800">
            {form.files.map(file => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

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
}
